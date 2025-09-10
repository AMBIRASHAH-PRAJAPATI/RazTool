# RazTool Extension - Chrome Browser Extension

A Chrome browser extension that seamlessly integrates YouTube video downloading functionality directly into YouTube pages using the RazTool backend server.

## 🚀 Overview

RazTool Extension is a Chrome browser extension built with React and TypeScript. It injects download buttons directly into YouTube videos, allowing users to fetch video information and download content in various formats. The extension works by communicating with the local RazTool backend server for media processing.

## 🔧 Technologies Used

- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.0.4 with @crxjs/vite-plugin
- **Extension API**: Chrome Extension Manifest V3
- **Styling**: TailwindCSS 4.1.11, Tailwind Animate CSS
- **UI Icons**: Lucide React
- **Linting**: ESLint, TypeScript ESLint

## 📁 Project Structure

```
extension/
├── public/
│   ├── manifest.json     # Chrome extension manifest (Manifest V3)
│   ├── vite.svg          # Extension icon
├── src/
│   ├── background.ts     # Service worker script
│   ├── content.tsx       # Content script injected into YouTube
│   ├── popup.tsx         # Extension popup interface
│   └── utils/            # Utility functions
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite build configuration (CRX plugin)
├── .env                  # Extension environment variables
└── README.md             # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- Google Chrome browser
- **RazTool backend server running (start /server first!)**

### 1. Start the Backend Server (REQUIRED)

```bash
cd server
npm install
npm start
```

### 2. Install Extension Dependencies
```bash
cd extension
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the extension directory:
```
VITE_API_BASE_URL=http://localhost:4000
```

### 4. Build the Extension
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

### 6. Testing & Usage
- Navigate to any YouTube video page
- Download buttons should appear directly in the YouTube UI
- Click to fetch video formats and initiate downloads
- You can also use the extension popup via the extension icon in the toolbar

*Note:* The backend server **must** be running first for the extension to work.

## 🎯 Features

- **Direct YouTube Integration**: Download buttons injected into YouTube video pages
- **One-Click Downloads**: Retrieve video information and download in multiple formats straight from the page
- **Popup UI**: Access current video details and download controls from the extension's popup interface
- **Format Selection**: Choose video quality and file type before download
- **Background Processing**: Service worker handles API communication and download requests
- **User Preferences**: Store preferences and download history (via Chrome extension storage API)

## 🔌 Extension Architecture

### Chrome Manifest (V3)
Defines permissions and extension scripts:
- Service worker background (`src/background.ts`)
- Content script for YouTube (`src/content.tsx`)
- Popup interface (`index.html` -> `src/popup.tsx`)
- Permissions: `downloads`, `storage`, `activeTab`, `tabs`, `scripting`, `host_permissions` for `https://www.youtube.com/*`

### API Integration
Extension communicates with the RazTool server:
- **Get video info:**
```typescript
fetch(`${API_BASE_URL}/api/youtube/video-info`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: videoUrl }),
});
```
- **Download:**
```typescript
window.open(`${API_BASE_URL}/api/youtube/download?url=${videoUrl}&itag=${format}`);
```

### Message Passing
- Content scripts communicate with the extension's background and popup scripts for download initiation and status updates

## 🚦 Development Scripts

```bash
# Start development (hot reload)
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

1. **Extension Not Loading**
   - Ensure you built the extension with `npm run build`
   - Check Chrome DevTools console for errors
   - Verify manifest.json is valid

2. **Download Buttons Missing**
   - Backend server not running on port 4000
   - Content script has errors (check dev console)
   - YouTube page URL must match permissions

3. **API Connection Failure**
   - Verify backend server is up and API_BASE_URL is correct
   - Server must have proper CORS config

4. **Downloads Not Working**
   - Chrome download permissions required
   - Video must be available for download
   - Server endpoints must be accessible

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

- **Critical Setup Order:**
  1. Start the backend server in `/server`
  2. Build the extension
  3. Load extension in Chrome
- **Extension requires backend server**: Will not function standalone
- **Always test with various YouTube videos to confirm functionality**

## 🏗️ Contributing

1. Fork the repository
2. Add features or fix bugs via a branch
3. Test changes in Chrome with hot reload or production build
4. Submit PR with documentation updates

## 📦 Key Dependencies

- React 19.1.0, React / TypeScript
- @crxjs/vite-plugin
- TailwindCSS 4.1.11
- Lucide React icons
- Chrome Extension Manifest V3

## ⚠️ Disclaimer

For educational and personal use only. Respect YouTube's terms of service.

## 🔐 Security Considerations
- Content scripts run in isolation
- API communications should use HTTPS in production
- Follows Chrome extension security best practices