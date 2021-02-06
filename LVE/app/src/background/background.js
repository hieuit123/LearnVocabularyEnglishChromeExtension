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
        "title": "Mở Learning Vocabulary English",
        "parentId": "LVE",
        "contexts": [
            "all"
        ]
    })

    chrome.contextMenus.create({
            "id": "gameCenter",
            "title": "Ôn lại từ đã lưu",
            "parentId": "LVE",
            "contexts": [
                "all"
            ]
        })
        //END Create Menu context
    chrome.contextMenus.onClicked.addListener((info, tab) => {

        alert(info.pageUrl);
    })