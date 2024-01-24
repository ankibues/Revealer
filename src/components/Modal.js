
import React from 'react';
import '../styles/Modal.css'; 

const Modal = ({ show, score, onRestart }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modalContent">
        <h2>Congratulations!</h2>
        <p>Your final score is: {score}</p>
        <button>Come back tomorrow for a new image!</button>
      </div>
    </div>
  );
};

export default Modal;
