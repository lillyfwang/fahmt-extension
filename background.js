// function toggleExtension() {
// 	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
// 	    var activeTab = tabs[0];
// 	    chrome.tabs.sendMessage(tabs[0].id, {type: "toggle extension", toggle:true}, function(response) {
// 	    	document.getElementById("toggle").text = response.toggleState;
// 	    	console.log(response.toggleState);
// 	    });
// 	});
// }

chrome.browserAction.onClicked.addListener(function (tab) { 
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
	    var activeTab = tabs[0];
	    chrome.tabs.sendMessage(tabs[0].id, {type: "toggle extension", toggle:true});
	});
});
