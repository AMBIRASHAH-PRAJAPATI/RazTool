import { useState, useEffect } from 'react';
import { DownloadIcon } from 'lucide-react';

type VideoQuality = {
  quality: string;
  formatId: number;
  ext: string;
  hasVideo: boolean;
  hasAudio: boolean;
};

function App() {
  const [qualities, setQualities] = useState<VideoQuality[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
  const [status, setStatus] = useState('Waiting for quality selection...');
  const [videoUrl, setVideoUrl] = useState('');


  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getVideoUrl' }, (response) => {
      if (response?.url) {
        setVideoUrl(response.url);
        chrome.runtime.sendMessage({ action: 'getQualities', url: response.url }, (qualityResponse) => {
          if (qualityResponse?.qualities) {
            setQualities(qualityResponse.qualities);
            setStatus('Please select a quality.');
          } else {
            setStatus('Could not fetch video qualities.');
          }
        });
      } else {
        setStatus('Video URL not available.');
      }
    });
  }, []);

  const handleDownload = () => {
    if (selectedQuality && videoUrl) {
      setStatus(`Downloading ${selectedQuality}...`);
      // Send download request to background script with the selected quality
      chrome.runtime.sendMessage({
        action: 'downloadVideo',
        url: videoUrl,
        formatId: selectedQuality,
      }, (response) => {
        if (response?.status === 'success') {
          setStatus('Download started!');
        } else {
          setStatus('Download failed.');
        }
      });
    } else {
      setStatus('Please select a quality first.');
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-w-[300px] font-sans">
      <h1 className="text-xl font-bold mb-4">YouTube Downloader</h1>
      <p className="text-sm mb-4">{status}</p>

      {qualities.length > 0 ? (
        <div className="space-y-2">
          {qualities.map(q => (
            <button
              key={q.formatId}
              className={`block w-full text-left py-2 px-4 rounded transition-colors ${selectedQuality === q.formatId ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              onClick={() => setSelectedQuality(q.formatId)}
            >
              {q.quality} {q.hasVideo && q.hasAudio ? '(video + audio)' : q.hasVideo ? '(video only)' : '(audio only)'}
            </button>
          ))}
        </div>
      ) : (
        <p>Loading qualities...</p>
      )}


      <button
        className={`mt-4 w-full py-2 px-4 rounded font-bold transition-colors flex items-center justify-center space-x-2 ${!selectedQuality ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        onClick={handleDownload}
        disabled={!selectedQuality}
      >
        <DownloadIcon size={18} />
        <span>Download</span>
      </button>
    </div>
  );
}

export default App;