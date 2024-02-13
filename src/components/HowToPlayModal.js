import React from 'react';
import '../styles/Modal.css';

const HowToPlayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>How to play Revealer</h2>
        <p>Click on the tiles to reveal a part of the hidden picture</p>
        <p>Each revealed tile increases your score</p>
        <p>Your goal is to guess the picture in as less clicks as possible</p> 
        <p>A new picture is released daily at midnight</p>
        <p>Each picture belongs to the weekly theme.</p>

      </div>

    </div>
  );
};

export default HowToPlayModal;
