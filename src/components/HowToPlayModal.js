import React from 'react';
import '../styles/Modal.css';

const HowToPlayModal = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>How to play Revealer</h2>
        <p>Click on the tiles to reveal a portion of the hidden picture</p>
        <div className="modal-image-container">
          <img src='image/HowToPlay.png' alt="Gameboard" />
        </div>
        <p>Your goal is to  <b> guess the picture in as less clicks as possible</b></p> 
        <p>A new picture is released daily at midnight</p>
        <p>Each picture belongs to a weekly theme.</p>
        <p>This week's theme: <b>{theme}</b>  </p>

      </div>

    </div>
  );
};

export default HowToPlayModal;
