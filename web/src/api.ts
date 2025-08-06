// API wrapper: points to backend! Edit if backend is hosted elsewhere
const API_URL = 'http://localhost:4000/api';

export async function fetchVideoInfo(url: string) {
  const res = await fetch(`${API_URL}/video-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error('Backend error');
  return res.json();
}

export function getDownloadUrl({ url, itag }: { url: string, itag: number }) {
  // Backend streams the requested format
  return `${API_URL.replace('/api', '')}/api/download?url=${encodeURIComponent(url)}&itag=${itag}`;
}
