import { sql } from '../config/db.js';

/**
 * Database optimization script
 * This script adds indexes to speed up common queries
 */

async function optimizeDatabase() {
  try {
    console.log('🚀 Starting database optimization...\n');

    // 1. Add index on user_id for faster user-specific queries
    console.log('Adding index on user_id...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_houses_user_id 
      ON houses(user_id);
    `;
    console.log('✅ Index on user_id created\n');

    // 2. Add index on created_at for faster sorting
    console.log('Adding index on created_at...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_houses_created_at 
      ON houses(created_at DESC);
    `;
    console.log('✅ Index on created_at created\n');

    // 3. Add composite index for user_id + created_at
    console.log('Adding composite index on user_id + created_at...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_houses_user_created 
      ON houses(user_id, created_at DESC);
    `;
    console.log('✅ Composite index created\n');

    // 4. Add index on property_type for filtering
    console.log('Adding index on property_type...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_houses_property_type 
      ON houses(property_type);
    `;
    console.log('✅ Index on property_type created\n');

    // 5. Add index on monthly_rent for price range queries
    console.log('Adding index on monthly_rent...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_houses_monthly_rent 
      ON houses(monthly_rent);
    `;
    console.log('✅ Index on monthly_rent created\n');

    // 6. Add index on rooms for bedroom filtering
    console.log('Adding index on rooms...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_houses_rooms 
      ON houses(rooms);
    `;
    console.log('✅ Index on rooms created\n');

    // 7. Analyze the table to update query planner statistics
    console.log('Analyzing houses table...');
    await sql`ANALYZE houses;`;
    console.log('✅ Table analysis complete\n');

    // 8. Check table statistics
    console.log('📊 Checking table statistics...');
    const stats = await sql`
      SELECT 
        schemaname,
        tablename,
        n_live_tup as row_count,
        n_dead_tup as dead_rows
      FROM pg_stat_user_tables 
      WHERE tablename = 'houses';
    `;
    console.log('Table statistics:', stats[0]);

    // 9. List all indexes
    console.log('\n📋 Current indexes:');
    const indexes = await sql`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'houses'
      ORDER BY indexname;
    `;
    indexes.forEach(idx => {
      console.log(`  - ${idx.indexname}`);
    });

    console.log('\n✅ Database optimization complete!');
    console.log('\n💡 Performance tips:');
    console.log('  1. Images are stored as base64 - consider using external storage (S3, Cloudinary)');
    console.log('  2. Enable gzip compression in your Express server');
    console.log('  3. Implement pagination for large result sets');
    console.log('  4. Consider caching frequently accessed data');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    throw error;
  }
}

// Run optimization
optimizeDatabase()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
