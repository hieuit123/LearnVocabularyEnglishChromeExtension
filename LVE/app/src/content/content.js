//Create Icon
var dIcon = document.createElement("DIV");
dIcon.className = "icon-lve";
dIcon.innerHTML = "";
document.body.appendChild(dIcon);
var urlSrc = chrome.runtime.getURL("/assets/32.png");
dIcon.innerHTML = "<image src=\"" + urlSrc + "\">";

document.addEventListener('mouseup', function(event) {
    var sel = window.getSelection().toString();

    if (sel.length) {
        //show icon
        $(".icon-lve").css({ left: event.pageX });
        $(".icon-lve").css({ top: event.pageY });
        $(".icon-lve").show();
    }

})