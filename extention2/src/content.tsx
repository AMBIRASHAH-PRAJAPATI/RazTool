import React from 'react';
import { createRoot } from 'react-dom/client';
import ContentPage from './components/ContentPage';
import './index.css';

const root = document.createElement('div');
root.id = "youtube-downloader-root";
document.body.appendChild(root);

const reactRoot = createRoot(root);
reactRoot.render(
  <React.StrictMode>
    <ContentPage />
  </React.StrictMode>
);