// check login
let accountID = window.localStorage.getItem("accountIDlve")
if (accountID == 'false') chrome.runtime.sendMessage({
    action: "logout"
});

let myToken = window.localStorage.getItem("tokenlve")
let tmpUrlCurrent = window.location.href

if (myToken && tmpUrlCurrent === "http://localhost:3000/") {
    //send token to account js
    chrome.runtime.sendMessage({
        action: "sendToken",
        token: myToken,
        accountID: accountID
    });
} else {
    if (accountID != 'false') {
        chrome.runtime.sendMessage({
            action: "getToken"
        }, (res) => {
            if (res) {
                //set local data
                localStorage.setItem("tokenlve", res.token)
                localStorage.setItem("accountIDlve", res.accountID)
                myToken = res.token
                accountID = res.accountID
            }
        })
    }
}

//CONST
//send token to background js
//Listen message
const apiUrl = 'https://translate.googleapis.com';
const publicUrl = 'https://translate.google.com';
var apiClient = "dict-chrome-ex";
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
    '<img class="i-speaker-lve" id="btn-speak-lve" src="' + urlSrcIconSpeaker + '">' +
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
//api translate
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

async function translate(langFrom, langTo, text) {
    var getApiUrl = (withText = true) => {
        return apiUrl + '/translate_a/t?' + convertPostData({
            client: apiClient,
            q: withText ? text : null,
            sl: langFrom,
            tl: langTo,
            hl: langTo, // header for dictionary (part of speech)
            dt: [
                "t", // translation
                "bd", // dictionary
                "rm", // translit
                "qca", // spelling correction
            ],
        })
    }
    var url = getApiUrl();
    let result = await fetch(url).then(data => data.json()).then((res) => {
        return res;
    })
    return result
}
//Click icon

document.getElementById("i-lve").addEventListener('click', async () => {
    $(".icon-lve").hide();
    //show popup

    //validate
    sel = sel.trim()
    _sel = sel
    let convertWord = sel
    const data = "q=" + convertWord + "&source=en&target=vi";
    //show loading popup
    showPopup(point_x, point_y, ".parent-loading-popup")

    //Get example
    let promiseGetExample = new Promise((exampleResolve, exampleReject) => {
        const dataGetExample = null;

        const xhrGetExampleWord = new XMLHttpRequest();
        xhrGetExampleWord.withCredentials = true;

        xhrGetExampleWord.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                objExample = JSON.parse(this.responseText);
                if (objExample.result_code == '200') exampleResolve(objExample.example[0])
                else exampleResolve('');
            }

        });
        let urlRequestExample = "https://twinword-word-graph-dictionary.p.rapidapi.com/example/?entry=" + convertWord.replace(" ", "%20");

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

        xhrGetIpaWord.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                objIpaWord = JSON.parse(this.responseText);
                if (objIpaWord.result_code == '200') ipaWordResolve(objIpaWord)
                else ipaWordResolve('');
            }
        });
        let requestIpaWord = "https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=" + convertWord.replace(" ", "%20");
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
    let translation = await translate("en", "vi", sel)
    let tmpWord = translation.sentences[0].trans
    let resultGetExample2 = await getExample2()
    let tmpExampleWord
    //optimize example word
    if (resultGetExample2.status == 200) {
        let examplesArray = resultGetExample2.examples
        tmpExampleWord = examplesArray[0]

        let minLength = examplesArray[0].length
        examplesArray.forEach(element => {
            if (element.length < minLength) tmpExampleWord = element
        });
    } else {
        tmpExampleWord = await promiseGetExample
    }

    //change api example
    // let tmpExampleWord = await promiseGetExample

    let myObjIpaWord = await promiseGetIpaWord
    let resultIpaWord = await getIpaWord()
    let tmpIpaWord = ""
    console.log(resultIpaWord)
    if (resultIpaWord) {
        if (resultIpaWord.pronunciation.all) tmpIpaWord = resultIpaWord.pronunciation.all
        if (!resultIpaWord.pronunciation.all) tmpIpaWord = resultIpaWord.pronunciation
    } else {
        tmpIpaWord = myObjIpaWord.ipa
    }
    // let tmpWord = await promiseGetTranslateWord;
    //update type of word
    let typeOfWord = ""
    let flagContinueTypeOfWord = false;
    if (myObjIpaWord) {
        if (myObjIpaWord.meaning.verb) typeOfWord = typeOfWord.concat("v"), flagContinueTypeOfWord = true;
        if (myObjIpaWord.meaning.adverb) {
            typeOfWord = (flagContinueTypeOfWord) ? typeOfWord.concat("/adv") : typeOfWord.concat("adv")
            flagContinueTypeOfWord = true;
        }
        if (myObjIpaWord.meaning.noun) {
            typeOfWord = (flagContinueTypeOfWord) ? typeOfWord.concat("/n") : typeOfWord.concat("n")
            flagContinueTypeOfWord = true;
        }
        if (myObjIpaWord.meaning.adjective) {
            typeOfWord = (flagContinueTypeOfWord) ? typeOfWord.concat("/adj") : typeOfWord.concat("adj")
            flagContinueTypeOfWord = true;
        }
        console.log(typeOfWord)
        tmpIpaWord = tmpIpaWord.concat(`(${typeOfWord})`)
    }

    tmpWord = tmpWord.replace("% 20", " ")

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
    $("#btn-speak-lve").click(() => {
        say(sel)
    })
    //event btn add word
    $("#btn-add-word").click(async () => {
        if (sel.length > 30) alert("Từ quá dài")
        if (!accountID) {
            alert("Bạn chưa đăng nhập!")
            return
        }
        let linkPost = window.location.href
        let optionWB = document.getElementById("select-wb").value;
        let originalWord = sel
        let translateWord = tmpWord
        let phrase = tmpExampleWord
        let tmp_translation = await translate("en", "vi", phrase)
        let phraseMean = tmp_translation.sentences[0].trans
        let fullDate = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        let wordRequestData = {
            W_originalWord: originalWord,
            W_translatedWord: translateWord,
            W_Phrase: phrase,
            W_Avatar: 'avatar.png',
            W_linkPost: linkPost,
            W_idWordBook: optionWB,
            W_dateCreated: fullDate,
            W_phraseMean: phraseMean,
            W_learnTimes: "0",
            W_Degree: "0",
            W_idLearningNumberDay: "0",
            W_idCustomDegree: "0",
            W_idState: 3,
            W_wrongTimes: "0",
            W_idCatalogStored: 1,
            W_ipaWord: myObjIpaWord.ipa,
            W_typeOfWord: typeOfWord,
            AC_Id: accountID
        }
        handleAddWord(wordRequestData)
    })
    //Refresh popup
    refreshTmpWord();
    let tmpX = (point_x > 800) ? point_x - 320 : point_x + 10;
    let tmpY = (point_y > 450) ? point_y - 320 : point_y + 10;
    $(".parent-popup").css({
        left: tmpX
    });
    $(".parent-popup").css({
        top: tmpY
    });
    $(".parent-popup").show();

    sel = "";
    isShowPopup = true;
    // isShowIcon = false;
})
//hide icon when click outside

