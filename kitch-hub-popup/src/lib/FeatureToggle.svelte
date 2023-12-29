<script>
    // @ts-nocheck
    export let label;
    export let name;
    let enabled = true;

    function toggleFeature() {
        enabled = !enabled;

        sendMessage({
            command: enabled ? "enable-feature" : "disable-feature",
            feature: name,
        });
    }

    function sendMessage(message = {}) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }

    if (chrome.storage) {
        chrome.storage.sync.get(name, function (result) {
            enabled = result[name] ?? true;
        });
    }
</script>

<div class="row">
    <label for={name}>{label}</label>
    <button
        class="btn {enabled ? 'enabled' : 'disabled'}"
        on:click={toggleFeature}
    >
        <div
            class="toggle"
            style="transform: translateX({enabled ? '' : '-'}50%);"
        >
            <span style="color: #64ffb9"> <div>✓</div> </span>
            <span style="color: #ff6464"> <div>✗</div> </span>
        </div>
    </button>
</div>

<style>
    .enabled:hover {
        border-color: #64ffa5;
        background-color: #64ff8b50;
    }
    .disabled:hover {
        border-color: #ff6464;
        background-color: #ff646450;
    }
    .btn {
        width: 3.4em;
        overflow: hidden;
        display: flex;
        justify-content: center;
    }
    .toggle {
        min-width: 5em;
        white-space: nowrap;
        display: flex;
        justify-content: space-between;
        transition: all 0.25s;
    }
    .toggle > span {
        width: 0;
        display: flex;
        justify-content: center;
    }
</style>
