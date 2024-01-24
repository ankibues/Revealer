import React, { useState, useEffect } from 'react';
import Modal from './Modal'; 
import '../styles/RevealerGame.css';

const RevealerGame = ({ imageSrc, gridSize , answer, onGameStart}) => {
  // Create a grid state representing the revealed cells
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [showModal, setShowModal] = useState(false);

  const imageSize = 100 / (gridSize - 1);

  useEffect(() => {

    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
    setGrid(newGrid);
    
  },[gridSize]);
  
  const handleCellClick = (rowIndex, colIndex) => {
    onGameStart();
    if (finalScore !== null) return; // If the game is over, do nothing

    setGrid(currentGrid => {
      // Only update the score if the cell was not previously revealed
      if (!currentGrid[rowIndex][colIndex]) {
        setScore(score + 1);
        return currentGrid.map((row, rIdx) => (
          rIdx === rowIndex ? row.map((cell, cIdx) => cIdx === colIndex ? true : cell) : row
        ));
      }
      return currentGrid; // Return the grid as is if the cell was already revealed
    });
  };

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
      alert('Wrong guess! Keep trying.'); // Inform the user that the guess is incorrect
    }
  };


  // Render the grid
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="gridRow">
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
                backgroundPosition: `${positionX} ${positionY}`,
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
      <h5> Guess the picture as quickly as possible! </h5>
      </div>
      
      <div className="score">Score: {score}</div>
      <div className={`gridContainer ${finalScore !== null ? 'gameOver' : ''}`}>
        {renderGrid()}
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
        <button type="submit">Submit Guess</button>

        </div>

        
  
      </form>
    ) : (
      <Modal show={showModal} score={finalScore} onRestart={() => alert("See you tomorrow!")} />
    )}
    {/* Feedback for incorrect guesses */}
    <div id="feedback" className="feedback"></div>
    
  </div>

  );
};

export default RevealerGame;
