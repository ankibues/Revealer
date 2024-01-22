import React from 'react';
import './App.css';
import RevealerGame from './components/RevealerGame';
import './styles/RevealerGame.css';
function App() {
  const correctAnswer = "taj mahal"; 
  return (
    <div className="App">
      <header className="App-header">
      <RevealerGame imageSrc={'image/image.jpg'} answer={correctAnswer}/>

      </header>
    </div>
  );
}

export default App;
