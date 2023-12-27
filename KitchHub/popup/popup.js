const storageKey = 'KitchHub'

function toggleFeature(feature, enabled) {
    sendMessage({ command: enabled ? 'enable-feature' : 'disable-feature', feature: feature })
}

function sendMessage(message = {}) {
    console.log('sending')
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const elements = document.getElementsByName('toggle');
    chrome.storage.sync.get(null, function (result) {
        for (var i = 0; i < elements.length; i++) {
            elements[i]
                .addEventListener('click', function () {
                    const feature = this.getAttribute('id');
                    const checked = this.checked;
                    toggleFeature(feature, checked);
                });

            const feature = elements[i].getAttribute('id');
            elements[i].checked = result[feature] ?? true;
        }
    });
})
