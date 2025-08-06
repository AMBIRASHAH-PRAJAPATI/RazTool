import React, { useState } from 'react';
import { fetchVideoInfo, getDownloadUrl } from './api';
import './index.css';

function humanFileSize(bytes?: number) {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

interface Format {
  itag: number;
  quality: string;
  filesize?: number;
  ext: string;
  mimeType: string;
}

interface VideoInfo {
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  viewCount: number;
  formats: Format[];
  thumbnail: string;
}

const YT_REGEX = /(youtube\.com\/watch\?|youtu\.be\/)/;

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
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

  return (
    <div className="container">
      <h1>🎓 YT Downloader Web</h1>
      <p>Enter a YouTube video URL to fetch info and download:</p>
      <div style={{display:'flex', gap:8, margin:'1em 0'}}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{flex:1, padding:8, borderRadius:6, border:'1px solid #ccc'}}
          placeholder="https://youtube.com/watch?v=..."
          type="url"
        />
        <button onClick={handleAnalyze} disabled={loading}>{loading ? '...' : 'Analyze'}</button>
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
      {video &&
      <div className="card">
        <img src={video.thumbnail} alt="thumb" style={{width:180, borderRadius:8, float:'left',marginRight:14}}/>
        <h2>{video.title}</h2>
        <p>Channel: <b>{video.channel}</b><br/>Duration: {video.duration}s | Views: {video.viewCount}</p>
        <div style={{clear:'both'}} />
        <h4>Available formats:</h4>
        <ul>
          {video.formats.map(fmt =>
            <li key={fmt.itag} style={{marginBottom:6}}>
              <a
                href={getDownloadUrl({ url, itag: fmt.itag })}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{textDecoration:'none'}}
              >
                <button>
                  Download {fmt.quality} ({fmt.ext.toUpperCase()} {fmt.mimeType?.replace(/.*\//,'')}) [{humanFileSize(fmt.filesize)}]
                </button>
              </a>
            </li>
          )}
        </ul>
      </div>
      }
      <p style={{marginTop:40,fontSize:'0.93em',color:"#555"}}>
        <b>Note:</b> Actual YouTube download is done via your own backend server (http://localhost:4000).
      </p>
    </div>
  );
}

export default App;
