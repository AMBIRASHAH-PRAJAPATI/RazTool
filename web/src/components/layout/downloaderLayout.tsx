import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface DownloaderLayout {
  title?: string;
  subtitle?: string;
  onSearch?: (url: string) => void;
  children?: React.ReactNode;
}

const DownloaderLayout: React.FC<DownloaderLayout> = ({ 
  title = "Video Downloader",
  subtitle = "Download videos to MP3 and MP4 online for free",
  onSearch,
  children 
}) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (): void => {
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleClear = (): void => {
    setSearchValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  type="url"
                  placeholder="Paste your link here..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10 h-12 text-base border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              <Button 
                onClick={handleSearch}
                disabled={!searchValue.trim()}
                className="h-12 px-6 bg-red-500 hover:bg-red-600 text-white font-medium min-w-[120px]"
              >
                <Search size={18} className="mr-2" />
                Analyze
              </Button>
            </div>
            
            {/* Message Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                <span className="font-medium">Note:</span> This tool is for educational purposes only.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Children Content */}
        {children}
      </div>
    </div>
  );
};

export default DownloaderLayout;
