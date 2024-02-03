import React, { useState, useEffect,  useCallback } from 'react';
import Modal from './Modal'; 
import ConfirmationModal from './ConfirmationModal';
import IncorrectGuessModal from './IncorrectGuessModal'; 
import '../styles/RevealerGame.css';

const RevealerGame = ({ imageSrc, answer}) => {
  // Create a grid state representing the revealed cells
  
  const defaultGridSize=4;
  const [gridSize, setGridSize] = useState(defaultGridSize); 
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showIncorrectGuessModal, setShowIncorrectGuessModal] = useState(false);



  const imageSize = 100 / (gridSize - 1);

  const handleGameStart = useCallback(() => {
    setGameHasStarted(true);
  }, []);

  useEffect(() => {

    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
    setGrid(newGrid);
    document.documentElement.style.setProperty('--grid-size', gridSize.toString());
    
  },[gridSize]);

  const handleGridSizeChange = (event) => {
    setGridSize(Number(event.target.value));
  };
  
  const handleCellClick = (rowIndex, colIndex) => {
    handleGameStart();
    if (finalScore !== null) return; // If the game is over, do nothing

    setGrid(currentGrid => {
      // Only update the score if the cell was not previously revealed
      if (!currentGrid[rowIndex][colIndex]) {
        const newScore= score+1;
        setScore(newScore);

        const revealedTiles = currentGrid.flat().filter(revealed => revealed).length;
      if (revealedTiles  === gridSize * gridSize) {
        setFinalScore(newScore); // This captures the final score
      }
        return currentGrid.map((row, rIdx) => (
          rIdx === rowIndex ? row.map((cell, cIdx) => cIdx === colIndex ? true : cell) : row
        ));
      }
      return currentGrid; // Return the grid as is if the cell was already revealed
    });
  };
  
  const calculateRevealedTiles = () => {
    return grid.flat().filter(revealed => revealed).length;
  };

  const totalTiles = gridSize * gridSize;

  useEffect(() => {
    const revealedTiles = calculateRevealedTiles();
    setScore(`${revealedTiles}/${totalTiles}`);
  }, [grid]);


  const revealAllCells = () => {
    const newGrid = grid.map(row => row.map(() => true));
    setGrid(newGrid);
  };

  const handleSubmitGuess = (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    if (userGuess.toLowerCase() === answer.toLowerCase()) {
      setFinalScore(score); // Finalize the score if the guess is correct
      setShowModal(true); 
      revealAllCells(); 
    } else {
      setShowIncorrectGuessModal(true);
    }
  };

  const handleQuit = () => {
    setShowModal(false); // If you are using the same modal for both, close the guess modal
    setShowQuitModal(true); // Show the quit modal
    revealAllCells(); // Reveal all cells to show the answer
   
  };

  const handleQuitClick = () => {
    setShowConfirmationModal(true); // Show confirmation modal
  };

  const handleConfirmQuit = () => {
    // Code to handle the quit action
    setShowConfirmationModal(false); // Close the confirmation modal
    handleQuit(); 
  };
  
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false); // Close the confirmation modal
  };

  const showCustomTooltip = (e) => {
    const tooltip = document.getElementById('custom-tooltip');
    tooltip.style.display = 'block';
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY}px`; 
    tooltip.style.opacity = 1;
  };
  
  const hideCustomTooltip = () => {
    const tooltip = document.getElementById('custom-tooltip');
    tooltip.style.opacity = 0;
    setTimeout(() => tooltip.style.display = 'none', 150); // Hide after the transition
  };


  // Render the grid
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="gridRow" style={{ gridTemplateRows: `repeat(${gridSize}, 1fr)`}} >
        {row.map((revealed, colIndex) => {
          // Calculate background position for each cell
          const positionX = (imageSize * colIndex) + '%';
          const positionY = (imageSize * rowIndex) + '%';
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`gridCell ${revealed ? 'revealed' : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                backgroundImage: revealed ? `url(${imageSrc})` : 'none',
                backgroundPosition: `${positionY} ${positionX}`,
                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`
              }}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="gameContainer">
      <div className= "gameInfo">
      <h2>Revealer</h2>
      <h5> Guess the hidden picture! </h5>
      </div>
      
      <div className="score">Score: {finalScore !== null ? `${finalScore}` : `${score}`}</div>
      <div className={`gridContainer ${finalScore !== null ? 'gameOver' : ''}`}>
        {
        renderGrid()
        }

      </div>
      {finalScore === null ? (
      <form onSubmit={handleSubmitGuess} className="guessForm">
       <div className= "controls-container">
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Enter your guess"
        />
        <button type="submit" className="submit-button" >Submit Guess</button>
        <button type="button" onClick={handleQuitClick} className="quit-button">I Quit</button>
        </div>
        </form>
    ) : (
      <Modal onClose={() => setShowModal(false)} show={showModal} score={finalScore} answer={answer} message="Awesome! You are right !"/>
    )}


    {showQuitModal && (
     <Modal 
      onClose= {() => setShowQuitModal(false)}
       show={showQuitModal}
        score={finalScore}
        answer= {answer}
        message= "That's ok! You will get it next time!"
      />
      )}

    {showConfirmationModal && (
      <ConfirmationModal
          onConfirm={handleConfirmQuit}
          onClose={handleCloseConfirmationModal}
        />
      )}

    <label className="grid-size-label">
                    Choose grid size: 
              <select
                   value={gridSize}
                  onChange={handleGridSizeChange}
                  disabled={gameHasStarted}
                  onMouseOver={gameHasStarted ? showCustomTooltip : null}
                  onMouseOut={gameHasStarted ? hideCustomTooltip : null}
                  >

                    <option value="3">3x3</option>
                    <option value="4">4x4</option>
                    <option value="5">5x5</option>
            
                  </select>
                  <div id="custom-tooltip" style={{ display: 'none' }}>Grid can't be changed once the game has started</div>
                </label>


  {showIncorrectGuessModal && (
  <IncorrectGuessModal
    onClose={() => setShowIncorrectGuessModal(false)}
  />
)}




    
  </div>

  );
};

export default RevealerGame;
