//import React from 'react'; // Import useState here
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RevealerGame from './components/RevealerGame';
import './styles/RevealerGame.css';
import './styles/Modal.css';

function App() {
  const [imageData, setImageData] = useState({ url: '', answer: '', credit:'', crediturl:'' });
  const theme = "Wonders";
 // const correctAnswer = "taj mahal"; // The correct answer for guessing(this is going to be changed ltr)

 useEffect(() => {
  // Fetch the image based on the theme
  axios.get(`http://localhost:5001/images/by-theme/${theme}`)
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

                <RevealerGame
            imageSrc={imageData.url} //{'image/image.jpg'}
            answer= {imageData.answer}//{correctAnswer}
            credit= {imageData.credit}
            crediturl={imageData.crediturl}
          />
        
      </header>
    </div>
  );
}

export default App;
