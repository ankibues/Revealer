import React, { useState , useCallback} from 'react'; // Import useState here
import './App.css';
import RevealerGame from './components/RevealerGame';
import './styles/RevealerGame.css';
import './styles/Modal.css';

function App() {
  const defaultGridSize=4;
  const [gridSize, setGridSize] = useState(defaultGridSize); 
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const correctAnswer = "taj mahal"; // The correct answer for guessing(this is going to be changed ltr)

  const handleGameStart = useCallback(() => {
    setGameHasStarted(true);
  }, []);

  const handleGridSizeChange = (event) => {
    setGridSize(Number(event.target.value));
  };

  const handleRestart = () => {
    // Reset all necessary states to restart the game
    setGridSize(defaultGridSize); 
    setGameHasStarted(false);
  
  };

  
  

  return (
    <div className="App">
      <header className="App-header">
        <div className="game-container">
        <RevealerGame
            imageSrc={'image/image.jpg'}
            gridSize={gridSize}
            answer={correctAnswer}
            onGameStart={handleGameStart}
          />

          <div className="controls-container" style={{ display: gameHasStarted ? 'none' : 'block' }}>
                <label className="grid-size-label">
                    Choose grid size: 
                  <select
                   value={gridSize}
                  onChange={handleGridSizeChange}
                  disabled={gameHasStarted}
                  >
                    <option value="3">3x3</option>
                    <option value="4">4x4</option>
                    <option value="5">5x5</option>
            
                  </select>
                </label>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
