export const processImageForCanvas = async (
  file: File,
  scale: number,
  position: { x: number; y: number }
): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const SIZE = 400;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = SIZE;
        canvas.height = SIZE;

        // Calculate scaled dimensions
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Calculate position adjustments based on scale
        const adjustedX = position.x / scale;
        const adjustedY = position.y / scale;

        // Center the image first
        const centerX = (SIZE - scaledWidth) / 2;
        const centerY = (SIZE - scaledHeight) / 2;

        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, SIZE, SIZE);

        // Draw the image with correct positioning
        ctx.save();
        ctx.translate(SIZE / 2, SIZE / 2);
        ctx.scale(scale, scale);
        ctx.translate(-SIZE / 2, -SIZE / 2);
        ctx.drawImage(
          img,
          centerX / scale + adjustedX,
          centerY / scale + adjustedY,
          img.width,
          img.height
        );
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
          },
          'image/jpeg',
          0.9
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};