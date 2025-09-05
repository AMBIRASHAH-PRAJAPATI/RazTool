// If Node >= 18, global fetch; otherwise import node-fetch
import fetch from 'node-fetch';

export interface InstagramContent {
  id: string;
  shortcode: string;
  type: 'post' | 'reel';
  is_video: boolean;
  video_url?: string;
  display_url: string;
  thumbnail_url: string;
  owner: {
    id: string;
    username: string;
    full_name?: string;
    profile_pic_url?: string;
    is_verified?: boolean;
  };
  video_duration?: number;
  taken_at_timestamp?: number;
}

export interface InstagramApiResponse {
  success: boolean;
  data?: InstagramContent;
  error?: string;
  message?: string;
}

// Extract shortcode from the URL
export function extractShortcode(url: string): string | null {
  try {
    const p = new URL(url).pathname;
    const parts = p.split('/').filter(Boolean);
    if (['p', 'reel', 'tv'].includes(parts[0]) && parts[1]) return parts[1];
  } catch {}
  return null;
}

// EXACT GRAPHQL REQUEST (match repo)
export async function fetchInstagramPost(shortcode: string): Promise<InstagramApiResponse> {
  const body = new URLSearchParams({
    av: "0",
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "b",
    variables: JSON.stringify({ shortcode }),
    doc_id: "8845758582119845",
  });

  const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 11; SM-G973U)...",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Content-Type": "application/x-www-form-urlencoded",
    "Referer": `https://www.instagram.com/reel/${shortcode}/`,
    "X-IG-App-ID": "1217981644879628",
    "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
    // Do NOT send any cookies (matches their expectation)
  };

  try {
    const resp = await fetch("https://www.instagram.com/graphql/query", { method: "POST", headers, body });
    if (!resp.ok) {
      return {
        success: false,
        error: "FETCH_FAILED",
        message: `fetchInstagramPost: ${resp.status}`
      };
    }
    const json = await resp.json() as any;
    if (!json?.data?.xdt_shortcode_media) {
      return {
        success: false,
        error: "NOT_FOUND",
        message: "Media not found or blocked by Instagram"
      };
    }
    const media = json.data.xdt_shortcode_media;
    return {
      success: true,
      data: {
        id: media.id,
        shortcode: media.shortcode,
        type: media.product_type === "clips" ? "reel" : "post",
        is_video: media.is_video,
        video_url: media.video_url,
        display_url: media.display_url,
        thumbnail_url: media.thumbnail_src,
        owner: {
          id: media.owner.id,
          username: media.owner.username,
          full_name: media.owner.full_name,
          profile_pic_url: media.owner.profile_pic_url,
          is_verified: media.owner.is_verified,
        },
        video_duration: media.video_duration,
        taken_at_timestamp: media.taken_at_timestamp,
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: "FETCH_FAILED",
      message: err.message || "Unknown error"
    };
  }
}


// Download media stream
import { Response } from 'express';
import { Readable } from 'stream';

export async function downloadInstagramMedia(
  mediaUrl: string,
  res: Response,
  filename?: string
): Promise<void> {
  try {
    const resp = await fetch(mediaUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!resp.ok || !resp.body) {
      res.status(500).send('Download failed');
      return;
    }
    const contentType = resp.headers.get('Content-Type') || 'application/octet-stream';
    const ext = contentType.includes('video') ? 'mp4' : 'jpg';
    filename = filename || `instagram.${ext}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    const length = resp.headers.get('Content-Length');
    if (length) res.setHeader('Content-Length', length);

    // Convert WHATWG ReadableStream to Node.js stream
    const nodeStream = Readable.fromWeb(resp.body as any);
    nodeStream.pipe(res);
  } catch (err: any) {
    res.status(500).send('Download error' + (err.message || ''));
  }
}
