# RazTool Client - Web Application

A modern React-based web application for downloading YouTube and Instagram content with a clean, responsive user interface.

## 🚀 Overview

RazTool Client is a single-page application (SPA) built with React and TypeScript. It provides an intuitive front-end for users to download media content from YouTube and Instagram by connecting directly to the RazTool server backend. Features include multi-format support, responsive design, and real-time feedback for media download operations.

## 🔧 Technologies Used

- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: TailwindCSS 4.1.12, Tailwind Animate CSS
- **UI Components**: Radix UI (Accordion, Avatar, Separator, Slot, Tabs), Lucide React (icons), Class Variance Authority
- **Routing**: React Router DOM
- **Development Tools**: ESLint, TypeScript ESLint

## 📁 Project Structure

```
Client/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── page/          # Page components (YouTube and Instagram)
│   ├── lib/           # Utility libraries
│   ├── App.tsx        # Main application component
│   ├── api.ts         # API communication layer
│   ├── utils.ts       # Utility functions
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles
├── components.json    # Shadcn UI configuration
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite build config
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm, pnpm, or yarn
- Running RazTool server on port 4000 (see server README)

### Install Dependencies

```bash
cd Client
npm install
```

### Environment Variables

Create a `.env` file in the Client directory:
```
VITE_API_BASE_URL=http://localhost:4000
```

### Start Development Server

```bash
npm run dev
```
Application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎯 Features

### Multi-Platform Support
- **YouTube Downloads**: Fetch video info and download in multiple formats
- **Instagram Downloads**: Support for posts, reels, stories, and highlights
- **Format Selection**: User can choose video quality and format

### Modern UI/UX
- Responsive design for desktop & mobile
- Minimal, clean interface with TailwindCSS
- Consistent component library via Radix UI
- Lucide React icon support
- Light/Dark mode (if implemented)

### User Experience
- Real-time feedback (loading states, progress)
- Robust error handling and validation
- URL validation for supported platforms
- Download progress indicator

## 🧩 Component Architecture

### Page Components

#### YouTube (`src/page/youtube.tsx`)
- URL input and validation
- Video information display
- Format selection
- Download functionality

#### Instagram (`src/page/instagram.tsx`)
- Instagram URL processing
- Content type detection
- Media preview and download

### Shared Components (`src/components/`)
- Navbar for easy navigation
- Reusable UI/form elements

### API Layer (`src/api.ts`)
- HTTP client configuration
- API endpoint logic for server communication
- Error management

## 🔌 API Integration

Communicates with RazTool backend at `VITE_API_BASE_URL`.

### Sample YouTube API Usage
```typescript
// Get video information
const response = await fetch('/api/youtube/video-info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: videoUrl }),
});

// Download video
window.open(`/api/youtube/download?url=${videoUrl}&itag=${selectedFormat}`);
```

### Sample Instagram API Usage
```typescript
const response = await fetch('/api/instagram/content-info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: instagramUrl }),
});
```

## 🎨 Styling & Theming

- Uses TailwindCSS 4.x for utility-first styling
- Animation and transitions with Tailwind Animate CSS
- Component variants managed via Class Variance Authority

## 🚦 Development Scripts

```bash
# Start development
npm run dev
# Build for production
npm run build
# Lint code
npm run lint
# Preview production build
npm run preview
```

## 🐛 Troubleshooting

1. **Server Connection Error**: Make sure backend server is running.
2. **CORS Issues**: Server's CORS config must include client origin.
3. **Build Errors**: Clear node_modules and reinstall.
4. **Style Issues**: Ensure Tailwind is setup correctly.
5. **Debug Mode**: Use React DevTools; check browser console for API/network errors.

## 📦 Key Dependencies

- React 19.1.0, React-DOM
- TailwindCSS 4.1.12
- Radix UI, Lucide React icons
- Vite 7.0.4
- ESLint, TypeScript

## 🚀 Deployment

- Static hosting: Netlify, Vercel, GitHub Pages
- CDN: Cloudflare, AWS CloudFront
- Traditional hosting: Apache, Nginx

## ⚠️ Important Notes

- Backend server must be running before starting the client.
- API base URL in `.env` must be set properly.
- Always test downloads across multiple formats/platforms after deploying.
- Keep dependencies updated for security and performance.

## 🏗️ Contributing

1. Fork repository, create feature branch
2. Add or modify components/features
3. Test via development server
4. Submit PR with documentation updates

## 📖 For More Details
See [Server Documentation](../server/README.md) and [Extension Documentation](../extension/README.md)
