import React, { useState } from 'react';
import Sketch from './components/sketch';
import Modal from './components/modal';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [boidColors, setBoidColors] = useState({ redCount: 0, greenCount: 0, blueCount: 0 });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleModalChange = (colors) => {
    setBoidColors(colors);
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
      <Sketch boidColors={boidColors} />
      <Modal isOpen={menuOpen} onClose={toggleMenu} onChange={handleModalChange} />
    </div>
  );
};

export default App;
