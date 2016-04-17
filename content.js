$(document.body).append('<div id="fahmt-tooltip"></div>');
$(document.body).append('<div id="fahmt-highlight"></div>');

var lastSel = "";
var disabled = false;
var cache = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "toggle extension" && request.toggle == true) {
        disabled = !disabled;
    }
}); 

document.onmousemove = function(e) {
    if (disabled) {
        return;
    }

    if (!this.data && this.progress_started){
        return;
    }
    var sel = getWordAtPoint(e.srcElement,e.x,e.y);

    if (sel) {
        sel = sel.trim();
        var key = hashCode(sel);
        if (sel != lastSel) {
            lastSel = sel;
            var translation = sel + "<div class='hr'><hr /></div>";

            if (cache[key] == null) {
                $.getJSON( "https://api.metalang.io/?query=" + sel, function( data ) {
                    if (data.length === 0) {
                        translation = "No Translations Found";
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            var results = data[i]
                            var count = 1;
                            translation += "<p>" + results.word + "<p>";
                            for (var j = 0; j < results.translations.length; j++) {
                                translation += "<span class='def-number'>" + count + "</span>";
                                count++;
                                for (var k = 0; k < results.translations[j].length; k++) {
                                    translation += " " + results.translations[j][k] + "; ";
                                }
                            }
                        }
                    }                
                    $('#fahmt-tooltip').html(translation);
                    cache[key] = translation;
                });
            } else {
                $('#fahmt-tooltip').html(cache[key]);
            }
            
        }

        $('#fahmt-tooltip').css({
            'top':e.clientY + 15,
            'left':e.clientX - 50
        }).show();  
    }

    else {
        lastSel = "";
        $('#fahmt-highlight').hide();
        $('#fahmt-tooltip').text('');
        $('#fahmt-tooltip').hide();
    }
}


function getWordAtPoint(elem, x, y) {
    if(elem.nodeType == elem.TEXT_NODE) {
        var range = elem.ownerDocument.createRange();
        range.selectNodeContents(elem);
        var currentPos = 0;
        var endPos = range.endOffset;

        while(currentPos+1 < endPos) {
            range.setStart(elem, currentPos);
            range.setEnd(elem, currentPos+1);

            if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
              range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
                range.expand("word");
                this.lastNode = elem;
                this.lastRange = range;
                var ret = range.toString();
                range.detach();
                var text = elem.parentElement.textContent;

                // highlight the word
                var clientRectDiv = document.querySelector('#fahmt-highlight');
                var rect = range.getBoundingClientRect();
                clientRectDiv.style.display = "block";
                clientRectDiv.style.width = rect.width+'px';
                clientRectDiv.style.height = rect.height+'px';
                clientRectDiv.style.left = rect.left+'px';
                clientRectDiv.style.top = rect.top+'px';
                return ret;
          }
          currentPos += 1;
        }
    } else {
        for(var i = 0; i < elem.childNodes.length; i++) {
            var range = elem.childNodes[i].ownerDocument.createRange();
            range.selectNodeContents(elem.childNodes[i]);

            if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
             range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
                range.detach();
                return(getWordAtPoint(elem.childNodes[i], x, y));
            } else {
                range.detach();
            }
        }
    }
    return(null);
}

hashCode = function(s){
    if (s === null) {
        return 0;
    }
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}