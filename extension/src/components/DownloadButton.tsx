import React, { useState } from 'react';
import DownloadModal from './DownloadModal';

const DownloadButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button 
        onClick={handleClick} 
        className="p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>

      {isModalOpen && <DownloadModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default DownloadButton;