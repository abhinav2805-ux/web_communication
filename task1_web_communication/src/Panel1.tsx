import React, { useState, useRef, useEffect } from 'react';
import Modal from './Model'; // Modal component
import Edit from './Edit';
import { useROS } from './useROS'; // Custom hook to manage ROS connection
import GripperAdd from './GripperAdd';

const Panel1 = () => {

  interface Button {
    name: string;
    speed?: number;
    acceleration?: number;
    wait: number;
    id: string;
    state?: number;
    number?: number;
    type?: string;
  }

  const [buttons, setButtons] = useState<Button[]>([]);
  const [gripper, setgripper] = useState<Button[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showgripper, setShowgripper] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editbtn, seteditbtn] = useState<Button>();
  const [gripbtn, setgripeditbtn] = useState<Button>();
  const [newButtonName, setNewButtonName] = useState('');
  const [sourceButton, setSourceButton] = useState('');
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const [gripperData, setGripperData] = useState<Button | undefined>(undefined);
  const { sendROSCommand } = useROS(); // Use the custom hook here

  const resetGripperData = () => {
    setgripeditbtn(undefined); // Reset gripperData
  };

  const fetchButtons = async () => {
    try {
      const response = await fetch('http://localhost:5000/btn/getAllButtons');
      if (!response.ok) throw new Error(`Failed to fetch buttons: ${response.statusText}`);
      const data = await response.json();
      const buttonValues = data.currObject.buttons.map((button: { name: string, id: string, speed: number, acceleration: number, wait: number, type: string, state: number, number: number }) => ({
        name: button.name,
        id: button.id,
        acceleration: button.acceleration,
        speed: button.speed,
        wait: button.wait, // Include the button ID
        type: button.type,
        state: button.state,
        number: button.number,
      }));
      setButtons(buttonValues);
    } catch (error) {
      console.error('Error fetching buttons:', error);
    }
  };

  useEffect(() => {
    fetchButtons();
  }, [buttons]);

  const removeButton = async () => {
    try {
      const response = await fetch('http://localhost:5000/btn/removeButton', { method: 'GET' });
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
      const response = await fetch('http://localhost:5000/btn/removeAllButtons', { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to remove all buttons: ${response.statusText}`);
      const { message } = await response.json();
      console.log(message);
      setButtons([]);
    } catch (error) {
      console.error('Error removing all buttons:', error);
    }
  };

  const addButton = async (newButton: { name: string; acceleration: number, speed: number, wait: number }) => {
    try {
      const response = await fetch('http://localhost:5000/btn/addButton', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newButton),
      });
      if (!response.ok) throw new Error(`Failed to add button: ${response.statusText}`);
      const { data } = await response.json();
      console.log('Added button:', data);
      setButtons((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error adding button:', error);
    }
  };

  const handleAddButton = ({ name, speed, acceleration, wait }: Button) => {
    const trimmedName = name.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    if (trimmedName) {
      // Construct the new button object
      const newButton = {
        name: `${trimmedName}`,
        speed: speed,
        acceleration: acceleration,
        wait: wait,
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

  const openModal = (source: string) => {
    setSourceButton(source);
    setShowModal(true);
  };

  const openGripper = (source: string) => {
    setShowgripper(true);
  };

  const openEdit = (source: Button) => {
    console.log(source);
    seteditbtn(source);
    setShowEdit(true);
  };

  const handleButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`);
    if (buttonName === 'Save Path') sendROSCommand('SP');
    if (buttonName === 'Execute_Last_Path') sendROSCommand('elp');
    if (buttonName === 'Execute_Whole_Path') sendROSCommand('ewp');
  };

  return (
    <div className="flex flex-col md:flex-row max-h-screen border-gray-700 bg-gray-950 text-white font-sans w-full">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 p-4 md:p-8 space-y-6 border-r border-gray-700 bg-gray-950 shadow-xl">
        <button
          onClick={() => openModal('Save_Point')}
          className="w-full py-4 md:py-5 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition ease-in-out duration-300 shadow-xl transform hover:scale-105 uppercase tracking-wider"
        >
          Save Point
        </button>

        <button
          onClick={() => openGripper('')}
          className="w-full py-4 md:py-5 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition ease-in-out duration-300 shadow-xl transform hover:scale-105 uppercase tracking-wider "
        >
          Gripper Action
        </button>

        <button
          onClick={() => handleButtonClick('Save Path')}
          className="w-full py-4 md:py-5 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition ease-in-out duration-300 shadow-xl transform hover:scale-105 uppercase tracking-wider"
        >
          Save Path
        </button>

        <button
          onClick={() => handleButtonClick('Execute_Last_Path')}
          className="w-full py-4 md:py-5 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition ease-in-out duration-300 shadow-xl transform hover:scale-105 uppercase tracking-wider "
        >
          Execute Last Path
        </button>

        <button
          onClick={() => handleButtonClick('Execute_Whole_Path')}
          className="w-full py-4 md:py-5 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition ease-in-out duration-300 shadow-xl transform hover:scale-105 uppercase tracking-wider"
        >
          Execute Whole Path
        </button>
      
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen flex flex-col relative">
        <div
          ref={buttonContainerRef}
          className={`flex-1 overflow-x-hidden p-2 md:p-6 border-2 border-gray-700 h-full rounded-lg backdrop-blur-lg bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg ${
            buttons.length ? 'bg-opacity-90' : 'bg-opacity-70'
          }`}
        >
          <div className="space-y-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  if (button.type !== "Gripper") openEdit(button);
                  else {
                    setgripeditbtn(button);
                    setShowgripper(true);
                  }
                }}
                className="w-full py-5 px-4 rounded-lg bg-gray-700 hover:bg-gray-800 transition ease-in-out duration-300 text-lg shadow-md transform hover:scale-105 tracking-wide uppercase text-center break-all"
              >
                {`Save_Point@${button.name}`}
              </button>
            ))}
          </div>
        </div>

        {/* Remove Buttons */}
            <div className='flex p-6 justify-around space-x-6'>
            <button
            disabled={!buttons.length}
            onClick={removeButton}
            className={` w-full px-6 py-4 rounded-lg text-lg font-semibold break-all ${
              buttons.length ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
            } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
          >
            Remove Last
          </button>
          <button
            disabled={!buttons.length}
            onClick={removeAllButtons}
            className={`w-full px-6 py-4 rounded-lg text-lg font-semibold break-all ${
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
        />
      )}

      {/* Edit */}
      {showEdit && editbtn.type === "button" && (
        <Edit
          newButtonName={newButtonName}
          setNewButtonName={setNewButtonName}
          handleAddButton={handleAddButton}
          closeModal={() => setShowEdit(false)}
          data={editbtn}
        />
      )}

      {/* Gripper */}
      {showgripper && (
        <GripperAdd
          closeGripper={() => setShowgripper(false)}
          gripperData={gripbtn}
          resetGripperData={resetGripperData} // Close the modal
        />
      )}
    </div>
  );
};

export default Panel1;
