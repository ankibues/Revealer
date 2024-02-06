import React from 'react';
import '../styles/PhotoWithCredit.css'; // Make sure to create this CSS file

const PhotoWithCredit = ({ credit,crediturl }) => {
  return (
      <div className="photo-credit">
        Photo by   
        <a 
          href={`${crediturl}?utm_source=revealer&utm_medium=referral`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
         {" " + credit}
        </a> on &nbsp;
        <a 
          href="https://unsplash.com/?utm_source=revealer&utm_medium=referral" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Unsplash
        </a>
      </div>
  );
};

export default PhotoWithCredit;
