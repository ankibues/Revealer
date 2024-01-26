import React from 'react'; // Import useState here
import './App.css';
import RevealerGame from './components/RevealerGame';
import './styles/RevealerGame.css';
import './styles/Modal.css';

function App() {
  
  const correctAnswer = "taj mahal"; // The correct answer for guessing(this is going to be changed ltr)

  return (
    <div className="App">
      <header className="App-header">

                <RevealerGame
            imageSrc={'image/image.jpg'}
            answer={correctAnswer}
          />
        
      </header>
    </div>
  );
}

export default App;
