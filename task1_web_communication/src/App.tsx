import React, { useState, useRef, useEffect } from 'react';
import Modal from './Model'; // Modal component
import { useROS } from './useROS'; // Custom hook to manage ROS connection

const App = () => {
  const [buttons, setButtons] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newButtonName, setNewButtonName] = useState('');
  const [sourceButton, setSourceButton] = useState('');
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  interface Button {
    name: string;
    speed: number;
    acceleration: number;
    wait: number;
  }
  const { sendROSCommand } = useROS(); // Use the custom hook here

  const fetchButtons = async () => {
    try {
      const response = await fetch('http://localhost:5000/getAllButtons');
      if (!response.ok) throw new Error(`Failed to fetch buttons: ${response.statusText}`);
      const data = await response.json();
      const buttonValues = data.currObject.buttons.map((button: { name: string }) => button.name);
      setButtons(buttonValues);
    } catch (error) {
      console.error('Error fetching buttons:', error);
    }
  };

  useEffect(() => {
    fetchButtons();
  }, []);

  const removeButton = async () => {
    try {
      const response = await fetch('http://localhost:5000/removeButton', { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to remove button: ${response.statusText}`);
      const { removedButton } = await response.json();
      console.log('Removed button:', removedButton);
      setButtons((prev) => prev.slice(0, -1));
    } catch (error) {
      console.error('Error removing button:', error);
    }
  };

  const removeAllButtons = async () => {
    try {
      const response = await fetch('http://localhost:5000/removeAllButtons', { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to remove all buttons: ${response.statusText}`);
      const { message } = await response.json();
      console.log(message);
      setButtons([]);
    } catch (error) {
      console.error('Error removing all buttons:', error);
    }
  };

  const addButton = async (newButton: { name: string; acceleration: number, speed:number, wait:number }) => {
    try {
      const response = await fetch('http://localhost:5000/addButton', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newButton),
      });
      if (!response.ok) throw new Error(`Failed to add button: ${response.statusText}`);
      const { data } = await response.json();
      console.log('Added button:', data);
      setButtons((prev) => [...prev, data.name]);
    } catch (error) {
      console.error('Error adding button:', error);
    }
  };

  const handleAddButton = ({name, speed, acceleration, wait}:Button) => {
    const trimmedName = name.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    if (trimmedName) {
      // Construct the new button object
      const newButton = { 
        name: `${sourceButton}@${trimmedName}`, 
        speed: speed, 
        acceleration: acceleration, 
        wait: wait 
      };
      console.log(newButton);
      
      addButton(newButton);
      setShowModal(false);
      setNewButtonName('');
      setTimeout(() => buttonContainerRef.current?.scrollTo(0, buttonContainerRef.current.scrollHeight), 100);
      
      // Send ROS command using new button name
      sendROSCommand(`sp@${trimmedName}`);
    }
};
console.log("hlo");
    
  const openModal = (source: string) => {
    setSourceButton(source);
    setShowModal(true);
  };

  const handleButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`);
    if (buttonName === 'Execute_Last_Path') sendROSCommand('elp');
    if (buttonName === 'Execute_Whole_Path') sendROSCommand('ewp');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 h-[750px] p-8 flex flex-col relative">
        <div
          ref={buttonContainerRef}
          className={`flex-1 overflow-x-hidden p-6 border-2 border-gray-700 rounded-lg backdrop-blur-lg bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg ${
            buttons.length ? 'bg-opacity-90' : 'bg-opacity-70'
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

        {/* Remove Buttons */}
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-6 z-10">
          <button
            disabled={!buttons.length}
            onClick={removeButton}
            className={`px-6 py-4 rounded-lg text-lg font-semibold ${
              buttons.length ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
            } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
          >
            Remove Last
          </button>
          <button
            disabled={!buttons.length}
            onClick={removeAllButtons}
            className={`px-6 py-4 rounded-lg text-lg font-semibold ${
              buttons.length ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
            } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
          >
            Remove All
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          newButtonName={newButtonName}
          setNewButtonName={setNewButtonName}
          handleAddButton={handleAddButton}
          closeModal={() => setShowModal(false)}
          sourceButton={sourceButton}
        />
      )}
    </div>
  );
};

export default App;
