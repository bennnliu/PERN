# Performance Optimization Guide

## Current Performance Issues

The main performance bottlenecks in your application are:

1. **Large Base64 Image Payloads** - Images stored as base64 strings increase size by ~33%
2. **No Response Compression** - API responses aren't compressed
3. **Missing Database Indexes** - Queries scan entire table instead of using indexes
4. **No Query Optimization** - Some queries could be more efficient

---

## Optimizations Implemented ✅

### 1. Response Compression (DONE)
- Added `compression` middleware to Express server
- All API responses now use gzip compression
- Reduces payload sizes by 60-80%
- **Impact**: Faster API responses, especially for property listings with images

### 2. Database Indexes (To Run)
Run the optimization script when your backend is configured:
```bash
cd backend
node scripts/optimize-db.js
```

This will create indexes on:
- `user_id` - Faster user-specific queries
- `created_at` - Faster date sorting
- `property_type` - Faster property type filtering
- `monthly_rent` - Faster price range queries
- `rooms` - Faster bedroom filtering
- Composite index on `user_id + created_at` for dashboard queries

**Expected Impact**: 5-10x faster queries on large datasets

---

## Additional Recommendations

### High Priority (Significant Impact)

#### 1. Move Images to External Storage
**Problem**: Base64 images in database cause:
- Slow UPDATE queries (sending 5+ MB per request)
- Large response payloads
- Increased database storage costs

**Solution**: Use Cloudinary or AWS S3
```javascript
// Before (current):
images: ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."] // 2MB+ per image

// After (with Cloudinary):
images: ["https://res.cloudinary.com/your-cloud/image/upload/v1234567/house1.jpg"]
```

**Implementation Steps**:
1. Sign up for Cloudinary (free tier: 25GB storage, 25GB bandwidth/month)
2. Install SDK: `npm install cloudinary`
3. Upload images to Cloudinary instead of converting to base64
4. Store only URLs in database

**Expected Impact**: 
- 90% reduction in payload size
- 10-20x faster UPDATE operations
- 5-10x faster initial page loads

---

#### 2. Implement Response Caching
Cache frequently accessed data:

```javascript
// In your frontend api.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

export const houseApi = {
  getAll: async () => {
    const cacheKey = 'all-houses';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const response = await api.get('/houses');
    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  },
  // ...
};
```

**Expected Impact**: Instant loads for repeated visits

---

#### 3. Add Pagination
Limit results per request:

```javascript
// Backend controller
export const getHouses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  const houses = await sql`
    SELECT * FROM houses 
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  const total = await sql`SELECT COUNT(*) FROM houses`;
  
  res.json({
    houses,
    pagination: {
      page,
      limit,
      total: total[0].count,
      pages: Math.ceil(total[0].count / limit)
    }
  });
};
```

**Expected Impact**: 
- Load only 20 properties instead of all
- 5x faster initial page load
- Better UX with "Load More" or pagination

---

### Medium Priority

#### 4. Optimize Image Size on Upload
Resize and compress images before uploading:

```javascript
// In frontend, compress before base64 conversion
import imageCompression from 'browser-image-compression';

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  
  const options = {
    maxSizeMB: 0.5,          // Compress to max 500KB
    maxWidthOrHeight: 1920,  // Max dimension
    useWebWorker: true
  };
  
  const compressedFile = await imageCompression(file, options);
  // Then convert to base64...
};
```

Install: `npm install browser-image-compression`

**Expected Impact**: 70-80% reduction in image sizes

---

#### 5. Lazy Load Images
Load images only when visible:

```javascript
<img 
  src={placeholderImage}
  data-src={actualImage}
  loading="lazy"
  onLoad={(e) => {
    e.target.src = e.target.dataset.src;
  }}
/>
```

**Expected Impact**: Faster initial page render

---

#### 6. Use React Query for Data Fetching
Better caching and request deduplication:

```bash
npm install @tanstack/react-query
```

```javascript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['houses'],
  queryFn: houseApi.getAll,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

**Expected Impact**: Automatic caching, no duplicate requests

---

### Low Priority (Polish)

#### 7. Add Loading Skeletons
Better perceived performance with loading states

#### 8. Implement Optimistic Updates
Update UI immediately, sync with server in background

#### 9. Enable HTTP/2
If using a production server, enable HTTP/2 for parallel requests

---

## Quick Wins Summary

### Immediate (Already Done):
✅ Added compression middleware - **Responses 60-80% smaller**

### Next Steps (15 minutes):
1. Run `node scripts/optimize-db.js` - **5-10x faster queries**
2. Add response caching in frontend - **Instant repeat loads**

### High Impact (1-2 hours):
1. Move to Cloudinary - **90% payload reduction, 10x faster updates**
2. Add pagination - **5x faster initial load**

### Long Term:
1. Implement React Query
2. Add image compression on upload
3. Lazy load images

---

## Performance Monitoring

Add timing logs to identify bottlenecks:

```javascript
// In your API controllers
export const updateHouse = async (req, res) => {
  const startTime = Date.now();
  
  // ... your code ...
  
  console.log(`✅ Update completed in ${Date.now() - startTime}ms`);
};
```

Check Network tab in browser DevTools:
- Look for requests taking >1s
- Check response sizes (should be <100KB with compression)
- Monitor "Time to First Byte" (TTFB)

---

## Expected Results After All Optimizations

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Browse page load | 3-5s | 0.5-1s | **5-10x faster** |
| Update property | 2-4s | 0.3-0.5s | **8-10x faster** |
| Response size | 5-10MB | 500KB-1MB | **90% reduction** |
| Database queries | 500-1000ms | 10-50ms | **20x faster** |

---

## Testing Performance

```javascript
// Add to your frontend to measure real performance
const start = performance.now();
await houseApi.update(id, data);
console.log(`Update took ${performance.now() - start}ms`);
```

Target times:
- ✅ GET all houses: < 500ms
- ✅ GET single house: < 200ms  
- ✅ UPDATE house: < 500ms
- ✅ CREATE house: < 500ms
