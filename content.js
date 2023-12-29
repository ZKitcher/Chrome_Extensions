const storageKey = 'KitchHub'
const LS_ID = 'LinkScan'
const YT_ID = 'YouTubeSearch'
const ExitPIP = 'exitPiP'
const MuteTabs = 'muteTabs'
const href = window.location.href;

const defaultConfig = {
    twitch: true,
    mediaDemo: true,
    pageLinkLookup: true,
    POE: true,
    quickHide: true,
    youTubeLookup: true,
    muteTabs: true,
}

let runningFeatures = defaultConfig;
getHubConfig();

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Twitch.tv

if (href.match(/Twitch.tv/gi)) {
    AdMuter()
}

function AdMuter() {
    let volume = 0.1;
    const MAIN_ID = 'Main_Stream_Video'
    const AD_BANNER_ID = 'Ad_Banner'

    setInterval(() => {
        if (!runningFeatures.twitch) return;

        const videos = document.getElementsByTagName('video');
        const mainViewer = document.getElementById(MAIN_ID);
        const adBanner = document.getElementById(AD_BANNER_ID);

        if (mainViewer) {
            volume = mainViewer.volume;
        }

        if (!videos) return;

        const vidArray = Array.from(videos);

        if (!mainViewer && vidArray.length === 1) {
            console.log('Setting ID');
            vidArray[0].id = MAIN_ID;
        }

        console.log(vidArray)
        vidArray.forEach(e => {
            if (e.id === MAIN_ID) return;
            if (!e.hasAttribute('controls')) e.setAttribute('controls', '');

            const playing = isVideoPlaying(e);
            e.volume = volume;
            e.muted = !playing;
            mainViewer.muted = playing;

            if (!adBanner && playing) {
                const title = document.querySelector('[data-a-target="stream-title"]');
                const newAdBanner = document.createElement('div');
                newAdBanner.id = AD_BANNER_ID;
                newAdBanner.innerText = '🔴 Ad in Progress';
                title.appendChild(newAdBanner);
            } else if (!mainViewer.muted && adBanner) {
                adBanner.remove();
            }
        });

    }, 200);
}

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Media Demo

let hoverTimer;

document.addEventListener('mouseover', (e) => {
    if (!runningFeatures.mediaDemo) return;

    if (e.target.tagName === 'A') {
        const HREF = e.target.getAttribute('href');
        if (!HREF) return;

        const demo = createDemo(HREF, e);
        if (demo)
            document.body.appendChild(demo);

        e.target.addEventListener('mouseleave', function mouseLeaveHandler() {
            const demo = document.querySelectorAll('#MousedOverDemo');
            demo.forEach((e) => e.remove());
            e.target.removeEventListener('mouseleave', mouseLeaveHandler);
        }, { once: true });
    }
});


function createDemo(href, event) {
    let imageDemo = null;

    if (href.match(/.jpg|.png|.gif/)) {
        imageDemo = document.createElement('div');
        imageDemo.style.backgroundImage = `url(${href})`;
    }
    if (href.match(/.gifv|.mp4/)) {
        href = href.replace('.gifv', '.mp4')
        imageDemo = document.createElement('video');
        imageDemo.autoplay = true;
        imageDemo.src = href;
    }

    if (!imageDemo) return;

    const imageLimit = 500;

    imageDemo.id = 'MousedOverDemo';
    imageDemo.style.position = 'absolute';
    imageDemo.style.top = `${event.pageY + 20}px`;
    imageDemo.style.left = `${event.pageX}px`;
    imageDemo.style.position = 'absolute';
    imageDemo.style.backgroundRepeat = 'no-repeat';
    imageDemo.style.backgroundPosition = 'center center';
    imageDemo.style.backgroundSize = 'contain';
    imageDemo.style.width = `${imageLimit}px`;
    imageDemo.style.height = `${Math.min((window.outerHeight - 50) - event.screenY, imageLimit)}px`;
    imageDemo.style.zIndex = '100';

    return imageDemo;
}

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Page Link Lookup

