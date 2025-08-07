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

type ExtensionMessage = FetchVideoInfoMessage | StartDownloadMessage;

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _, sendResponse) => {
    if (message.action === "fetchVideoInfo") {
      const { videoId } = message;
      // Replace with your actual backend endpoint
      const backendUrl = `YOUR_BACKEND_URL/api/video-info?videoId=${videoId}`;

      fetch(backendUrl)
        .then((response) => response.json())
        .then((data) => {
          sendResponse({ success: true, videoInfo: data });
        })
        .catch((error) => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep the message channel open for sendResponse
    }

    if (message.action === "startDownload") {
      const { videoId, quality } = message;
      // Replace with your actual download endpoint
      const downloadUrl = `YOUR_BACKEND_URL/api/download?videoId=${videoId}&quality=${quality}`;

      fetch(downloadUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          chrome.downloads.download({ url: url, filename: `${videoId}.mp4` });
          sendResponse({ success: true });
        })
        .catch((error) => {
          sendResponse({ success: false, error: error.message });
        });
      return true;
    }
  }
);