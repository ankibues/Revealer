
import React, { useState, useEffect} from 'react';
import '../styles/Modal.css'; 
import { FaFacebook, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import CustomAlert from './CustomAlert'; 

const Modal = ({ onClose, show, score, answer, message, resultString}) => {
  const [isCopyMessageVisible, setIsCopyMessageVisible] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse(); // Ensure Facebook SDK is parsed
    }
  }, []);

  


  if (!show) return null;

  const gameUrl = window.location.href;
  const shareText = `🎉 I just played this fun game! Can you beat my score? 🤔 My score is: ${score} 🏆 \n${resultString}\nPlay the game here and challenge me: ${gameUrl} 😄🎮`;
  const encodedShareText = encodeURIComponent(shareText);

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopyMessageVisible(true);
      setTimeout(() => {
        setIsCopyMessageVisible(false);
      }, 2000);

      setShowCustomAlert(false);
      if (window.FB) {
      window.FB.ui({
        method: 'share',
        href: gameUrl,
      }, function (response) {
        if (response && !response.error_message) {
          console.log("Posting completed.");
        } else {
          console.error("Error while posting.");
        }
      });
    } else {
      console.error('Facebook SDK not loaded yet.');
    }






    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const shareToFacebook = () => {
    setShowCustomAlert(true);
  };



  const shareToX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodedShareText}`;
    window.open(url, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodedShareText}`;
    window.open(url, '_blank');
  };


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
        {score !== null && (
          <>
        <button
          onClick={() => {
            navigator.clipboard
              .writeText('Revealer ' + new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date()) + ': ' + score + '\n' + '\n'+ resultString)
              .then(() => {
                setIsCopyMessageVisible(true);
                setTimeout(() => {
                  setIsCopyMessageVisible(false);
                }, 2000);
              })
              .catch((err) => {
                console.error('Could not copy text: ', err);
              });
          }}
        >
          Share Result
        </button>
         <p>Share it with your friends and see if you beat them!</p>
         <div className="social-icons">
              <FaFacebook onClick={shareToFacebook} aria-label="Share on Facebook" className="facebook-icon" />
              <FaXTwitter onClick={shareToX} aria-label="Share on X" className="x-icon"/>
              <FaWhatsapp onClick={shareToWhatsApp} aria-label="Share on WhatsApp" className="whatsapp-icon" />
            </div>
       </>
      )}
      
{isCopyMessageVisible && <div className="clipboard-message">Copied results to clipboard</div>}
        <p>See you tomorrow!</p>
        {showCustomAlert && (
          <CustomAlert
            message="You will be redirected to Facebook to share your score. Use following button to proceed!"
            onCopy={handleCopyText}
          />
        )}
      </div>
    </div>
  );
};


export default Modal;
