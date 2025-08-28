import FeatureTile from './FeatureTile';
import { 
  Settings, 
  FileText, 
  Download, 
  Gauge, 
  Monitor, 
  Smartphone 
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Settings,
      title: "Versatility in Format",
      subtitle: "Download YouTube videos to MP3, MP4, WEBM, and audio-less video files, catering to diverse needs such as music production, offline viewing, and professional editing."
    },
    {
      icon: FileText,
      title: "High Quality Options",
      subtitle: "Download YouTube videos, Shorts, and music tracks in high quality, including full HD, 1080p, 4k and even 8k."
    },
    {
      icon: Download,
      title: "Absolutely Free",
      subtitle: "Enjoy unlimited YouTube video and YouTube Shorts downloads without spending a dime. ytld is committed to providing a safe and cost-free service for all users."
    },
    {
      icon: Gauge,
      title: "Fastly Downloads",
      subtitle: "ytld offers a fast YouTube video downloading experience. Tasks are completed within seconds, providing you with high-speed downloads"
    },
    {
      icon: Monitor,
      title: "No Sign-up Required",
      subtitle: "Our safe YouTube downloader ensures that your ease of access and privacy are our top priorities. No login is required, and we do not store your personal information."
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Compatibility",
      subtitle: "Download YouTube videos instantly across Mac, Android, and Windows devices through any web browser (Chrome/Safari) with no client installation required."
    }
  ];

  return (
    <section className="py-16 px-4 bg-white" id='about'>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            YouTube is the biggest YouTube video sharing platform in the world, and provide an excellent experience for user to upload, view, and share videos. What it can't provide is a YouTube video download. That is why ytld is here to help you out!
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With our YouTube video downloader, you can search for and download videos, Shorts, and music tracks directly from YouTube – all for free! Choose from resolutions up to 4K or convert videos to audio formats with a single click, ensuring seamless saving and sharing. Ready to try? Paste your video link and start downloading instantly!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureTile
              key={index}
              icon={feature.icon}
              title={feature.title}
              subtitle={feature.subtitle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;