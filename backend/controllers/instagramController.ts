
import { Request, Response } from 'express';
import { InstagramHelper, ContentInfo } from '../helper/instagramHelper';
import axios from 'axios';

export class InstagramController {

  /**
   * Get Instagram content information (POST /content-info)
   */
  static async getContentInfo(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body;

      // Validate request
      if (!url) {
        res.status(400).json({
          success: false,
          error: 'URL is required'
        });
        return;
      }

      // Validate Instagram URL
      if (!InstagramHelper.isValidInstagramUrl(url)) {
        res.status(400).json({
          success: false,
          error: 'Invalid Instagram URL. Please provide a valid Instagram post, reel, or IGTV URL.'
        });
        return;
      }

      console.log(`Fetching content info for: ${url}`);

      // Get content information using Instagram helper
      const result: ContentInfo = await InstagramHelper.getContentInfo(url);

      if (!result.success || !result.data) {
        res.status(404).json({
          success: false,
          error: result.error || 'Failed to fetch Instagram content'
        });
        return;
      }

      // Prepare response with download URLs
      const responseData = {
        success: true,
        data: {
          id: result.data.id,
          shortcode: result.data.shortcode,
          url: result.data.url,
          caption: result.data.caption,
          owner: result.data.owner,
          stats: result.data.stats,
          timestamp: result.data.timestamp,
          media: result.data.media.map((item, index) => ({
            id: item.id,
            type: item.type,
            url: item.url,
            thumbnail: item.thumbnail,
            downloadUrl: item.downloadUrl,
            downloadLink: `/api/instagram/download?mediaUrl=${encodeURIComponent(item.downloadUrl || item.url)}&type=${item.type}&index=${index}`
          }))
        }
      };

      res.json(responseData);

    } catch (error) {
      console.error('Error in getContentInfo:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while fetching Instagram content'
      });
    }
  }

  /**
   * Download Instagram media (GET /download)
   */
  static async downloadMedia(req: Request, res: Response): Promise<void> {
    try {
      const { mediaUrl, type, filename } = req.query;

      // Validate request
      if (!mediaUrl) {
        res.status(400).json({
          success: false,
          error: 'Media URL is required'
        });
        return;
      }

      const url = decodeURIComponent(mediaUrl as string);
      console.log(`Downloading media from: ${url}`);

      // Set appropriate headers for file download
      const fileExtension = type === 'video' ? '.mp4' : '.jpg';
      const defaultFilename = filename as string || `instagram_${Date.now()}${fileExtension}`;

      res.setHeader('Content-Disposition', `attachment; filename="${defaultFilename}"`);
      res.setHeader('Content-Type', type === 'video' ? 'video/mp4' : 'image/jpeg');

      // Stream the file directly to the response
      try {
        const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'stream',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.instagram.com/',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
          },
          timeout: 30000 // 30 second timeout
        });

        // Set content length if available
        if (response.headers['content-length']) {
          res.setHeader('Content-Length', response.headers['content-length']);
        }

        // Pipe the response stream directly to the client
        response.data.pipe(res);

        response.data.on('error', (error: any) => {
          console.error('Stream error:', error);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: 'Error streaming file'
            });
          }
        });

      } catch (downloadError: any) {
        console.error('Download error:', downloadError);

        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: `Failed to download media: ${downloadError.message}`
          });
        }
      }

    } catch (error) {
      console.error('Error in downloadMedia:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Internal server error while downloading media'
        });
      }
    }
  }

  /**
   * Format bytes to human readable format
   */
  private static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Error handler middleware
   */
  static errorHandler(error: any, req: Request, res: Response): void {
    console.error('Instagram API Error:', error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}