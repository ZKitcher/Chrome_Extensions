const LS_ID = 'LinkScan'
const YT_ID = 'YouTubeSearch'

const stringSimilarityPercentage = (str1, str2) => {
    function levenshteinDistance(s1, s2) {
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

const findBestMatchingLink = (query, links) => {
    let bestMatch = 25;
    let bestMatchLink = null;

    links.forEach(linkElement => {
        const linkText = linkElement.textContent;
        const match = calculateStringSimilarity(query, linkText);
        if (match > bestMatch) {
            bestMatch = match;
            bestMatchLink = linkElement;
        }
    });

    return bestMatchLink;
}

const createDemo = (href, event) => {
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

    if (!imageDemo) {
        console.log('returning')
        return;
    }

    console.log(event)

    imageDemo.id = 'MousedOverDemo';
    imageDemo.style.position = 'absolute';
    imageDemo.style.top = `${event.pageY + 20}px`;
    imageDemo.style.left = `${event.pageX}px`;
    imageDemo.style.position = 'absolute';
    imageDemo.style.backgroundRepeat = 'no-repeat';
    imageDemo.style.backgroundPosition = 'center center';
    imageDemo.style.backgroundSize = 'contain';
    imageDemo.style.width = '400px';
    imageDemo.style.height = '400px';
    imageDemo.style.zIndex = '100';

    return imageDemo;
}


document.addEventListener('mouseover', function (e) {
    if (e.target.tagName === "A") {
        console.log(e);

        const HREF = e.target.getAttribute('href');

        if (!HREF) return;

        const demo = createDemo(HREF, e);

        if (demo)
            document.body.appendChild(demo);

        e.target.addEventListener("mouseleave", function mouseLeaveHandler() {
            const demo = document.querySelectorAll('#MousedOverDemo');
            demo.forEach((e) => e.remove());
            e.target.removeEventListener("mouseleave", mouseLeaveHandler);
        }, { once: true });
    }


});

document.addEventListener('mousedown', () => {
    const linkScan = document.querySelectorAll('.LinkScan')[0];
    if (linkScan)
        linkScan.classList.remove('LinkScan');

    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        // chrome.runtime.sendMessage({ type: LS_ID, text: selectedText });
        // chrome.runtime.sendMessage({ type: YT_ID, text: selectedText });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        if (message.id === LS_ID) {
            const query = message.message;
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
    } catch (error) {
        console.error('Error:', error);
    }
});
