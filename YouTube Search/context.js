const YT_ID = 'YouTubeSearch'

document.addEventListener('mousedown', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.runtime.sendMessage({ type: YT_ID, text: selectedText });
    }
});
