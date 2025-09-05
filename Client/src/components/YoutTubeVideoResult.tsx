import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Music, Video, Eye, Clock, User, Download } from 'lucide-react';
import FormatTable from './FormatTable';
import { formatDuration } from '../utils'

interface Format {
    itag: number;
    quality: string;
    filesize?: number;
    ext: string;
    mimeType: string;
    url: string;
    type: string;
}

interface VideoInfo {
    videoId: string;
    title: string;
    channel: string;
    duration: string;
    viewCount: number;
    formats: {
        combined: Format[];
        videoOnly: Format[];
        audioOnly: Format[];
    };
    thumbnail: string;
}

interface YouTubeVideoResultsProps {
    video: VideoInfo | null;
    loading: boolean;
    error: string;
    onDownload: (format: Format) => void;
}

const YouTubeVideoResults: React.FC<YouTubeVideoResultsProps> = ({
    video,
    loading,
    error,
    onDownload
}) => {
    const [activeTab, setActiveTab] = useState('video');

    if (loading) {
        return (
            <Card className="w-full border-0 shadow-card animate-scale-in">
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-full max-w-md mb-6">
                        <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                            <div className="h-full bg-gradient-primary rounded-full animate-loading-bar absolute inset-0"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 text-muted-foreground">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-lg font-medium">Analyzing video...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full border-red-200 bg-red-50">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-red-700">
                        <span className="font-medium">Error:</span>
                        <span>{error}</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!video) {
        return null;
    }

    const { combined = [], videoOnly = [], audioOnly = [] } = video.formats;
    const videoFormats = [...combined, ...videoOnly];
    const audioFormats = audioOnly;

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    return (
        <Card className="w-full shadow-lg animate-fade-in">
            <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                    <div className="lg:col-span-2 p-8 border-r border-border/50 space-y-4">
                        <div className="relative group overflow-hidden rounded-xl">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Badge
                                variant='destructive'
                                className="absolute bottom-3 right-3 px-2 py-1 text-sm font-bold"
                            >
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDuration(video.duration)}
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            <h2 className="font-bold text-2xl leading-tight text-foreground line-clamp-3">
                                {video.title}
                            </h2>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <User size={16} />
                                    <span className="font-medium">{video.channel}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <Clock size={16} />
                                        <span>{video.duration}s</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Eye size={16} />
                                        <span>{formatNumber(video.viewCount)} views</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-3 p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Download Options</h3>
                            <p className="text-muted-foreground">Choose your preferred format and quality</p>
                        </div>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/80 backdrop-blur-sm">
                                <TabsTrigger
                                    value="video"
                                    className="flex items-center space-x-2 border border-border rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                                >
                                    <Video className="w-5 h-5" />
                                    <span className="font-medium">Video ({videoFormats.length})</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="audio"
                                    className="flex items-center space-x-2 border border-border rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                                >
                                    <Music className="w-5 h-5" />
                                    <span className="font-medium">Audio ({audioFormats.length})</span>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="video" className="space-y-6 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xl font-semibold text-foreground">Video Formats</h4>
                                    <Badge variant="secondary" className="bg-background/50">
                                        <Download className="w-3 h-3 mr-1" />
                                        {videoFormats.length} options
                                    </Badge>
                                </div>
                                <FormatTable formats={videoFormats} kind="video" onDownload={onDownload} />
                            </TabsContent>
                            <TabsContent value="audio" className="space-y-6 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xl font-semibold text-foreground">Audio Formats</h4>
                                    <Badge variant="secondary" className="bg-background/50">
                                        <Download className="w-3 h-3 mr-1" />
                                        {audioFormats.length} options
                                    </Badge>
                                </div>
                                <FormatTable formats={audioFormats} kind="audio" onDownload={onDownload} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default YouTubeVideoResults;