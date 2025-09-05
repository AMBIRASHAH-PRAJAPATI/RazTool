interface GetVideoUrlMessage {
  action: "getVideoUrl";
}

interface FetchVideoInfoMessage {
  action: "fetchVideoInfo";
  url: string;
}

interface DownloadVideoMessage {
  action: "downloadVideo";
  url: string;
  formatId: number;
}

type ExtensionMessage =
  | GetVideoUrlMessage
  | FetchVideoInfoMessage
  | DownloadVideoMessage;

const BACKEND_URL = import.meta.env.VITE_API_URL;

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _, sendResponse) => {
    console.log("Background received message:", message);

    // Get current tab URL if on YouTube
    if (message.action === "getVideoUrl") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab?.url && currentTab.url.includes("youtube.com/watch")) {
          sendResponse({ url: currentTab.url });
        } else {
          sendResponse({
            url: null,
            error: "Not on a YouTube video page",
          });
        }
      });
      return true;
    }

    // Fetch video info (title, channel, thumbnail, qualities)
    if (message.action === "fetchVideoInfo") {
      const { url } = message;
      if (!url) {
        sendResponse({ success: false, error: "URL is required" });
        return;
      }

      const apiUrl = `${BACKEND_URL}/youtube/video-info`;

      (async () => {
        try {
          console.log("Fetching video info from:", apiUrl);

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Video info data:", data);

          // Flatten formats
          const allFormats = [
            ...(data.formats?.combined || []),
            ...(data.formats?.videoOnly || []),
            ...(data.formats?.audioOnly || []),
          ];

          const qualities = allFormats.map((f: any) => ({
            quality: f.quality || f.audioQuality || "unknown",
            formatId: parseInt(f.itag) || 0,
            ext: f.ext || "mp4",
            hasVideo:
              !!f.hasVideo || f.type === "video" || f.type === "combined",
            hasAudio:
              !!f.hasAudio || f.type === "audio" || f.type === "combined",
          }));

          const videoInfo = {
            videoId: data.videoId,
            title: data.title,
            channel: data.channel,
            duration: data.duration,
            thumbnail: data.thumbnail,
            viewCount: data.viewCount,
            qualities,
          };

          sendResponse({ success: true, videoInfo });
        } catch (error) {
          console.error("Fetch video info error:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          sendResponse({ success: false, error: errorMessage });
        }
      })();

      return true;
    }

    // Download video
    if (message.action === "downloadVideo") {
      const { url, formatId } = message;
      if (!url || !formatId) {
        sendResponse({
          status: "error",
          error: "URL and formatId are required",
        });
        return;
      }
      const downloadUrl = `${BACKEND_URL.replace(
        "/api",
        ""
      )}/api/youtube/download?url=${encodeURIComponent(url)}&itag=${formatId}`;
      const videoId = (() => {
        try {
          return new URL(url).searchParams.get("v") || "video";
        } catch {
          return "video";
        }
      })();
      const filename = `${videoId}_${formatId}.mp4`;
      chrome.downloads.download(
        {
          url: downloadUrl,
          filename,
          conflictAction: "uniquify",
        },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Download failed:",
              chrome.runtime.lastError.message
            );
            sendResponse({
              status: "error",
              error: chrome.runtime.lastError.message,
            });
          } else {
            sendResponse({ status: "success", downloadId });
          }
        }
      );
      return true;
    }

    // Unknown action
    sendResponse({ success: false, error: "Unknown action" });
  }
);

chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Downloader extension installed");
});
