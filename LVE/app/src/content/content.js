//CONST
var sel = "";
var _sel = "";
var isShowIcon = false;
var isShowPopup = false;
var point_x = 0;
var point_y = 0;
var keyTranslateWord = "LVEWord"
var keyOgWord = "LVEOgWord"
var keyExampleOfWord = "LVEExampleOfWord"
var keyIpaWord = "[LVEIpaWord]"
var voices = window.speechSynthesis.getVoices()

var urlSrcIconTranslate = chrome.runtime.getURL("/assets/translate.png");
var urlSrcIconSpeaker = chrome.runtime.getURL("/assets/speaker.png");
var urlIconLoading = chrome.runtime.getURL("/assets/loader.gif");

//Create Icon
var dIcon = document.createElement("DIV");
dIcon.className = "icon-lve";
dIcon.innerHTML = "";
document.body.appendChild(dIcon);
var urlSrc = chrome.runtime.getURL("/assets/32.png");
dIcon.innerHTML = "<image id=\"i-lve\" src=\"" + urlSrc + "\" >";
//End create icon

//Start create popup
var dPopup = document.createElement("DIV");
dPopup.className = "parent-popup";
dPopup.innerHTML = "";
document.body.appendChild(dPopup);

var popup = '<div class="popup">' +
    '<div class="tpopup"><img class="icon-translate" src="' + urlSrcIconTranslate + '"> <span class="t-dich">Dịch</span></div>' +
    '<div class="body-popup">' +
    '<div class="word">' +
    '<!-- original word -->' +
    '<span class="o-word">LVEOgWord</span>' +
    '<img class="i-speaker" id="btn-speak" src="' + urlSrcIconSpeaker + '">' +
    '<button id="btn-add-word">Thêm vào sổ từ</button>' +
    '<div class="clearfix"></div>' +
    '<div class="phien-am">[LVEIpaWord]</div>' +
    '<span class="title-owb">Thêm vào</span>' +
    '<select class="option-word-book">' +
    '<option value="gia dinh">gia đình</option>' +
    '</select>' +
    '</div>' +
    '<!-- translate word -->' +
    '<div class="footer-word">' +
    '<span class="title-t-word">Phổ biến nhất</span>' +
    '<div class="t-word">LVEWord</div>' +
    '<span class="title-ex-setence">Ví dụ</span>' +
    '<div class="ex-setence">LVEExampleOfWord</div>' +
    '</div>' +
    '</div>' +
    '</div>';
dPopup.innerHTML = popup;
var _popup = popup;
//End create popup

//Start Create Loading Panel
var dLoadingPopup = document.createElement("DIV");
dLoadingPopup.className = "parent-loading-popup";
dLoadingPopup.innerHTML = "";
document.body.appendChild(dLoadingPopup);

var loadingPopup = '<div class="popup">' +
    '<div class="tpopup"><img class="icon-translate" src="' + urlSrcIconTranslate + '"> <span class="t-dich">Dịch</span></div>' +
    '<div class="body-popup">' +
    '<img class = "icon-loading" src = "' + urlIconLoading + '" / >'
'</div>';
dLoadingPopup.innerHTML = loadingPopup;
//End create loading popup

//Click icon

