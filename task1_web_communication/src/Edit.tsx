import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
interface Button {
  name: string;
  speed: number;
  acceleration: number;
  wait: number;
  id: string;
}

type ModalProps = {
  newButtonName: string;
  setNewButtonName: Dispatch<SetStateAction<string>>;
  handleAddButton: (data: { name: string; speed: number; acceleration: number; wait: number; id: string }) => void;
  closeModal: () => void;
  data: Button | undefined;
};
const Edit: React.FC<ModalProps> = ({
  newButtonName,
  setNewButtonName,
  handleAddButton,
  data,
  closeModal,
}) => {
  const [speed, setSpeed] = useState<number | "">("");
  const [acceleration, setAcceleration] = useState<number | "">("");
  const [wait, setWait] = useState<number | 0>(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setNewButtonName(data.name || "");
      setSpeed(data.speed || "");
      setAcceleration(data.acceleration || "");
      setWait(data.wait || 0);
    }
  }, [data, setNewButtonName]); // Update state whenever `data` changes

  const validateForm = () => {
    if (!newButtonName.trim()) {
      setError("Name is required.");
      return false;
    }
    if (speed !== "" && (speed < 0.1 || speed > 1)) {
      setError("Speed must be a number between 0.1 and 1, if provided.");
      return false;
    }
    if (acceleration !== "" && (acceleration < 0.1 || acceleration > 1)) {
      setError("Acceleration must be a number between 0.1 and 1, if provided.");
      return false;
    }
    if (wait !== 0 && wait < 0) {
      setError("Wait time must be a non-negative number.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const updatedData = {
        name: newButtonName,
        speed: speed === "" ? 0.1 : Number(speed),
        acceleration: acceleration === "" ? 0.1 : Number(acceleration),
        wait: wait === 0 ? 0 : Number(wait),
        id: data?.id || "",
      };

      try {
        const response = await fetch(`http://localhost:5000/btn/editButton`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          console.log("Data updated successfully!");
          resetForm();
          closeModal();
        } else {
          const errorText = await response.text();
          setError(`Error: ${errorText}`);
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setNewButtonName("");
    setSpeed("");
    setAcceleration("");
    setWait(0);
    setError("");
  };

  const handleCancel = () => {
    resetForm();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-semibold mb-4">Enter Robot Command</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={newButtonName}
              onChange={(e) => setNewButtonName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="speed" className="block text-sm font-medium mb-2">
              Speed (0.1 - 1)
            </label>
            <input
              id="speed"
              type="number"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter speed"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="acceleration" className="block text-sm font-medium mb-2">
              Acceleration (0.1 - 1)
            </label>
            <input
              id="acceleration"
              type="number"
              step="0.1"
              value={acceleration}
              onChange={(e) => setAcceleration(e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter acceleration"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="wait" className="block text-sm font-medium mb-2">
              Wait Time
            </label>
            <input
              id="wait"
              type="number"
              value={wait}
              onChange={(e) => setWait(e.target.value !== "" ? Number(e.target.value) : 0)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter wait time"
            />
          </div>
        </form>
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200"
          >
            Submit
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
