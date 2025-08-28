import React, { useState } from 'react';
import DownloaderLayout from './layout/downloaderLayout';
import { fetchVideoInfo, getDownloadUrl } from '@/api';
import YouTubeVideoResults from './YoutTubeVideoResult';


interface Format {
  itag: number;
  quality: string;
  filesize?: number;
  ext: string;
  mimeType: string;
  url: string;
  type: string;
}

interface VideoInfo {
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  viewCount: number;
  formats: {
    combined: Format[];
    videoOnly: Format[];
    audioOnly: Format[];
  };
  thumbnail: string;
}

const YT_REGEX = /(youtube\.com\/watch\?|youtu\.be\/)/;

function YouTubeVideoDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (url: string) => {
    setUrl(url);
    setError('');
    setVideo(null);
    if (!url.match(YT_REGEX)) {
      setError('Enter a valid YouTube URL');
      return;
    }
    setLoading(true);
    try {
      const info: VideoInfo = await fetchVideoInfo(url.trim());
      setVideo(info);
    } catch (err) {
      setError('Could not analyze video: ' + (err as Error).message);
    }
    setLoading(false);
  };
  const handleDownload = (format: Format) => {
    const downloadUrl = getDownloadUrl({ url, itag: format.itag });
    window.open(downloadUrl, '_blank');
  };
  return (
    <DownloaderLayout
      title="🎓 YouTube Video Downloader"
      subtitle="Download YouTube videos to MP3 and MP4 online for free"
      onSearch={handleAnalyze}
      loading={loading}
    >
      <YouTubeVideoResults
        video={video}
        loading={loading}
        error={error}
        onDownload={handleDownload}
      />
    </DownloaderLayout>
  );
}

export default YouTubeVideoDownloader;
