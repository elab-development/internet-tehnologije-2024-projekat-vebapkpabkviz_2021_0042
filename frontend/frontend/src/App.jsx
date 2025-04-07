import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Scoreboard from './components/Scoreboard';

function App() {
  return (
    <div className="App">
     <p className='bg-red-800'>Caocao</p>
    
     <Scoreboard></Scoreboard>
    </div>
  );
}

export default App
