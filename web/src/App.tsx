import React from 'react';
import './index.css';
import Navbar from './components/navbar';
import YouTubeVideoDownloader from './components/youtubevideodownloader';
import FeaturesSection from './components/FeaturesSection';
import FAQSection from './components/FAQSection';
import InstagramVideoDownloader from './components/InstaVideoDownload';


function App() {

  const faqItems = [
    { question: "Is RazTube free to use?", answer: "Yes, RazTube is completely free. You can download YouTube videos in MP3 or MP4 formats without paying anything." },
    { question: "Do I need to install any software to use RazTube?", answer: "No installation is required. RazTube works directly in your browser—just paste the YouTube link, choose format/quality, and download." },
    { question: "Can I download both video and audio?", answer: "Yes. RazTube allows you to download videos in multiple qualities (like 1080p, 720p, etc.) and also extract audio in MP3 formats." },
    { question: "Is it safe to use RazTube?", answer: "Yes, RazTube is safe. We don’t store your downloaded files or track your activity. All downloads happen directly from YouTube to your device." },
    { question: "Can I use RazTube on my phone?", answer: "Absolutely. RazTube works on mobile, tablet, and desktop. You can download videos and audio on any device with a browser." }
  ];
  return (
    <div className="w-full md:w-[80%] mx-auto">
      <Navbar />
      <YouTubeVideoDownloader />
      <InstagramVideoDownloader />
      <FeaturesSection >
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            YouTube is the biggest YouTube video sharing platform in the world, and provide an excellent experience for user to upload, view, and share videos. What it can't provide is a YouTube video download. That is why ytld is here to help you out!
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With our YouTube video downloader, you can search for and download videos, Shorts, and music tracks directly from YouTube – all for free! Choose from resolutions up to 4K or convert videos to audio formats with a single click, ensuring seamless saving and sharing. Ready to try? Paste your video link and start downloading instantly!
          </p>
        </div>
      </FeaturesSection>
      <FAQSection
        title="Frequently Asked Questions"
        items={faqItems}
      />
    </div>
  );
}

export default App;
