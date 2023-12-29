const LS_ID = 'LinkScan'
const YT_ID = 'YouTubeSearch'
const ExitPIP = 'exitPiP'
const MuteTabs = 'muteTabs'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === ExitPIP) {
        closePip()
    }
    if (message.action === MuteTabs) {
        toggleTabsMute()
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === LS_ID) {
        chrome.tabs.sendMessage(tab.id, { id: LS_ID, message: info.selectionText });
    }
    if (info.menuItemId === YT_ID) {
        chrome.tabs.sendMessage(tab.id, { id: YT_ID, message: info.selectionText });
    }
});

createContextMenu();

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Scripts

function toggleTabsMute() {
    chrome.tabs.query({}, (tabs) => {
        const currentMute = tabs.find(e => e.mutedInfo.muted) ?? false;
        tabs.forEach(tab => {
            chrome.tabs.update(tab.id, { muted: !currentMute });
        });
    });
}

function closePip() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    if (document.pictureInPictureElement) {
                        document.exitPictureInPicture().catch(console.error);
                    }
                }
            });
        });
    });
}

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
