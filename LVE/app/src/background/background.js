var token = null;
var accountID = null;
var localToken = localStorage.getItem("tokenlve")
var localAccountID = localStorage.getItem("accountIDlve")

//Create Menu context
chrome.contextMenus.create({
    "id": "lveextension",
    "title": "Learn English - LVE",
    "contexts": [
        "all"
    ]
})

chrome.contextMenus.create({
    "id": "advancetranslate",
    "title": "Dịch nâng cao",
    "parentId": "lveextension",
    "contexts": [
        "all"
    ]
})

chrome.contextMenus.create({
    "id": "gameCenter",
    "title": "Ôn tập từ vựng",
    "parentId": "lveextension",
    "contexts": [
        "all"
    ]
})

//END Create Menu context
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // alert(info.menuItemId)
    switch (info.menuItemId) {
        case "gameCenter": { break; }
        case "advanceTranslate": { break; }
    }
})

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request.action);
        if (request.action == "sendToken") {
            if (request.token) {
                token = request.token
                let tmpLocalToken = localStorage.getItem("tokenlve")
                if(tmpLocalToken) token = tmpLocalToken
                localStorage.setItem("tokenlve", token)
                accountID = request.accountID// get account id
                localStorage.setItem("accountIDlve", accountID)
                
            }
        }
        if(request.action == "logout") window.localStorage.clear()
        if(request.action == "getToken") {
            if(localToken){
                sendResponse({token:localToken, accountID:localAccountID})
            }
        }
    }
);
//Listen message
// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//             alert("da vao")
//             chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//                 chrome.tabs.sendMessage(tabs[0].id, {action: "redirect",link:request.link}, function(response) {});  
//             });
//     }
// );