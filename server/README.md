# RazTool Server - Backend API

A robust Node.js/TypeScript backend server that provides media downloading capabilities for YouTube and Instagram content.

## 🚀 Overview

The RazTool server is a RESTful API built with Express.js and TypeScript that handles media content extraction, processing, and download functionality. It serves as the backend for both the web client and browser extension.

## 🔧 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Media Processing**:
  - `@nuclearplayer/ytdl-core` - YouTube video processing and download
  - `@distube/ytdl-core` - Alternative YouTube processing library
  - `scraper-instagram` - Instagram content extraction
  - `puppeteer` - Web scraping capabilities
- **HTTP Client**: Axios for external API requests
- **Security**: CORS middleware, Express Rate Limiting
- **Development**: ts-node, TypeScript compiler
- **Additional**: dotenv for environment variables

## 📁 Project Structure

```
server/
├── controllers/              # Request handlers
│   ├── youtubeController.ts  # YouTube API logic
│   └── instagramController.ts # Instagram API logic
├── helper/                   # Utility functions
│   └── youtubeHelper.ts     # YouTube-specific helpers
├── routes/                   # API route definitions
│   ├── youtubeRouter.ts     # YouTube routes
│   └── instagramRouter.ts   # Instagram routes
├── validator/                # Input validation middleware
├── middleware/               # Custom Express middleware
├── server.ts                 # Main server application file
├── server.js                 # Compiled JavaScript (if exists)
├── package.json             # Dependencies and scripts
├── package-lock.json        # Dependency lock file
├── pnpm-lock.yaml          # PNPM lock file
├── tsconfig.json           # TypeScript configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm package manager

### Install Dependencies

```bash
cd server
npm install
```

Or using pnpm:
```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=4000
ALLOWED_ORIGIN=http://localhost:5173,chrome-extension://your-extension-id
NODE_ENV=development
```

**Environment Variables Explained:**
- `PORT`: Server port (default: 4000)
- `ALLOWED_ORIGIN`: Comma-separated list of allowed CORS origins
- `NODE_ENV`: Environment mode (development/production)

### Start the Server

#### Development Mode
```bash
npm start
```

This runs the server using ts-node with TypeScript files directly.

#### Using ts-node directly
```bash
npx ts-node server.ts
```

The server will start on `http://localhost:4000` and display:
```
Backend server listening at http://localhost:4000
```

## 📚 API Endpoints

### Base URL
`http://localhost:4000`

### Root Endpoint
```http
GET /
```
Returns welcome message:
```json
{
  "message": "Welcome to RazTube"
}
```

### YouTube Endpoints

#### Get Video Information
```http
POST /api/youtube/video-info
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response Format:**
```json
{
  "videoId": "VIDEO_ID",
  "title": "Video Title",
  "channel": "Channel Name", 
  "duration": 180,
  "viewCount": 1000000,
  "formats": {
    "combined": [
      {
        "itag": "22",
        "quality": "720p",
        "filesize": 52428800,
        "mimeType": "video/mp4",
        "ext": "mp4",
        "url": "https://...",
        "type": "combined"
      }
    ],
    "videoOnly": [
      {
        "itag": "137", 
        "quality": "1080p",
        "filesize": 89478485,
        "mimeType": "video/mp4",
        "ext": "mp4",
        "url": "https://...",
        "type": "video-only"
      }
    ],
    "audioOnly": [
      {
        "itag": "140",
        "quality": "128kbps",
        "filesize": 4194304,
        "mimeType": "audio/mp4", 
        "ext": "mp4",
        "url": "https://...",
        "type": "audio-only"
      }
    ]
  },
  "thumbnail": "https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg"
}
```

#### Download Video
```http
GET /api/youtube/download?url=VIDEO_URL&itag=FORMAT_ITAG
```

**Parameters:**
- `url`: Full YouTube video URL (required)
- `itag`: Format identifier from video-info response (required)

**Response:**
- Stream download with appropriate headers
- Content-Disposition: attachment with generated filename
- Content-Type: video/audio MIME type based on format

### Instagram Endpoints

#### Content Information  
```http
POST /api/instagram/content-info
Content-Type: application/json

