import express from 'express';
import cors from 'cors';
import youtubedl, { exec } from 'youtube-dl-exec';
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
  format_id: string;
  format_note?: string;
  resolution?: string;
  ext: string;
  filesize?: number;
  filesize_approx?: number;
  url: string;
  vcodec: string;
  acodec: string;
}

interface VideoInfo {
  id: string;
  title: string;
  channel?: string;
  uploader?: string;
  duration?: number;
  view_count?: number;
  thumbnail?: string;
  thumbnails?: { url: string }[];
  formats?: VideoFormat[];
}

// --- /api/video-info endpoint ---
app.post('/api/video-info', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string')
    return res.status(400).json({ error: 'Invalid YouTube URL' });

  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    }) as VideoInfo | string; // Be explicit about possible types

    if (typeof info === 'string' || !info.formats) {
      // If info is a string or missing formats, it's invalid
      return res.status(500).json({ error: 'Invalid video info received.' });
    }

    // Now info is VideoInfo
    const formats = info.formats
      .filter(f => f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4' && f.format_note)
      .map(f => ({
        itag: f.format_id, // Always use format_id as string (yt-dlp)
        quality: f.format_note || f.resolution || f.ext || 'unknown',
        filesize: f.filesize || f.filesize_approx,
        mimeType: f.ext ? `video/${f.ext}` : undefined,
        ext: f.ext,
        url: f.url,
      }));

    return res.json({
      videoId: info.id,
      title: info.title,
      channel: info.channel || info.uploader || '',
      duration: info.duration,
      viewCount: info.view_count,
      formats,
      thumbnail: info.thumbnails && info.thumbnails.length
        ? info.thumbnails[info.thumbnails.length - 1].url
        : info.thumbnail || ''
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
    const info = await youtubedl(url, { dumpSingleJson: true }) as VideoInfo | string;
    if (typeof info === 'string' || !info.formats)
      return res.status(500).send('Invalid video info');

    const format = info.formats.find(f => f.format_id === itag);
    const filename = `${info.id || 'video'}_${itag}.${format?.ext || 'mp4'}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', format?.ext ? `video/${format.ext}` : 'video/mp4');

    // Carefully check proc.stdout is not null:
    const proc = exec(url, { format: itag, output: '-', quiet: true });
    if (proc.stdout) {
      proc.stdout.pipe(res);
    } else {
      return res.status(500).send('Failed to start download process');
    }

    proc.stderr?.on('data', chunk => console.error('yt-dlp error:', chunk.toString()));
    proc.on('error', err => {
      console.error('Download process error:', err);
      if (!res.writableEnded) res.status(500).end('Download failed.');
    });
    proc.on('close', code => {
      if (!res.writableEnded) res.end();
      if (code !== 0) console.error(`yt-dlp exited with code ${code}`);
    });
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
