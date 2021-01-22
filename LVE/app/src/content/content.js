var sel = "";
var isShowIcon = false;
//Create Icon
var dIcon = document.createElement("DIV");
dIcon.className = "icon-lve";
dIcon.innerHTML = "";
document.body.appendChild(dIcon);
var urlSrc = chrome.runtime.getURL("/assets/32.png");
dIcon.innerHTML = "<image id=\"i-lve\" src=\"" + urlSrc + "\" >";

//Click icon
document.getElementById("i-lve").addEventListener('click', () => {
        $(".icon-lve").hide();
        alert("show popup");
        isShowIcon = false;
    })
    //Select text
document.addEventListener('mouseup', function(event) {
        sel = window.getSelection().toString();
        if (sel.length) {
            //show icon
            $(".icon-lve").css({ left: event.pageX });
            $(".icon-lve").css({ top: event.pageY + 10 });
            $(".icon-lve").show();
            isShowIcon = true;
        }
    })
    //Hide icon when click without icon
document.addEventListener('click', function(event) {
    //If not found selected text
    if (sel.length == 0 || !isShowIcon) {
        //hide icon
        $(".icon-lve").hide();
        isShowIcon = false;
    }
})