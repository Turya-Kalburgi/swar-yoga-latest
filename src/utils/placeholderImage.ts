/**
 * Placeholder image generator
 * Creates simple SVG-based placeholder images without external dependencies
 */

export const getPlaceholderImage = (width: number = 400, height: number = 300, text: string = 'Image'): string => {
  const encodedText = encodeURIComponent(text);
  
  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${text}
      </text>
    </svg>
  `;
  
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};

/**
 * Get a data URL for a placeholder image
 */
export const getPlaceholderDataUrl = (width: number = 400, height: number = 300, text: string = 'Image'): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${text}
      </text>
    </svg>
  `;
  
  const encoded = btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
};

/**
 * Simple solid color placeholder
 */
export const getColorPlaceholder = (width: number = 400, height: number = 300, color: string = '#667eea', text: string = ''): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      ${text ? `<text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${text}</text>` : ''}
    </svg>
  `;
  
  const encoded = btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
};
