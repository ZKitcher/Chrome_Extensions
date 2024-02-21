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
    craftHub: true,
}

let runningFeatures = defaultConfig;
getHubConfig();

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
// Neil.fun/infinite-craft

function craftHub() {
    if (!runningFeatures.muteTabs) return;
    if (!href.match(/neal.fun\/infinite-craft/gi)) return;

    let focusedElement = document.activeElement;
    if (focusedElement && focusedElement.tagName === "INPUT") {
        return;
    }

    const res = localStorage.getItem('infinite-craft-data');
    const parsedRes = JSON.parse(res);

    console.log(parsedRes);

    const dataList = document.createElement('div');
    dataList.style.display = 'flex';
    dataList.style.flexDirection = 'column';
    dataList.style.gap = '0.2em';

    parsedRes.elements.sort((a, b) => a.text.localeCompare(b.text)).forEach(item => {
        const listItem = document.createElement('div');
        listItem.style.display = 'flex';
        listItem.style.justifyContent = 'space-between';

        const title = document.createElement('span');
        title.textContent = item.text;

        const remove = document.createElement('button');
        remove.textContent = 'Remove';
        remove.onclick = function () {
            removeElement(item.text)
        };

        listItem.appendChild(title);
        listItem.appendChild(remove);

        dataList.appendChild(listItem);
    });


    createModal('Craft Hub', dataList)
}

function removeElement(element) {
    const res = localStorage.getItem('infinite-craft-data');
    const parsedRes = JSON.parse(res);

    const newList = parsedRes.elements.filter(e => e.text !== element);
    localStorage.setItem('infinite-craft-data', JSON.stringify({ elements: [...newList] }));
    console.log('Removing:', element);
}


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
        const subbed = window.document.body.textContent.match('Continue Sub')
        if (!runningFeatures.twitch || subbed) return;

        const videos = document.getElementsByTagName('video');
        const mainViewer = document.getElementById(MAIN_ID);
        const adBanner = document.getElementById(AD_BANNER_ID);

        if (!videos) return;

        const vidArray = Array.from(videos);

        if (!mainViewer && vidArray.length === 1) {
            console.log('Setting ID');
            vidArray[0].id = MAIN_ID;
        }

        if (mainViewer && vidArray.length === 1) {
            volume = mainViewer.volume;
        }

        vidArray.forEach(e => {
            if (e.id === MAIN_ID) return;
            if (!e.hasAttribute('controls')) e.setAttribute('controls', '');

            const playing = isVideoPlaying(e);
            e.volume = volume;
            e.muted = !playing;
            mainViewer.muted = playing;

            if (e.volume !== volume) {
                volume = e.volume;
            }

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


function createModal(header, children) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.width = '100svw';
    modal.style.height = '100svh';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.position = 'absolute';
    modal.style.zIndex = '100';
    modal.style.color = 'rgba(255, 255, 255, 0.87)';
    modal.style.backgroundColor = '#24242440';
    modal.style.padding = '0.3em';

    // Create modal content
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal-content');
    modalWrapper.style.width = '20vw';
    modalWrapper.style.height = '45vh';
    modalWrapper.style.backgroundColor = '#242424';
    modalWrapper.style.display = 'flex';
    modalWrapper.style.flexDirection = 'column';
    modalWrapper.style.padding = '0.3em';
    modalWrapper.style.borderRadius = '0.2rem';

    const modalHeader = document.createElement('div');
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.padding = '0.1em 0.2em';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.width = '100%';
    modalContent.style.height = '100%';
    modalContent.style.overflow = 'auto';
    modalContent.style.background = '#313131';
    modalContent.style.borderRadius = '0.2em';

    const Header = document.createElement('span');
    Header.innerHTML = header;
    Header.style.fontSize = '2em';

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;';
    closeButton.style.fontSize = '2em';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function () {
        modal.style.display = 'none';
    };

    modalHeader.appendChild(Header);
    modalHeader.appendChild(closeButton);
    modalWrapper.appendChild(modalHeader);
    modalContent.appendChild(children);
    modalWrapper.appendChild(modalContent);
    modal.appendChild(modalWrapper);

    document.body.appendChild(modal);

    modal.style.display = 'flex';
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
    if (e.key === 'c') {
        craftHub()
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