import React, { useState } from 'react';

const Panel2: React.FC = () => {
  // State to handle toggle button states
  const [toggleStates, setToggleStates] = useState([false, false, false]);

  const handleToggle = (index: number) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
  };

  return (
    <div className="w-full p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white rounded-lg shadow-lg border border-gray-700  h-full">
      <h1 className="text-center text-cyan-400 text-2xl font-bold mb-6">
        Servo Node Controller
      </h1>

      {/* Two-column layout with a separator */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6">
        {/* Column 1: J buttons */}
        <div className="space-y-6">
          {['J1', 'J2', 'J3', 'J4', 'J5', 'J6'].map((joint) => (
            <div
              key={joint}
              className="flex items-center p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-md hover:shadow-xl transition ease-in-out duration-300"
            >
              <span className="text-lg sm:text-xl font-semibold text-cyan-400 w-1/4">{joint}:</span>
              <div className="flex w-[60%] space-x-3 justify-center">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm transition-transform transform hover:scale-105">
                  +
                </button>
                <span className="text-lg sm:text-xl font-semibold text-gray-300 w-1/4 text-center pt-1">0.0</span>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-sm transition-transform transform hover:scale-105">
                  -
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-l border-gray-700 hidden md:block"></div>

        {/* Column 2: Axis buttons */}
        <div className="space-y-6">
          {['X', 'Y', 'Z', 'R', 'P', 'W'].map((axis) => (
            <div
              key={axis}
              className="flex items-center p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-md hover:shadow-xl transition ease-in-out duration-300"
            >
              <span className="text-lg sm:text-xl font-semibold text-cyan-400 w-1/4">{axis}:</span>
              <div className="flex w-[60%] space-x-3 justify-center">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm transition-transform transform hover:scale-105">
                  +
                </button>
                <span className="text-lg sm:text-xl font-semibold text-gray-300 w-1/4 text-center pt-1">0.0</span>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-sm transition-transform transform hover:scale-105">
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="mt-6 flex justify-center space-x-6">
        {['Gripper', 'Mode', 'Cobot'].map((label, index) => (
          <div key={label} className="flex items-center space-x-2">
            <span className="text-cyan-400 text-lg sm:text-2xl font-semibold">{label}</span>
            <button
              className={`w-16 sm:w-20 h-10 sm:h-12 bg-gradient-to-r ${toggleStates[index] ? 'from-green-600 to-green-700' : 'from-red-600 to-red-700'} rounded-full transition-all duration-300`}
              onClick={() => handleToggle(index)}
            >
              <span
                className={`block w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full transition-all duration-300 transform ${toggleStates[index] ? 'translate-x-[30px] sm:translate-x-[38px]' : 'translate-x-[2px]'}`}
              ></span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Panel2;
