/**
 * Image Optimization Utilities
 * Helper functions to optimize image handling
 */

/**
 * Compress an image file before converting to base64
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed file
 */
export async function compressImage(file: File, options: { maxSizeMB?: number; maxWidthOrHeight?: number; quality?: number } = {}): Promise<File> {
  const {
    maxSizeMB = 0.5,        // Max file size in MB
    maxWidthOrHeight = 1920, // Max dimension
    quality = 0.8            // Quality (0-1)
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Convert file to base64 with size validation
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 encoded string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Get estimated base64 size
 * @param {string} base64String - Base64 encoded string
 * @returns {number} Size in MB
 */
export function getBase64Size(base64String: string) {
  const base64Length = base64String.length - (base64String.indexOf(',') + 1);
  const padding = (base64String.charAt(base64String.length - 2) === '=') ? 2 
    : ((base64String.charAt(base64String.length - 1) === '=') ? 1 : 0);
  return (base64Length * 0.75 - padding) / (1024 * 1024); // MB
}

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @param {Object} constraints - Validation constraints
 * @returns {Object} Validation result
 */
export function validateImage(file: File, constraints: { maxSizeMB?: number; allowedTypes?: string[] } = {}) {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  } = constraints;
  
  const errors = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed. Allowed: ${allowedTypes.join(', ')}`);
  }
  
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    errors.push(`File size ${sizeMB.toFixed(2)}MB exceeds maximum ${maxSizeMB}MB`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Process image file with compression and validation
 * @param {File} file - The image file to process
 * @returns {Promise<{base64: string, size: number}>}
 */
export async function processImage(file: File) {
  // Validate
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.errors.join('. '));
  }
  
  // Compress
  const compressed = await compressImage(file);
  
  // Convert to base64
  const base64 = await fileToBase64(compressed);
  const size = getBase64Size(base64);
  
  console.log(`📸 Image processed: ${file.name}`);
  console.log(`   Original size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`   Compressed size: ${size.toFixed(2)}MB`);
  console.log(`   Reduction: ${(((file.size / (1024 * 1024)) - size) / (file.size / (1024 * 1024)) * 100).toFixed(1)}%`);
  
  return { base64, size };
}
