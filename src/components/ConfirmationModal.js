import React from 'react';
import '../styles/Modal.css'; 

const ConfirmationModal = ({ onClose, onConfirm }) => {
    return (
      <div className="modal-backdrop">
        <div className="modalContent">
        <button className="modal-close-button" onClick={onClose} onKeyDown={(e) => {
    // Check if the key pressed is 'Enter' or 'Escape' and close the modal
    if (e.key === 'Enter' || e.key === 'Escape') onClose();
  }}
  tabIndex="0"
  aria-label="Close">&times;</button>
          <h2>Are you sure you want to quit?</h2>
          <h5> Answer will be revealed as the game ends!</h5>
          <div className="modal-actions">
            <button onClick={onConfirm} className='quit-button'>Yes, I Quit</button>
            <button onClick={onClose} className='submit-button'>No, Go Back</button>
          </div>
        </div>
      </div>
    );
  };

  export default ConfirmationModal;
