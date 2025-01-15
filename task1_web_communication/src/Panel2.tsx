import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';

const Panel2: React.FC = () => {
  const [toggleStates, setToggleStates] = useState([false, false, false]);
  const [jointStates, setJointStates] = useState<Record<string, number>>({});
  const intervalRef = useRef<number | null>(null); // useRef to store intervalId

  // Initialize ROS variables
  let ros: ROSLIB.Ros;
  let uiCommandTopic: ROSLIB.Topic;
  let cobotPlayPause: ROSLIB.Topic;
  let cobotJointState: ROSLIB.Topic;

  // Functions to handle ROS communication
  const ros2Publish = (data: string) => {
    const message = new ROSLIB.Message({
      data: data,
    });
    uiCommandTopic.publish(message);
    console.log('Published:', data);
  };

  const ros2PublishCobotState = (data: boolean) => {
    const message = new ROSLIB.Message({
      data: data,
    });
    cobotPlayPause.publish(message);
    console.log('Cobot Stop:', data);
  };

  // Establish ROS connection
  useEffect(() => {
    // Set up the ROS connection
    ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090', // Ensure ROS WebSocket server is running
    });

    uiCommandTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/ui_commands',
      messageType: 'std_msgs/String',
    });

    cobotPlayPause = new ROSLIB.Topic({
      ros: ros,
      name: '/cobot_play_pause',
      messageType: 'std_msgs/Bool',
    });

    cobotJointState = new ROSLIB.Topic({
      ros: ros,
      name: '/nextup_joint_states',
      messageType: 'nextup_joint_interfaces/msg/NextupJointState',
    });

    // Subscribe to joint states
    cobotJointState.subscribe((message: any) => {
      const jointState: Record<string, number> = {};

      ['j1', 'j2', 'j3', 'j4', 'j5', 'j6'].forEach((joint, index) => {
        jointState[joint] = message.position[index];
      });

      setJointStates(jointState);
    });

    // Cleanup WebSocket connection on component unmount
    return () => {
      ros.close();
    };
  }, []);

  // Handle toggle button click
  const handleToggle = (index: number) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);

    // Handle ROS play/pause toggle
    const state = newToggleStates[index];
    if (index === 0) {
      ros2PublishCobotState(state);
    }
  };

  // Handle joint button press
  const handleJointButtonPress = (joint: string, direction: string) => {
    intervalRef.current = window.setInterval(() => {
      ros2Publish(`${direction}${joint}`);
    }, 2000);
  };

  // Handle joint button release (stop movement)
  const handleJointButtonRelease = (joint: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Reset the interval reference
    }
    ros2Publish(`0${joint}`); // Stop the joint movement
  };

  return (
    <div className="w-full p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white rounded-lg shadow-lg border border-gray-700 max-h-[90vh] overflow-hidden">
      <h1 className="text-center text-cyan-400 text-2xl font-bold mb-6">Servo Node Controller</h1>

      {/* Two-column layout with a separator */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 h-full">
        {/* Column 1: J buttons */}
        <div className="space-y-6 h-full overflow-y-auto">
          {['j1', 'j2', 'j3', 'j4', 'j5', 'j6'].map((joint) => (
            <div
              key={joint}
              className="flex items-center p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-md hover:shadow-xl transition ease-in-out duration-300"
            >
              <span className="text-lg sm:text-xl font-semibold text-cyan-400 w-1/4">{joint.toUpperCase()}:</span>
              <div className="flex w-[88%] space-x-3 justify-center">

                <button
                  className="w-48 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-lg rounded shadow-sm transition-transform transform hover:scale-105"
                  onTouchStart={() => handleJointButtonPress(joint, '+')}
                  onMouseDown={() => handleJointButtonPress(joint, '+')}
                  onTouchEnd={() => handleJointButtonRelease(joint)}
                  onMouseUp={() => handleJointButtonRelease(joint)}
                >
                  +
                </button>
                <span className="text-lg sm:text-xl font-semibold text-gray-300 w-1/6 text-center pt-1">
                  {jointStates[joint]?.toFixed(2) || '0.0'}
                </span>
                <button
                  className="w-48 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-lg rounded shadow-sm transition-transform transform hover:scale-105"
                  onTouchStart={() => handleJointButtonPress(joint, '-')}
                  onMouseDown={() => handleJointButtonPress(joint, '-')}
                  onTouchEnd={() => handleJointButtonRelease(joint)}
                  onMouseUp={() => handleJointButtonRelease(joint)}
                >
                  -
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-l border-gray-700 hidden md:block"></div>

        {/* Column 2: Axis buttons */}
        <div className="space-y-6 h-full overflow-y-auto">
          {['X', 'Y', 'Z', 'R', 'P', 'W'].map((axis) => (
            <div
              key={axis}
              className="flex items-center p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-md hover:shadow-xl transition ease-in-out duration-300"
            >
              <span className="text-lg sm:text-xl font-semibold text-cyan-400 w-1/4">{axis}:</span>
              <div className="flex w-[88%] space-x-3 justify-center">

                <button
                  className="w-48 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-lg rounded shadow-sm transition-transform transform hover:scale-105"
                  onTouchStart={() => handleJointButtonPress(axis, '+')}
                  onMouseDown={() => handleJointButtonPress(axis, '+')}
                  onTouchEnd={() => handleJointButtonRelease(axis)}
                  onMouseUp={() => handleJointButtonRelease(axis)}
                >
                  +
                </button>
                <span className="text-lg sm:text-xl font-semibold text-gray-300 w-1/6 text-center pt-1">0.0</span>
                <button
                  className="w-48 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-lg rounded shadow-sm transition-transform transform hover:scale-105"
                  onTouchStart={() => handleJointButtonPress(axis, '-')}
                  onMouseDown={() => handleJointButtonPress(axis, '-')}
                  onTouchEnd={() => handleJointButtonRelease(axis)}
                  onMouseUp={() => handleJointButtonRelease(axis)}
                >
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
