import './index.css';
import { useState, useEffect } from 'react';
import { DownloadIcon } from 'lucide-react';

type VideoQuality = {
  quality: string;
  formatId: number;
  ext: string;
  hasVideo: boolean;
  hasAudio: boolean;
};

type VideoInfo = {
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  thumbnail: string;
  viewCount: number;
  qualities: VideoQuality[];
};

function App() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
  const [status, setStatus] = useState('Loading...');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setStatus('Getting video URL...');

        // 1. Get current video URL
        const urlResponse = await chrome.runtime.sendMessage({ action: 'getVideoUrl' });

        if (!urlResponse?.url) {
          setStatus('Not on a YouTube video page');
          return;
        }

        setVideoUrl(urlResponse.url);
        setStatus('Fetching video info...');

        // 2. Fetch full video info (title + qualities)
        const infoResponse = await chrome.runtime.sendMessage({
          action: 'fetchVideoInfo',
          url: urlResponse.url
        });

        if (infoResponse?.success && infoResponse.videoInfo) {
          setVideoInfo(infoResponse.videoInfo);
          setStatus('Please select a quality to download');
        } else {
          setStatus(`Could not fetch video info: ${infoResponse?.error || 'Unknown error'}`);
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
    <div className="p-4 bg-gray-900 text-white min-w-[320px] font-sans flex flex-col h-[500px]">
      <h1 className="text-xl font-bold mb-4 text-center">YouTube Downloader</h1>
  
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Video Info Preview */}
        {videoInfo && (
          <div className="mb-4 flex items-center space-x-3 bg-gray-800 rounded-lg p-3">
            <img src={videoInfo.thumbnail} alt="thumbnail" className="w-20 h-12 rounded" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold line-clamp-2">{videoInfo.title}</h2>
              <p className="text-xs text-gray-400">{videoInfo.channel}</p>
              <p className="text-xs text-gray-500">{videoInfo.viewCount.toLocaleString()} views</p>
            </div>
          </div>
        )}
  
        {/* Status */}
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-center">{status}</p>
        </div>
  
        {/* Qualities */}
        {!isLoading && videoInfo && videoInfo.qualities && videoInfo.qualities.length > 0 && (
          <div className="space-y-2 mb-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Available Qualities:</h3>
            {videoInfo.qualities.map(q => (
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
                  <span className="font-medium">
                    {q.quality} ({q.ext})
                  </span>
                  <span className="text-xs text-gray-400">
                    {q.hasVideo && q.hasAudio
                      ? 'Video + Audio'
                      : q.hasVideo
                      ? 'Video Only'
                      : 'Audio Only'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
  
      {/* Fixed Download Button */}
      <div className="mt-4">
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
    </div>
  );  
}

export default App;
