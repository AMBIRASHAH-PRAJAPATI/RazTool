import React from 'react';
import DownloadButton from './DownloadButton';

const ContentPage: React.FC = () => {
  return (
    <div className="fixed top-20 left-4 z-[9999]">
      <DownloadButton />
    </div>
  );
};

export default ContentPage;