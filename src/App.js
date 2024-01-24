import React, { useState } from 'react'; // Import useState here
import './App.css';
import RevealerGame from './components/RevealerGame';
import './styles/RevealerGame.css';
import './styles/Modal.css';

function App() {
  const [gridSize, setGridSize] = useState(5); // State for grid size
  const [gameStart, setGameStart] = useState(false); // State to control when the game starts

  const handleGridSizeChange = (event) => {
    setGridSize(Number(event.target.value));
  };

  const handleRestart = () => {
    // Reset all necessary states to restart the game
    setGridSize(4); 
    setGameStart(false);
  
  };

  const startGame = () => {
    setGameStart(true); // Start the game
  };

  const correctAnswer = "taj mahal"; // The correct answer for guessing

  return (
    <div className="App">
      <header className="App-header">
        {!gameStart && (
          <div>
            <label>
              Choose grid size:
              <select value={gridSize} onChange={handleGridSizeChange}>
                <option value="3">3x3</option>
                <option value="4">4x4</option>
                <option value="5">5x5</option>
        
              </select>
            </label>
            <button onClick={startGame}>Start Game</button>
          </div>
        )}

        {gameStart && (
          <RevealerGame
            imageSrc={'image/image.jpg'}
            gridSize={gridSize}
            answer={correctAnswer}
          />
        )}
      </header>
    </div>
  );
}

export default App;
