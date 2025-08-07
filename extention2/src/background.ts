// Define interfaces for messages to ensure type-safe communication
interface FetchVideoInfoMessage {
  action: "fetchVideoInfo";
  videoId: string;
}

interface StartDownloadMessage {
  action: "startDownload";
  videoId: string;
  quality: string;
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

type ExtensionMessage = FetchVideoInfoMessage | StartDownloadMessage | GetVideoUrlMessage | GetQualitiesMessage | DownloadVideoMessage;

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    console.log('Background received message:', message);
    
    if (message.action === "getVideoUrl") {
      // Get the current active tab URL
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
      const videoId = new URL(url).searchParams.get('v');
      
      if (!videoId) {
        sendResponse({ qualities: null, error: "Video ID not found" });
        return;
      }

      // Replace http://localhost:4000 with your actual backend endpoint
      const backendUrl = `http://localhost:4000/api/video-qualities?videoId=${videoId}`;

      (async () => {
        try {
          const response = await fetch(backendUrl);
          const data = await response.json();
          sendResponse({ qualities: data.qualities || [] });
        } catch (error) {
          console.error('Fetch qualities error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          sendResponse({ qualities: null, error: errorMessage });
        }
      })();
      
      return true;
    }

    if (message.action === "downloadVideo") {
      const { url, formatId } = message;
      const videoId = new URL(url).searchParams.get('v');
      
      if (!videoId) {
        sendResponse({ status: "error", error: "Video ID not found" });
        return;
      }

      // Replace http://localhost:4000 with your actual download endpoint
      const downloadUrl = `http://localhost:4000/api/download?videoId=${videoId}&formatId=${formatId}`;

      (async () => {
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          await chrome.downloads.download({ 
            url: blobUrl, 
            filename: `${videoId}.mp4` 
          });
          
          sendResponse({ status: "success" });
        } catch (error) {
          console.error('Download error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          sendResponse({ status: "error", error: errorMessage });
        }
      })();
      
      return true;
    }
    
    if (message.action === "fetchVideoInfo") {
      const { videoId } = message;
      // Replace http://localhost:4000 with your actual backend endpoint
      const backendUrl = `http://localhost:4000/api/video-info?videoId=${videoId}`;

      // Handle async operation properly
      (async () => {
        try {
          const response = await fetch(backendUrl);
          const data = await response.json();
          sendResponse({ success: true, videoInfo: data });
        } catch (error) {
          console.error('Fetch error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          sendResponse({ success: false, error: errorMessage });
        }
      })();
      
      return true; // Keep the message channel open for sendResponse
    }

    if (message.action === "startDownload") {
      const { videoId, quality } = message;
      const downloadUrl = `http://localhost:4000/api/download?videoId=${videoId}&quality=${quality}`;

      // Handle async operation properly
      (async () => {
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          await chrome.downloads.download({ 
            url: url, 
            filename: `${videoId}.mp4` 
          });
          
          sendResponse({ success: true });
        } catch (error) {
          console.error('Download error:', error);
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
