
import React, { useState} from 'react';
import '../styles/Modal.css'; 

const Modal = ({ onClose, show, score, answer, message, resultString}) => {
  const [isCopyMessageVisible, setIsCopyMessageVisible] = useState(false);

  if (!show) return null;


  return (
    <div className="modal-backdrop">
      <div className="modalContent">
      <button className="modal-close-button" onClick={onClose} onKeyDown={(e) => {
    // Check if the key pressed is 'Enter' or 'Escape' and close the modal
    if (e.key === 'Enter' || e.key === 'Escape') onClose();
  }}
  tabIndex="0"
  aria-label="Close"
> &times;</button>
        <p>{message}</p>
        <p>  Correct answer is '{answer}' </p>
        {score !== null ? <p>Your final score is: {score}</p> : null}
        <button onClick={() => {
            navigator.clipboard.writeText('Revealer Result: ' + score + '\n'+ resultString).then(() => {
              setIsCopyMessageVisible(true); // Show the copied message
              setTimeout(() => {
                setIsCopyMessageVisible(false); // Hide the message after 2 seconds
              }, 2000);
            }).catch((err) => {
              console.error('Could not copy text: ', err);
              // Optionally handle the error case
            });
        }}>
  Share Result
</button>
{isCopyMessageVisible && <div className="clipboard-message">Copied results to clipboard</div>}
        <p>See you tomorrow!</p>
      </div>
    </div>
  );
};


export default Modal;
