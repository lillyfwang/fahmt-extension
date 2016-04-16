$(document.body).append('<div id="fahmt-tooltip"></div>');
$(document.body).append('<div id="fahmt-highlight"></div>');

var last_sel = "";


document.onmousemove = function(e) {
    if (!this.data && this.progress_started){
        return;
    }
    var sel = getWordAtPoint(e.srcElement,e.x,e.y);
    if (sel) {
        sel = sel.trim();
    }
    
    if (sel && sel != last_sel) {
        console.log("app:" + sel);
        last_sel = sel;
        $('#fahmt-tooltip').css({
            'top':e.clientY + 15,
            'left':e.clientX - 50
        }).show().html(
            sel + 
            "<div class='hr'><hr /></div>"
        );
    }

    if (!sel) {
        console.log('GOT HERE DA FUCK');
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
                /* EXPAND MANUALLY */
                var text = elem.parentElement.textContent;
                //highlight the range
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