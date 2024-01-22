import React, { useState } from 'react';
import '../styles/RevealerGame.css';

const RevealerGame = ({ imageSrc, gridSize = 3 }) => {
  // Create a grid state representing the revealed cells
  const [grid, setGrid] = useState(Array(gridSize).fill(Array(gridSize).fill(false)));
  const [score, setScore] = useState(0);
  const imageSize = 100 / (gridSize - 1);
  
  // Handle cell click
  const handleCellClick = (rowIndex, colIndex) => {
    // Reveal the cell by updating the grid state
    const newGrid = grid.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        return row.map((cell, cIdx) => cIdx === colIndex ? true : cell);
      }
      return row;
    });

    setGrid(newGrid);
    setScore(score + 1); 
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
      <h2>Revealer</h2>
      <h5> Guess the picture as quickly as possible! </h5>
      <div className="score">Score: {score}</div>
      <div className="gridContainer">
        {renderGrid()}
      </div>
    </div>
  );
};

export default RevealerGame;
