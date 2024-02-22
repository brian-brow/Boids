import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onChange }) => {
  const [redCount, setRedCount] = useState(100);
  const [greenCount, setGreenCount] = useState(100);
  const [blueCount, setBlueCount] = useState(100);
  const [sharkEnabled, setSharkEnabled] = useState(false);

  const handleSliderChange = (color, value) => {
    if (color === 'red') {
      setRedCount(value);
    } else if (color === 'green') {
      setGreenCount(value);
    } else if (color === 'blue') {
      setBlueCount(value);
    }
  };

  const handleSharkCheckboxChange = () => {
    setSharkEnabled(!sharkEnabled);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange({ redCount, greenCount, blueCount, sharkEnabled });
    onClose();
  };

  return (
    <div className={`${isOpen ? 'fixed inset-0 z-20 flex flex-col justify-center items-center bg-gray-800 bg-opacity-50' : 'hidden'}`}>
      <div className="modal-container bg-white rounded-lg p-8 w-96 flex relative">
        <div className="w-1/2 pr-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="red" className="block text-sm font-medium text-gray-700">Red: {redCount}</label>
              <input
                type="range"
                min="1"
                max="255"
                name="red"
                value={redCount}
                onChange={(e) => handleSliderChange('red', e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="green" className="block text-sm font-medium text-gray-700">Green: {greenCount}</label>
              <input
                type="range"
                min="1"
                max="255"
                name="green"
                value={greenCount}
                onChange={(e) => handleSliderChange('green', e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="blue" className="block text-sm font-medium text-gray-700">Blue: {blueCount}</label>
              <input
                type="range"
                min="1"
                max="255"
                name="blue"
                value={blueCount}
                onChange={(e) => handleSliderChange('blue', e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Apply</button>
          </form>
        </div>
        <div className="w-1/2 pl-4">
          <div className="mb-4">
            <label htmlFor="shark" className="inline-flex items-center">
              <input
                type="checkbox"
                id="shark"
                checked={sharkEnabled}
                onChange={handleSharkCheckboxChange}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Enable Shark</span>
            </label>
          </div>
        </div>
        <button className="absolute top-4 right-4 text-red-500" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Modal;
