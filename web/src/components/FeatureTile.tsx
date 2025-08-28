import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface FeatureTileProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const FeatureTile: React.FC<FeatureTileProps> = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="bg-white flex flex-col items-center text-center space-y-4 p-8 rounded-4xl">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
        <Icon className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed max-w-sm">
        {subtitle}
      </p>
    </div>
  );
};

export default FeatureTile;