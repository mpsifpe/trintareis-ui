import { useState } from 'react';

/**
 * Hook to wrap the logic of creating a boolean state and setting it to the Modal component
 * @returns {Array} Array with the state, a setter to set the state to true and another one to set it to false
 */
const useModalState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return [isModalOpen, openModal, closeModal];
};

export default useModalState;