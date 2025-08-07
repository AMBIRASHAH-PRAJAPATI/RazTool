import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import ContentPage from './components/ContentPage';
import './index.css';

const root = document.createElement('div');
root.id = "youtube-downloader-root";
document.body.appendChild(root);

createRoot(root).render(
  <StrictMode>
    <ContentPage />
  </StrictMode>
);