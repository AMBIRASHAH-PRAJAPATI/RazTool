import React from 'react';
import App from '../App';

interface DownloadModalProps {
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ onClose }) => {

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
      <App />
  );
};

export default DownloadModal;