import React, { useState } from 'react';
import Sketch from './components/sketch';
import Modal from './components/modal';
import About from './components/about';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [boidColors, setBoidColors] = useState({ redCount: 100, greenCount: 100, blueCount: 100 });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleModalChange = (colors) => {
    const redCount = parseInt(colors.redCount);
    const greenCount = parseInt(colors.greenCount);
    const blueCount = parseInt(colors.blueCount);
    console.log({ redCount, greenCount, blueCount });
    setBoidColors({ redCount, greenCount, blueCount });
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
      <Sketch boidColors={boidColors} />
      <About />
    </div>
  );
};

export default App;