//Select text
let containerTemp;
document.addEventListener('mouseup', function (event) {
    let mySel = window.getSelection().toString();
    //hide popup
    var container = $(".parent-popup");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(event.target) && container.has(event.target).length === 0) {
        container.hide();
        isShowPopup = false
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
        isShowIcon = false;
    }
    if (sel == mySel && event.target != containerTemp) {
        return;
    }

    containerTemp = event.target;
    sel = mySel;
    if (sel.length && sel != '' && sel != '\n' && !isShowIcon && !isShowPopup) {
        point_x = event.pageX;
        point_y = event.pageY;
        //show icon
        $(".icon-lve").css({
            left: event.pageX
        });
        $(".icon-lve").css({
            top: event.pageY + 10
        });
        $(".icon-lve").show();
        //validate
        isShowIcon = true;
        _sel = sel;
    }
})

function hideIconLve() {
    $(".icon-lve").hide();
}

function refreshSel() {
    if (sel == _sel) _sel = ""
}
//end event
function refreshTmpWord(tmpWord, tmpExampleWord, tmpIpaWord) {
    popup = _popup;
}

async function handleAddWord(wordRequestData) {
    alert("Đã thêm vào sổ từ");
    let data
    let dataImage
    try {
        dataImage = await getImageLink(sel)
        wordRequestData.W_Avatar = dataImage.value[0].thumbnailUrl
    } catch (e) {
        console.log(e)
    }

    console.log(dataImage);
    data = await post("word/add", wordRequestData)

    if (data.status) {

    } else {
        //alert
        alert("Từ này đã có trong sổ từ")
    }
}

function showPopup(pointX, pointY, classPopup) {
    let tmpX = (pointX > 800) ? pointX - 320 : pointX + 10;
    let tmpY = (pointY > 450) ? pointY - 320 : pointY + 10;
    $(classPopup).css({
        left: tmpX
    });
    $(classPopup).css({
        top: tmpY
    });
    $(classPopup).show();

    isShowPopup = true;
    isShowIcon = false;
}

function hidePopup(classPopup) {
    $(classPopup).hide();
}
//other api
async function getImageLink() {
    let result = await fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=${sel.replace(" ","%20")}&offset=2&count=1`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "4163873f00mshac33a4e6303fe2ap107817jsn8c6abd690fd1",
                "x-rapidapi-host": "bing-image-search1.p.rapidapi.com"
            }
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
            return null
        });
    return result
}
async function getIpaWord() {
    let result = await fetch("https://wordsapiv1.p.rapidapi.com/words/" + sel.replace(" ", "%20") + "/pronunciation", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "4163873f00mshac33a4e6303fe2ap107817jsn8c6abd690fd1",
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
            }
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.error(err);
            return null
        });
    if (!result.success) return null
    return result
}
var synth = window.speechSynthesis;
var myVoices = [];
//end api
function say(m) {
    myVoices = synth.getVoices();
    var myMsg = new SpeechSynthesisUtterance(m);
    myMsg.voice = myVoices[1];
    myMsg.pitch = 1
    myMsg.rate = 0.8
    synth.speak(myMsg)
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
async function getExample2() {
    let result = await fetch("https://wordsapiv1.p.rapidapi.com/words/" + sel.replace(" ", "%20") + "/examples", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "4163873f00mshac33a4e6303fe2ap107817jsn8c6abd690fd1",
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
            }
        })
        .then(response => {
            console.log(response);
            return response.json()
        })
        .catch(err => {
            console.error(err);
            return ""
        });
    return result
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