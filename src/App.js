import React from 'react';
import './App.css';
import RevealerGame from './components/RevealerGame';
import './styles/RevealerGame.css';
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <RevealerGame imageSrc={'image/image.jpg'}/>

      </header>
    </div>
  );
}

export default App;