{
  "url": "https://www.instagram.com/p/POST_ID/"
}
```

**Supported URL Types:**
- Instagram Posts: `/p/POST_ID/`
- Instagram Reels: `/reel/REEL_ID/`
- Instagram Stories: `/stories/USERNAME/STORY_ID/`
- Instagram Highlights: `/s/HIGHLIGHT_ID/`

## 🎯 Features

### YouTube Functionality
- **Video Information Extraction**: Comprehensive metadata including title, channel, duration, view count
- **Multi-format Support**: 
  - Combined formats (audio + video in single file)
  - Video-only formats (for custom audio mixing)
  - Audio-only formats (music/podcast downloads)
- **Quality Selection**: Support from 144p to 4K resolution
- **Real-time Progress**: Download progress tracking and logging
- **Format Deduplication**: Intelligent filtering to remove duplicate formats
- **Container Support**: MP4, WebM, and other video containers

### Instagram Functionality
- **Content Detection**: Automatic detection of content type (post/reel/story/highlight)
- **Media Extraction**: High-quality image and video downloads
- **Profile Information**: User profile and content metadata extraction
- **Multiple Content Types**: Support for single posts, carousels, and video content

### General Features
- **CORS Support**: Configurable cross-origin resource sharing for web clients
- **Rate Limiting**: Built-in request throttling for API protection
- **Error Handling**: Comprehensive error responses with meaningful messages
- **TypeScript**: Full type safety and IntelliSense support throughout
- **Modular Architecture**: Clean separation of controllers, routes, and helpers
- **Logging**: Detailed server-side logging for debugging and monitoring

## 🔧 Configuration

### CORS Configuration
The server supports configurable CORS origins through environment variables:

```typescript
const allowedOrigins = (process.env.ALLOWED_ORIGIN || '')
  .split(',')
  .map(x => x.trim());
```

For production, update ALLOWED_ORIGIN to include your frontend domains:
```env
ALLOWED_ORIGIN=https://yourapp.com,https://www.yourapp.com
```

### Rate Limiting
Express rate limiting is implemented to prevent API abuse. Current configuration allows:
- Standard requests: Based on IP address
- Configurable limits through middleware

### TypeScript Configuration
The server uses strict TypeScript configuration:
- Target: ES2020
- Module: CommonJS  
- Strict type checking enabled
- Path mapping for clean imports

## 🚦 Development

### Project Scripts

```bash
# Start the server in development mode
npm start

# Run with direct ts-node execution  
npx ts-node server.ts

# Install dependencies
npm install

# Run tests (when implemented)
npm test
```

### Adding New Endpoints

1. **Create Controller**: Add new controller file in `controllers/`
```typescript
// controllers/newPlatformController.ts
import { Request, Response } from 'express';

export class NewPlatformController {
  static async getContentInfo(req: Request, res: Response) {
    // Implementation
  }
}
```

2. **Define Routes**: Create router in `routes/`
```typescript
// routes/newPlatformRouter.ts
import express from 'express';
import { NewPlatformController } from '../controllers/newPlatformController';

const router = express.Router();
router.post('/content-info', NewPlatformController.getContentInfo);

export default router;
```

3. **Add Validation**: Create validators in `validator/`
4. **Register Routes**: Import and use in `server.ts`

### Helper Functions
Shared functionality is organized in the `helper/` directory:
- **Format Processing**: Video format parsing and deduplication
- **Media Extraction**: Common media processing utilities  
- **URL Validation**: Platform URL validation functions
- **Error Handling**: Standardized error response helpers

## 🔍 API Testing

### Using cURL

**Test YouTube Video Info:**
```bash
curl -X POST http://localhost:4000/api/youtube/video-info \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

**Test Instagram Content:**
```bash
curl -X POST http://localhost:4000/api/instagram/content-info \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/p/EXAMPLE/"}'
```

**Test Download:**
```bash
curl -G http://localhost:4000/api/youtube/download \
  -d "url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" \
  -d "itag=22" \
  --output video.mp4
```

