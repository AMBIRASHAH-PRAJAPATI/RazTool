import React from 'react';
import './index.css';
import Navbar from './components/navbar';
import YouTubeVideoDownloader from './components/youtubevideodownloader';
import FeaturesSection from './components/FeaturesSection';
import FAQSection from './components/FAQSection';


function App() {

  const faqItems = [
    { question: "Is RazTube free to use?", answer: "Yes, RazTube is completely free. You can download YouTube videos in MP3 or MP4 formats without paying anything." },
    { question: "Do I need to install any software to use RazTube?", answer: "No installation is required. RazTube works directly in your browser—just paste the YouTube link, choose format/quality, and download." },
    { question: "Can I download both video and audio?", answer: "Yes. RazTube allows you to download videos in multiple qualities (like 1080p, 720p, etc.) and also extract audio in MP3 formats." },
    { question: "Is it safe to use RazTube?", answer: "Yes, RazTube is safe. We don’t store your downloaded files or track your activity. All downloads happen directly from YouTube to your device." },
    { question: "Can I use RazTube on my phone?", answer: "Absolutely. RazTube works on mobile, tablet, and desktop. You can download videos and audio on any device with a browser." }
  ];  
  return (
    <>
      <Navbar />
      <YouTubeVideoDownloader />
      <FeaturesSection />
      <FAQSection
        title="Frequently Asked Questions"
        items={faqItems}
      />
    </>
  );
}

export default App;
