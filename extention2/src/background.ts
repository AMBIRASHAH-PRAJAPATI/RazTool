let currentVideoUrl = '';

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === 'setVideoUrl') {
    currentVideoUrl = request.url || '';
    sendResponse({ status: 'ok' });
    return true;
  }

  if (request.action === 'getVideoUrl') {
    sendResponse({ url: currentVideoUrl });
    return true;
  }
  if (request.action === 'getQualities') {
    fetch('http://localhost:4000/api/qualities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: request.url }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch qualities.');
        return response.json();
      })
      .then(data => {
        sendResponse({ qualities: data.qualities });
      })
      .catch(error => {
        console.error('Error fetching qualities:', error);
        sendResponse({ error: 'Failed to get qualities.' });
      });
    return true; // Important to keep the message channel alive
  }

  if (request.action === 'downloadVideo') {
    const { url, formatId } = request;
    const downloadUrl = `http://localhost:4000/api/download?url=${encodeURIComponent(url)}&formatId=${encodeURIComponent(formatId)}`;
    chrome.downloads.download({
      url: downloadUrl,
      filename: `youtube-video-${formatId}.mp4`,
      saveAs: true,  // optional: prompts user to choose save location
    });    
    sendResponse({ status: 'success' });
    return true;
  } 
  
  return false;
});