var url;
var blocked_urls = [ "(http|https)://.*facebook.com/.*", "(http|https)://.*twitter.com/.*", "(http|https)://.*\.reddit.com/.*", "(http|https)://.*\.youtube.com/.*"]
chrome.runtime.sendMessage({message: "check_url"}, (response) => {
    url = response.url;
    if ( blocked_urls.some(e => RegExp(e).test(url) ))
    {
	let key = new URL(url)
	key = key.hostname
	chrome.storage.local.get(key, (data) => {
	    // Check if object has data
	    if (Object.keys(data).length > 0)
	    {
		let now = new Date();
		let d = new Date(data[key])
		if(d <= now)
		{
		    blockPage(url)
		}	
	    }	
	    else
		blockPage(url)
	})
    }
});

function blockPage(url) {
    chrome.runtime.sendMessage({message: "block_tab", url: url})

}
