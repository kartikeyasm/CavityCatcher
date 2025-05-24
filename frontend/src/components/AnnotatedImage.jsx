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
          
          // Draw bounding box
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 3;  // Increased from 2
          ctx.strokeRect(x - width/2, y - height/2, width, height);

          // Text styling
          const fontSize = 18;  // Increased from 14
          ctx.font = `bold ${fontSize}px Arial`;  // Added bold
          const label = `${p.class} ${(p.confidence * 100).toFixed(1)}%`;
          const textWidth = ctx.measureText(label).width;
          
          // Calculate positions
          const textX = x - width/2 + 8;  // Increased padding
          const textY = y - height/2 - 10; // Adjusted position
          const rectHeight = fontSize + 8; // Dynamic height based on font size

          // Draw label background
          ctx.fillStyle = 'rgba(255, 0, 0, 1)';  // Slightly transparent
          ctx.fillRect(
            x - width/2, 
            y - height/2 - rectHeight, 
            textWidth + 16,  // Increased padding
            rectHeight
          );

          // Draw label text
          ctx.fillStyle = '#FFFFFF';
          ctx.textBaseline = 'top';  // Better text alignment
          ctx.fillText(label, textX, textY - rectHeight + 4);
        });
      }
    };

    return () => {
      // Clean up object URL if needed
    };
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
