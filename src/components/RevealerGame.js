import React, { useState, useEffect,  useCallback, useRef } from 'react';
import Modal from './Modal'; 
import ConfirmationModal from './ConfirmationModal';
import IncorrectGuessModal from './IncorrectGuessModal'; 
import '../styles/RevealerGame.css';
import PhotoWithCredit from './PhotoWithCredit';
import axios from 'axios';
import logo from '../logo.svg';
import HowToPlayModal from './HowToPlayModal';

const RevealerGame = ({ imageSrc, answer, credit, crediturl,theme}) => {
  // Create a grid state representing the revealed cells

  const [showHowToModal, setShowHowToModal] = useState(false);
  const defaultGridSize=6;
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
  const [showPhotoCredit, setShowPhotoCredit] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [modalString,setmodalString]= useState('');
  const wrapperRef = useRef(null);
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false); // Hide dropdown when clicking outside
      }
    }
  
    // Add when the component is mounted
    document.addEventListener("mousedown", handleClickOutside);
  
    // Remove when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);



  const imageSize = 100 / (gridSize - 1);

  const handleGameStart = useCallback(() => {
    setGameHasStarted(true);
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (userGuess.length > 0) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/images/autocomplete?searchTerm=${userGuess}`);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching autocomplete suggestions:', error);
        }
      } else {
        setSuggestions([]); // Clear suggestions if input is empty
      }
    };
  
    // Implementing a basic debounce
    const timeoutId = setTimeout(() => {
      loadSuggestions();
    }, 300);
  
    return () => clearTimeout(timeoutId);
  }, [userGuess]);
  

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
    setShowPhotoCredit(true);
  };

  const handleSubmitGuess = (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    if (userGuess.toLowerCase() === answer.toLowerCase()) {
      setFinalScore(score); // Finalize the score if the guess is correct
      const resultString = generateTextRepresentation(grid);
      setShowModal(true); 
      revealAllCells(); 
      setmodalString(resultString);
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

  const generateTextRepresentation = (grid) => {
    const revealedCell = '🟩';//'▢'; //
    const unrevealedCell ='⬛';// '▣';//; 
    
    let resultString = '';
    if (grid.length === 0) return resultString; // Handle empty grid
  
    // Determine the number of columns based on the first row (assuming a uniform grid)
    const numColumns = grid[0].length;
  
    // Iterate over each column first
    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
      // Then iterate over each row for the current column
      grid.forEach((row) => {
        const cell = row[colIndex]; // Access the cell at the current column in the current row
        resultString += cell ? revealedCell : unrevealedCell;
      });
      resultString += '\n'; // Add a newline at the end of each "column" to start a new "row"
    }
  
    return resultString.trim(); // Trim the final string to remove any trailing whitespace
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



  return (
    <div className="gameContainer">
      <div className= "gameInfo">
      <div className="logoAndTitle">
      <img src={logo} alt="Game Logo" style={{ marginRight: '20px' }} />
      <h2>Revealer</h2>
      </div>
      <h5> Guess the hidden picture! </h5>
      </div>

      <div className="scoreAndHelpAndGridSizeLabel">
      <div className="score">Score: {finalScore !== null ? `${finalScore}` : `${score}`}</div>
     
      <label className={`grid-size-label ${gameHasStarted ? "game-started" : ""}`}>
      
              <select
                   value={gridSize}
                  onChange={handleGridSizeChange}
                  disabled={gameHasStarted}
                  //  onMouseOver={gameHasStarted ? showCustomTooltip : null}
                  //  onMouseOut={gameHasStarted ? hideCustomTooltip : null}
                  >

                    <option value="5">5x5</option>
                    <option value="6">6x6</option>
                    <option value="7">7x7</option>
            
                  </select>
                  <div id="custom-tooltip" >Grid can't be changed once the game has started</div>
                </label>

      
      <button className="howToPlayButton" onClick={handleHowToPlayOpen}> <img src='image/Question1.png' alt="How to Play?" /></button>
      
      
      
      </div>



      <div className={`gridContainer ${finalScore !== null ? 'gameOver' : ''}`}>
        {
        renderGrid()
        }
        {showHint && (
       <div className="hintOverlay" onClick={handleHintClick}>
         <span>Click these tiles to reveal the picture!</span>



        </div>

        
  )}

      </div>

      

      {showPhotoCredit && <PhotoWithCredit credit={credit} crediturl={crediturl} />}
    
     
      {finalScore === null ? (
      <form onSubmit={handleSubmitGuess} className="guessForm">
       <div ref={wrapperRef} className= "controls-container">
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
         //onFocus={() => userGuess && setSuggestions(prev => prev)} 
          onFocus={() => setShowDropdown(true)} 
          placeholder="Enter your guess"
        />
        {showDropdown && suggestions.length > 0 && (
                <ul className="dropdown">
           {suggestions.map((suggestion, index) => (
            <li style={{
               padding: '5px 10px',
                cursor: 'pointer'
              }} key={index} onClick={() => {setUserGuess(suggestion); setShowDropdown(false);}}>
               {suggestion}
              </li>
            ))}
            </ul>
        )}
        <button type="submit" className="submit-button" >Submit Guess</button>
        <button type="button" onClick={handleQuitClick} className="quit-button">I Quit</button>
        </div>
        </form>
    ) : (
      <Modal onClose={() => setShowModal(false)} show={showModal} score={finalScore} answer={answer} message="Awesome! You are right!" resultString= {modalString} />
    )}


  {showHowToModal && (<HowToPlayModal isOpen={showHowToModal} onClose={handleHowToPlayClose} theme={theme} />)}


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

  {showIncorrectGuessModal && (
  <IncorrectGuessModal
    onClose={() => setShowIncorrectGuessModal(false)}
  />
)}

<div style={{ textAlign: 'center', fontSize:'15px', padding: '10px 0', background: '#fff', color: '#000' }}>
      <p>
        Made with ❤️ by <a href="https://medium.com/bhandlab" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold'  }}>BhandLab</a>
      </p>
    </div>


    
  </div>

  );
};

export default RevealerGame;
