import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const ImageRevealGame = () => {
  const [imageUri, setImageUri] = useState(null);
  const [coveredParts, setCoveredParts] = useState(new Array(16).fill(true)); // 3x3 grid

  const onImageUpload = (uri) => {
    setImageUri(uri);
    setCoveredParts(new Array(16).fill(true)); // Reset the grid
  };

  const onSectionPress = (index) => {
    const updatedCoveredParts = coveredParts.map((covered, idx) => idx === index ? false : covered);
    setCoveredParts(updatedCoveredParts);
  };

  return (
    <div>
      <ImageUpload onImageSelect={onImageUpload} />
      <div style={{ position: 'relative', width: 300, height: 300 ,overflow: 'hidden' }}>
        
        {imageUri && <img src={imageUri} alt="Reveal" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexWrap: 'wrap' }}>
          {coveredParts.map((covered, index) => (
            covered && (
              <div key={index} style={{ width: '25%', height: '25%', backgroundColor: 'rgba(0, 0, 0, 1)' }} onClick={() => onSectionPress(index)}></div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageRevealGame;
