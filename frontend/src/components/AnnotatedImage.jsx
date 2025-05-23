// src/components/AnnotatedImage.jsx
import React, { useRef, useEffect } from 'react';

const AnnotatedImage = ({ imageUrl, predictions }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      if (predictions && predictions.length > 0) {
        predictions.forEach(p => {
          const { x, y, width, height } = p.bbox;
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - width/2, y - height/2, width, height);

          ctx.fillStyle = '#FF0000';
          const label = `${p.class} ${(p.confidence * 100).toFixed(1)}%`;
          const textWidth = ctx.measureText(label).width;
          ctx.fillRect(x - width/2, y - height/2 - 20, textWidth + 10, 20);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px Arial';
          ctx.fillText(label, x - width/2 + 5, y - height/2 - 5);
        });
      }
    };

    return () => {
      // Clean up object URL if needed
      // URL.revokeObjectURL(imageUrl); // Only if imageUrl is a blob URL
    };
  }, [imageUrl, predictions]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full max-w-md h-auto border rounded" />
    </div>
  );
};

export default AnnotatedImage;
