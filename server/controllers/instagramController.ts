import { Request, Response } from 'express';
import {
  extractShortcode,
  fetchInstagramPost,
  downloadInstagramMedia,
  InstagramApiResponse
} from '../helper/instagramHelper';

export class InstagramController {
  static async getContentInfo(req: Request, res: Response) {
    const url = req.body.url as string;
    const shortcode = extractShortcode(url);

    if (!shortcode) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_URL',
        message: 'Shortcode could not be extracted'
      });
    }

    const result: InstagramApiResponse = await fetchInstagramPost(shortcode);
    return res.status(result.success ? 200 : 500).json(result);
  }

  static async downloadMedia(req: Request, res: Response) {
    const mediaUrl = req.query.url as string;
    const filename = req.query.filename as string | undefined;
    await downloadInstagramMedia(mediaUrl, res, filename);
  }
}
