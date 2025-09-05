import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '../utils'
import {
  Download,
  Play,
  Image,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Video,
  Camera
} from 'lucide-react';

interface InstagramContent {
  id: string;
  shortcode: string;
  type: 'post' | 'reel' | 'story' | 'highlight';
  is_video: boolean;
  video_url?: string;
  display_url: string;
  thumbnail_url: string;
  caption?: string;
  owner: {
    id: string;
    username: string;
    full_name: string;
    profile_pic_url: string;
    is_verified: boolean;
  };
  dimensions: { height: number; width: number };
  video_duration?: number;
  has_audio?: boolean;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  taken_at_timestamp: number;
  product_type?: string;
}

interface InstaVideoResultProps {
  post: InstagramContent | null;
  loading: boolean;
  error: string;
  onDownload: (type: 'video' | 'image') => void;
}

const InstaVideoResult: React.FC<InstaVideoResultProps> = ({
  post,
  loading,
  error,
  onDownload
}) => {
  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
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

  if (!post) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'reel':
        return <Video className="h-4 w-4" />;
      case 'story':
        return <Camera className="h-4 w-4" />;
      case 'highlight':
        return <Play className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'reel':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'story':
        return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
      case 'highlight':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.owner.profile_pic_url} alt={post.owner.username} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                {post.owner.full_name || post.owner.username}
                {post.owner.is_verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </CardTitle>
              <CardDescription>@{post.owner.username}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className={getContentTypeColor(post.type)}>
            {getContentTypeIcon(post.type)}
            <span className="ml-1 capitalize">{post.type}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative rounded-lg overflow-hidden bg-gray-100">
          {post.is_video ? (
            <div className="relative">
              <img
                src={post.thumbnail_url}
                alt="Video thumbnail"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: `${post.dimensions.width}/${post.dimensions.height}` }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-3">
                  <Play className="h-8 w-8 text-gray-800" />
                </div>
              </div>
              {post.video_duration && (
                <Badge variant="secondary" className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(post.video_duration)}
                </Badge>
              )}
            </div>
          ) : (
            <img
              src={post.display_url}
              alt="Instagram post"
              className="w-full h-auto object-cover"
              style={{ aspectRatio: `${post.dimensions.width}/${post.dimensions.height}` }}
            />
          )}
        </div>

        {post.caption && (
          <div className="space-y-2">
            <p className="text-sm text-gray-700 line-clamp-3">
              {post.caption}
            </p>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {post.like_count !== undefined && (
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{post.like_count.toLocaleString()}</span>
              </div>
            )}
            {post.comment_count !== undefined && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comment_count.toLocaleString()}</span>
              </div>
            )}
            {post.view_count !== undefined && (
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.view_count.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.taken_at_timestamp)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3">
          {post.is_video && post.video_url && (
            <Button
              onClick={() => onDownload('video')}
              className="flex-1"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Video
            </Button>
          )}
          <Button
            onClick={() => onDownload('image')}
            variant={post.is_video ? "outline" : "default"}
            className="flex-1"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Image
          </Button>
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <div>Dimensions: {post.dimensions.width} × {post.dimensions.height}</div>
          {post.has_audio !== undefined && (
            <div>Audio: {post.has_audio ? 'Yes' : 'No'}</div>
          )}
          <div>Content ID: {post.shortcode}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstaVideoResult;
