import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RevealerGame from './components/RevealerGame';
import './styles/RevealerGame.css';
import './styles/Modal.css';
import HowToPlayModal from './components/HowToPlayModal';
import ImageScheduler from './components/ImageScheduler';

function App() {
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [theme, setTheme] = useState('Animals'); // Default theme is Animals
  const [imageData, setImageData] = useState({ url: '', answer: '', credit: '', crediturl: '' });

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowHowToModal(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  useEffect(() => {
    // Call the endpoint to get today's image
    axios.get(`${process.env.REACT_APP_URL}/images/get-todays-image`)
      .then(response => {
        if (response.data) {
          setTheme(response.data.themeName || 'Animals'); // Default theme if not provided
          setImageData({
            url: response.data.imageUrl || '',
            answer: response.data.answer || '',
            credit: response.data.credit || '', // Placeholder for future use
            crediturl: response.data.crediturl || '' // Placeholder for future use
          });
        }
      })
      .catch(error => {
        console.error('Error fetching image data:', error);
      });
  }, []);

  const handleCloseModal = () => setShowHowToModal(false);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* Route for the main game */}
            <Route
              path="/"
              element={
                <>
                  <HowToPlayModal isOpen={showHowToModal} onClose={handleCloseModal} theme={theme} />
                  <RevealerGame
                    imageSrc={imageData.url}
                    answer={imageData.answer}
                    credit={imageData.credit}
                    crediturl={imageData.crediturl}
                    theme={theme}
                  />
                </>
              }
            />

            {/* Admin-only route for image scheduling */}
            <Route
              path="/image-scheduler"
              element={<ImageScheduler />}
            />

            {/* Redirect any unknown route back to the main game */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
