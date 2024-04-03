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
  const [theme, setTheme] = useState('Animals'); // default theme is Animals
  const [imageData, setImageData] = useState({ url: '', answer: '', credit:'', crediturl:'' });

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowHowToModal(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);


 useEffect(() => {
  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  
  axios.get(`${process.env.REACT_APP_URL}/images/image-for-date?date=${today}`)
    .then(response => {
      // Assuming the endpoint returns the image details directly,
      // including the theme as part of the response.
      
      if(response.data && response.data.themeName) {
        setTheme(response.data.themeName);
        console.log(response.data.themeName);
      }

      setImageData({ 
        url: response.data.url || '', 
        answer: response.data.answer || '',
        credit: response.data.credit || '',
        crediturl: response.data.crediturl || '',
      });
    })
    .catch(error => {
      console.error('Error fetching image data:', error);
      // Optionally handle the case where no image data is available.
    });
}, []);


const handleCloseModal = () => setShowHowToModal(false);

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
