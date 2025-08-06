// Extension content script for YouTube - calls backend for info!

const BACKEND = "http://localhost:4000";

// Add button on YouTube video pages
function createDownloadButton() {
  if (document.getElementById('edu-ytdl-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'edu-ytdl-btn';
  btn.textContent = '📚 Download (edu)';
  Object.assign(btn.style, {
    position: 'fixed',
    top: '110px',
    right: '20px',
    zIndex: 99999,
    background: '#005ae0',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px #0003',
    cursor: 'pointer'
  });

  btn.onclick = async () => {
    const url = window.location.href;
    try {
      const resp = await fetch(`${BACKEND}/api/video-info`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ url })
      });
      if (!resp.ok) throw new Error('Backend error');
      const info = await resp.json();
      if (!info.formats || !info.formats.length) {
        alert('No formats available!');
        return;
      }
      // Ask user for format choice
      const menu = info.formats.map((f, i) =>
        `${i+1}. ${f.quality} (${f.ext})`).join('\n');
      const choice = prompt(`Select format:\n${menu}`, '1');
      const idx = Math.max(0, Math.min(info.formats.length-1, (parseInt(choice)||1)-1));
      const chosen = info.formats[idx];
      chrome.runtime.sendMessage({
        action: 'downloadEducationalContent',
        url,
        itag: chosen.itag,
        filename: `yt_${info.videoId}_${info.title.replace(/[^a-z0-9]/gi,'_').slice(0,40)}.${chosen.ext}`
      });
      alert('Your download is starting!');
    } catch (err) {
      alert('Failed to analyze video.');
    }
  };

  document.body.appendChild(btn);
}

function delayInject() {
  // Wait then inject (SPA navigation)
  setTimeout(createDownloadButton, 1200);
}

let oldHref = location.href;
setInterval(() => {
  if (location.href !== oldHref) {
    oldHref = location.href;
    delayInject();
  }
}, 1500);

if (document.readyState === 'complete' || document.readyState === 'interactive')
  delayInject();
else
  window.addEventListener('DOMContentLoaded', delayInject);
