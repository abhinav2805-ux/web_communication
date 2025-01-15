import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
interface Button {
  name: string;
  id:string
}

type ModalProps = {
  newButtonName: string;
  setNewButtonName: Dispatch<SetStateAction<string>>;
  handleAddButton: (data: { name: string }) => void;
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setNewButtonName(data.name || "");
    }
  }, [data, setNewButtonName]); // Update state whenever `data` changes

  const validateForm = () => {
    if (!newButtonName.trim()) {
      setError("Name is required.");
      return false;
    }
    if (/\s/.test(newButtonName)) {
      setError("Name cannot contain spaces.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const updatedData = {
        name: newButtonName,
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
    setError("");
  };

  const handleCancel = () => {
    resetForm();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-semibold mb-4">Edit Robot Command</h2>
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
