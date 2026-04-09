import * as QRCode from 'qrcode';

export const generateQRCode = async (data: any): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrDataUrl;
  } catch (err) {
    console.error('QR Generation Error:', err);
    throw err;
  }
};

export const downloadQR = (dataUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `QR_${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
