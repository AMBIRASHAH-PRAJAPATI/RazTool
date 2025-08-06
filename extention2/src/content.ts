function addDownloadButton() {
  const actionsContainer = document.querySelector('#top-level-buttons-computed');
  if (!actionsContainer) {
    return;
  }

  if (document.getElementById('youtube-downloader-button')) return;

  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download Video';
  downloadButton.id = 'youtube-downloader-button';
  downloadButton.style.cssText = 'padding: 8px 16px; margin-left: 8px; cursor: pointer;';

  downloadButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'setVideoUrl', url: window.location.href });
  });

  actionsContainer.insertBefore(downloadButton, actionsContainer.firstChild);
}

// Observe YouTube's dynamic page changes and inject button when needed
const observer = new MutationObserver(() => {
  addDownloadButton();
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial call in case container is already present
addDownloadButton();
