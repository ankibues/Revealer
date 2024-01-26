const IncorrectGuessModal = ({ onClose }) => {
    return (
      <div className="modal-backdrop">
        <div className="modalContent">
        <button className="modal-close-button" onClick={onClose} onKeyDown={(e) => {
    // Check if the key pressed is 'Enter' or 'Escape' and close the modal
    if (e.key === 'Enter' || e.key === 'Escape') onClose();
  }}
  tabIndex="0"
  aria-label="Close"
>&times;</button>
          <h2>Wrong guess! Keep trying.</h2>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

export default IncorrectGuessModal;