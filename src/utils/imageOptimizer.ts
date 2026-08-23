/**
 * Image optimization utilities for Firestore document size limits (1MB hard limit).
 * Compresses images to high-quality, lightweight Web JPEGs (~30-60KB each)
 * allowing multiple gallery images per product without exceeding document size limits.
 */

export async function optimizeDataUrl(dataUrl: string, maxDim = 900, quality = 0.72): Promise<string> {
  // If not a data url or already very small (< 40KB), return as is
  if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length < 50000) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let result = canvas.toDataURL('image/jpeg', quality);

        // If still > 80KB, do a second tighter pass
        if (result.length > 100000) {
          const secondCanvas = document.createElement('canvas');
          const tightDim = Math.min(maxDim, 720);
          let w2 = width;
          let h2 = height;
          if (w2 > h2) {
            if (w2 > tightDim) {
              h2 = Math.round((h2 * tightDim) / w2);
              w2 = tightDim;
            }
          } else {
            if (h2 > tightDim) {
              w2 = Math.round((w2 * tightDim) / h2);
              h2 = tightDim;
            }
          }
          secondCanvas.width = w2;
          secondCanvas.height = h2;
          const ctx2 = secondCanvas.getContext('2d');
          if (ctx2) {
            ctx2.imageSmoothingEnabled = true;
            ctx2.imageSmoothingQuality = 'high';
            ctx2.drawImage(img, 0, 0, w2, h2);
            result = secondCanvas.toDataURL('image/jpeg', 0.65);
          }
        }

        resolve(result);
      } catch (err) {
        console.warn('Could not optimize data URL canvas:', err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function compressImageFile(file: File, maxDim = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error('Failed to read file'));
        return;
      }
      try {
        const optimized = await optimizeDataUrl(rawDataUrl, maxDim, quality);
        resolve(optimized);
      } catch (err) {
        resolve(rawDataUrl);
      }
    };
    reader.onerror = (err) => reject(err);
  });
}

export async function optimizeProductForFirestore<T extends { imageUrl?: string; thumbnails?: string[] }>(product: T): Promise<T> {
  const cloned = { ...product };

  // 1. Optimize primary image if it is base64
  if (cloned.imageUrl && cloned.imageUrl.startsWith('data:image/') && cloned.imageUrl.length > 50000) {
    cloned.imageUrl = await optimizeDataUrl(cloned.imageUrl, 900, 0.72);
  }

  // 2. Optimize thumbnails array
  if (Array.isArray(cloned.thumbnails) && cloned.thumbnails.length > 0) {
    const optimizedThumbs: string[] = [];
    for (const thumb of cloned.thumbnails) {
      if (thumb && thumb.startsWith('data:image/') && thumb.length > 50000) {
        optimizedThumbs.push(await optimizeDataUrl(thumb, 850, 0.70));
      } else {
        optimizedThumbs.push(thumb);
      }
    }
    cloned.thumbnails = optimizedThumbs;
  }

  // 3. Document Size Check: Ensure whole serialized product is well below 800KB (Firestore limit is 1,048,576 bytes)
  try {
    let jsonStr = JSON.stringify(cloned);
    if (jsonStr.length > 750000) {
      // Aggressive downscale pass if user added many high-res images
      if (cloned.imageUrl && cloned.imageUrl.startsWith('data:image/')) {
        cloned.imageUrl = await optimizeDataUrl(cloned.imageUrl, 650, 0.60);
      }
      if (Array.isArray(cloned.thumbnails)) {
        const tightThumbs: string[] = [];
        for (const thumb of cloned.thumbnails) {
          if (thumb && thumb.startsWith('data:image/')) {
            tightThumbs.push(await optimizeDataUrl(thumb, 600, 0.58));
          } else {
            tightThumbs.push(thumb);
          }
        }
        cloned.thumbnails = tightThumbs;
      }
    }
  } catch (e) {
    console.warn('Size check warning:', e);
  }

  return cloned;
}
