import React, { useState, useEffect } from "react";

type GripperProps = {
  number: number;
  state: number;
  wait: number;
  id: string;
};

type GripperAddProps = {
  closeGripper: () => void;
  gripperData?: GripperProps; // Optional for editing
};

const GripperAdd: React.FC<GripperAddProps> = ({ closeGripper, gripperData }) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [wait, setWait] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<"add" | "edit">("add"); // Default to add

  // Reset form when switching to adding new gripper or editing an existing one
  useEffect(() => {
    if (gripperData) {
      // When editing, set the state with the existing gripper data
      setMode("edit");
      setSelectedNumber(gripperData.number);
      setSelectedState(gripperData.state);
      setWait(gripperData.wait);
    } else {
      // When adding, reset the state
      setMode("add");
      resetForm();
    }
  }, [gripperData]);

  const handleSubmit = async () => {
    // Validate inputs
    if (selectedNumber === null) {
      setError("Number selection is required.");
      return;
    }
    if (wait < 0) {
      setError("Wait time must be a non-negative number.");
      return;
    }
    setError("");

    const gripperCommand: GripperProps = {
      number: selectedNumber,
      state: selectedState ?? 0, // Ensure a default state value if not selected
      wait,
      id: gripperData?.id || "", // Use existing id if editing
    };

    try {
      const url = gripperCommand.id
        ? `http://localhost:5000/gripper/editGripper` // Edit URL
        : "http://localhost:5000/gripper/addGripper"; // Add URL
      const method = gripperCommand.id ? "PUT" : "POST"; // PUT for editing, POST for adding

      // Send request to server
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gripperCommand),
      });

      if (!response.ok) {
        throw new Error("Failed to save the gripper. Please try again.");
      }

      console.log("Gripper successfully saved:", gripperCommand);
      resetForm(); // Reset form after successful submission
      closeGripper(); // Close the form
      setMode("add"); 
      
      // Ensure mode is set back to 'add' when the form closes (if adding)
    } catch (error) {
      console.error("Error saving gripper:", error);
    }
  };

  const resetForm = () => {
    setSelectedNumber(null); // Reset number
    setSelectedState(null); // Reset state
    setWait(0); // Reset wait
    setError(""); // Clear error message
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-semibold mb-4">{mode === "edit" ? "Edit Gripper Command" : "Add Gripper Command"}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* Number Selection */}
        <div className="mb-4">
          <label className="block mb-2">Select Number:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="number"
                value="1"
                checked={selectedNumber === 1}
                onChange={() => setSelectedNumber(1)}
                className="mr-2"
              />
              Number 1
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="number"
                value="2"
                checked={selectedNumber === 2}
                onChange={() => setSelectedNumber(2)}
                className="mr-2"
              />
              Number 2
            </label>
          </div>
        </div>
        {/* State Selection */}
        <div className="mb-4">
          <label className="block mb-2">Select State:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="state"
                value="open"
                checked={selectedState === 1}
                onChange={() => setSelectedState(1)}
                className="mr-2"
              />
              Open
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="state"
                value="close"
                checked={selectedState === 0}
                onChange={() => setSelectedState(0)}
                className="mr-2"
              />
              Close
            </label>
          </div>
        </div>
        {/* Wait Time */}
        <div className="mb-4">
          <label className="block mb-2">Wait Time (ms):</label>
          <input
            type="number"
            value={wait}
            onChange={(e) => setWait(Number(e.target.value))}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
          />
        </div>
        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200"
          >
            {mode === "edit" ? "Update" : "Submit"}
          </button>
          <button
            onClick={closeGripper}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GripperAdd;
