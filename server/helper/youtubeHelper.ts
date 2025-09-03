// Types for youtube content
interface VideoFormat {
    itag: number;
    format_note?: string;
    qualityLabel?: string;
    quality?: string;
    container: string;
    hasVideo: boolean;
    hasAudio: boolean;
    url: string;
    contentLength?: string;
    approxDurationMs?: string;
}

interface VideoDetails {
    videoId: string;
    title: string;
    author: {
        name: string;
    };
    lengthSeconds: string;
    viewCount: string;
    thumbnails: { url: string }[];
}

export interface VideoInfo {
    videoDetails: VideoDetails;
    formats: VideoFormat[];
}
export interface VideoOut {
    itag: string;
    quality: string;
    filesize: number | undefined;
    mimeType: string;
    ext: string;
    url: string;
    type: string;
}[]

// Helper class for youtube operations
export class YoutubeHelper {
    static dedupeFormats(formats: VideoOut[]) {
        const map = new Map();
        formats.forEach(f => {
            // Use quality+ext+type for uniqueness
            const key = `${f.quality}|${f.ext}|${f.type}`;
            if (!map.has(key)) {
                map.set(key, f);
            }
        });
        return Array.from(map.values());
    }
}