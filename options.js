document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settings-form');
    const enabledTrue = document.getElementById('enabled-true');
    const enabledFalse = document.getElementById('enabled-false');
    const difficulty = document.getElementById('difficulty');
    const blockedUrls = document.getElementById('blocked-urls');
    const addBlockedUrl = document.getElementById('add-blocked-url');
    const addUrlBtn = document.getElementById('add-url-btn');
    const timeInterval = document.getElementById('time-interval');
    const saveBtn = document.getElementById('save-btn');


    function renderBlockedUrls(urls) {
        blockedUrls.innerHTML = '';
        for (const userInput in urls) {
            const url = userInput;
            const regex = urls[userInput];
            const urlElement = document.createElement('div');
            urlElement.classList.add('blocked-url');
            urlElement.innerHTML = `
            ${url} <button class="remove-url" data-url="${regex}">X</button>
        `;
            blockedUrls.appendChild(urlElement);
        }
    }

    chrome.storage.sync.get(['enabled', 'difficulty', 'blockedUrls', 'timeInterval'], (settings) => {
        settings.hasOwnProperty('enabled') ? (settings.enabled ? enabledTrue.checked = true : enabledFalse.checked = true) : enabledTrue.checked = true;
        difficulty.value = settings.difficulty || 'medium';
        renderBlockedUrls(settings.blockedUrls || []);
        timeInterval.value = settings.timeInterval || 60;
    });


    function convertUrlToRegex(url) {
        const match = url.match(/^(https?:\/\/)?((?:[a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)(\/.*)?$/);
        if (match) {
            const domain = match[2].replace(/\./g, '\\.');
            const subdomainPart = match[1] || '[a-zA-Z0-9_-]+\\.';
            const protocol = match[1] ? match[1].replace(':', '\\:') : '(https?:\\/\\/)?';
            const regex = `^${protocol}(${subdomainPart})?${domain}(\\/.*)?$`;
            return regex;
        }
        return null;
    }

    // Adding a Blocked URL
    addUrlBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = addBlockedUrl.value;
        if (!url) return;
        const regex = convertUrlToRegex(url);
        if (!regex) {
            alert('Invalid input. Please provide a valid domain or URL.');
            return;
        }
        addBlockedUrl.value = '';
        console.table(url, regex)
        chrome.storage.sync.get(['blockedUrls'], ({ blockedUrls = {} }) => {
            blockedUrls[url] = regex;
            chrome.storage.sync.set({ blockedUrls }, () => {
                renderBlockedUrls(blockedUrls);
            });
        });
    });

    // Removing Blocked URL
    blockedUrls.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-url')) {
            const regexToRemove = e.target.getAttribute('data-url');
            chrome.storage.sync.get(['blockedUrls'], ({ blockedUrls = {} }) => {
                for (const userInput in blockedUrls) {
                    if (blockedUrls[userInput] === regexToRemove) {
                        delete blockedUrls[userInput];
                        break;
                    }
                }
                chrome.storage.sync.set({ blockedUrls }, () => {
                    renderBlockedUrls(blockedUrls);
                });
            });
        }
    });

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const enabled = enabledTrue.checked;
        const updatedDifficulty = difficulty.value;
        const updatedTimeInterval = parseInt(timeInterval.value);

        chrome.storage.sync.set({
            enabled,
            difficulty: updatedDifficulty,
            timeInterval: updatedTimeInterval
        }, () => {
            alert('Settings saved!');
        });
    });
});