### Using Postman
1. Import the API collection (create one based on endpoints above)
2. Set base URL to `http://localhost:4000`
3. Test each endpoint with sample data

### Using Thunder Client (VS Code)
Install Thunder Client extension and create requests for each endpoint.

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   Error: listen EADDRINUSE :::4000
   ```
   **Solution**: Change PORT in `.env` file or kill process using port 4000

2. **CORS Errors**
   ```
   Access to fetch blocked by CORS policy
   ```
   **Solution**: Add your frontend URL to ALLOWED_ORIGIN in `.env`

3. **Video Extraction Fails**
   ```json
   {"error": "Could not fetch video info"}
   ```
   **Solution**: 
   - Check if video exists and is public
   - Verify video isn't age-restricted
   - Update ytdl-core if outdated

4. **Dependencies Installation Issues**
   ```bash
   npm ERR! peer dep missing
   ```
   **Solution**: Delete `node_modules` and `package-lock.json`, run `npm install`

5. **TypeScript Compilation Errors**
   ```bash
   TSError: Unable to compile TypeScript
   ```
   **Solution**: Check `tsconfig.json` configuration and fix type errors

### Debug Mode
Enable detailed logging:
```bash
NODE_ENV=development npm start
```

Additional debugging:
```bash
DEBUG=* npm start  # Enable all debug logs
```

### Server Health Check
Test server health:
```bash
curl http://localhost:4000/
```
Should return: `{"message":"Welcome to RazTube"}`

## 📦 Dependencies

### Production Dependencies
```json
{
  "@distube/ytdl-core": "^4.16.12",
  "@nuclearplayer/ytdl-core": "^4.16.13", 
  "@xmldom/xmldom": "^0.8.11",
  "axios": "^1.11.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.1",
  "express": "^5.1.0",
  "express-rate-limit": "^8.0.1",
  "node-fetch": "^3.3.2",
  "puppeteer": "^24.17.1",
  "scraper-instagram": "^1.0.17"
}
```

### Development Dependencies
```json
{
  "@types/cors": "^2.8.19",
  "@types/express": "^5.0.3",
  "ts-node": "^10.9.2",
  "typescript": "^5.9.2"
}
```

### Dependency Management
- Keep `@nuclearplayer/ytdl-core` updated for YouTube compatibility
- Monitor `scraper-instagram` for Instagram API changes
- Update security dependencies regularly

## ⚠️ Important Notes

### Server Startup Requirements
- **Critical**: The server MUST be running before starting the client or extension
- **Port**: Default port 4000 must be available
- **Dependencies**: All npm packages must be installed successfully
- **Environment**: Proper .env configuration required

### Platform Limitations  
- **YouTube**: Some videos may be restricted (age-gated, premium, private)
- **Instagram**: Private accounts and stories require authentication
- **Rate Limits**: Platforms may implement rate limiting

### Performance Considerations
- Video processing can be CPU-intensive
- Large video downloads consume bandwidth and storage
- Consider implementing download queues for multiple requests
- Monitor memory usage during video processing

### Security Considerations
- **Input Validation**: All URLs are validated before processing
- **CORS Configuration**: Properly configure allowed origins for production
- **Rate Limiting**: Implement appropriate rate limits per IP/user
- **Dependencies**: Keep all dependencies updated for security patches
- **Environment Variables**: Use secure environment variable management
- **Error Handling**: Don't expose internal server details in error responses

## 🔐 Production Deployment

### Environment Setup
```env
NODE_ENV=production
PORT=4000
ALLOWED_ORIGIN=https://yourapp.com,https://api.yourapp.com
```

### Security Checklist
- [ ] Configure proper CORS origins
- [ ] Implement production-grade rate limiting  
- [ ] Set up HTTPS with valid certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Implement proper error handling
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated

### Performance Optimization
- Enable gzip compression
- Implement caching where appropriate
- Use PM2 or similar for process management
- Set up load balancing if needed
- Monitor server resources and scaling needs