document.getElementById("i-lve").addEventListener('click', async() => {
    $(".icon-lve").hide();

    //show popup

    //validate
    sel = sel.trim()
    _sel = sel
    let convertWord = sel.replace(" ", "%20");
    const data = "q=" + convertWord + "&source=en&target=vi";
    //show loading popup
    showPopup(point_x, point_y, ".parent-loading-popup")
        //Get translated word
    let promiseGetTranslateWord = new Promise((translateResolve, translateReject) => {
        const data = JSON.stringify({
            "from": "en_GB",
            "to": "vi_VN",
            "data": convertWord,
            "platform": "api"
        });

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                console.log(this.responseText)
                let obj = JSON.parse(this.responseText)
                translateResolve(obj.result)
            }
        });

        xhr.open("POST", "https://lingvanex-translate.p.rapidapi.com/translate");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-rapidapi-key", "4163873f00mshac33a4e6303fe2ap107817jsn8c6abd690fd1");
        xhr.setRequestHeader("x-rapidapi-host", "lingvanex-translate.p.rapidapi.com");

        xhr.send(data);
    });
    //End get translated word
    //Get example
    let promiseGetExample = new Promise((exampleResolve, exampleReject) => {
            const dataGetExample = null;

            const xhrGetExampleWord = new XMLHttpRequest();
            xhrGetExampleWord.withCredentials = true;

            xhrGetExampleWord.addEventListener("readystatechange", function() {
                if (this.readyState === this.DONE) {
                    objExample = JSON.parse(this.responseText);
                    if (objExample.result_code == '200') exampleResolve(objExample.example[0])
                    else exampleResolve('');
                }

            });
            let urlRequestExample = "https://twinword-word-graph-dictionary.p.rapidapi.com/example/?entry=" + convertWord;

            xhrGetExampleWord.open("GET", urlRequestExample);
            xhrGetExampleWord.setRequestHeader("x-rapidapi-key", "4163873f00mshac33a4e6303fe2ap107817jsn8c6abd690fd1");
            xhrGetExampleWord.setRequestHeader("x-rapidapi-host", "twinword-word-graph-dictionary.p.rapidapi.com");
            xhrGetExampleWord.send(dataGetExample);
        })
        //End get example
        //Get ipa word
    let promiseGetIpaWord = new Promise((ipaWordResolve, ipaWordReject) => {
            const dataGetIpaWord = null;
            const xhrGetIpaWord = new XMLHttpRequest();
            xhrGetIpaWord.withCredentials = true;

            xhrGetIpaWord.addEventListener("readystatechange", function() {
                if (this.readyState === this.DONE) {
                    objIpaWord = JSON.parse(this.responseText);
                    if (objIpaWord.result_code == '200') ipaWordResolve('[' + objIpaWord.ipa + ']')
                    else ipaWordResolve('');
                }
            });
            let requestIpaWord = "https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=" + convertWord;
            xhrGetIpaWord.open("GET", requestIpaWord);
            xhrGetIpaWord.setRequestHeader("x-rapidapi-key", "4163873f00mshac33a4e6303fe2ap107817jsn8c6abd690fd1");
            xhrGetIpaWord.setRequestHeader("x-rapidapi-host", "twinword-word-graph-dictionary.p.rapidapi.com");
            xhrGetIpaWord.send(dataGetIpaWord);
        })
        //End get ipa word

    //validate
    let tmpExampleWord = await promiseGetExample
    let tmpIpaWord = await promiseGetIpaWord
    let tmpWord = await promiseGetTranslateWord;
    tmpWord = tmpWord.replace("% 20", " ")

    //Update popup
    if (tmpIpaWord == undefined) tmpIpaWord = ""
    popup = popup.replace(keyOgWord, sel)
    popup = popup.replace(keyExampleOfWord, tmpExampleWord)
    popup = popup.replace(keyIpaWord, tmpIpaWord)
    popup = popup.replace(keyTranslateWord, tmpWord)

    //Hide loading popup
    hidePopup(".parent-loading-popup")
    dPopup.innerHTML = popup;
    //text to speech
    $("#btn-speak").click(() => {
        say(sel)
    })

    //Refresh popup
    refreshTmpWord();

    $(".parent-popup").css({ left: point_x });
    $(".parent-popup").css({ top: point_y + 10 });
    $(".parent-popup").show();

    sel = "";
    isShowPopup = true;
    isShowIcon = false;
})


//Select text
document.addEventListener('mouseup', function(event) {
    sel = window.getSelection().toString();
    //hide popup
    var container = $(".parent-popup");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(event.target) && container.has(event.target).length === 0) {
        container.hide();
    }

    var container = $(".parent-loading-popup");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(event.target) && container.has(event.target).length === 0) {
        container.hide();
    }

    //Hide icon
    var container = $(".icon-lve");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(event.target) && container.has(event.target).length === 0) {
        container.hide();
    }


    if (sel.length) {
        point_x = event.pageX;
        point_y = event.pageY;
        //show icon
        $(".icon-lve").css({ left: event.pageX });
        $(".icon-lve").css({ top: event.pageY + 10 });
        $(".icon-lve").show();
        isShowIcon = true;
    }

    if (sel.length == 0 || sel == "" || !isShowIcon) {
        //hide icon
        $(".icon-lve").hide();
        isShowIcon = false;
    }
})

function refreshTmpWord(tmpWord, tmpExampleWord, tmpIpaWord) {
    popup = _popup;
}

function showPopup(pointX, pointY, classPopup) {
    $(classPopup).css({ left: pointX });
    $(classPopup).css({ top: pointY + 10 });
    $(classPopup).show();

    isShowPopup = true;
    isShowIcon = false;
}

function hidePopup(classPopup) {
    $(classPopup).hide();
}

function say(m) {
    var msg = new SpeechSynthesisUtterance();

    msg.voice = voices[9];
    msg.voiceURI = "native";
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 0.8;
    msg.text = m;
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
}