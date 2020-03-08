chrome.storage.sync.clear();

chrome.storage.sync.get("enabled", (data) => {
    if(Object.keys(data).length <= 0 )
    {
        chrome.storage.sync.set({"enabled": true}) 
    }
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.extension.getBackgroundPage().console.log("TEST")
	if ( request.message === "check_url" )
	    sendResponse({ url: sender.tab.url })
	else if (request.message === "block_tab" )
	{
		chrome.tabs.update(sender.tab.id, {url: 'index.html?p='+ request.url});
	}
	else if (request.message === "unblock")
	{
	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var tab = tabs[0];
		let url = new URL(tab.url)
		url = url.searchParams.get("p")
		let dt = new Date()
		let value = dt.setHours( dt.getHours() + 1 ) 
		let key = new URL(url)
		key = key.hostname

		let val_obj = {}
		val_obj[key] = value
		chrome.storage.local.set(val_obj)
		chrome.tabs.update(tab.id, {url: url});
	    });
	}
    }
);
