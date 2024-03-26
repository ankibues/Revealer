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

  


  
 // const theme = "Wonders of the world";
// instead of this, i should have an API call that get's the theme based on date.





 // const correctAnswer = "taj mahal"; // The correct answer for guessing(this is going to be changed ltr)

 useEffect(() => {
  // Fetch the theme based on the current date
  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  axios.get(`/api/themes/by-date?date=${today}`)
    .then(response => {
      // Assuming the response contains an array of theme names
      const themeName = response.data.length > 0 ? response.data[0] : 'Animals';
      setTheme(themeName); // Set the theme

      // Now, fetch the image based on the newly set theme
      axios.get(`${process.env.REACT_APP_URL}/images/image-of-the-day/${themeName}`)
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
    })
    .catch(error => {
      console.error('Error fetching theme:', error);
      // You can optionally fetch the default theme's image here if needed
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
