import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onChange }) => {
  const [redCount, setRedCount] = useState(0);
  const [greenCount, setGreenCount] = useState(0);
  const [blueCount, setBlueCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'red') {
      setRedCount(value);
    } else if (name === 'green') {
      setGreenCount(value);
    } else if (name === 'blue') {
      setBlueCount(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange({ redCount, greenCount, blueCount });
    onClose();
  };

  return (
    <div className={`${isOpen ? 'absolute inset-0 z-10 flex justify-center items-center' : 'hidden'}`}>
      <div className="modal-container bg-white rounded-lg p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Adjust Boid Colors</h2>
          <button className="close-button text-red-500" onClick={onClose}>X</button>
        </div>
        <div className="mt-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="red" className="block text-sm font-medium text-gray-700">Number of Reds:</label>
              <input
                type="number"
                name="red"
                value={redCount}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none "
              />
            </div>
            <div className="mb-4">
              <label htmlFor="green" className="block text-sm font-medium text-gray-700">Number of Greens:</label>
              <input
                type="number"
                name="green"
                value={greenCount}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none "
              />
            </div>
            <div className="mb-4">
              <label htmlFor="blue" className="block text-sm font-medium text-gray-700">Number of Blues:</label>
              <input
                type="number"
                name="blue"
                value={blueCount}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none "
              />
            </div>
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Apply</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
