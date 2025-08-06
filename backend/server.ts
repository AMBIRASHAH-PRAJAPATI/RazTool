import express from 'express';
import cors from 'cors';
import youtubedl, { exec } from 'youtube-dl-exec';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
}));
app.use(express.json());

// In yt-videos-backend/server.ts
app.post('/api/qualities', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Invalid YouTube URL' });

  try {
    const info = await youtubedl(url, { dumpSingleJson: true }) as any;
    if (typeof info === 'string' || !info.formats) {
      return res.status(500).json({ error: 'Invalid video info received.' });
    }

    const qualities = (info.formats as any[])
      .map(f => ({
        quality: f.format_note || f.resolution || f.ext || 'unknown',
        formatId: f.format_id,
        ext: f.ext,
        hasVideo: f.vcodec !== 'none',
        hasAudio: f.acodec !== 'none',
      }))
      .sort((a, b) => (b.quality || '').localeCompare(a.quality || ''));

    // Also return title and thumbnail
    res.json({
      qualities,
      title: info.title || '',
      thumbnail: info.thumbnail || ''
    });
  } catch (error) {
    console.error('Error fetching video qualities:', error);
    res.status(500).json({ error: 'Failed to get video qualities.' });
  }
});


// backend/server.js or server.ts
app.get('/api/download', (req, res) => {
  const url = req.query.url as string;
  const formatId = req.query.formatId as string;

  if (!url || !formatId) {
    return res.status(400).send('Missing parameters');
  }

  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const downloadProcess = exec(url, { format: formatId, output: '-' });

  downloadProcess.stdout?.pipe(res);

  downloadProcess.stderr?.on('data', chunk =>
    console.error('yt-dlp error:', chunk.toString())
  );

  downloadProcess.on('error', err => {
    console.error('Download process error:', err);
    if (!res.writableEnded) res.status(500).end('Download failed.');
  });

  downloadProcess.on('close', code => {
    if (!res.writableEnded) res.end();
    if (code !== 0) console.error(`yt-dlp exited with code ${code}`);
  });
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
