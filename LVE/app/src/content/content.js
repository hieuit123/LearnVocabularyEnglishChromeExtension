// check login
let myToken = localStorage.getItem("tokenlve")
let accountID = localStorage.getItem("accountIDlve")

if (accountID == 'false') chrome.runtime.sendMessage({ action: "logout" });
if (myToken) {
    console.log(myToken);
    //send token to account js
    chrome.runtime.sendMessage({ action: "sendToken", token: myToken, accountID: accountID });
} else {
    //send announcement not login to background js
    chrome.runtime.sendMessage({ action: "getToken" }, (res) => {
        console.log(res.token)
        if (res) {
            //set local data
            localStorage.setItem("tokenlve", res.token)
            localStorage.setItem("accountIDlve", res.accountID)
            myToken = res.token
            accountID = res.accountID
        }
    })

    //chrome.runtime.sendMessage({ action: "sendToken", token: null })

}

//CONST
//send token to background js
//Listen message
const URL_SERVER = "http://localhost:5000/"
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
var keyWordBooks = "LVEBooks"
var today = new Date()
const voices = window.speechSynthesis.getVoices()
var msg = new SpeechSynthesisUtterance();

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
    '<button id="btn-add-word"">Thêm vào sổ từ</button>' +
    '<div class="clearfix"></div>' +
    '<div class="phien-am">[LVEIpaWord]</div>' +
    '<span class="title-owb">Thêm vào</span>' +
    '<select id="select-wb" class="option-word-book">' +
    'LVEBooks' +
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

//start event
//Click icon

document.getElementById("i-lve").addEventListener('click', async() => {
        $(".icon-lve").hide();

        //show popup

        //validate
        sel = sel.trim()
        _sel = sel
        let convertWord = sel
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
                        if (objIpaWord.result_code == '200') ipaWordResolve(objIpaWord)
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
            //Get word books
        async function fetchData(requestUrl) {
            let response = await fetch(`${URL_SERVER}${requestUrl}`);
            if (response.status === 200) {
                let data = await response.json();
                return data.data
            }
        }
        let myWordbooks = await fetchData(`wordbook/getallbyidaccount/${accountID}`)
        console.log(myWordbooks)
        let htmlWordBooks = myWordbooks.map((wordbook) => `<option value="${wordbook.WB_Id}">${wordbook.WB_Name}</option>`)

        //End Get word books
        //validate
        let tmpExampleWord = await promiseGetExample
        let myObjIpaWord = await promiseGetIpaWord
        let tmpIpaWord = objIpaWord.ipa
        let tmpWord = await promiseGetTranslateWord;
        tmpWord = tmpWord.replace("% 20", " ")
        console.log(objIpaWord)
            //Update popup
        if (tmpIpaWord == undefined) tmpIpaWord = ""
        popup = popup.replace(keyOgWord, sel)
        popup = popup.replace(keyExampleOfWord, tmpExampleWord)
        popup = popup.replace(keyIpaWord, tmpIpaWord)
        popup = popup.replace(keyTranslateWord, tmpWord)
        popup = popup.replace(keyWordBooks, htmlWordBooks.join(""))
            //Hide loading popup
        hidePopup(".parent-loading-popup")
        dPopup.innerHTML = popup;
        //event btn speak
        $("#btn-speak").click(() => {
                say(sel)
            })
            //event btn add word
        $("#btn-add-word").click(() => {
                // if (!accountID) {
                //     alert("Bạn chưa đăng nhập!")
                //     return
                // }
                //connect data
                let linkPost = window.location.href
                let optionWB = document.getElementById("select-wb").value;
                let originalWord = sel
                let translateWord = tmpWord
                let phrase = tmpExampleWord
                let fullDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

                let wordRequestData = {
                    W_originalWord: originalWord,
                    W_translatedWord: translateWord,
                    W_Phrase: phrase,
                    W_Avatar: 'avatar.png',
                    W_linkPost: linkPost,
                    W_idWordBook: optionWB,
                    W_dateCreated: fullDate,
                    W_phraseMean: "update",
                    W_learnTimes: "0",
                    W_Degree: "0",
                    W_idVocabularyState: "0",
                    W_idLearningNumberDay: "0",
                    W_idCustomDegree: "0",
                    W_idState: "0",
                    W_wrongTimes: "0"
                }
                handleAddWord(wordRequestData)
            })
            //Refresh popup
        refreshTmpWord();
        let tmpX = (point_x > 800) ? point_x - 320 : point_x + 10;
        let tmpY = (point_y > 450) ? point_y - 320 : point_y + 10;
        $(".parent-popup").css({ left: tmpX });
        $(".parent-popup").css({ top: tmpY });
        $(".parent-popup").show();

        sel = "";
        isShowPopup = true;
        // isShowIcon = false;
    })
    //hide icon when click outside

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
        container.hide()

    }

    //Hide icon
    var container = $(".icon-lve");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(event.target) && container.has(event.target).length === 0) {
        container.hide()
        isShowIcon = false
    }

    if (sel.length && sel != '' && sel != '\n' && !isShowIcon && _sel != sel) {
        point_x = event.pageX;
        point_y = event.pageY;
        //show icon
        $(".icon-lve").css({ left: event.pageX });
        $(".icon-lve").css({ top: event.pageY + 10 });
        $(".icon-lve").show();
        //validate
        isShowIcon = true
        _sel = sel;
    }
})

//end event
function refreshTmpWord(tmpWord, tmpExampleWord, tmpIpaWord) {
    popup = _popup;
}

async function handleAddWord(wordRequestData) {
    let data;
    data = await post("word/add", wordRequestData)
    console.log(data)
}

function showPopup(pointX, pointY, classPopup) {
    let tmpX = (pointX > 800) ? pointX - 320 : pointX + 10;
    let tmpY = (pointY > 450) ? pointY - 320 : pointY + 10;
    $(classPopup).css({ left: tmpX });
    $(classPopup).css({ top: tmpY });
    $(classPopup).show();

    isShowPopup = true;
    isShowIcon = false;
}

function hidePopup(classPopup) {
    $(classPopup).hide();
}

function say(m) {
    msg.voice = voices[9];
    msg.voiceURI = "native";
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 0.8;
    msg.text = m;
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
}
async function post(requestUrl, data) {
    let formBody = convertPostData(data)
    let response = await fetch(`${URL_SERVER}${requestUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    }).then(data => data.json())
    if (response.status === true) {
        return response
    }
    return false;
}

function convertPostData(details) {
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody
}