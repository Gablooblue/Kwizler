chrome.runtime.sendMessage({message: "check_url"}, (response) => {
    url = response.url;
    let blockedUrlsArray

    // Get blocked URLs
    chrome.storage.sync.get(['blockedUrls'], ({ blockedUrls = {} }) => {
        const blockedUrlsArray = getBlockedUrlsArray(blockedUrls);
        console.log(blockedUrlsArray)
        console.log(url)
            chrome.storage.local.get(console.log)
        if ( blockedUrlsArray.some(e => RegExp(e).test(url) ))
        {
            console.log("BLOCK")

            // TODO replace with an actual way to find urls in the new blockedUrlsArray object
            let key = new URL(url)
            key = key.hostname
            chrome.storage.local.get(key, (data) => {
                // Check if object has data
                if (Object.keys(data).length > 0)
                {
                    let now = new Date();
                    let d = new Date(data[key])
                    if(d <= now && !isOAuthUrl(url))
                    {
                        blockPage(url)
                    }	
                }	
                else
                    blockPage(url)
            })
        }
        else 
        {
            console.log("skip")
        }
    });
});

function blockPage(url) {
    chrome.runtime.sendMessage({message: "block_tab", url: url})

}

function isOAuthUrl(url) {
    const oauthProviders = [
        // Google
        'https://accounts.google.com/o/oauth2/auth',
        'https://accounts.google.com/o/oauth2/v2/auth',

        // Facebook
        'https://www.facebook.com/dialog/oauth',
        'https://www.facebook.com/v2.0/dialog/oauth',
        'https://www.facebook.com/v3.0/dialog/oauth',
        'https://www.facebook.com/v4.0/dialog/oauth',
        'https://www.facebook.com/v5.0/dialog/oauth',
        'https://www.facebook.com/v6.0/dialog/oauth',
        'https://www.facebook.com/v7.0/dialog/oauth',
        'https://www.facebook.com/v8.0/dialog/oauth',
        'https://www.facebook.com/v9.0/dialog/oauth',
        'https://www.facebook.com/v10.0/dialog/oauth',

        // GitHub
        'https://github.com/login/oauth/authorize',

        // Twitter
        'https://api.twitter.com/oauth/authenticate',
        'https://api.twitter.com/oauth/authorize',

        // Apple
        'https://appleid.apple.com/auth/authorize',

        // Microsoft (Azure Active Directory)
        'https://login.microsoftonline.com/common/oauth2/authorize',
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',

        // LinkedIn
        'https://www.linkedin.com/oauth/v2/authorization',

        // Amazon
        'https://www.amazon.com/ap/oa',

        // Spotify
        'https://accounts.spotify.com/authorize',

        // Dropbox
        'https://www.dropbox.com/oauth2/authorize'
    ];

    return oauthProviders.some(providerUrl => url.startsWith(providerUrl));
}

function getBlockedUrlsArray(blockedUrls) {
    const blockedUrlsArray = [];
    for (const userInput in blockedUrls) {
        const regex = blockedUrls[userInput];
        blockedUrlsArray.push(regex);
    }
    return blockedUrlsArray;
}

