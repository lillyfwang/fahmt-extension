chrome.browserAction.onClicked.addListener(function (tab) { 
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
	    var activeTab = tabs[0];
	    chrome.tabs.sendMessage(tabs[0].id, {type: "toggle extension", toggle:true});
	});
});
