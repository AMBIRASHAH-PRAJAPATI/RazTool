import React, { useState } from 'react';
import DownloaderLayout from './layout/downloaderLayout';
import InstaVideoResult from './InstaVideoResult';
import { fetchInstagramContentInfo, downloadInstagramMedia, isValidInstagramUrl } from '../api';

interface InstagramContent {
  id: string;
  shortcode: string;
  type: 'post' | 'reel' | 'story' | 'highlight';
  is_video: boolean;
  video_url?: string;
  display_url: string;
  thumbnail_url: string;
  caption?: string;
  owner: {
    id: string;
    username: string;
    full_name: string;
    profile_pic_url: string;
    is_verified: boolean;
  };
  dimensions: { height: number; width: number };
  video_duration?: number;
  has_audio?: boolean;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  taken_at_timestamp: number;
  product_type?: string;
}

function InstagramVideoDownloader() {
  const [post, setPost] = useState<InstagramContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const getContent = async (url: string) => {
    if (!url.trim()) {
      setError('Please enter an Instagram URL');
      return;
    }

    if (!isValidInstagramUrl(url)) {
      setError('Please enter a valid Instagram URL (post, reel, story, or highlight)');
      return;
    }

    setLoading(true);
    setError('');
    setPost(null);

    try {
      const result = await fetchInstagramContentInfo(url);
      
      if (result.success && result.data) {
        setPost(result.data);
        setError('');
      } else {
        setError(result.message || 'Failed to fetch Instagram content. Make sure the URL is correct and the content is public.');
        setPost(null);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setPost(null);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type: 'video' | 'image') => {
    if (!post) return;

    try {
      let mediaUrl: string;
      let filename: string;
      
      if (type === 'video' && post.is_video && post.video_url) {
        mediaUrl = post.video_url;
        filename = `${post.owner.username}_${post.type}_${post.shortcode}.mp4`;
      } else {
        mediaUrl = post.display_url;
        filename = `${post.owner.username}_${post.type}_${post.shortcode}.jpg`;
        type = 'image';
      }

      await downloadInstagramMedia({
        media_url: mediaUrl,
        filename,
        type,
      });
    } catch (err) {
      setError('Download failed. Please try again.');
      console.error('Download error:', err);
    }
  };

  return (
    <DownloaderLayout
      title="📱 Instagram Video Downloader"
      subtitle="Download Instagram videos and reels online for free"
      onSearch={getContent}
      loading={loading}
    >
      <InstaVideoResult
        post={post}
        loading={loading}
        error={error}
        onDownload={handleDownload}
      />
    </DownloaderLayout>
  );
}

export default InstagramVideoDownloader;
