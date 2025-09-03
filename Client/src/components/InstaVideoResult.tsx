import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Your media/item type
interface InstaMedia {
  id: string;
  type: string;      // 'video' or 'image'
  url: string;
  thumbnail?: string;
  downloadUrl: string;
  caption?: string;
}

// Your post info type
interface InstaPostInfo {
  id: string;
  shortcode: string;
  url: string;
  caption: string;
  owner: {
    username: string;
    fullName: string;
    profilePic?: string;
    isVerified?: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    views?: number;
  };
  media: InstaMedia[];
  timestamp: number;
}

interface Props {
  post: InstaPostInfo | null;
  loading: boolean;
  error: string;
  onDownload: (media: InstaMedia, index: number) => void;
}

const InstaVideoResults: React.FC<Props> = ({
  post,
  loading,
  error,
  onDownload,
}) => {
  if (loading) {
    // Show skeleton cards while loading
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-700 font-semibold">
        {error}
      </div>
    );
  }
  if (!post || !post.media?.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Paste a valid Instagram post, reel, or IGTV link to see results.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall post info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <img
              src={post.owner.profilePic || '/avatar.svg'}
              alt={post.owner.username}
              className="w-8 h-8 rounded-full border"
            />
            @{post.owner.username}
            {post.owner.isVerified && (
              <span className="ml-1 text-blue-500">✔️</span>
            )}
          </CardTitle>
          <CardDescription>
            {post.caption?.substring(0, 90) || "No caption."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <div>❤️ {post.stats.likes } likes</div>
            <div>💬 {post.stats.comments } comments</div>
            {post.stats.views !== undefined && (
              <div>👁 {post.stats.views} views</div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Media items */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {post.media.map((media, i) => (
          <Card key={media.id + i}>
            <CardHeader>
              <CardTitle>
                {media.type === 'video' ? 'Video' : 'Image'} #{i + 1}
              </CardTitle>
              {media.caption && (
                <CardDescription>
                  {media.caption.substring(0, 30)}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {media.type === 'video' ? (
                <video
                  src={media.url}
                  poster={media.thumbnail}
                  controls
                  className="w-full h-56 rounded-lg border shadow-sm"
                />
                // If you use shadcn/ui's VideoPlayer, swap `<video>` as below:
                // <VideoPlayer src={media.url} thumbnail={media.thumbnail} />
              ) : (
                <img
                  src={media.url}
                  alt={`Instagram content #${i + 1}`}
                  className="w-full h-56 object-cover rounded-lg border shadow-sm"
                  loading="lazy"
                />
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="default"
                onClick={() => onDownload(media, i)}
              >
                ⬇️ Download {media.type === 'video' ? 'Video' : 'Image'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstaVideoResults;
