<script>
    // @ts-nocheck

    export let label;
    export let name;

    let enabled = true;

    function toggleFeature() {
        sendMessage({
            command: enabled ? "disable-feature" : "enable-feature",
            feature: name,
        });
        enabled = !enabled;
    }

    function sendMessage(message = {}) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }

    chrome.storage.sync.get(name, function (result) {
        enabled = result[name] ?? true;
    });
</script>

<div class="row">
    <label for={name}>{label}</label>
    <button
        style="color: {enabled ? '#64ffb9' : '#ff6464'}"
        on:click={toggleFeature}
    >
        {enabled ? "✓" : "✗"}
    </button>
</div>
