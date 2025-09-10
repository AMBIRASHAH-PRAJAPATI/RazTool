# RazTool Server - Backend API

A robust Node.js/TypeScript backend server that provides media downloading capabilities for YouTube and Instagram content.

## 🚀 Overview

The RazTool server is a RESTful API built with Express.js and TypeScript that handles media content extraction, processing, and download functionality. It serves as the backend for both the web client and browser extension.

## 🔧 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Media Processing**: 
  - `@nuclearplayer/ytdl-core` - YouTube video processing
  - `puppeteer` - Web scraping capabilities
- **HTTP Client**: Axios
- **Security**: CORS, Express Rate Limiting
- **Development**: ts-node, TypeScript compiler

## 📁 Project Structure

```
server/
├── controllers/           # Request handlers
│   ├── youtubeController.ts
│   └── instagramController.ts
├── helper/               # Utility functions
├── middleware/           # Express middleware
├── routes/               # API route definitions
│   ├── youtubeRouter.ts
│   └── instagramRouter.ts
├── validator/            # Input validation
├── server.ts            # Main server file
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Install Dependencies

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=4000
ALLOWED_ORIGIN=http://localhost:5173,chrome-extension://your-extension-id
```

### Start the Server

#### Development Mode
```bash
npm start
```

#### Using ts-node directly
```bash
npx ts-node server.ts
```

The server will start on `http://localhost:4000`

## 📚 API Endpoints

### Base URL
```
http://localhost:4000
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

**Response:**
```json
{
  "videoId": "VIDEO_ID",
  "title": "Video Title",
  "channel": "Channel Name",
  "duration": 180,
  "viewCount": 1000000,
  "formats": {
    "combined": [...],
    "videoOnly": [...],
    "audioOnly": [...]
  },
  "thumbnail": "https://..."
}
```

#### Download Video
```http
GET /api/youtube/download?url=VIDEO_URL&itag=FORMAT_ITAG
```

**Parameters:**
- `url`: YouTube video URL
- `itag`: Format identifier from video-info response

### Instagram Endpoints

#### Content Information
```http
POST /api/instagram/content-info
Content-Type: application/json

{
  "url": "https://www.instagram.com/p/POST_ID/"
}
```

## 🎯 Features

### YouTube Functionality
- **Video Information Extraction**: Fetch video metadata, available formats, and quality options
- **Multi-format Support**: Combined (audio+video), video-only, and audio-only downloads
- **Quality Selection**: Support for various resolutions (144p to 4K)
- **Real-time Progress**: Download progress tracking
- **Format Deduplication**: Intelligent format filtering and deduplication

### Instagram Functionality
- **Content Detection**: Support for posts, reels, stories, and highlights
- **Media Extraction**: High-quality image and video downloads
- **Profile Information**: User profile and content metadata

### General Features
- **CORS Support**: Configurable cross-origin resource sharing
- **Rate Limiting**: Built-in request rate limiting for API protection
- **Error Handling**: Comprehensive error responses and logging
- **TypeScript**: Full type safety and IntelliSense support
- **Modular Architecture**: Clean separation of controllers, routes, and helpers

## 🔧 Configuration

### CORS Configuration
The server supports configurable CORS origins through environment variables:

```typescript
const allowedOrigins = (process.env.ALLOWED_ORIGIN || '').split(',').map(x => x.trim());
```

### Rate Limiting
Express rate limiting is implemented to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';
```

## 🚦 Development

### Project Scripts

```bash
# Start the server
npm start

# Run tests (when available)
npm test
```

### Adding New Endpoints

1. Create controller in `controllers/`
2. Define routes in `routes/`
3. Add validation in `validator/`
4. Register routes in `server.ts`

### Helper Functions

Shared functionality is organized in the `helper/` directory:
- Format processing utilities
- Media extraction helpers
- Common validation functions

## 🔍 API Testing

Test the API endpoints using tools like:

- **Postman**: Import the API collection
- **curl**: Command-line testing
- **Thunder Client**: VS Code extension

Example curl command:
```bash
curl -X POST http://localhost:4000/api/youtube/video-info \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in `.env` file
2. **CORS errors**: Add your frontend URL to ALLOWED_ORIGIN
3. **Video extraction fails**: Check if the video is available and not age-restricted
4. **Dependencies issues**: Delete `node_modules` and run `npm install` again

### Debug Mode

Enable detailed logging by setting NODE_ENV:
```bash
NODE_ENV=development npm start
```

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `@nuclearplayer/ytdl-core` - YouTube processing
- `@sasmeee/igdl` - Instagram extraction
- `axios` - HTTP client
- `cors` - Cross-origin resource sharing
- `puppeteer` - Web automation

### Development Dependencies
- `typescript` - Type checking
- `ts-node` - TypeScript execution
- `@types/*` - Type definitions

## ⚠️ Important Notes

- Ensure the server is running before starting the client or extension
- Keep dependencies updated for security and performance
- Respect platform rate limits and terms of service
- Monitor server logs for errors and performance issues

## 🔐 Security Considerations

- Configure CORS properly for production
- Implement proper rate limiting
- Validate all user inputs
- Keep dependencies updated
- Use environment variables for sensitive configuration