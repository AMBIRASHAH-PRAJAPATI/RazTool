chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "downloadEducationalContent") {
      const backend = "http://localhost:4000";
      const url = `${backend}/api/download?url=${encodeURIComponent(req.url)}&itag=${req.itag}`;
      chrome.downloads.download({
        url,
        filename: req.filename || "video.mp4",
        conflictAction: 'uniquify'
      }, downloadId => {
        if (chrome.runtime.lastError)
          console.error('Download failed:', chrome.runtime.lastError.message);
      });
    }
  });
  