function linkSearch(query) {
    if (!runningFeatures.pageLinkLookup) return;

    const allLinks = document.querySelectorAll('a');

    const bestMatchLink = findBestMatchingLink(query, allLinks);

    if (bestMatchLink) {
        bestMatchLink.classList.add('LinkScan');
        bestMatchLink.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    } else {
        console.log('No Matching Link found.');
    }
}

function findBestMatchingLink(query, links) {
    let bestMatch = 25;
    let bestMatchLink = null;

    links.forEach(linkElement => {
        const linkText = linkElement.textContent;
        const match = stringSimilarityPercentage(query, linkText);
        if (match > bestMatch) {
            bestMatch = match;
            bestMatchLink = linkElement;
        }
    });

    return bestMatchLink;
};

document.addEventListener('mousedown', () => {
    const linkScan = document.querySelectorAll('.LinkScan')[0];
    if (linkScan)
        linkScan.classList.remove('LinkScan');

    // const selectedText = window.getSelection().toString().trim();
    // if (selectedText) {
    //     chrome.runtime.sendMessage({ type: LS_ID, text: selectedText });
    //     chrome.runtime.sendMessage({ type: YT_ID, text: selectedText });
    // }
});

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// YouTube Lookup

function YouTubeLookup(selected) {
    if (!runningFeatures.youTubeLookup) return;

    const query = selected.replace(/ /g, '+');
    const URL = 'https://www.youtube.com/results?search_query=' + query;
    window.open(URL, '_blank').focus();
}

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// POE

if (runningFeatures.POE) {
    if (href.match(/pathofexile.fandom/gi)) {
        window.location.href = 'https://www.poewiki.net' + window.location.pathname;
    }
    document.querySelectorAll('a[href*="pathofexile.fandom.com"]').forEach(e => {
        e.href = e.href.replace('pathofexile.fandom.com', 'www.poewiki.net');
    });
};

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Quick Hide

function quickHide() {
    if (!runningFeatures.quickHide) return;

    chrome.runtime.sendMessage({ action: ExitPIP });
}

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Mute Tabs

function muteTabs() {
    if (!runningFeatures.muteTabs) return;

    chrome.runtime.sendMessage({ action: MuteTabs });
}

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Utility

function isVideoPlaying(e) {
    return !!(e.currentTime > 0 && !e.paused && !e.ended && e.readyState > 2);
}

function stringSimilarityPercentage(str1, str2) {
    const levenshteinDistance = (s1, s2) => {
        const m = s1.length;
        const n = s2.length;
        const dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= n; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else {
                    const cost = s1.charAt(i - 1) === s2.charAt(j - 1) ? 0 : 1;
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j - 1] + cost
                    );
                }
            }
        }
        return dp[m][n];
    }

    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    const similarityPercentage = ((maxLength - distance) / maxLength) * 100;

    return parseFloat(similarityPercentage.toFixed(2));
}


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Listeners

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        if (message.id === LS_ID) {
            linkSearch(message.message);
        }
        if (message.id === YT_ID) {
            YouTubeLookup(message.message);
        }


        if (message.command) {
            switch (message.command) {
                case 'enable-feature':
                    runningFeatures[message.feature] = true;
                    break;
                case 'disable-feature':
                    runningFeatures[message.feature] = false;
                    break;
                default:
                    break;
            }

            setHubConfig();
        }

    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'F8') {
        quickHide()
    }
    if (e.key === 'F9') {
        muteTabs()
    }
});

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Hub Config

function getHubConfig() {
    try {
        chrome.storage.sync.get(null, function (result) {
            runningFeatures = { ...runningFeatures, ...result };
        });
    } catch {
        resolve(defaultConfig)
    }
}

function setHubConfig() {
    chrome.storage.sync.set(runningFeatures, function () {
        console.log('Values are set to sync storage', runningFeatures);
    });
}