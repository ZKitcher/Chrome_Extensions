const LS_ID = 'LinkScan'

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


document.addEventListener('mousedown', () => {
    const linkScan = document.querySelectorAll('.LinkScan')[0];
    if (linkScan)
        linkScan.classList.remove('LinkScan');

    const selectedText = window.getSelection().toString().trim();
    if (selectedText && chrome.runtime) {
        chrome.runtime.sendMessage({ type: LS_ID, text: selectedText });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const query = message.message;
    const allLinks = document.querySelectorAll('a');

    let bestMatch = 25;
    let link = null;

    allLinks.forEach(e => {
        const linkText = e.textContent;
        const match = stringSimilarityPercentage(query, linkText);
        if (match > bestMatch) {
            bestMatch = match;
            link = e;
        }
    });

    if (link) {
        link.classList.add('LinkScan');
        link.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    } else {
        alert('No Matching Link found.')
    }

});