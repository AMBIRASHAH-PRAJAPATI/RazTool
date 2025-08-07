import React, { useEffect, useState } from 'react';

// Define a type for the video information returned from the backend
interface VideoInfo {
  title: string;
  qualities: string[];
}

// Define the props for the modal component
interface DownloadModalProps {
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ onClose }) => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const url = new URL(window.location.href);
        const videoId = url.searchParams.get("v");
        if (!videoId) {
          throw new Error("Video ID not found.");
        }

        const response: { success: boolean; videoInfo?: VideoInfo; error?: string } = await chrome.runtime.sendMessage({
          action: "fetchVideoInfo",
          videoId: videoId,
        });

        if (response.success && response.videoInfo) {
          setVideoInfo(response.videoInfo);
        } else {
          console.error("Failed to fetch video info:", response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleDownload = (quality: string) => {
    const url = new URL(window.location.href);
    const videoId = url.searchParams.get("v");
    if (videoId) {
      chrome.runtime.sendMessage({
        action: "startDownload",
        videoId: videoId,
        quality: quality,
      });
      onClose(); // Close modal after initiating download
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Download Options</h3>
          <div className="mt-2 px-7 py-3">
            {isLoading ? (
              <p>Loading video details...</p>
            ) : videoInfo ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">{videoInfo.title}</p>
                {videoInfo.qualities.map((quality) => (
                  <button 
                    key={quality} 
                    onClick={() => handleDownload(quality)}
                    className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                  >
                    {quality}
                  </button>
                ))}
              </div>
            ) : (
              <p>Could not fetch video info.</p>
            )}
          </div>
          <div className="items-center px-4 py-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;