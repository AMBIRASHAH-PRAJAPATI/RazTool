import React, { useState } from 'react';
import DownloaderLayout from './layout/downloaderLayout';
import { fetchInstagramContentInfo, getInstagramDownloadUrl } from '@/api';
import InstaVideoResult from './InstaVideoResult';

// Media format type for Instagram videos/images
interface InstaMedia {
    id: string;
    type: string;      // 'video' or 'image'
    url: string;
    thumbnail?: string;
    downloadUrl: string;
    caption?: string;
}

// Instagram post info type
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

// Regex to validate Instagram post, reel, or IGTV URLs
const INSTA_REGEX = /(instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_\-]+)/;

function InstagramVideoDownloader() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<InstaPostInfo | null>(null);
    const [error, setError] = useState('');

    const getContent = async (instagramUrl: string) => {
        setUrl(instagramUrl);
        setError('');
        setPost(null);

        // Optional: enable regex URL validation
        // if (!INSTA_REGEX.test(instagramUrl.trim())) {
        //   setError('Enter a valid Instagram post, reel, or IGTV URL');
        //   return;
        // }

        setLoading(true);
        try {
            const info = await fetchInstagramContentInfo(instagramUrl.trim());
            if (info.success && info.data) {
                setPost(info.data);
            } else {
                setError(info.error || 'Could not analyze Instagram link');
            }
        } catch (err) {
            setError('Could not analyze link: ' + (err as Error).message);
        }
        setLoading(false);
    };

    const handleDownload = (media: InstaMedia, index: number) => {
        const filename =
            `instagram_${media.type}_${index + 1}_${post?.shortcode}.${media.type === 'video' ? 'mp4' : 'jpg'}`;
        const downloadUrl = getInstagramDownloadUrl({
            mediaUrl: media.downloadUrl,
            type: media.type,
            filename
        });
        window.open(downloadUrl, '_blank');
    };

    return (
        <DownloaderLayout
            title="📱 Instagram Video Downloader"
            subtitle="Download Instagram videos and reels online for free"
            onSearch={getContent}
            loading={loading}
        >
            <InstaVideoResult
                post={post}
                loading={loading}
                error={error}
                onDownload={handleDownload}
            />
        </DownloaderLayout>
    );
}

export default InstagramVideoDownloader;
