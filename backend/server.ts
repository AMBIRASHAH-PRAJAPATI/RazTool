import express from 'express';
import cors from 'cors';
import ytdl from '@nuclearplayer/ytdl-core';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = (process.env.ALLOWED_ORIGIN || '').split(',').map(x => x.trim());

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true); // Allow non-browser clients like Postman
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   }
// }));
app.use(cors());
app.use(express.json());

// --- TypeScript interfaces for proper type inference ---
interface VideoFormat {
  itag: number;
  format_note?: string;
  qualityLabel?: string;
  quality?: string;
  container: string;
  hasVideo: boolean;
  hasAudio: boolean;
  url: string;
  contentLength?: string;
  approxDurationMs?: string;
}

interface VideoDetails {
  videoId: string;
  title: string;
  author: {
    name: string;
  };
  lengthSeconds: string;
  viewCount: string;
  thumbnails: { url: string }[];
}

interface VideoInfo {
  videoDetails: VideoDetails;
  formats: VideoFormat[];
}

// --- /api/video-info endpoint ---
app.post('/api/video-info', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string')
    return res.status(400).json({ error: 'Invalid YouTube URL' });

  try {
    // Use ytdl.getInfo to get video information
    const info = await ytdl.getInfo(url) as VideoInfo;

    if (!info || !info.formats) {
      return res.status(500).json({ error: 'Invalid video info received.' });
    }

    // Filter formats for video+audio mp4 only
    const formats = info.formats
      .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
      .map(f => ({
        itag: f.itag.toString(),
        quality: f.qualityLabel || f.quality || 'unknown',
        filesize: f.contentLength ? parseInt(f.contentLength) : undefined,
        mimeType: `video/${f.container}`,
        ext: f.container,
        url: f.url,
      }));

    return res.json({
      videoId: info.videoDetails.videoId,
      title: info.videoDetails.title,
      channel: info.videoDetails.author.name,
      duration: parseInt(info.videoDetails.lengthSeconds),
      viewCount: parseInt(info.videoDetails.viewCount),
      formats,
      thumbnail: info.videoDetails.thumbnails && info.videoDetails.thumbnails.length
        ? info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
        : ''
    });
  } catch (err) {
    console.error('Error [video-info]:', err);
    return res.status(500).json({ error: 'Could not fetch video info' });
  }
});

// --- /api/download endpoint ---
app.get('/api/download', async (req, res) => {
  const url = req.query.url as string;
  const itag = req.query.itag as string;
  if (!url || !itag)
    return res.status(400).send('Missing parameters');

  try {
    // Get basic info for filename
    const info = await ytdl.getBasicInfo(url);
    const filename = `${info.videoDetails.videoId}_${itag}.mp4`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Create download stream with specific itag
    const downloadStream = ytdl(url, {
      quality: itag,
      filter: 'audioandvideo'
    });

    // Handle progress (optional)
    downloadStream.on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      console.log(`Download progress: ${(percent * 100).toFixed(2)}%`);
    });

    // Handle errors
    downloadStream.on('error', (err) => {
      console.error('Download stream error:', err);
      if (!res.writableEnded) {
        res.status(500).end('Download failed.');
      }
    });

    downloadStream.on('end', () => {
      if (!res.writableEnded) {
        res.end();
      }
    });

    // Pipe the stream to response
    downloadStream.pipe(res);

  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});