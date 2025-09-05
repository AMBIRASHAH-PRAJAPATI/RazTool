import InstagramVideoDownloader from '@/components/InstaVideoDownload';
import FeaturesSection from '@/components/FeaturesSection';
import FAQSection from '@/components/FAQSection';

function Instagram() {

  const faqItems = [
    { question: "Is RazTube free to use for Instagram downloads?", answer: "Yes, RazTube is completely free. You can download Instagram Reels, videos, and photos without any charges." },
    { question: "Do I need to install any software to download from Instagram?", answer: "No installation is needed. RazTube works directly in your browser—just paste the Instagram link and download instantly." },
    { question: "Can I download both Reels and photos?", answer: "Yes. RazTube lets you download Instagram Reels, videos, and photos in high quality with just one click." },
    { question: "Is it safe to download Instagram content with RazTube?", answer: "Absolutely. RazTube is safe—we don’t store your files or track your activity. All downloads happen directly from Instagram to your device." },
    { question: "Can I use RazTube on my phone for Instagram downloads?", answer: "Yes, RazTube works perfectly on mobile, tablet, and desktop. You can save Instagram content on any device with a browser." }
  ];
  return (
    <>
      <InstagramVideoDownloader />
      <FeaturesSection >
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Instagram is one of the most popular platforms for sharing photos, Reels, and videos worldwide. However, it doesn't allow users to directly download content. That's where RazTube comes in to make things easier for you!
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With our Instagram downloader, you can save Reels, videos, and images directly to your device completely free. Download content in high quality within seconds and enjoy offline access anytime. Just paste the Instagram link and start downloading instantly!
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

export default Instagram;
