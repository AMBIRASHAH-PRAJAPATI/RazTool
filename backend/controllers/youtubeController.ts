import ytdl from '@nuclearplayer/ytdl-core';
import { Request, Response } from 'express';
import { VideoInfo, YoutubeHelper } from '../helper/youtubeHelper'

export class YoutubeController {
  /**
   * Get video content information 
   */
  static async getVideoInfo(req: Request, res: Response) {
    console.log("Hit /video-info");
    const { url } = req.body;
    if (!url || typeof url !== 'string')
      return res.status(400).json({ error: 'Invalid YouTube URL' });

    try {
      const info = await ytdl.getInfo(url) as VideoInfo;

      if (!info || !info.formats) {
        return res.status(500).json({ error: 'Invalid video info received.' });
      }

      const combinedFormats = YoutubeHelper.dedupeFormats(
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

      const videoOnlyFormats = YoutubeHelper.dedupeFormats(
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

      const audioOnlyFormats = YoutubeHelper.dedupeFormats(
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
  };
  /**
   * Download Youtube media 
   */
  static async downloadVideo(req: Request, res: Response) {
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
  };
}