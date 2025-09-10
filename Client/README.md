# RazTool Client - Web Application

A modern React-based web application for downloading YouTube and Instagram content with a clean, responsive user interface.

## 🚀 Overview

The RazTool Client is a single-page application (SPA) built with React and TypeScript that provides an intuitive web interface for downloading media content. It communicates with the RazTool server backend to process and download videos from various platforms.

## 🔧 Technologies Used

- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: 
  - TailwindCSS 4.1.12
  - Tailwind Animate CSS
- **UI Components**: 
  - Radix UI (Accordion, Avatar, Separator, Slot, Tabs)
  - Lucide React (Icons)
  - Class Variance Authority
- **Routing**: React Router DOM
- **Development**: ESLint, TypeScript ESLint

## 📁 Project Structure

```
Client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── page/           # Page components
│   │   ├── youtube.tsx
│   │   └── instagram.tsx
│   ├── lib/            # Utility libraries
│   ├── App.tsx         # Main application component
│   ├── api.ts          # API communication layer
│   ├── utils.ts        # Utility functions
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── components.json     # Shadcn UI configuration
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite build configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm, pnpm, or yarn
- Running RazTool server (see server documentation)

### Install Dependencies

```bash
cd Client
npm install
```

### Environment Variables

Create a `.env` file in the Client directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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
- **YouTube Downloads**: Video information fetching and download in multiple formats
- **Instagram Downloads**: Support for posts, reels, stories, and highlights
- **Format Selection**: Choose from various video qualities and formats

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean Interface**: Modern, minimal design with TailwindCSS
- **Component Library**: Consistent UI components using Radix UI
- **Dark/Light Mode**: Theme support (if implemented)
- **Icons**: Beautiful icons from Lucide React

### User Experience
- **Real-time Feedback**: Loading states and progress indicators
- **Error Handling**: Friendly error messages and validation
- **URL Validation**: Input validation for platform URLs
- **Download Progress**: Visual feedback during download process

## 🧩 Component Architecture

### Page Components

#### YouTube Page (`src/page/youtube.tsx`)
- URL input and validation
- Video information display
- Format selection interface
- Download functionality

#### Instagram Page (`src/page/instagram.tsx`)
- Instagram URL processing
- Content type detection
- Media preview and download

### Shared Components (`src/components/`)
- **Navbar**: Navigation component
- **UI Components**: Reusable interface elements
- **Form Elements**: Input fields, buttons, selectors

### API Layer (`src/api.ts`)
- HTTP client configuration
- API endpoint definitions
- Request/response handling
- Error management

## 🔌 API Integration

The client communicates with the RazTool server through REST API calls:

### YouTube API Calls
```typescript
// Get video information
const response = await fetch('/api/youtube/video-info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: videoUrl })
});

// Download video
window.open(`/api/youtube/download?url=${videoUrl}&itag=${selectedFormat}`);
```

### Instagram API Calls
```typescript
// Get content information
const response = await fetch('/api/instagram/content-info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: instagramUrl })
});
```

## 🎨 Styling & Theming

### TailwindCSS Configuration
The project uses TailwindCSS 4.x with:
- Custom color palette
- Responsive breakpoints
- Animation utilities
- Component variants

### Component Styling
- **Utility-first**: TailwindCSS classes for styling
- **Component Variants**: Class Variance Authority for component variants
- **Responsive Design**: Mobile-first responsive utilities
- **Animations**: Smooth transitions and hover effects

### Shadcn UI Integration
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css"
  }
}
```

## 🚦 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Development Workflow

1. **Component Development**: Create new components in `src/components/`
2. **Page Development**: Add new pages in `src/page/`
3. **API Integration**: Update `src/api.ts` for new endpoints
4. **Styling**: Use TailwindCSS utilities and Radix UI components
5. **Type Safety**: Ensure proper TypeScript typing

### Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Type checking and IntelliSense
- **React Hooks**: Modern React patterns
- **Component Composition**: Reusable component architecture

## 🔧 Configuration Files

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173
  }
})
```

### TypeScript Configuration
- `tsconfig.json`: Main TypeScript configuration
- `tsconfig.app.json`: Application-specific settings
- `tsconfig.node.json`: Node.js environment settings

## 🐛 Troubleshooting

### Common Issues

1. **Server Connection Error**: Ensure the backend server is running on port 4000
2. **CORS Issues**: Check server CORS configuration includes the client origin
3. **Build Errors**: Clear `node_modules` and reinstall dependencies
4. **Style Issues**: Ensure TailwindCSS is properly configured

### Debug Mode

Enable React DevTools and browser developer tools for debugging:
- Components tree inspection
- State and props monitoring
- Network request analysis
- Console error tracking

## 📦 Dependencies Overview

### Production Dependencies
- **react**: Core React library
- **react-dom**: React DOM rendering
- **@radix-ui/***: UI component primitives
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **eslint**: Code linting
- **@types/***: TypeScript type definitions

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Traditional Hosting**: Apache, Nginx

### Environment Configuration
Update environment variables for production:
```env
VITE_API_BASE_URL=https://your-production-server.com
```

## ⚠️ Important Notes

- Ensure the backend server is running before starting the client
- Configure API base URL properly for different environments
- Test all functionality after building for production
- Monitor console for any JavaScript errors
- Keep dependencies updated for security and performance