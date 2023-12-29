<script>
    import logo from "./assets/logo.png";
    import hubConfig from "./hubConfig";
    import FeatureToggle from "./lib/FeatureToggle.svelte";
</script>

<main>
    <img src={logo} class="logo" alt="Vite Logo" />
    <div class="card">
        {#each hubConfig as e}
            <FeatureToggle label={e.label} name={e.id} />
        {/each}
    </div>
    <p>Enable and disabled features as needed.</p>
</main>

<style>
    .logo {
        height: 50px;
        will-change: filter;
        transition: filter 300ms;
        margin: 0.5em 0;
    }
    .logo:hover {
        filter: drop-shadow(0 0 2em #f39f2eaa);
    }
    p {
        color: #888;
    }
</style>
