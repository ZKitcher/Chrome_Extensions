const LS_ID = 'LinkScan'

const createdMenus = {};

const createContextMenu = () => {
    chrome.contextMenus.create({
        id: LS_ID,
        title: '🔎 Search',
        contexts: ['selection'],
    });
    console.log('Context menu created.');
    createdMenus[LS_ID] = true;
}

if (createdMenus[LS_ID]) {
    console.log('Context menu already exists.');
} else {
    createContextMenu();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === LS_ID) {
        chrome.contextMenus.update(LS_ID, {
            title: `Scan for: "${message.text}"`
        })
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === LS_ID) {
        const link = info.selectionText;
        chrome.tabs.sendMessage(tab.id, { message: link });
    }
});

