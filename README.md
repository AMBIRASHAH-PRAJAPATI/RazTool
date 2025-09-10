# RazTool - Multi-Platform Media Downloader

A comprehensive media downloading solution supporting YouTube and Instagram content across web, desktop, and browser extension platforms.

## 🚀 Overview

RazTool is a full-stack application that allows users to download media content from popular platforms. It consists of three main components:

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

- **Backend**: Node.js, Express, TypeScript, ytdl-core
- **Frontend**: React, TypeScript, Vite, TailwindCSS, Radix UI
- **Extension**: Chrome Extension APIs, React, TypeScript
- **Build Tools**: Vite, ESLint, PostCSS

## 🛠️ Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- Chrome browser (for extension)

### 1. Start the Backend Server

```bash
cd server
npm install
npm start
```

The server will run on `http://localhost:4000`

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
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/dist` folder

## 🔗 Component Integration

### Server → Client
The web client communicates with the backend server via REST API endpoints:
- YouTube: `http://localhost:4000/api/youtube/*`
- Instagram: `http://localhost:4000/api/instagram/*`

### Server → Extension
The browser extension also connects to the same backend server for media processing and download functionality.

### Workflow
1. **Server** provides API endpoints for media information and download
2. **Client** offers a web interface for users to input URLs and download content
3. **Extension** integrates directly into YouTube pages for one-click downloads

## 📚 API Endpoints

### YouTube
- `POST /api/youtube/video-info` - Get video information and available formats
- `GET /api/youtube/download` - Download video in specified format

### Instagram
- Available endpoints for Instagram content processing

## 🎯 Features

- **Multi-format support**: Download videos in various qualities and formats
- **Cross-platform**: Web app, browser extension, and API access
- **Modern UI**: Clean, responsive interface with TailwindCSS
- **Type-safe**: Full TypeScript implementation across all components
- **Real-time feedback**: Progress indicators and error handling

## 🚦 Development

Each component can be developed independently:

1. **Server**: Handles media processing and API logic
2. **Client**: Provides web-based user interface
3. **Extension**: Offers browser integration for YouTube

## 📖 Documentation

For detailed setup and usage instructions for each component:

- [Server Documentation](./server/README.md)
- [Client Documentation](./Client/README.md)  
- [Extension Documentation](./extension/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across all components
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## ⚠️ Disclaimer

This tool is for educational and personal use only. Please respect content creators' rights and platform terms of service when downloading media.