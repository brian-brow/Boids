import React, { useState } from 'react';
import Sketch from './components/sketch';
import Modal from './components/modal';
import About from './components/about';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [boidColors, setBoidColors] = useState({ redCount: 100, greenCount: 100, blueCount: 100 });
  const [sharkEnabled, setSharkEnabled] = useState(false);
  const [speed, setSpeed] = useState({ maxSpeed: 6, minSpeed: 3 });
  const [linesEnabled, setLinesEnabled] = useState(false);
  const [shockWaveRad, setShockWaveRad] = useState(150);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleModalChange = (colors) => {
    const redCount = parseInt(colors.redCount);
    const greenCount = parseInt(colors.greenCount);
    const blueCount = parseInt(colors.blueCount);
    setBoidColors({ redCount, greenCount, blueCount });
    setSharkEnabled(colors.sharkEnabled);
    const maxSpeed = parseInt(colors.maxSpeed);
    const minSpeed = parseInt(colors.minSpeed);
    setSpeed({ maxSpeed, minSpeed });
    setLinesEnabled(colors.linesEnabled);
    setShockWaveRad(colors.shockWaveRad);
  };

  return (
    <div>
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Boids Sim</h1>
        <a
          className="text-right cursor-pointer hover:font-bold"
          onClick={toggleMenu}
        >
          <h1>Menu</h1>
        </a>
      </header>
      <Modal isOpen={menuOpen} onClose={toggleMenu} onChange={handleModalChange} />
      <Sketch boidColors={boidColors} sharkEnabled={sharkEnabled} speed={speed} linesEnabled={linesEnabled} shockWaveRad={shockWaveRad}/>
      <About />
    </div>
  );
};

export default App;
