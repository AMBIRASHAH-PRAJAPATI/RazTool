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
  const [status, setStatus] = useState('Loading...');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setStatus('Getting video URL...');
        
        // Get current video URL
        const urlResponse = await chrome.runtime.sendMessage({ action: 'getVideoUrl' });
        
        if (!urlResponse?.url) {
          setStatus('Not on a YouTube video page');
          return;
        }
        
        setVideoUrl(urlResponse.url);
        setStatus('Fetching available qualities...');
        
        // Get video qualities
        const qualityResponse = await chrome.runtime.sendMessage({ 
          action: 'getQualities', 
          url: urlResponse.url 
        });
        
        if (qualityResponse?.qualities && qualityResponse.qualities.length > 0) {
          setQualities(qualityResponse.qualities);
          setStatus('Please select a quality to download');
        } else {
          setStatus(`Could not fetch video qualities: ${qualityResponse?.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error in useEffect:', error);
        setStatus('Error loading video data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    if (!selectedQuality || !videoUrl) {
      setStatus('Please select a quality first.');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('Starting download...');
      
      const response = await chrome.runtime.sendMessage({
        action: 'downloadVideo',
        url: videoUrl,
        formatId: selectedQuality,
      });

      if (response?.status === 'success') {
        setStatus('Download started! Check your downloads folder.');
      } else {
        setStatus(`Download failed: ${response?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      setStatus('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-w-[320px] font-sans">
      <h1 className="text-xl font-bold mb-4 text-center">YouTube Downloader</h1>
      
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <p className="text-sm text-center">{status}</p>
      </div>

      {qualities.length > 0 && !isLoading && (
        <div className="space-y-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Available Qualities:</h3>
          {qualities.map(q => (
            <button
              key={q.formatId}
              className={`block w-full text-left py-3 px-4 rounded transition-colors ${
                selectedQuality === q.formatId 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
              onClick={() => setSelectedQuality(q.formatId)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{q.quality}</span>
                <span className="text-xs text-gray-400">
                  {q.hasVideo && q.hasAudio ? 'Video + Audio' : 
                   q.hasVideo ? 'Video Only' : 'Audio Only'}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        className={`w-full py-3 px-4 rounded font-bold transition-colors flex items-center justify-center space-x-2 ${
          !selectedQuality || isLoading
            ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        onClick={handleDownload}
        disabled={!selectedQuality || isLoading}
      >
        <DownloadIcon size={18} />
        <span>{isLoading ? 'Processing...' : 'Download Video'}</span>
      </button>
    </div>
  );
}

export default App;
