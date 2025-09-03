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
  return `${API_URL.replace('/api', '')}/api/youtube/download?url=${encodeURIComponent(url)}&itag=${itag}`;
}

export async function fetchInstagramContentInfo(instagramUrl: string) {
  const res = await fetch(`${API_URL}/instagram/content-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: instagramUrl })
  });
  if (!res.ok) throw new Error('Backend error');
  return res.json();
}

export function getInstagramDownloadUrl({ mediaUrl, type, filename }: { mediaUrl: string, type?: string, filename?: string }) {
  const params = [
    `mediaUrl=${encodeURIComponent(mediaUrl)}`,
    type ? `type=${encodeURIComponent(type)}` : null,
    filename ? `filename=${encodeURIComponent(filename)}` : null
  ].filter(Boolean).join('&');

  return `${API_URL}/instagram/download?${params}`;
}