import React from 'react';

function ImageUpload({ onImageSelect }) {
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      onImageSelect(URL.createObjectURL(img));
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
    </div>
  );
}

export default ImageUpload;
