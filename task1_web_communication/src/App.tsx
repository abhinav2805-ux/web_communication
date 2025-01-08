import React, { useState, useRef, useEffect } from 'react';
import Modal from './Model'; // Modal component
import { useROS } from './useROS'; // Custom hook to manage ROS connection

const App = () => {
  const [buttons, setButtons] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newButtonName, setNewButtonName] = useState('');
  const [sourceButton, setSourceButton] = useState('');
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  type Button = {
    buttonType: string;
    value: string;
  };

const getAllButtons=async ()=>{
  const url='http://localhost:5000/getAllButtons';
  try {
    const response=await fetch(url);
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`)
    }
    const res=await response.json()
    console.log(res.currObject.buttons);
    
    const buttonValues = res.currObject.buttons.map((button:Button) => button.value);
    console.log(buttonValues);
    
    setButtons(buttonValues)
    // console.log(updatedButtons);
    
    //setButtons(updatedButtons);
    
  } catch (error) {
    console.log("error",error);
  }
}
 useEffect(()=>{
  getAllButtons()
 })
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
    sendROSCommand("new button added");
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
    if (buttonName === 'Save_Point') {
      console.log("Save button clicked from");
      sendROSCommand("sp"); // sp
    } else if (buttonName === 'Execute_Last_Path') {
      sendROSCommand("elp"); // elp
    } else if (buttonName === 'Execute_Whole_Path') {
      sendROSCommand("ewp"); // ewp
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-800 to-purple-800 text-white font-sans">
      <div className="w-1/4 p-8 space-y-6">
        <button
          onClick={() => openModal('Save_Point')}
          className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition ease-in-out duration-300 shadow-lg transform hover:scale-105"
        >
          Save Point
        </button>
        <button
          onClick={() => openModal('Execute_Last_Path')}
          className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition ease-in-out duration-300 shadow-lg transform hover:scale-105"
        >
          Execute Last Path
        </button>
        <button
          onClick={() => openModal('Execute_Whole_Path')}
          className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition ease-in-out duration-300 shadow-lg transform hover:scale-105"
        >
          Execute Whole Path
        </button>
      </div>

      <div className="flex-1 p-8 flex flex-col relative">
        <div
          ref={buttonContainerRef}
          className={`flex-1 overflow-y-auto p-6 border-2 border-gray-600 rounded-lg ${
            buttons.length === 0 ? 'bg-gray-800' : 'bg-gray-900'
          }`}
        >
          <div className="space-y-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(button)}
                className="w-full max-w-full py-4 rounded-lg bg-gray-700 hover:bg-gray-800 transition ease-in-out duration-300 text-xl shadow-md transform hover:scale-105"
              >
                {button}
              </button>
            ))}
          </div>
        </div>

        <div className="fixed bottom-10 left-1/2 transform -translate-x-[-50px] flex space-x-6 z-10">
          <button
            disabled={disableDeleteButtons}
            onClick={() => setButtons(buttons.slice(0, -1))}
            className={`px-6 py-4 rounded-lg ${
              disableDeleteButtons ? 'bg-gray-600' : 'bg-red-600'
            } hover:bg-red-700 transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
          >
            Delete Last
          </button>
          <button
            disabled={disableDeleteButtons}
            onClick={() => setButtons([])}
            className={`px-6 py-4 rounded-lg ${
              disableDeleteButtons ? 'bg-gray-600' : 'bg-red-600'
            } hover:bg-red-700 transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
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
