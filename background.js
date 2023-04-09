chrome.storage.sync.clear();

chrome.storage.sync.get("enabled", (data) => {
    if(Object.keys(data).length <= 0 )
    {
        chrome.storage.sync.set({"enabled": true}) 
    }
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if ( request.message === "check_url" )
            sendResponse({ url: sender.tab.url })
        else if (request.message === "block_tab" )
        {
            chrome.tabs.update(sender.tab.id, {url: 'index.html?p='+ request.url});
        }
        else if (request.message === "unblock")
        {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.storage.sync.get(['timeInterval'], ({ timeInterval }) => {

                    var tab = tabs[0];
                    let url = new URL(tab.url)
                    url = url.searchParams.get("p")
                    let dt = new Date()
                    let value = dt.setMinutes( dt.getMinutes() + timeInterval ) 
                    let key = new URL(url)
                    key = key.hostname

                    let val_obj = {}
                    val_obj[key] = value
                    chrome.storage.local.set(val_obj)
                    console.log("Blocked until", dt)
                    chrome.tabs.update(tab.id, {url: url});
                });
            });
        }
    }
);

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        const defaultBlockedUrls = {
            'twitter.com': /^https?:\/\/(?:[a-zA-Z0-9_-]+\.)?twitter\.com(?:\/.*)?$/i,
            'facebook.com': /^https?:\/\/(?:[a-zA-Z0-9_-]+\.)?facebook\.com(?:\/.*)?$/i,
            'youtube.com': /^https?:\/\/(?:[a-zA-Z0-9_-]+\.)?youtube\.com(?:\/.*)?$/i,
            'reddit.com': /^https?:\/\/(?:[a-zA-Z0-9_-]+\.)?reddit\.com(?:\/.*)?$/i,
        };

        await chrome.storage.sync.set({ 
            blockedUrls: defaultBlockedUrls,
            difficulty: "medium",
            timeInverval: 60,
            enabled: true
        });
    }
});

