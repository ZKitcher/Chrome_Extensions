const LS_ID = 'LinkScan'
const YT_ID = 'YouTubeSearch'


function createContextMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: YT_ID,
            title: 'YouTube Search',
            contexts: ['selection'],
        });

        chrome.contextMenus.create({
            id: LS_ID,
            title: 'Link Search',
            contexts: ['selection'],
        });
    });
    console.log('Context menu created.');
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { });

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === LS_ID) {
        const link = info.selectionText;
        chrome.tabs.sendMessage(tab.id, { id: LS_ID, message: link });
    }

    if (info.menuItemId === YT_ID) {
        const query = info.selectionText.replace(/ /g, '+');
        const URL = 'https://www.youtube.com/results?search_query=' + query;
        chrome.tabs.create({ url: URL });
    }
});


createContextMenu();
