import FAQSection from "@/components/FAQSection";
import FeaturesSection from "@/components/FeaturesSection";
import YouTubeVideoDownloader from "@/components/youtubevideodownloader";

function YouTube() {

    const faqItems = [
        { question: "Is RazTube free to use for YouTube downloads?", answer: "Yes, RazTube is completely free. You can download YouTube videos in MP4 or extract audio in MP3 format without paying anything." },
        { question: "Do I need to install any software to download from YouTube?", answer: "No installation is required. RazTube works directly in your browser—just paste the YouTube link, choose the format/quality, and download." },
        { question: "Can I download both video and audio from YouTube?", answer: "Yes. RazTube lets you download YouTube videos in multiple resolutions (such as 4K, 1080p, 720p) and also extract audio in MP3 format." },
        { question: "Is it safe to download YouTube content with RazTube?", answer: "Yes, RazTube is safe. We don’t store your downloads or track your activity. Files are transferred directly from YouTube to your device." },
        { question: "Can I use RazTube on my phone to download YouTube videos?", answer: "Absolutely. RazTube works on mobile, tablet, and desktop, so you can download YouTube videos and audio on any device with a browser." }
    ];
    return (
        <>
            <YouTubeVideoDownloader />
            <FeaturesSection >
                <div className="text-center mb-12 max-w-4xl mx-auto">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        YouTube is the biggest YouTube video sharing platform in the world, and provide an excellent experience for user to upload, view, and share videos. What it can't provide is a YouTube video download. That is why ytld is here to help you out!
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        With our YouTube video downloader, you can search for and download videos, Shorts, and music tracks directly from YouTube – all for free! Choose from resolutions up to 4K or convert videos to audio formats with a single click, ensuring seamless saving and sharing. Ready to try? Paste your video link and start downloading instantly!
                    </p>
                </div>
            </FeaturesSection>
            <FAQSection
                title="Frequently Asked Questions"
                items={faqItems}
            />
        </>
    );
}

export default YouTube;
