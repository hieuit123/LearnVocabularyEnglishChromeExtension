//CONST
var sel = "";
var isShowIcon = false;
var isShowPopup = false;
var point_x = 0;
var point_y = 0;

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
var urlSrcIconTranslate = chrome.runtime.getURL("/assets/translate.png");
var urlSrcIconSpeaker = chrome.runtime.getURL("/assets/speaker.png");

var popup = '<div class="popup">' +
    '<div class="tpopup"><img class="icon-translate" src="' + urlSrcIconTranslate + '"> <span class="t-dich">Dịch</span></div>' +
    '<div class="body-popup">' +
    '<div class="word">' +
    '<!-- original word -->' +
    '<span class="o-word">dictionary</span>' +
    '<img class="i-speaker" src="' + urlSrcIconSpeaker + '">' +
    '<button id="btn-add-word">Thêm vào sổ từ</button>' +
    '<div class="clearfix"></div>' +
    '<div class="phien-am">[ˈdɪkʃəˌnɛriz]</div>' +
    '<span class="title-owb">Thêm vào</span>' +
    '<select class="option-word-book">' +
    '<option value="gia dinh">gia đình</option>' +
    '</select>' +
    '</div>' +
    '<!-- translate word -->' +
    '<div class="footer-word">' +
    '<span class="title-t-word">Phổ biến nhất</span>' +
    '<div class="t-word">từ điển, từ điển, từ điển của từ </div>' +
    '<span class="title-ex-setence">Ví dụ</span>' +
    '<div class="ex-setence">You can perform lookup for a word in all dictionaries simultaneously</div>' +
    '</div>' +
    '</div>' +
    '</div>';
dPopup.innerHTML = popup;
//End create popup
//Click icon
document.getElementById("i-lve").addEventListener('click', () => {
        $(".icon-lve").hide();
        //show popup
        $(".parent-popup").css({ left: point_x });
        $(".parent-popup").css({ top: point_y + 10 });
        $(".parent-popup").show();

        sel = "";
        isShowPopup = true;
        isShowIcon = false;
    })
    //Select text
document.addEventListener('mouseup', function(event) {
    //hide popup
    var container = $(".parent-popup");
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

    sel = window.getSelection().toString();
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