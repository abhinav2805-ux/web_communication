import React, { useState, useRef, useEffect } from 'react';
import Modal from './Model'; // Modal component
import Edit from './Edit';
import { useROS } from './useROS'; // Custom hook to manage ROS connection
import GripperAdd from './GripperAdd';
import SavePath from './SavePath';
import SEdit from './SEdit';


const Panel1 = () => {

  interface Button {
    name: string;
    speed?: number;
    plan_space?: string;
    acceleration?: number;
    wait?: number;
    id: string;
    state?: number;
    number?: number;
    type?: string;
  }

  const [buttons, setButtons] = useState<Button[]>([]);
  const [points, setPoints] = useState<Button[]>([]);

  const [gripper, setgripper] = useState<Button[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showgripper, setShowgripper] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSEdit, setShowSEdit] = useState(false);
  const [editbtn, seteditbtn] = useState<Button>();
  const [Seditbtn, setSeditbtn] = useState<Button>();
  const [gripbtn, setgripeditbtn] = useState<Button>();
  const [newButtonName, setNewButtonName] = useState('');
  const [sourceButton, setSourceButton] = useState('');
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const [gripperData, setGripperData] = useState<Button | undefined>(undefined);
  const { sendROSCommand } = useROS(); // Use the custom hook here

  const resetGripperData = () => {
    setgripeditbtn(undefined); // Reset gripperData
    fetchButtons()
  };

  const fetchButtons = async () => {
    try {
      const response = await fetch('http://localhost:5000/path/getAllPaths');
      if (!response.ok) throw new Error(`Failed to fetch buttons: ${response.statusText}`);
      const data = await response.json();
      console.log(data);
      if(data.points){
      const pointValues = data.points.map((button: { name: string, id: string }) => ({
        name: button.name,
        id: button.id,
      }));
      setPoints(pointValues);
    }
    if(data.paths){
      const buttonValues = data.paths.map((button: { name: string, id: string, speed: number, acceleration: number, wait: number, type: string, state: number, number: number }) => ({
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
    }
    } catch (error) {
      console.error('Error fetching buttons:', error);
    }
  };

  useEffect(() => {
    fetchButtons();
  }, []);

  const removeButton = async () => {
    try {
      const response = await fetch('http://localhost:5000/path/removePath', { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to remove button: ${response.statusText}`);
      const { removedButton } = await response.json();
      console.log('Removed path:', removedButton);
      setButtons((prev) => prev.slice(0, -1));
    } catch (error) {
      console.error('Error removing button:', error);
    }
  };

  const removeAllButtons = async () => {
    try {
      const response = await fetch('http://localhost:5000/path/removeAllPaths', { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to remove all path: ${response.statusText}`);
      const { message } = await response.json();
      console.log(message);
      setButtons([]);
    } catch (error) {
      console.error('Error removing all path:', error);
    }
  };


  const removePoint = async () => {
    try {
      const response = await fetch('http://localhost:5000/points/removePoint', { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to remove button: ${response.statusText}`);
      const { removedButton } = await response.json();
      console.log('Removed path:', removedButton);
      setPoints((prev) => prev.slice(0, -1));
    } catch (error) {
      console.error('Error removing button:', error);
    }
  };

  const removeAllPoint = async () => {
    try {
      const response = await fetch('http://localhost:5000/points/removeAllPoints', { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to remove all path: ${response.statusText}`);
      const { message } = await response.json();
      console.log(message);
      setPoints([]);
    } catch (error) {
      console.error('Error removing all path:', error);
    }
  };



  const addButton = async (newButton: { name: string; acceleration: number, speed: number, wait: number,plan_space:string }) => {
    try {
      console.log(newButton);
      
      const response = await fetch('http://localhost:5000/path/addPath', {
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
  const addPoint = async (newButton: { name: string }) => {
    try {
      console.log(newButton);
      
      const response = await fetch('http://localhost:5000/points/addPoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newButton),
      });
      if (!response.ok) throw new Error(`Failed to add point: ${response.statusText}`);
      const { data } = await response.json();
      console.log('Added point:', data);
      setPoints((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error adding point:', error);
    }
  };
  const handleSaveButton = ({ name,plan_space, speed, acceleration, wait }: Button) => {
    const trimmedName = name.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    if (trimmedName) {
      // Construct the new button object
      const newButton = {
        name: `${trimmedName}`,
        plan_space: plan_space,
        speed: speed,
        acceleration: acceleration,
        wait: wait,
      };
      console.log(newButton);

      addButton(newButton);
      setShowSave(false);
      setNewButtonName('');
      setTimeout(() => buttonContainerRef.current?.scrollTo(0, buttonContainerRef.current.scrollHeight), 100);

      // Send ROS command using new button name
      sendROSCommand(`sp@${trimmedName}`);
    }
  };


const handleAddButton = ({ name }: Button) => {
    const trimmedName = name.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    if (trimmedName) {
      // Construct the new button object
      const newButton = {
        name: `${trimmedName}`,
      };
      console.log(newButton);

      addPoint(newButton);
      setShowModal(false);
      setNewButtonName('');
      setTimeout(() => buttonContainerRef.current?.scrollTo(0, buttonContainerRef.current.scrollHeight), 100);

      // Send ROS command using new button name
      sendROSCommand(`sp@${trimmedName}`);
    }
  };






  const openSave = (source: string) => {
    setSourceButton(source);
    setShowSave(true);
  };

  const openModel = (source: string) => {
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

  const openSedit= (source: Button)=>{
    console.log(source);
    setSeditbtn(source);
    setShowSEdit(true);
  }

  const handleButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`);
    if (buttonName === 'Save Path') sendROSCommand('SP');
    if (buttonName === 'Execute_Last_Path') sendROSCommand('elp');
    if (buttonName === 'Execute_Whole_Path') sendROSCommand('ewp');
  };

  return (
    <div className="flex flex-col md:flex-row h-[90vh] border-gray-700 bg-gray-950 text-white font-sans w-full">
      {/* Sidebar */}
      <div className="w-full md:w-1/2 max-h-[90vh] p-4 md:p-8 space-y-6 border-r border-gray-700 bg-gray-950 shadow-xl">
        <button
          onClick={() => openModel('Save_Point')}
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
          onClick={() => openSave('Save Path')}
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
        
        <button
          disabled={!buttons.length}
          onClick={removeButton}
          className={` w-full px-6 py-4 rounded-lg text-lg font-semibold break-all ${
            buttons.length ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
          } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
        >
          Remove last (Path)
        </button>
        <button
          disabled={!buttons.length}
          onClick={removeAllButtons}
          className={`w-full px-6 py-4 rounded-lg text-lg font-semibold break-all ${
            buttons.length ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
          } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
        >
          Remove All (Path)
        </button>

        <button
          disabled={!points.length}
          onClick={removePoint}
          className={` w-full px-6 py-4 rounded-lg text-lg font-semibold break-all ${
            points.length ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
          } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
        >
          Remove last (point)
        </button>
        <button
          disabled={!points.length}
          onClick={removeAllPoint}
          className={`w-full px-6 py-4 rounded-lg text-lg font-semibold break-all ${
            points.length ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
          } transition ease-in-out duration-300 shadow-lg transform hover:scale-105`}
        >
          Remove All (point)
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-h-[90vh] flex flex-col space-y-4">
  {/* Scrollable Section 1 */}
  <div
    className="flex-1 max-h-[45vh] overflow-x-hidden overflow-y-auto p-2 md:p-6 border-2 border-gray-700 rounded-lg backdrop-blur-lg bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg"
  >
    <div className="space-y-3 h-full">
      <h2 className="text-lg font-semibold text-cyan-500 mb-4">Save Point</h2>
      {points.map((button, index) => (
        <button
          key={index}
          onClick={() => {
            openEdit(button);
          }}
          className="w-full py-5 px-4 rounded-lg bg-gray-700 hover:bg-gray-800 transition ease-in-out duration-300 text-md shadow-md transform hover:scale-105 tracking-wide uppercase text-center break-all"
        >
          {`${button.name}`}
        </button>
      ))}
    </div>
  </div>

  {/* Scrollable Section 2 with Fixed Height */}
  <div
    className="h-[40vh] overflow-x-hidden overflow-y-auto p-2 md:p-6 border-2 border-gray-700 rounded-lg backdrop-blur-lg bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg"
  >
    <div className="space-y-3 h-full">
      <h2 className="text-lg font-semibold text-cyan-500 mb-4">Path/Gripper</h2>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => {
            console.log(button.type);
            
            if (button.type !== "Gripper"){
              seteditbtn(button)
              openSedit(button);
            }
            else {
              setgripeditbtn(button);
              setShowgripper(true);
            }
          }}
          className="w-full py-5 px-4 rounded-lg bg-gray-700 hover:bg-gray-800 transition ease-in-out duration-300 text-md shadow-md transform hover:scale-105 tracking-wide uppercase text-center break-all"
        >
          {`${button.name}`}
        </button>
      ))}
    </div>
  </div>
</div>



      {/* Modal */}
      {showSave && (
        <SavePath
          newButtonName={newButtonName}
          setNewButtonName={setNewButtonName}
          handleSaveButton={handleSaveButton}
          closeModal={() => setShowSave(false)}
        />
      )}

        {showModal && (
                <Modal
                  newButtonName={newButtonName}
                  setNewButtonName={setNewButtonName}
                  handleAddButton={handleAddButton}
                  closeModal={() => setShowModal(false)}
                />
              )}  

      {/* Edit */}
      {showEdit && (
        <Edit
          newButtonName={newButtonName}
          setNewButtonName={setNewButtonName}
          handleAddButton={handleAddButton}
          closeModal={() => {
            fetchButtons()
            setShowEdit(false)}
          }
          data={editbtn}
        />
      )}

{showSEdit  && editbtn.type == "path" && (
        <SEdit
          newButtonName={newButtonName}
          setNewButtonName={setNewButtonName}
          handleSaveButton={handleSaveButton}
          closeSedit={() => {
            fetchButtons()
            setShowSEdit(false)
          }}
          data={editbtn}
        />
      )}

      {/* Gripper */}
      {showgripper && (
        <GripperAdd
          closeGripper={() => setShowgripper(false)}
          gripperData={gripbtn}
          resetGripperData={resetGripperData}
        />
      )}
    </div>
  );
};

export default Panel1;
