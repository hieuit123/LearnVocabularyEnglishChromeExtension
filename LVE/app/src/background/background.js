    //Create Menu context
    chrome.contextMenus.create({
        "id": "LVE",
        "title": "Learn English - LVE",
        "contexts": [
            "all"
        ]
    })

    chrome.contextMenus.create({
        "id": "translateTab",
        "title": "Open translate window",
        "parentId": "LVE",
        "contexts": [
            "all"
        ]
    })

    chrome.contextMenus.create({
            "id": "gameCenter",
            "title": "Ball English Vocabulary",
            "parentId": "LVE",
            "contexts": [
                "all"
            ]
        })
        //END Create Menu context
    chrome.contextMenus.onClicked.addListener((info, tab) => {

        alert(info.pageUrl);
    })