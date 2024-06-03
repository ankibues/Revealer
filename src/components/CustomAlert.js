import React from 'react';
import '../styles/CustomAlert.css';

const CustomAlert = ({ message, onCopy }) => {
  return (
    <div className="custom-alert-backdrop">
      <div className="custom-alert-content">
        <p>{message}</p>
        <button onClick={onCopy}>Copy Score To Your Clipboard</button>
      </div>
    </div>
  );
};

export default CustomAlert;
