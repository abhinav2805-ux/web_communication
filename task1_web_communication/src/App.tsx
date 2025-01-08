import React, { useState, useRef } from 'react';
import Modal from './Model'; // Modal component
import { useROS } from './useROS'; // Custom hook to manage ROS connection

const App = () => {
  const [buttons, setButtons] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newButtonName, setNewButtonName] = useState('');
  const [sourceButton, setSourceButton] = useState('');
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const { sendROSCommand } = useROS(); // Use the custom hook here

  const handleAddButton = () => {
    if (newButtonName.trim() !== '') {
      const updatedButtons = [...buttons, `${sourceButton}_${newButtonName}`];
      setButtons(updatedButtons);
      setShowModal(false);
      setNewButtonName('');
      setTimeout(() => {
        if (buttonContainerRef.current) {
          buttonContainerRef.current.scrollTop = buttonContainerRef.current.scrollHeight;
        }
      }, 100);
    }
    sendROSCommand(`sp_${newButtonName}`);
  };

  const openModal = (source: string) => {
    setSourceButton(source);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  const disableDeleteButtons = buttons.length === 0;

  const handleButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`);
    // Send the corresponding ROS command when a button is clicked
    if (buttonName === 'Execute_Last_Path') {
      sendROSCommand("elp"); // elp
    } else if (buttonName === 'Execute_Whole_Path') {
      sendROSCommand("ewp"); // ewp
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
      <div className="w-1/4 p-8 space-y-6 border-r border-gray-700 bg-gray-950 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Robot Controls</h1>
        <button
          onClick={() => openModal('Save_Point')}
          className="w-full py-4 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition ease-in-out duration-300 shadow-xl transform hover:scale-105 uppercase tracking-wider"
        >
          Save Point
        </button>
        <button
          onClick={() => handleButtonClick('Execute_Last_Path')}
          className="w-full py-4 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition ease-in-out duration-300 shadow-xl transform hover:scale-105 uppercase tracking-wider"
        >
          Execute Last Path
        </button>
        <button
          onClick={() => handleButtonClick('Execute_Whole_Path')}
          className="w-full py-4 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition ease-in-out duration-300 shadow-xl transform hover:scale-105 uppercase tracking-wider"
        >
          Execute Whole Path
        </button>
      </div>

      <div className="flex-1 h-[750px] p-8 flex flex-col relative">
        <div
          ref={buttonContainerRef}
          className={`flex-1 overflow-y-auto p-6 border-2 border-gray-700 rounded-lg backdrop-blur-lg bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg ${
            buttons.length === 0 ? 'bg-opacity-70' : 'bg-opacity-90'
          }`}
        >
          <div className="space-y-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(button)}
                className="w-full py-4 rounded-lg bg-gray-700 hover:bg-gray-800 transition ease-in-out duration-300 text-xl shadow-md transform hover:scale-105 tracking-wide uppercase text-center"
              >
                {button}
              </button>
            ))}
          </div>
        </div>

        <div className="fixed bottom-10 left-[950px] transform -translate-x-1/2 flex space-x-6 z-10">
          <button
            disabled={disableDeleteButtons}
            onClick={() => setButtons(buttons.slice(0, -1))}
            className={`px-6 py-4 rounded-lg text-lg font-semibold ${
              disableDeleteButtons ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
          >
            Delete Last
          </button>
          <button
            disabled={disableDeleteButtons}
            onClick={() => setButtons([])}
            className={`px-6 py-4 rounded-lg text-lg font-semibold ${
              disableDeleteButtons ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
          >
            Delete All
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          newButtonName={newButtonName}
          setNewButtonName={setNewButtonName}
          handleAddButton={handleAddButton}
          closeModal={closeModal}
          sourceButton={sourceButton}
        />
      )}
    </div>
  );
};

export default App;
