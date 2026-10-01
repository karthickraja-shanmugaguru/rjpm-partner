/**
 * Utility functions for client-side image compression and encoding.
 * Allows storing uploaded photos directly into SQLite database as optimized Data URLs
 * without needing an external S3 / Cloud storage bucket.
 */

export const compressImageFile = (file, options = {}) => {
  const { maxWidth = 1280, maxHeight = 1280, quality = 0.82 } = options

  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'))
    }

    // Only process images
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'))
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = (readerEvent) => {
      const img = new Image()
      img.onerror = () => {
        // Fallback to raw base64 if image decoding fails
        resolve(readerEvent.target.result)
      }
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve(readerEvent.target.result)
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Use JPEG for optimal compression (reduces 5-10MB photos to ~100-200KB)
        const outputFormat = 'image/jpeg'
        try {
          const compressedDataUrl = canvas.toDataURL(outputFormat, quality)
          resolve(compressedDataUrl)
        } catch (e) {
          resolve(readerEvent.target.result)
        }
      }
      img.src = readerEvent.target.result
    }
    reader.readAsDataURL(file)
  })
}

export const compressMultipleImages = async (fileList, options = {}) => {
  const files = Array.from(fileList || [])
  const results = []
  for (const file of files) {
    try {
      const compressed = await compressImageFile(file, options)
      results.push(compressed)
    } catch (err) {
      console.error('Error compressing image:', file.name, err)
    }
  }
  return results
}
