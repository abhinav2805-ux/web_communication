import React from "react";

type ModalProps = {
  newButtonName: string;
  sourceButton: string;
  setNewButtonName: React.Dispatch<React.SetStateAction<string>>;
  handleAddButton: () => void;
  closeModal: () => void;
};

const Modal: React.FC<ModalProps> = ({
  newButtonName,
  setNewButtonName,
  handleAddButton,
  closeModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Enter Robot Command</h2>
        <input
          type="text"
          value={newButtonName}
          onChange={(e) => setNewButtonName(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
          placeholder="Enter command name"
        />
        <div className="flex justify-between">
          <button
            onClick={handleAddButton}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200"
          >
            OK
          </button>
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
