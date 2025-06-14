
import QRCode from 'react-qr-code';
import React from 'react';

export const generateQRCodeUrl = async (text: string): Promise<string> => {
  try {
    // Create a temporary div to render the QR code
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    // Create QR code element
    const qrCodeElement = React.createElement(QRCode, {
      value: text,
      size: 150,
      level: 'M',
    });

    // Use ReactDOM to render to the container
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    
    return new Promise((resolve) => {
      root.render(qrCodeElement);
      
      // Wait for render to complete
      setTimeout(() => {
        const svgElement = container.querySelector('svg');
        if (svgElement) {
          const svgString = new XMLSerializer().serializeToString(svgElement);
          const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
          
          // Cleanup
          root.unmount();
          document.body.removeChild(container);
          
          resolve(dataUrl);
        } else {
          // Cleanup on failure
          root.unmount();
          document.body.removeChild(container);
          resolve('');
        }
      }, 100);
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

export const convertEmbedsToQRCodes = async (content: string): Promise<string> => {
  const embedRegex = /<div class="embed-container" data-url="([^"]*)" data-title="([^"]*)" data-type="([^"]*)"[\s\S]*?<\/div>/g;
  let convertedContent = content;
  const matches = [...content.matchAll(embedRegex)];
  
  for (const match of matches) {
    const [fullMatch, url, title, type] = match;
    try {
      const qrCodeUrl = await generateQRCodeUrl(url);
      if (qrCodeUrl) {
        const qrCodeHtml = `
          <div class="qr-code-container" style="text-align: center; margin: 20px 0; padding: 15px; border: 2px dashed #ccc; border-radius: 8px;">
            <h4 style="margin-bottom: 10px; color: #333;">${title}</h4>
            <img src="${qrCodeUrl}" alt="QR Code for ${title}" style="display: block; margin: 0 auto 10px;" />
            <p style="font-size: 12px; color: #666; margin: 0;">Scan QR code to access: ${type === 'video' ? 'Video' : 'Website'}</p>
            <p style="font-size: 10px; color: #999; margin: 5px 0 0; word-break: break-all;">${url}</p>
          </div>
        `;
        convertedContent = convertedContent.replace(fullMatch, qrCodeHtml);
      }
    } catch (error) {
      console.error('Error converting embed to QR code:', error);
    }
  }
  
  return convertedContent;
};
