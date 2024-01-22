import React from 'react';
import '../styles/ImageGrid.css';

const ImageGrid = ({ gridSize, revealedCells, onCellClick,imageUrl }) => {
  const renderGrid = () => {
    let grid = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      grid.push(
        <div key={i} className={`grid-cell ${revealedCells.has(i) ? 'revealed' : ''}`} onClick={() => onCellClick(i)}
        style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: getBackgroundPosition(i, gridSize) }}
       />
      );
    }
    return grid;
  };
  const getBackgroundPosition = (index, size) => {
    const x = (index % size) * (100 / (size - 1));
    const y = Math.floor(index / size) * (100 / (size - 1));
    return `${-x}% ${-y}%`;
  };

  return <div className="image-grid">{renderGrid()}</div>;
};

export default ImageGrid;
