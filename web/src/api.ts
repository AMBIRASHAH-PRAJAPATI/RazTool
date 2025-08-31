// API wrapper: points to backend! Edit if backend is hosted elsewhere
const API_URL = 'http://localhost:4000/api';

export async function fetchYoutubeVideoInfo(url: string) {
  const res = await fetch(`${API_URL}/instagram/content-info`, {
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

// Fetch Instagram post/media info (video, image, etc.)
export async function fetchInstagramContentInfo(instagramUrl: string) {
  const res = await fetch(`${API_URL}/instagram/content-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: instagramUrl })
  });
  if (!res.ok) throw new Error('Backend error');
  return res.json();
}

// Get download URL for Instagram media (streams the file via backend)
export function getInstagramDownloadUrl({ mediaUrl, type, filename }: { mediaUrl: string, type?: string, filename?: string }) {
  // Streams the file (video/image) via backend; add type/filename as needed
  const params = [
    `mediaUrl=${encodeURIComponent(mediaUrl)}`,
    type ? `type=${encodeURIComponent(type)}` : null,
    filename ? `filename=${encodeURIComponent(filename)}` : null
  ].filter(Boolean).join('&');

  return `${API_URL}/instagram/download?${params}`;
}