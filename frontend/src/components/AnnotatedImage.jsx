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
          ctx.lineWidth = 3;  
          ctx.strokeRect(x - width/2, y - height/2, width, height);

          const fontSize = 18;  
          ctx.font = `bold ${fontSize}px Arial`;  
          const label = `${p.class} ${(p.confidence * 100).toFixed(1)}%`;
          const textWidth = ctx.measureText(label).width;
          
          const textX = x - width/2 + 8;  
          const textY = y - height/2 - 10; 
          const rectHeight = fontSize + 8; 

          ctx.fillStyle = 'rgba(255, 0, 0, 1)';  
          ctx.fillRect(
            x - width/2, 
            y - height/2 - rectHeight, 
            textWidth + 16,  
            rectHeight
          );

          ctx.fillStyle = '#FFFFFF';
          ctx.textBaseline = 'top';  
          ctx.fillText(label, textX, textY - rectHeight + 4);
        });
      }
    };

    return () => {};
  }, [imageUrl, predictions]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="w-full max-w-4xl h-auto border-2 border-gray-200 rounded-lg"
      />
    </div>
  );
};

export default AnnotatedImage;
