/**
 * High-Fidelity Jewelry Image Engine
 * 
 * Specially engineered for luxury jewelry photography:
 * 1. Preserves crystal-clear gold luster, diamond/gemstone facets, and micro-details.
 * 2. Employs 2048px Ultra-HD canvas rendering with subtle unsharp-mask edge sharpening.
 * 3. Never touches or alters external HTTP/HTTPS URLs (preserving 100% lossless original quality).
 * 4. Optimizes local base64 uploads cleanly so they remain sharp on Retina & 4K displays while respecting Firestore document limits.
 */

function checkWebpSupport(): boolean {
  try {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  } catch (e) {
    return false;
  }
}

const isWebpSupported = checkWebpSupport();

/**
 * Applies a subtle unsharp mask convolution to enhance gemstone and jewelry clarity
 */
function applyClaritySharpen(ctx: CanvasRenderingContext2D, width: number, height: number, amount = 0.15) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);

    // 3x3 Sharpen Kernel
    // [  0, -a,  0 ]
    // [ -a, 1+4a, -a ]
    // [  0, -a,  0 ]
    const a = amount;
    const center = 1 + 4 * a;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const top = ((y - 1) * width + x) * 4;
        const bottom = ((y + 1) * width + x) * 4;
        const left = (y * width + (x - 1)) * 4;
        const right = (y * width + (x + 1)) * 4;

        for (let c = 0; c < 3; c++) {
          const val = copy[idx + c] * center -
            (copy[top + c] + copy[bottom + c] + copy[left + c] + copy[right + c]) * a;
          data[idx + c] = Math.min(255, Math.max(0, val));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    // If CORS or tainted canvas, continue safely
  }
}

/**
 * Stepped multi-pass downsampling with crisp edge preservation
 */
function steppedDownscale(
  sourceCanvas: HTMLCanvasElement, 
  targetWidth: number, 
  targetHeight: number,
  applySharpen = true
): HTMLCanvasElement {
  let curCanvas = sourceCanvas;
  let curW = curCanvas.width;
  let curH = curCanvas.height;

  while (curW / 2 >= targetWidth && curH / 2 >= targetHeight) {
    const nextCanvas = document.createElement('canvas');
    curW = Math.floor(curW / 2);
    curH = Math.floor(curH / 2);
    nextCanvas.width = curW;
    nextCanvas.height = curH;

    const ctx = nextCanvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(curCanvas, 0, 0, curW, curH);
    }
    curCanvas = nextCanvas;
  }

  if (curW !== targetWidth || curH !== targetHeight) {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;
    const ctx = finalCanvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(curCanvas, 0, 0, targetWidth, targetHeight);
      if (applySharpen) {
        applyClaritySharpen(ctx, targetWidth, targetHeight, 0.12);
      }
    }
    return finalCanvas;
  }

  const finalCtx = curCanvas.getContext('2d');
  if (finalCtx && applySharpen) {
    applyClaritySharpen(finalCtx, curW, curH, 0.12);
  }

  return curCanvas;
}

export async function optimizeDataUrl(
  dataUrl: string,
  maxDim = 2048,
  quality = 0.90
): Promise<string> {
  // If not a data url (e.g. https://...), return 100% original as is
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // If already reasonably sized (< 2048px) and moderate payload, keep full original pixels
        if (width <= maxDim && height <= maxDim && dataUrl.length < 250000) {
          resolve(dataUrl);
          return;
        }

        // Maintain exact aspect ratio up to 2048px Ultra-HD
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

        const initialCanvas = document.createElement('canvas');
        initialCanvas.width = img.naturalWidth || img.width;
        initialCanvas.height = img.naturalHeight || img.height;
        const initCtx = initialCanvas.getContext('2d');
        if (!initCtx) {
          resolve(dataUrl);
          return;
        }
        initCtx.drawImage(img, 0, 0);

        // High-precision stepped downsampling with clarity enhancement
        const scaledCanvas = steppedDownscale(initialCanvas, width, height, true);

        // Modern high-fidelity format
        const mimeType = isWebpSupported ? 'image/webp' : 'image/jpeg';
        let result = scaledCanvas.toDataURL(mimeType, quality);

        // Safety fallback if payload exceeds 300KB
        if (result.length > 350000) {
          result = scaledCanvas.toDataURL(mimeType, 0.85);
        }

        resolve(result);
      } catch (err) {
        console.warn('Could not optimize image canvas:', err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function compressImageFile(
  file: File,
  maxDim = 2048,
  quality = 0.90
): Promise<string> {
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

/**
 * Protects Firestore writes from hitting the 1MB document limit while keeping
 * images at maximum 2048px Ultra-HD resolution and high clarity.
 */
export async function optimizeProductForFirestore<T extends { imageUrl?: string; thumbnails?: string[] }>(product: T): Promise<T> {
  const cloned = { ...product };

  // 1. If primary image is base64, ensure 2048px high clarity
  if (cloned.imageUrl && cloned.imageUrl.startsWith('data:image/')) {
    cloned.imageUrl = await optimizeDataUrl(cloned.imageUrl, 2048, 0.90);
  }

  // 2. If thumbnails are base64, ensure 1800px high clarity
  if (Array.isArray(cloned.thumbnails) && cloned.thumbnails.length > 0) {
    const optimizedThumbs: string[] = [];
    for (const thumb of cloned.thumbnails) {
      if (thumb && thumb.startsWith('data:image/')) {
        optimizedThumbs.push(await optimizeDataUrl(thumb, 1800, 0.88));
      } else {
        optimizedThumbs.push(thumb);
      }
    }
    cloned.thumbnails = optimizedThumbs;
  }

  // 3. Document Size Safety Check: If total document approaches 900KB (Firestore limit is 1MB)
  try {
    let jsonStr = JSON.stringify(cloned);
    if (jsonStr.length > 880000) {
      if (cloned.imageUrl && cloned.imageUrl.startsWith('data:image/')) {
        cloned.imageUrl = await optimizeDataUrl(cloned.imageUrl, 1600, 0.85);
      }
      if (Array.isArray(cloned.thumbnails)) {
        const balancedThumbs: string[] = [];
        for (const thumb of cloned.thumbnails) {
          if (thumb && thumb.startsWith('data:image/')) {
            balancedThumbs.push(await optimizeDataUrl(thumb, 1400, 0.82));
          } else {
            balancedThumbs.push(thumb);
          }
        }
        cloned.thumbnails = balancedThumbs;
      }
    }
  } catch (e) {
    console.warn('Size check warning:', e);
  }

  return cloned;
}
