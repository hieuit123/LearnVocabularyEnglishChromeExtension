document.addEventListener('mouseup', function(event) {
    var sel = window.getSelection().toString();

    if (sel.length) {
        //Create 
        var para = document.createElement("DIV");
        para.innerText = "This is a paragraph.";
        var att = document.createAttribute("id");
        att.value = "icon";
        para.setAttributeNode(att);
        document.body.appendChild(para);
    }

})