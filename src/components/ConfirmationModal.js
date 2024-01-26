import React from 'react';
import '../styles/Modal.css'; 

const ConfirmationModal = ({ onClose, onConfirm }) => {
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <h2>Are you sure you want to quit?</h2>
          <div className="modal-actions">
            <button onClick={onConfirm}>Yes, I Quit</button>
            <button onClick={onClose}>No, Go Back</button>
          </div>
        </div>
      </div>
    );
  };
