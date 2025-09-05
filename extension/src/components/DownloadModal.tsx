import React from 'react';
import App from '../App';

interface DownloadModalProps {
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-auto shadow-lg">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none"
        >
          <span className="text-xl leading-none p-2">×</span>
        </button>
        <App />
      </div>
    </div>

  );
};

export default DownloadModal;
