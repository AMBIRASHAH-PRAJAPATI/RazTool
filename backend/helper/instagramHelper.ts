import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
// Types for Instagram content
export interface InstagramMedia {
  id: string;
  url: string;
  type: 'video' | 'image' | 'carousel';
  thumbnail?: string;
  caption?: string;
  timestamp?: number;
  downloadUrl?: string;
  width?: number;
  height?: number;
}
export interface InstagramPost {
  id: string;
  shortcode: string;
  url: string;
  caption: string;
  media: InstagramMedia[];
  owner: {
    username: string;
    fullName: string;
    profilePic: string;
    isVerified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    views?: number;
  };
  timestamp: number;
}
export interface ContentInfo {
  success: boolean;
  data?: InstagramPost;
  error?: string;
}
export interface DownloadResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}
// Helper class for Instagram operations
export class InstagramHelper {
  private static readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private static readonly INSTAGRAM_BASE_URL = 'https://www.instagram.com';
  /**
   * Extract shortcode from Instagram URL
   */
  static extractShortcode(url: string): string | null {
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
  /**
 * Utility function to wait for a specific time
 */
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
   * Method 1: Using Puppeteer + Cheerio (Most reliable)
   */
  static async getContentInfoViaPuppeteer(url: string): Promise<ContentInfo> {
    let browser;
    try {
      const shortcode = this.extractShortcode(url);
      if (!shortcode) {
        return { success: false, error: 'Invalid Instagram URL' };
      }
  
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
  
      const page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });
      await page.setUserAgent(this.USER_AGENT);
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      });
  
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      try {
        await page.waitForSelector('article', { timeout: 15000 });
      } catch {
        try {
          await page.waitForSelector('[role="main"]', { timeout: 10000 });
        } catch {
          await page.waitForSelector('main', { timeout: 5000 });
        }
      }
      await this.delay(2000);
  
      const html = await page.content();
      const $ = cheerio.load(html);
      const media: InstagramMedia[] = [];
  
      // Only accept real URLs, not blob:
      $('video').each((_, element) => {
        const videoSrc = $(element).attr('src');
        const poster = $(element).attr('poster');
        if (videoSrc && videoSrc.startsWith('http')) {
          media.push({
            id: shortcode,
            url: videoSrc,
            type: 'video',
            thumbnail: poster,
            downloadUrl: videoSrc
          });
        }
      });
  
      if (media.length === 0) {
        $('video source').each((_, element) => {
          const videoSrc = $(element).attr('src');
          const poster = $(element).parent().attr('poster');
          if (videoSrc && videoSrc.startsWith('http')) {
            media.push({
              id: shortcode,
              url: videoSrc,
              type: 'video',
              thumbnail: poster,
              downloadUrl: videoSrc
            });
          }
        });
      }
  
      if (media.length === 0) {
        const imageSelectors = [
          'img[src*="cdninstagram"]',
          'img[src*="fbcdn"]',
          'article img',
          '[role="main"] img'
        ];
        for (const selector of imageSelectors) {
          $(selector).each((_, element) => {
            const imgSrc = $(element).attr('src');
            if (
              imgSrc &&
              imgSrc.startsWith('http') && // Only real image URLs
              !imgSrc.includes('profile') &&
              !imgSrc.includes('stories') &&
              !imgSrc.includes('avatar') &&
              imgSrc.length > 50
            ) {
              media.push({
                id: shortcode,
                url: imgSrc,
                type: 'image',
                downloadUrl: imgSrc
              });
            }
          });
          if (media.length > 0) break;
        }
      }
  
      // If no media or only blobs, fallback elsewhere (handled by getContentInfo)
      if (media.length === 0) {
        return { success: false, error: 'No usable media found (all sources were blobs or missing).' };
      }
  
      // Metadata extraction as before
      let caption = '';
      const captionSelectors = [
        'meta[property="og:title"]',
        'meta[name="description"]',
        'meta[property="og:description"]',
        '[data-testid="post-caption"]',
        'article h1',
        'article [role="button"] + div'
      ];
      for (const selector of captionSelectors) {
        const foundCaption = $(selector).attr('content') || $(selector).text();
        if (foundCaption && foundCaption.length > caption.length) {
          caption = foundCaption;
        }
      }
  
      let username = 'unknown';
      let fullName = 'unknown';
      let profilePic = '';
      const usernameMatch = html.match(/"username":"([^"]+)"/);
      if (usernameMatch) username = usernameMatch[1];
      const fullNameMatch = html.match(/"full_name":"([^"]+)"/);
      if (fullNameMatch) fullName = fullNameMatch[1];
      const profilePicMatch = html.match(/"profile_pic_url":"([^"]+)"/);
      if (profilePicMatch) profilePic = profilePicMatch[1].replace(/\u0026/g, '&');
  
      const post: InstagramPost = {
        id: shortcode,
        shortcode,
        url,
        caption: caption.substring(0, 2000),
        media,
        owner: {
          username,
          fullName,
          profilePic,
          isVerified: false
        },
        stats: {
          likes: 0,
          comments: 0
        },
        timestamp: Date.now()
      };
  
      return { success: true, data: post };
  
    } catch (error) {
      console.error('Puppeteer error:', error);
      return { success: false, error: 'Failed to fetch content' };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  
  /**
   * Method 2: Using Instagram GraphQL API (Alternative method)
   */
  static async getContentInfoViaGraphQL(url: string): Promise<ContentInfo> {
    try {
      const shortcode = this.extractShortcode(url);
      if (!shortcode) {
        return { success: false, error: 'Invalid Instagram URL' };
      }
      // Fetch the post page to get GraphQL data
      const response = await axios.get(`${this.INSTAGRAM_BASE_URL}/p/${shortcode}/`, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 15000
      });
      const $ = cheerio.load(response.data);
      // Extract JSON data from script tags
      let postData = null;
      // Try to find JSON-LD data
      $('script[type="application/ld+json"]').each((_, element) => {
        try {
          const jsonData = JSON.parse($(element).html() || '');
          if (jsonData['@type'] === 'ImageObject' || jsonData['@type'] === 'VideoObject') {
            postData = jsonData;
          }
        } catch (e) {
          // Continue searching
        }
      });
      if (!postData) {
        // Try to extract from window._sharedData or window.__additionalDataLoaded
        const scriptMatches = [
          /window\._sharedData = ({.*?});/,
          /window\.__additionalDataLoaded\([^,]+,({.*?})\)/,
          /"shortcode_media":({.*?}),"logging_page_id"/
        ];
        for (const pattern of scriptMatches) {
          const scriptContent = response.data.match(pattern);
          if (scriptContent) {
            try {
              const sharedData = JSON.parse(scriptContent[1]);
              if (sharedData.entry_data?.PostPage?.[0]?.graphql?.shortcode_media) {
                postData = sharedData.entry_data.PostPage[0].graphql.shortcode_media;
                break;
              } else if (sharedData.shortcode_media || sharedData.display_url || sharedData.video_url) {
                postData = sharedData;
                break;
              }
            } catch (e) {
              console.error('Failed to parse shared data:', e);
            }
          }
        }
      }
      if (!postData) {
        return { success: false, error: 'Could not extract post data' };
      }
      // Build media array
      const media: InstagramMedia[] = [];
      if (postData.video_url || postData.contentUrl) {
        media.push({
          id: shortcode,
          url: postData.video_url || postData.contentUrl,
          type: 'video',
          thumbnail: postData.thumbnail_src || postData.thumbnailUrl || postData.display_url,
          downloadUrl: postData.video_url || postData.contentUrl
        });
      } else if (postData.display_url || postData.url) {
        media.push({
          id: shortcode,
          url: postData.display_url || postData.url,
          type: 'image',
          downloadUrl: postData.display_url || postData.url
        });
      }
      const post: InstagramPost = {
        id: shortcode,
        shortcode,
        url,
        caption: postData.caption || postData.name || postData.edge_media_to_caption?.edges?.[0]?.node?.text || '',
        media,
        owner: {
          username: postData.author?.alternateName || postData.owner?.username || 'unknown',
          fullName: postData.author?.name || postData.owner?.full_name || 'unknown',
          profilePic: postData.author?.image || postData.owner?.profile_pic_url || '',
          isVerified: postData.owner?.is_verified || false
        },
        stats: {
          likes: postData.interactionStatistic?.userInteractionCount || postData.edge_media_preview_like?.count || 0,
          comments: postData.edge_media_to_comment?.count || 0,
          views: postData.video_view_count || 0
        },
        timestamp: postData.taken_at_timestamp ? postData.taken_at_timestamp * 1000 : Date.now()
      };
      return { success: true, data: post };
    } catch (error) {
      console.error('GraphQL method error:', error);
      return { success: false, error: 'Failed to fetch content via GraphQL' };
    }
  }
  /**
   * Method 3: Using RapidAPI (Backup method)
   */
  static async getContentInfoViaRapidAPI(url: string): Promise<ContentInfo> {
    try {
      const rapidApiKey = process.env.RAPID_API_KEY;
      if (!rapidApiKey) {
        return { success: false, error: 'RapidAPI key not configured' };
      }
      const options = {
        method: 'GET',
        url: 'https://instagram-scraper-api2.p.rapidapi.com/v1/post_info',
        params: { code_or_id_or_url: url },
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
        },
        timeout: 15000
      };
      const response = await axios.request(options);
      const data = response.data.data;
      if (!data) {
        return { success: false, error: 'No data from API' };
      }
      const media: InstagramMedia[] = [];
      if (data.video_versions && data.video_versions.length > 0) {
        media.push({
          id: data.id,
          url: data.video_versions[0].url,
          type: 'video',
          thumbnail: data.image_versions2?.candidates?.[0]?.url,
          downloadUrl: data.video_versions[0].url
        });
      } else if (data.image_versions2?.candidates?.[0]) {
        media.push({
          id: data.id,
          url: data.image_versions2.candidates[0].url,
          type: 'image',
          downloadUrl: data.image_versions2.candidates[0].url
        });
      }
      const post: InstagramPost = {
        id: data.id,
        shortcode: data.code,
        url,
        caption: data.caption?.text || '',
        media,
        owner: {
          username: data.user?.username || 'unknown',
          fullName: data.user?.full_name || 'unknown',
          profilePic: data.user?.profile_pic_url || '',
          isVerified: data.user?.is_verified || false
        },
        stats: {
          likes: data.like_count || 0,
          comments: data.comment_count || 0,
          views: data.view_count || 0
        },
        timestamp: data.taken_at * 1000
      };
      return { success: true, data: post };
    } catch (error) {
      console.error('RapidAPI error:', error);
      return { success: false, error: 'Failed to fetch content via RapidAPI' };
    }
  }
  /**
   * Main method to get content info (tries multiple methods)
   */
  static async getContentInfo(url: string): Promise<ContentInfo> {
    // 1. Try GraphQL first (faster, more reliable)
    let result = await this.getContentInfoViaGraphQL(url);
    if (result.success) return result;
  
    // 2. Try Puppeteer as backup (slower but thorough)
    result = await this.getContentInfoViaPuppeteer(url);
    if (result.success) return result;
  
    // 3. Try RapidAPI as last resort
    result = await this.getContentInfoViaRapidAPI(url);
    if (result.success) return result;
  
    return { success: false, error: 'All methods failed to fetch content' };
  }
  
  /**
   * Download media file
   */
  static async downloadMedia(mediaUrl: string, filename?: string): Promise<DownloadResponse> {
    try {
      const response = await axios({
        method: 'GET',
        url: mediaUrl,
        responseType: 'stream',
        headers: {
          'User-Agent': this.USER_AGENT,
          'Referer': 'https://www.instagram.com/'
        },
        timeout: 30000
      });
      if (!filename) {
        const urlParts = mediaUrl.split('/');
        filename = urlParts[urlParts.length - 1].split('?')[0];
        if (!filename.includes('.')) {
          filename += mediaUrl.includes('video') ? '.mp4' : '.jpg';
        }
      }
      return {
        success: true,
        downloadUrl: mediaUrl,
        filename
      };
    } catch (error) {
      console.error('Download error:', error);
      return { success: false, error: 'Failed to download media' };
    }
  }
  /**
   * Validate Instagram URL
   */
  static isValidInstagramUrl(url: string): boolean {
    const patterns = [
      /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+/,
      /^https?:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+/,
      /^https?:\/\/(www\.)?instagram\.com\/tv\/[A-Za-z0-9_-]+/
    ];
    return patterns.some(pattern => pattern.test(url));
  }
  /**
   * Get media type from URL
   */
  static getMediaType(url: string): 'video' | 'image' | 'unknown' {
    if (url.includes('/reel/') || url.includes('/tv/')) return 'video';
    if (url.includes('/p/')) return 'image'; // Could be video too
    return 'unknown';
  }
}