
import React from 'react';
import '../styles/Modal.css'; 

const Modal = ({ show, score, answer, message}) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modalContent">
        <p>{message}</p>
        <p>  Correct answer is '{answer}' </p>
        {score !== null ? <p>Your final score is: {score}</p> : null}
        <p>See you tomorrow !</p>
      </div>
    </div>
  );
};

export default Modal;
