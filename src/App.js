//import React from 'react'; // Import useState here
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RevealerGame from './components/RevealerGame';
import './styles/RevealerGame.css';
import './styles/Modal.css';
import HowToPlayModal from './components/HowToPlayModal';
function App() {
  const [showHowToModal, setShowHowToModal] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowHowToModal(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleCloseModal = () => setShowHowToModal(false);


  const [imageData, setImageData] = useState({ url: '', answer: '', credit:'', crediturl:'' });
  const theme = "Wonders of the world";
 // const correctAnswer = "taj mahal"; // The correct answer for guessing(this is going to be changed ltr)

 useEffect(() => {
  // Fetch the image based on the theme
  axios.get(`${process.env.REACT_APP_URL}/images/image-of-the-day/${theme}`)
    .then(response => {
      setImageData({ 
        url: response.data.url, 
        answer: response.data.answer,
        credit: response.data.credit,
        crediturl: response.data.crediturl,
      });
    })
    .catch(error => {
      console.error('Error fetching image:', error);
    });
}, []); 

  return (
    <div className="App">
      <header className="App-header">
                <HowToPlayModal isOpen={showHowToModal} onClose={handleCloseModal} theme={theme} />

                <RevealerGame
            imageSrc={imageData.url} //{'image/image.jpg'}
            answer= {imageData.answer}//{correctAnswer}
            credit= {imageData.credit}
            crediturl={imageData.crediturl}
            theme= {theme}
          />
        
      </header>
    </div>
  );
}

export default App;
