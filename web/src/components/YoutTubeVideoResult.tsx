import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Music, Video, Eye, Clock, User } from 'lucide-react';


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

function humanFileSize(bytes?: number) {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const YouTubeVideoResults: React.FC<YouTubeVideoResultsProps> = ({
    video,
    loading,
    error,
    onDownload
}) => {
    const [activeTab, setActiveTab] = useState('video');

    // Loading State
    if (loading) {
        return (
            <Card className="w-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-full max-w-md mb-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full animate-pulse loading-bar"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                        <span>Analyzing video...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Error State
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
        <Card className="w-full shadow-lg">
            <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Left Section - Video Info */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Thumbnail */}
                        <div className="relative">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full aspect-video object-cover rounded-lg shadow-md"
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                                {video.duration}s
                            </div>
                        </div>

                        {/* Video Details */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg line-clamp-2 text-gray-900">
                                {video.title}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600">
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

                    {/* Right Section - Download Options */}
                    <div className="lg:col-span-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="video" className="flex items-center space-x-2">
                                    <Video size={16} />
                                    <span>Video</span>
                                </TabsTrigger>
                                <TabsTrigger value="audio" className="flex items-center space-x-2">
                                    <Music size={16} />
                                    <span>Audio</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Video Formats */}
                            <TabsContent value="video" className="space-y-4">
                                <h4 className="font-semibold text-lg mb-4">Video Formats</h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="font-semibold">Quality</TableHead>
                                                <TableHead className="font-semibold">Format</TableHead>
                                                <TableHead className="font-semibold">Size</TableHead>
                                                <TableHead className="text-right font-semibold">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {videoFormats.map((format) => (
                                                <TableRow key={format.itag} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <Badge variant="secondary" className="font-medium">
                                                            {format.quality}
                                                        </Badge>
                                                        {format.type === 'video-only' &&
                                                            <span className="ml-2 text-xs text-orange-700">(no audio)</span>
                                                        }
                                                        {format.type === 'combined' &&
                                                            <span className="ml-2 text-xs text-green-700">(audio+video)</span>
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-gray-600">
                                                            {format.ext.toUpperCase()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-gray-600">
                                                            {humanFileSize(format.filesize)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => onDownload(format)}
                                                            className="bg-red-500 hover:bg-red-600 text-white"
                                                            title={format.type !== 'combined' ? 'Audio not included. Merge video+audio with advanced tools.' : 'Download'}
                                                        >
                                                            <Download size={14} className="mr-1" />
                                                            Download
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>
                                </div>
                            </TabsContent>

                            {/* Audio Formats */}
                            <TabsContent value="audio" className="space-y-4">
                                <h4 className="font-semibold text-lg mb-4">Audio Formats</h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="font-semibold">Quality</TableHead>
                                                <TableHead className="font-semibold">Format</TableHead>
                                                <TableHead className="font-semibold">Size</TableHead>
                                                <TableHead className="text-right font-semibold">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {audioFormats.map((format) => (
                                                <TableRow key={format.itag} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <Badge variant="secondary" className="font-medium">
                                                            {format.quality}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-gray-600">
                                                            {format.ext.toUpperCase()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-gray-600">
                                                            {humanFileSize(format.filesize)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => onDownload(format)}
                                                            className="bg-red-500 hover:bg-red-600 text-white"
                                                        >
                                                            <Download size={14} className="mr-1" />
                                                            Download
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default YouTubeVideoResults;
