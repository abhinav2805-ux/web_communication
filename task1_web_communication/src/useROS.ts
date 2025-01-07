import { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

export const useROS = () => {
  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
  const [buttonPublisher, setButtonPublisher] = useState<ROSLIB.Topic | null>(null);

  useEffect(() => {
    // Initialize the ROS connection
    const rosInstance = new ROSLIB.Ros({
      url: 'ws://localhost:9090', // ROS WebSocket bridge URL (adjust to your ROS bridge URL)
    });

    // Handle connection, errors, and closure
    rosInstance.on('connection', () => {
      console.log('Connected to ROS 2 WebSocket bridge');
    });

    rosInstance.on('error', (error) => {
      console.error('Error connecting to ROS 2 WebSocket bridge:', error);
    });

    rosInstance.on('close', () => {
      console.log('Connection to ROS 2 WebSocket bridge closed');
    });

    // Create a publisher for the /button_command topic
    const publisher = new ROSLIB.Topic({
      ros: rosInstance,
      name: '/button_command', // Name of the topic
      messageType: 'std_msgs/String', // Message type
    });

    setRos(rosInstance);
    setButtonPublisher(publisher);

    // Cleanup function to close the connection
    return () => {
      if (rosInstance) {
        rosInstance.close();
      }
    };
  }, []);

  // Function to send the ROS command (message) based on the button action
  const sendROSCommand = (command: number) => {
    let messageData = '';

    // Map command numbers to button actions
    switch (command) {
      case 1:
        messageData = 'sp'; // Save Point
        break;
      case 2:
        messageData = 'elp'; // Execute Last Path
        break;
      case 3:
        messageData = 'ewp'; // Execute Whole Path
        break;
      default:
        messageData = 'Unknown Command'; // Default for unknown commands
    }

    // Send the message to the ROS topic
    if (buttonPublisher) {
      const message = new ROSLIB.Message({
        data: messageData,
      });

      // Publish the message to the topic
      buttonPublisher.publish(message);
      console.log('Sent:', messageData); // Log the sent message
    } else {
      console.error('Button Publisher is not defined!');
    }
  };

  return { sendROSCommand };
};
