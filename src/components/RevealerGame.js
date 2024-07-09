import React, { useState, useEffect, useCallback, useRef } from 'react';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import IncorrectGuessModal from './IncorrectGuessModal';
import '../styles/RevealerGame.css';
import PhotoWithCredit from './PhotoWithCredit';
import axios from 'axios';
import logo from '../logo.svg';
import HowToPlayModal from './HowToPlayModal';

const RevealerGame = ({ imageSrc, answer, credit, crediturl, theme }) => {
  const [showHowToModal, setShowHowToModal] = useState(false);
  const defaultGridSize = 6;
  const [gridSize, setGridSize] = useState(defaultGridSize);
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gameHasEnded, setgameHasEnded] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showIncorrectGuessModal, setShowIncorrectGuessModal] = useState(false);
  const [showPhotoCredit, setShowPhotoCredit] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [modalString, setModalString] = useState('');
  const wrapperRef = useRef(null);
  const [showShareScoreModal, setShowShareScoreModal] = useState(false);

  const isInitialized = useRef(false);  // To check if the state has been initialized from localStorage

  const initializeGrid = (size) => {
    return Array(size).fill().map(() => Array(size).fill(false));
  };

  useEffect(() => {
    if (!isInitialized.current) {
      const savedState = localStorage.getItem('revealerGameState');
      if (savedState) {
        const {
          savedGrid,
          savedScore,
          savedFinalScore,
          savedUserGuess,
          savedGameHasStarted,
          savedGameHasEnded,
          savedGridSize
        } = JSON.parse(savedState);
        console.log('Loaded state from localStorage:', savedState);
        setGrid(savedGrid);
        setScore(savedScore);
        setFinalScore(savedFinalScore);
        setUserGuess(savedUserGuess);
        setGameHasStarted(savedGameHasStarted);
        setgameHasEnded(savedGameHasEnded);
        setGridSize(savedGridSize);
        if (savedGameHasStarted) {
          setShowHint(false);
        }

      } else {
        console.log('No saved state found, initializing new grid.');
        setGrid(initializeGrid(gridSize));
      }
      document.documentElement.style.setProperty('--grid-size', gridSize.toString());
      isInitialized.current = true;  // Mark as initialized
    }

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false); // Hide dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [gridSize, wrapperRef]);

  useEffect(() => {
    if (isInitialized.current) {
      const saveGameState = () => {
        const gameState = {
          savedGrid: grid,
          savedScore: score,
          savedFinalScore: finalScore,
          savedUserGuess: userGuess,
          savedGameHasStarted: gameHasStarted,
          savedGameHasEnded: gameHasEnded,
          savedGridSize: gridSize
        };
        console.log('Saving state to localStorage:', gameState);
        localStorage.setItem('revealerGameState', JSON.stringify(gameState));
      };
      saveGameState();
    }
  }, [grid, score, finalScore, userGuess, gameHasStarted, gameHasEnded, gridSize]);

  const handleGameStart = useCallback(() => {
    setGameHasStarted(true);
  }, []);

  const handleGridSizeChange = (event) => {
    const newSize = Number(event.target.value);
    setGridSize(newSize);
    setGrid(initializeGrid(newSize));
  };

  const handleCellClick = (rowIndex, colIndex) => {
    handleGameStart();
    if (finalScore !== null) return; // If the game is over, do nothing

    setGrid(currentGrid => {
      if (!currentGrid[rowIndex][colIndex]) {
        const newScore = score + 1;
        setScore(newScore);

        const revealedTiles = currentGrid.flat().filter(revealed => revealed).length;
        if (revealedTiles === gridSize * gridSize) {
          setFinalScore(newScore); // This captures the final score
        }
        return currentGrid.map((row, rIdx) => (
          rIdx === rowIndex ? row.map((cell, cIdx) => cIdx === colIndex ? true : cell) : row
        ));
      }
      return currentGrid; // Return the grid as is if the cell was already revealed
    });
  };

  const handleSubmitGuess = (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    if (userGuess.toLowerCase() === answer.toLowerCase()) {
      setFinalScore(score); // Finalize the score if the guess is correct
      const resultString = generateTextRepresentation(grid);
      setShowModal(true); 
      revealAllCells(); 
      setModalString(resultString);
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
    setShowConfirmationModal(false); // Close the confirmation modal
    handleQuit(); 
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false); // Close the confirmation modal
  };

  const revealAllCells = () => {
    const newGrid = grid.map(row => row.map(() => true));
    setGrid(newGrid);
    setShowPhotoCredit(true);
    setgameHasEnded(true);
  };

  const renderGrid = useCallback(() => {
    const imageSize = 100 / (gridSize - 1);
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="gridRow" style={{ gridTemplateRows: `repeat(${gridSize}, 1fr)`}} >
        {row.map((revealed, colIndex) => {
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
  }, [grid, gridSize, imageSrc, handleCellClick]);

  const generateTextRepresentation = (grid) => {
    const revealedCell = '🟩';
    const unrevealedCell = '⬛'; 
    
    let resultString = '';
    if (grid.length === 0) return resultString;

    const numColumns = grid[0].length;
    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
      grid.forEach((row) => {
        const cell = row[colIndex];
        resultString += cell ? revealedCell : unrevealedCell;
      });
      resultString += '\n';
    }
  
    return resultString.trim();
  };

  const handleHowToPlayOpen = () => {
    setShowHowToModal(true);
  };

  const handleHowToPlayClose = () => {
    setShowHowToModal(false);
  };

  const handleHintClick = () => {
    setShowHint(false);
  };

  const loadSuggestions = async () => {
    if (userGuess.length > 0) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/images/autocomplete?searchTerm=${userGuess}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadSuggestions();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [userGuess]);

  useEffect(() => {
    const revealedTiles = grid.flat().filter(revealed => revealed).length;
    setScore(`${revealedTiles}/${gridSize * gridSize}`);
  }, [grid, gridSize]);

  return (
    <div className="gameContainer">
      <div className="gameInfo">
        <div className="logoAndTitle">
          <img src={logo} alt="Game Logo" style={{ marginRight: '20px' }} />
          <h2>Revealer</h2>
        </div>
        <h5>Guess the hidden picture!</h5>
      </div>

      <div className="scoreAndHelpAndGridSizeLabel">
        <div className="score">Score: {finalScore !== null ? `${finalScore}` : `${score}`}</div>
        <label className={`grid-size-label ${gameHasStarted ? "game-started" : ""}`}>
          <select value={gridSize} onChange={handleGridSizeChange} disabled={gameHasStarted}>
            <option value="5">5x5</option>
            <option value="6">6x6</option>
            <option value="7">7x7</option>
          </select>
          <div id="custom-tooltip">Grid can't be changed once the game has started</div>
        </label>
        <button className="howToPlayButton" onClick={handleHowToPlayOpen}>
          <img src='image/Question1.png' alt="How to Play?" />
        </button>
      </div>

      <div className="weeklytheme">Weekly theme: <b>{theme}</b> </div>

      <div className={`gridContainer ${finalScore !== null ? 'gameOver' : ''}`}>
        {renderGrid()}
        {showHint && (
          <div className="hintOverlay" onClick={handleHintClick}>
            <span>Click these tiles to reveal the picture!</span>
          </div>
        )}
      </div>

      {showPhotoCredit && <PhotoWithCredit credit={credit} crediturl={crediturl} />}
      {finalScore === null ? (
        <form onSubmit={handleSubmitGuess} className="guessForm">
          <div ref={wrapperRef} className="controls-container">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="Enter your guess"
            />
            {showDropdown && suggestions.length > 0 && (
              <ul className="dropdown">
                {suggestions.map((suggestion, index) => (
                  <li
                    style={{ padding: '5px 10px', cursor: 'pointer' }}
                    key={index}
                    onClick={() => { setUserGuess(suggestion); setShowDropdown(false); }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <button type="submit" className="submit-button">Submit Guess</button>
            <button type="button" onClick={handleQuitClick} className="quit-button">I Quit</button>
          </div>
        </form>
      ) : (
        <Modal onClose={() => setShowModal(false)} show={showModal} score={finalScore} answer={answer} message="Awesome! You are right!" resultString={modalString} />
      )}

      {showHowToModal && (<HowToPlayModal isOpen={showHowToModal} onClose={handleHowToPlayClose} theme={theme} />)}

      {showQuitModal && (
        <Modal 
          onClose={() => setShowQuitModal(false)}
          show={showQuitModal}
          score={finalScore}
          answer={answer}
          message="That's ok! You will get it next time!"
        />
      )}


      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={handleConfirmQuit}
          onClose={handleCloseConfirmationModal}
        />
      )}

      {showIncorrectGuessModal && (
        <IncorrectGuessModal
          onClose={() => setShowIncorrectGuessModal(false)}
        />
      )}

     {gameHasEnded && (
       <button onClick={() => setShowShareScoreModal(true)}>Share Your Score!</button>
      )}

{showShareScoreModal && (
  <Modal 
    onClose={() => setShowShareScoreModal(false)} 
    show={showShareScoreModal} 
    score={finalScore} 
    answer={answer} 
    message="Share your score!" 
    resultString={modalString} 
  />
)}



      <div style={{ textAlign: 'center', fontSize: '15px', padding: '10px 0', background: '#fff', color: '#000' }}>
        <p>
          Made with ❤️ by <a href="https://medium.com/bhandlab" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold' }}>BhandLab</a>
        </p>
      </div>
    </div>
  );
};

export default RevealerGame;
