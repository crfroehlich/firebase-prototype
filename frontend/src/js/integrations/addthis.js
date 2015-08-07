var addThis = function (apiKey) {
    
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
          t = window.addthis || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = `//s7.addthis.com/js/300/addthis_widget.js#pubid=${apiKey}`;
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    }(document, "script", "add-this-js"));

    let init = () => {
        window.addthis.ready(function() {
            if (['#home', '#contact'].indexOf(window.location.hash) >= 0) {
                var tryCount = 0;
                var hideShares = function(keepGoing) {
                    if ($('#at4-share') && $('#at4-share').length >= 1) {
                        $('#at4-share').parent().hide();
                        if (keepGoing) {
                            _.delay(hideShares, 3000);
                        }
                    } else {
                        tryCount += 1;
                        if (tryCount < 60) {
                            _.delay(hideShares, 250);
                        }
                    }
                }
                hideShares(true);
            }
        });
    };
    return init;
};

module.exports = addThis;


