import FeatureTile from './FeatureTile';
import {
  Settings,
  FileText,
  Download,
  Gauge,
  Monitor,
  Smartphone
} from 'lucide-react';
import type { PropsWithChildren } from "react";

const FeaturesSection = ({ children }: PropsWithChildren) => {
  const features = [
    {
      icon: Settings,
      title: "Versatility in Format",
      subtitle: "Download YouTube videos and Instagram reels to MP3, MP4, WEBM, and audio-less video files, catering to diverse needs such as music production, offline viewing, and professional editing."
    },
    {
      icon: FileText,
      title: "High Quality Options",
      subtitle: "Download Instagram reels and YouTube videos, Shorts, and music tracks in high quality, including full HD, 1080p, 4k and even 8k."
    },
    {
      icon: Download,
      title: "Absolutely Free",
      subtitle: "Enjoy unlimited YouTube video, Shorts and Instagram reels downloads without spending a dime. ytld is committed to providing a safe and cost-free service for all users."
    },
    {
      icon: Gauge,
      title: "Fastly Downloads",
      subtitle: "ytld offers a fast YouTube video and Instagram reels downloading experience. Tasks are completed within seconds, providing you with high-speed downloads"
    },
    {
      icon: Monitor,
      title: "No Sign-up Required",
      subtitle: "Our safe YouTube and Instagram reels downloader ensures that your ease of access and privacy are our top priorities. No login is required, and we do not store your personal information."
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Compatibility",
      subtitle: "Download YouTube videos and Instagram reels instantly across Mac, Android, and Windows devices through any web browser (Chrome/Safari) with no client installation required."
    }
  ];
  return (
    <section className="py-16 px-4" id='about'>
      <div className="max-w-7xl mx-auto">
        {children}
        <h2 className="text-3xl font-bold text-center text-gray-900 my-16">
          Advantages of Using Our Video Downloader
        </h2>
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