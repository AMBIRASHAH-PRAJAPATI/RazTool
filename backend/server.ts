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
interface VideoOut {
  itag: string;
  quality: string;
  filesize: number | undefined;
  mimeType: string;
  ext: string;
  url: string;
  type: string;
}[]

function dedupeFormats(formats: VideoOut[]) {
  const map = new Map();
  formats.forEach(f => {
    // Use quality+ext+type for uniqueness
    const key = `${f.quality}|${f.ext}|${f.type}`;
    if (!map.has(key)) {
      map.set(key, f);
    }
  });
  return Array.from(map.values());
}

app.post('/api/video-info', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string')
    return res.status(400).json({ error: 'Invalid YouTube URL' });

  try {
    const info = await ytdl.getInfo(url) as VideoInfo;

    if (!info || !info.formats) {
      return res.status(500).json({ error: 'Invalid video info received.' });
    }
    
    const combinedFormats = dedupeFormats(
      info.formats
        .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
        .map(f => ({
          itag: f.itag.toString(),
          quality: f.qualityLabel || f.quality || 'unknown',
          filesize: f.contentLength ? parseInt(f.contentLength) : undefined,
          mimeType: `video/${f.container}`,
          ext: f.container,
          url: f.url,
          type: 'combined'
        }))
    );
    
    const videoOnlyFormats = dedupeFormats(
      info.formats
        .filter(f => f.hasVideo && !f.hasAudio)
        .map(f => ({
          itag: f.itag.toString(),
          quality: f.qualityLabel || f.quality || 'unknown',
          filesize: f.contentLength ? parseInt(f.contentLength) : undefined,
          mimeType: `video/${f.container}`,
          ext: f.container,
          url: f.url,
          type: 'video-only'
        }))
    );
    
    const audioOnlyFormats = dedupeFormats(
      info.formats
        .filter(f => !f.hasVideo && f.hasAudio)
        .map(f => ({
          itag: f.itag.toString(),
          quality: f.qualityLabel || f.quality || 'unknown',
          filesize: f.contentLength ? parseInt(f.contentLength) : undefined,
          mimeType: `audio/${f.container}`,
          ext: f.container,
          url: f.url,
          type: 'audio-only'
        }))
    );

    return res.json({
      videoId: info.videoDetails.videoId,
      title: info.videoDetails.title,
      channel: info.videoDetails.author.name,
      duration: parseInt(info.videoDetails.lengthSeconds),
      viewCount: parseInt(info.videoDetails.viewCount),
      formats: {
        combined: combinedFormats,
        videoOnly: videoOnlyFormats,
        audioOnly: audioOnlyFormats
      },
      thumbnail: info.videoDetails.thumbnails && info.videoDetails.thumbnails.length
        ? info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
        : ''
    });
  } catch (err) {
    console.error('Error [video-info]:', err);
    return res.status(500).json({ error: 'Could not fetch video info' });
  }
});

app.get('/api/download', async (req, res) => {
  const url = req.query.url as string;
  const itag = req.query.itag as string;
  if (!url || !itag)
    return res.status(400).send('Missing parameters');

  try {
    // Get video info to find the requested format
    const info = await ytdl.getInfo(url);
    const format = info.formats.find(f => f.itag.toString() === itag);

    if (!format) {
      return res.status(404).send('Format not found');
    }

    // Generate filename and contentType from format
    const ext = format.container || 'mp4';
    const filename = `${info.videoDetails.videoId}_${itag}.${ext}`;
    const contentType = format.mimeType || (format.hasAudio && format.hasVideo
      ? `video/${ext}`
      : format.hasAudio
        ? `audio/${ext}`
        : `video/${ext}`);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);

    // Decide ytdl filter automatically
    let filter: 'audioandvideo' | 'audioonly' | 'videoonly';
    if (format.hasAudio && format.hasVideo) filter = 'audioandvideo';
    else if (format.hasAudio && !format.hasVideo) filter = 'audioonly';
    else filter = 'videoonly';

    const downloadStream = ytdl(url, {
      quality: itag,
      filter,
    });

    downloadStream.on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      console.log(`Download progress: ${(percent * 100).toFixed(2)}%`);
    });

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

    downloadStream.pipe(res);

  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});