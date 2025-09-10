# RazTool - Multi-Platform Media Downloader

A comprehensive media downloading solution supporting YouTube and Instagram content across web, desktop, and browser extension platforms.

## 🚀 Overview

RazTool is a full-stack application that allows users to download media content from popular platforms. It consists of three main components that work together to provide a seamless downloading experience:

- **Server**: Node.js/TypeScript backend API for media processing
- **Client**: React web application with modern UI
- **Extension**: Chrome browser extension for seamless integration

## 📁 Project Structure

```
RazTool/
├── server/          # Backend API (Node.js + TypeScript)
├── Client/          # Web application (React + TypeScript)
├── extension/       # Chrome browser extension (React + TypeScript)
└── README.md        # This file
```

## 🔧 Technologies Used

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Media Processing**: @nuclearplayer/ytdl-core, scraper-instagram
- **Security**: CORS, Express Rate Limiting
- **HTTP Client**: Axios

### Frontend (Client)
- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: TailwindCSS 4.1.12
- **UI Components**: Radix UI, Lucide React
- **Routing**: React Router DOM

### Extension
- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.0.4 with @crxjs/vite-plugin
- **Extension API**: Chrome Extension Manifest V3
- **Styling**: TailwindCSS 4.1.11

## 🛠️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- Chrome browser (for extension)

### 1. Start the Backend Server (Required First!)

```bash
cd server
npm install
npm start
```

The server will run on `http://localhost:4000`

**Important**: The server must be running before starting the client or extension.

### 2. Launch the Web Client

```bash
cd Client
npm install
npm run dev
```

The web app will be available at `http://localhost:5173`

### 3. Install the Browser Extension

```bash
cd extension
npm install
npm run build
```

Then load the extension in Chrome:

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension/dist` folder
4. The extension will appear in your extensions list

## 🔗 Component Integration & Workflow

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │    │   Extension     │    │     Server      │
│   (React SPA)   │    │ (Chrome Ext.)   │    │ (Node.js API)   │
│                 │    │                 │    │                 │
│ Port: 5173      │    │ Injected into   │    │ Port: 4000      │
│                 │    │ YouTube pages   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                │
                         API Endpoints:
                    /api/youtube/video-info
                    /api/youtube/download
                    /api/instagram/content-info
```

### Communication Flow

1. **Server** provides REST API endpoints for media information and download
2. **Client** offers a web interface for users to input URLs and download content
3. **Extension** integrates directly into YouTube pages for one-click downloads
4. Both Client and Extension communicate with the same Server endpoints

### Server → Client Communication
The web client communicates with the backend server via REST API endpoints:
- YouTube: `http://localhost:4000/api/youtube/*`
- Instagram: `http://localhost:4000/api/instagram/*`

### Server → Extension Communication
The browser extension also connects to the same backend server for media processing and download functionality through content scripts and popup interface.

## 📚 API Endpoints

### Base URL
`http://localhost:4000`

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

### Multi-Platform Support
- **YouTube Downloads**: Video information fetching and download in multiple formats
- **Instagram Downloads**: Support for posts, reels, stories, and highlights
- **Format Selection**: Choose from various video qualities and formats

### Cross-Platform Access
- **Web Application**: Full-featured web interface for any browser
- **Browser Extension**: Seamless integration directly into YouTube pages
- **API Access**: Direct API access for custom integrations

### Technical Features
- **Type-Safe**: Full TypeScript implementation across all components
- **Modern UI**: Clean, responsive interface with TailwindCSS and Radix UI
- **Real-time Feedback**: Progress indicators and comprehensive error handling
- **Modular Architecture**: Clean separation of concerns across components

## 🚦 Development

Each component can be developed independently:

1. **Server**: Start with `npm start` in `/server` directory
2. **Client**: Start with `npm run dev` in `/Client` directory  
3. **Extension**: Build with `npm run build` in `/extension` directory

### Development Workflow
1. Always start the server first (`cd server && npm start`)
2. Start the client for web development (`cd Client && npm run dev`)
3. Build and load the extension for browser integration
4. Test functionality across all three components

## 🔧 Environment Configuration

### Server (.env)
```env
PORT=4000
ALLOWED_ORIGIN=http://localhost:5173,chrome-extension://your-extension-id
```

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:4000
```

### Extension (.env)
```env
VITE_API_BASE_URL=http://localhost:4000
```

## 📖 Individual Component Documentation

For detailed setup and usage instructions for each component, refer to the individual README files:

- **[Server Documentation](./server/README.md)**: Backend API setup, endpoints, and configuration
- **[Client Documentation](./Client/README.md)**: Web application setup, components, and development
- **[Extension Documentation](./extension/README.md)**: Browser extension installation, development, and Chrome setup

## 🐛 Troubleshooting

### Common Issues

1. **Server Connection Errors**
   - Ensure the backend server is running on port 4000
   - Check if the port is already in use
   - Verify CORS configuration includes client origins

2. **Client/Extension Not Working**
   - Confirm the server is running first
   - Check API_BASE_URL environment variables
   - Verify no network/firewall blocking localhost:4000

3. **Extension Installation Issues**
   - Build the extension first (`npm run build`)
   - Enable Developer Mode in Chrome
   - Check Chrome console for errors

### Debug Mode
Enable detailed logging by setting NODE_ENV:
```bash
NODE_ENV=development npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test across all components (server, client, extension)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

### Development Guidelines
- Maintain TypeScript typing across all components
- Follow existing code structure and naming conventions
- Test functionality in both web client and browser extension
- Update documentation for any new features or API changes

## 📦 Dependencies Summary

### Server
- Express.js, TypeScript, @nuclearplayer/ytdl-core, scraper-instagram
- CORS, axios, puppeteer, express-rate-limit

### Client  
- React 19, TypeScript, Vite 7, TailwindCSS 4
- Radix UI, Lucide React, React Router DOM

### Extension
- React 19, TypeScript, Chrome Extension APIs
- @crxjs/vite-plugin, TailwindCSS, Lucide React

## 📄 License

This project is licensed under the ISC License.

## ⚠️ Important Notes

- **Server Dependency**: Both the client and extension require the server to be running
- **Setup Order**: Always start the server before using the client or extension
- **Chrome Extensions**: Extensions require loading as "unpacked" for development
- **CORS Configuration**: Server must allow origins for both client and extension
- **Port Configuration**: Default ports are 4000 (server) and 5173 (client)

## ⚠️ Disclaimer

This tool is for educational and personal use only. Please respect content creators' rights and platform terms of service when downloading media content. Users are responsible for ensuring their usage complies with applicable laws and platform policies.

## 🔐 Security Considerations

- Configure CORS properly for production environments
- Keep all dependencies updated for security patches
- Validate all user inputs on both client and server
- Use HTTPS in production deployments
- Follow Chrome extension security best practices for the extension component