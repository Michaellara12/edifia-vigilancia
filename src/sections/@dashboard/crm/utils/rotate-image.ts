export const rotateImage = (blob: Blob, degrees: number) => {
    return new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not create canvas context.'));
          return;
        }
  
        // Rotate the image
        canvas.width = img.height;
        canvas.height = img.width;
        ctx.rotate(degrees * (Math.PI / 180));
        ctx.drawImage(img, 0, -canvas.width);
  
        // Convert the canvas back to a blob
        canvas.toBlob((resultBlob) => {
          if (resultBlob) {
            resolve(resultBlob);
          } else {
            reject(new Error('Could not convert canvas to blob.'));
          }
        });
      };
  
      img.onerror = () => {
        reject(new Error('Failed to load image.'));
      };
    });
  };