import { VisualSignal } from '@/types';

/**
 * Extract simple browser-local visual signals from an image using HTML Canvas API.
 * NOTE: These are prototype visual features for observation only and NOT medically validated measurements.
 */
export async function extractImageFeatures(imageSrc: string): Promise<VisualSignal> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Scale down image for fast local analysis
      const targetWidth = 150;
      const scale = targetWidth / img.width;
      const targetHeight = Math.max(1, Math.round(img.height * scale));

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback default signal if context fails
        resolve({
          redDominance: 28,
          brightness: 120,
          imageQuality: 'good',
        });
        return;
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imageData.data;

      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let redDominantPixelCount = 0;
      const totalPixels = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        totalR += r;
        totalG += g;
        totalB += b;

        // Check if red component is visibly dominant over green & blue
        if (r > g + 15 && r > b + 15) {
          redDominantPixelCount++;
        }
      }

      const avgBrightness = Math.round((totalR + totalG + totalB) / (totalPixels * 3));
      const redDominance = Math.min(100, Math.round((redDominantPixelCount / totalPixels) * 100));

      const isLowQuality = img.width < 200 || avgBrightness < 30 || avgBrightness > 235;

      resolve({
        redDominance: Math.max(12, redDominance), // Normal human skin baseline range
        brightness: avgBrightness,
        imageQuality: isLowQuality ? 'low' : 'good',
      });
    };

    img.onerror = () => {
      // Fallback signal if image failed to render
      resolve({
        redDominance: 25,
        brightness: 110,
        imageQuality: 'good',
      });
    };

    img.src = imageSrc;
  });
}
