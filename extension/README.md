# RazTool Extension - Chrome Browser Extension

A Chrome browser extension that seamlessly integrates YouTube video downloading functionality directly into YouTube pages.

## 🚀 Overview

The RazTool Extension is a Chrome browser extension built with React and TypeScript that allows users to download YouTube videos with a single click. It injects download buttons directly into YouTube's interface and communicates with the RazTool backend server for video processing.

## 🔧 Technologies Used

- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.0.4 with @crxjs/vite-plugin
- **Extension APIs**: Chrome Extension Manifest V3
- **Styling**: 
  - TailwindCSS 4.1.11
  - Tailwind Animate CSS
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript ESLint

## 📁 Project Structure

```
extension/
├── public/
│   ├── manifest.json    # Extension manifest (Manifest V3)
│   └── vite.svg        # Extension icon
├── src/
│   ├── background.ts   # Service worker script
│   ├── content.tsx     # Content script for YouTube integration
│   ├── popup.tsx       # Extension popup interface
│   └── utils/          # Utility functions
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite build configuration with CRX plugin
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- Chrome browser
- **Running RazTool server** (IMPORTANT: Start server first!)

### Install Dependencies

```bash
cd extension
npm install
```

### Environment Variables

Create a `.env` file in the extension directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Build the Extension

```bash
npm run build
```

This creates a `dist/` folder with the compiled extension.

### Install Extension in Chrome

**IMPORTANT: Start the backend server first!**

1. Start the RazTool server:
   ```bash
   cd ../server
   npm start
   ```

2. Build the extension:
   ```bash
   cd extension
   npm run build
   ```

3. Install in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **"Developer mode"** in the top right corner
   - Click **"Load unpacked"**
   - Select the `extension/dist` folder
   - The extension should now appear in your extensions list

4. Verify Installation:
   - Go to any YouTube video page
   - You should see download buttons integrated into the YouTube interface
   - Click the extension icon in the toolbar to access the popup interface

## 🎯 Features

### Direct YouTube Integration
- **Seamless UI Integration**: Download buttons appear directly on YouTube video pages
- **One-click Downloads**: Download videos without leaving YouTube
- **Format Selection**: Choose from available video qualities and formats
- **Real-time Updates**: Buttons appear automatically on new videos

### Extension Popup
- **Video Information**: Display current video details
- **Download Options**: Quality and format selection
- **Quick Access**: Fast download without navigating away

### Background Processing
- **Service Worker**: Handles extension lifecycle and background tasks
- **Message Passing**: Communication between content scripts and popup
- **Storage**: User preferences and download history

## 🔌 Extension Architecture

### Manifest V3 Configuration (`public/manifest.json`)

```json
{
  "manifest_version": 3,
  "name": "YouTube Downloader",
  "version": "1.0.0",
  "description": "Download YouTube videos with a click.",
  "permissions": [
    "downloads",
    "storage", 
    "activeTab",
    "tabs",
    "scripting"
  ],
  "host_permissions": [
    "https://www.youtube.com/*"
  ],
  "background": {
    "service_worker": "src/background.ts",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/*"],
      "js": ["src/content.tsx"]
    }
  ],
  "action": {
    "default_popup": "index.html"
  }
}
```

### Content Script (`src/content.tsx`)
- Injects download buttons into YouTube pages
- Detects video URL changes
- Handles user interactions
- Communicates with background script

### Background Script (`src/background.ts`)
- Service worker for extension lifecycle
- Handles API communications
- Manages download requests
- Storage operations

### Popup Interface (`src/popup.tsx`)
- React-based popup UI
- Video information display
- Download controls
- Settings and preferences

## 🔌 Server Communication

The extension communicates with the RazTool server for video processing:

### API Integration
```typescript
// Get video information
const response = await fetch(`${API_BASE_URL}/api/youtube/video-info`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: videoUrl })
});

// Trigger download
window.open(`${API_BASE_URL}/api/youtube/download?url=${videoUrl}&itag=${format}`);
```

### Message Passing
```typescript
// Content script to background
chrome.runtime.sendMessage({
  action: 'downloadVideo',
  url: videoUrl,
  format: selectedFormat
});

// Background to content script
chrome.tabs.sendMessage(tabId, {
  action: 'updateDownloadButton',
  status: 'downloading'
});
```

## 🚦 Development

### Available Scripts

```bash
# Start development mode with hot reload
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview built extension
npm run preview
```

### Development Workflow

1. **Start Backend Server**: Always ensure the server is running first
2. **Build Extension**: Run `npm run build` to compile the extension
3. **Load in Chrome**: Install the built extension in Chrome
4. **Test Functionality**: Navigate to YouTube and test download features
5. **Debug**: Use Chrome DevTools for content script and popup debugging

### Hot Reload Development

For development with hot reload:
```bash
npm run dev
```

Then load the `dist/` folder in Chrome. The extension will auto-reload on changes.

## 🔧 Configuration

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ]
})
```

### Chrome Extension Permissions

The extension requires these permissions:
- `downloads`: To initiate file downloads
- `storage`: To save user preferences
- `activeTab`: To access current tab information
- `tabs`: To interact with browser tabs
- `scripting`: To inject content scripts
- `host_permissions`: To access YouTube domains

## 🐛 Troubleshooting

### Common Issues

1. **Extension not loading**: 
   - Ensure you built the extension (`npm run build`)
   - Check Chrome DevTools console for errors
   - Verify manifest.json is valid

2. **Download buttons not appearing**:
   - Make sure the backend server is running on port 4000
   - Check content script console for errors
   - Verify YouTube page URL matches manifest permissions

3. **API connection failed**:
   - Confirm server is running: `http://localhost:4000`
   - Check CORS configuration in server
   - Verify API_BASE_URL in extension environment

4. **Downloads not working**:
   - Ensure Chrome download permissions are granted
   - Check if video is available for download
   - Verify server API endpoints are responding

### Debug Mode

Enable extension debugging:
1. Right-click extension icon → "Inspect popup"
2. Go to `chrome://extensions/` → Click "Inspect views: background page"
3. On YouTube pages, open DevTools to debug content script

### Console Logging

Add debug logging to track extension behavior:
```typescript
console.log('[RazTool Extension] Action:', action, data);
```

## 📦 Build Process

### Development Build
```bash
npm run dev
```
- Enables hot reload
- Source maps for debugging
- Development optimizations

### Production Build
```bash
npm run build
```
- Minified code
- Optimized for performance
- Ready for Chrome Web Store

## 🚀 Distribution

### Chrome Web Store Preparation

1. **Build for production**: `npm run build`
2. **Create zip file**: Compress the `dist/` folder
3. **Prepare assets**: Icons, screenshots, descriptions
4. **Submit to Chrome Web Store**: Follow Google's publishing guidelines

### Manual Distribution

1. Build the extension
2. Share the `dist/` folder
3. Users load as unpacked extension
4. Provide installation instructions

## ⚠️ Important Setup Notes

### Critical Setup Order:

1. **Start Backend Server First**:
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Then Build and Install Extension**:
   ```bash
   cd extension
   npm install
   npm run build
   ```

3. **Load Extension in Chrome**: Follow installation steps above

### Server Dependency

The extension **requires** the RazTool server to be running:
- Server provides video processing APIs
- Extension cannot function without backend
- Always start server before using extension

### Testing Checklist

- [ ] Backend server running on port 4000
- [ ] Extension built and loaded in Chrome
- [ ] Download buttons appear on YouTube videos
- [ ] Popup opens and displays video information
- [ ] Downloads complete successfully
- [ ] No console errors in content script or popup

## 🔐 Security Considerations

- Content scripts run in isolated environment
- API communications use HTTPS in production
- No sensitive data stored in extension storage
- Follows Chrome extension security best practices
- Manifest V3 compliance for enhanced security