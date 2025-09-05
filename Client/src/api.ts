const API_URL = import.meta.env.VITE_API_URL;

export async function fetchYoutubeVideoInfo(url: string) {
  const res = await fetch(`${API_URL}/youtube/video-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error('Backend error');
  return res.json();
}

export function getYoutubeDownloadUrl({ url, itag }: { url: string, itag: number }) {
  // Backend streams the requested format
  return `${API_URL.replace('/api', '')}/api/youtube/download?url=${encodeURIComponent(url)}&itag=${itag}`;
}

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

interface ApiResponse {
  success: boolean;
  data?: InstagramContent;
  error?: string;
  message?: string;
}

interface DownloadParams {
  media_url: string;
  filename?: string;
  type: 'video' | 'image';
}

export async function fetchInstagramContentInfo(url: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/instagram/content-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Instagram content info:', error);
    return {
      success: false,
      error: 'FETCH_ERROR',
      message: error instanceof Error ? error.message : 'Failed to fetch content info',
    };
  }
}

export async function downloadInstagramMedia({ 
  media_url, 
  filename, 
  type 
}: DownloadParams): Promise<void> {
  try {
    const params = new URLSearchParams({
      media_url,
      type,
      ...(filename && { filename }),
    });

    const downloadUrl = `${API_URL}/instagram/download?${params.toString()}`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || `instagram_${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading media:', error);
    throw error;
  }
}

export function isValidInstagramUrl(url: string): boolean {
  const instagramPattern = /^https?:\/\/(www\.)?instagram\.com\/.+/;
  return instagramPattern.test(url);
}