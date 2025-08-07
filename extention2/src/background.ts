// Define interfaces for messages to ensure type-safe communication
interface FetchVideoInfoMessage {
  action: "fetchVideoInfo";
  videoId: string;
}
interface GetVideoUrlMessage {
  action: "getVideoUrl";
}

interface GetQualitiesMessage {
  action: "getQualities";
  url: string;
}

interface DownloadVideoMessage {
  action: "downloadVideo";
  url: string;
  formatId: number;
}

type ExtensionMessage = FetchVideoInfoMessage  | GetVideoUrlMessage | GetQualitiesMessage | DownloadVideoMessage;

const BACKEND_URL = 'http://localhost:4000';

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _, sendResponse) => {
    console.log('Background received message:', message);
    
    if (message.action === "getVideoUrl") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab?.url && currentTab.url.includes('youtube.com/watch')) {
          sendResponse({ url: currentTab.url });
        } else {
          sendResponse({ url: null, error: "Not on a YouTube video page" });
        }
      });
      return true;
    }

    if (message.action === "getQualities") {
      const { url } = message;
      if (!url) {
        sendResponse({ qualities: null, error: "URL is required" });
        return;
      }
      const apiUrl = `${BACKEND_URL}/api/video-info`;
      (async () => {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          const qualities = (data.formats || []).map((f: any) => ({
            quality: f.quality,
            formatId: parseInt(f.itag) || 0,
            ext: f.ext,
            hasVideo: true,
            hasAudio: true
          }));
          sendResponse({ qualities });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          sendResponse({ qualities: null, error: errorMessage });
        }
      })();
      return true;
    }
    
    if (message.action === "downloadVideo") {
      const { url, formatId } = message;
      if (!url || !formatId) {
        sendResponse({ status: "error", error: "URL and formatId are required" });
        return;
      }
      const downloadUrl = `${BACKEND_URL}/api/download?url=${encodeURIComponent(url)}&itag=${formatId}`;
      const videoId = (() => {
        try {
          return new URL(url).searchParams.get('v') || 'video';
        } catch {
          return 'video';
        }
      })();
      const filename = `${videoId}_${formatId}.mp4`;
      chrome.downloads.download(
        {
          url: downloadUrl,
          filename,
          conflictAction: 'uniquify'
        },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error('Download failed:', chrome.runtime.lastError.message);
            sendResponse({ status: "error", error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ status: "success", downloadId });
          }
        }
      );
      return true; 
    }
    
    
    if (message.action === "fetchVideoInfo") {
      const { videoId } = message;
      
      if (!videoId) {
        sendResponse({ success: false, error: "Video ID is required" });
        return;
      }

      // Construct YouTube URL from video ID
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const apiUrl = `${BACKEND_URL}/api/video-info`;

      (async () => {
        try {
          console.log('Fetching video info from:', apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: youtubeUrl })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Video info data:', data);
          
          // Transform the response to match DownloadModal expectations
          const videoInfo = {
            title: data.title || `Video ${videoId}`,
            qualities: data.formats?.map((f: any) => f.quality) || []
          };
          
          sendResponse({ success: true, videoInfo: videoInfo });
        } catch (error) {
          console.error('Fetch video info error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          sendResponse({ success: false, error: errorMessage });
        }
      })();
      
      return true;
    }
    
    // If no action matches, send error response
    sendResponse({ success: false, error: 'Unknown action' });
  }
);

// Extension installation handler
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Downloader extension installed');
});
