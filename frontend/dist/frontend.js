(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FrontEnd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var usersnap = require('./js/integrations/usersnap');
var riot = window.riot;
var Router = require('./js/core/Router');
var ga = require('./js/integrations/google.js');
var twitter = require('./js/integrations/twitter.js');
var facebook = require('./js/integrations/facebook.js');
var addThis = require('./js/integrations/addthis.js');

var config = function config() {
    var SITES = {
        CRL: {
            db: 'meta-map-production'
        },
        CRL_STAGING: {
            db: 'meta-map-staging'
        },
        THINK_WATER: {
            db: 'thinkwater-production'
        }
    };

    var ret = {
        host: window.location.host,
        site: {}
    };
    var segments = ret.host.split('.');
    var first = segments[0];
    if (first === 'www') {
        first = segments[1];
    }
    switch (first.toLowerCase()) {
        case 'localhost':
        case 'meta-map-staging':
            ret.site = SITES.CRL_STAGING;
            break;

        case 'crlab':
        case 'frontend':
            ret.site = SITES.CRL;
            break;

        case 'thinkwater-production':
        case 'thinkwater-staging':
        case 'thinkwater':
            ret.site = SITES.THINK_WATER;
            break;
    }

    return ret;
};

var FrontEnd = (function () {
    function FrontEnd(tags) {
        _classCallCheck(this, FrontEnd);

        this.tags = tags;
        this.config = config();

        this.MetaFire = new MetaFire(this.config);
        this.socialFeatures = [];
    }

    _createClass(FrontEnd, [{
        key: 'initSocial',
        value: function initSocial() {
            _.each(this.socialFeatures, function (feature) {
                if (feature) feature();
            });
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            var _this = this;

            if (!this._onReady) {
                this._onReady = new Promise(function (fulfill, reject) {
                    _this.MetaFire.on('config', function (data) {
                        try {
                            _.extend(_this.config.site, data);
                            document.title = _this.config.site.title;
                            var favico = document.getElementById('favico');
                            favico.setAttribute('href', _this.config.site.imageUrl + 'favicon.ico');

                            fulfill(_this.config.site);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }

            return this._onReady;
        }
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            return this.onReady().then(function (config) {
                ga(_this2.config.site.google);
                _this2.socialFeatures.push(twitter());
                _this2.socialFeatures.push(facebook());
                _this2.socialFeatures.push(addThis(_this2.config.site.addthis.pubid));
                usersnap();

                riot.mount('*');
                _this2.Router = new Router();
            });
        }
    }, {
        key: 'log',
        value: function log(val) {
            if (window.ga) {
                window.ga('send', 'event', 'log', 'label', val);
            }
            console.log(val);
        }
    }, {
        key: 'error',
        value: function error(val) {
            if (window.ga) {
                window.ga('send', 'exception', {
                    'exDescription': val.message,
                    'exFatal': true
                });
            }
            console.error(val);
        }
    }, {
        key: 'login',
        value: function login() {
            var self = this;
            this.Auth0.login().then(function (profile) {});
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.MetaFire.logout();
        }
    }, {
        key: 'site',
        get: function get() {
            return 'frontend';
        }
    }]);

    return FrontEnd;
})();

module.exports = FrontEnd;

},{"./js/core/Router":3,"./js/integrations/addthis.js":4,"./js/integrations/facebook.js":5,"./js/integrations/firebase":6,"./js/integrations/google.js":7,"./js/integrations/twitter.js":8,"./js/integrations/usersnap":9}],2:[function(require,module,exports){
'use strict';

require('babel/polyfill');
window.riot = require('riot');
window._ = require('lodash');
window.Promise = require('bluebird');
require('core-js');
window.$ = window.jQuery = require('jquery');
require('jquery-ui');
require('bootstrap');
window.Firebase = require('firebase');
window.Firepad = require('firepad');
window.Humanize = require('humanize-plus');
window.moment = require('moment');
window.URI = require('URIjs');
window.localforage = require('localforage');
window.Ps = require('perfect-scrollbar');

var tags = ['page-head', 'page-banner', 'page-impact', 'page-countmein', 'page-footer', 'page-navbar-menu', 'page-navbar', 'page-news', 'page-explore', 'page-message', 'page-methodology', 'page-testimonials'];

require('./tags/pages/blog-page.tag');
require('./tags/pages/manifesto-page.tag');
require('./tags/pages/stms-page.tag');
require('./tags/pages/not-found-page.tag');
require('./tags/components/buttons.tag');
require('./tags/components/dynamic-page.tag');
require('./tags/page-banner.tag');
require('./tags/page-impact.tag');
require('./tags/page-countmein.tag');
require('./tags/page-footer.tag');
require('./tags/page-navbar-menu.tag');
require('./tags/page-navbar.tag');
require('./tags/page-news.tag');
require('./tags/page-explore.tag');
require('./tags/page-message.tag');
require('./tags/page-methodology.tag');
require('./tags/page-testimonials.tag');
require('./tags/page-main.tag');

var configMixin = require('./js/mixins/config.js');
riot.mixin('config', configMixin);

riot.tag('raw', '<span></span>', function (opts) {
    var _this = this;

    this.updateContent = function () {
        this.root.innerHTML = opts ? opts.content || '' : '';
    };

    this.on('update', function () {
        _this.updateContent();
    });

    this.updateContent();
});

var FrontEnd = require('./FrontEnd');
module.exports = new FrontEnd(tags);

},{"./FrontEnd":1,"./js/mixins/config.js":10,"./tags/components/buttons.tag":11,"./tags/components/dynamic-page.tag":12,"./tags/page-banner.tag":13,"./tags/page-countmein.tag":14,"./tags/page-explore.tag":15,"./tags/page-footer.tag":16,"./tags/page-impact.tag":17,"./tags/page-main.tag":18,"./tags/page-message.tag":19,"./tags/page-methodology.tag":20,"./tags/page-navbar-menu.tag":21,"./tags/page-navbar.tag":22,"./tags/page-news.tag":23,"./tags/page-testimonials.tag":24,"./tags/pages/blog-page.tag":25,"./tags/pages/manifesto-page.tag":26,"./tags/pages/not-found-page.tag":27,"./tags/pages/stms-page.tag":28,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"firepad":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var staticRoutes = {
    'contact': true,
    'home': true,
    'explore': true,
    'countmein': true
};

var isHidden = false;
var toggleMain = function toggleMain(hide, path) {
    track(path);
    if (hide) {
        isHidden = true;
        $('#main').hide();
        $('#at4-share').parent().show();
    } else {
        isHidden = false;
        $('#at4-share').parent().hide();
        $('#main').show();
        $('dynamic-page').empty();
    }
};

var track = function track(path) {
    if (window.ga) {
        window.ga('set', {
            page: path
        });
        window.ga('send', 'pageview');
    }
};

var Router = (function () {
    function Router() {
        var _this = this;

        _classCallCheck(this, Router);

        riot.route.start();
        riot.route(function (target) {
            var path = _this.getPath(target);
            if (!staticRoutes[path]) {
                toggleMain(true, path);
                riot.mount('dynamic-page', { id: path });
            } else {
                toggleMain(false, path);
            }
        });
        this.to(window.location.hash || 'home');
    }

    _createClass(Router, [{
        key: 'getPath',
        value: function getPath(path) {
            return route.getPath(path);
        }
    }, {
        key: 'to',
        value: function to(path) {
            return route.to(path);
        }
    }], [{
        key: 'getPath',
        value: function getPath(path) {
            if (path) {
                while (path.startsWith('!') || path.startsWith('#')) {
                    path = path.substr(1);
                }
            }
            return path;
        }
    }, {
        key: 'to',
        value: function to(path) {
            path = route.getPath(path);
            if (path) {
                if (staticRoutes[path]) {
                    toggleMain(false, path);
                    riot.route(path);
                } else {
                    toggleMain(true, path);
                    riot.route('!' + path);
                }
            }
        }
    }]);

    return Router;
})();

var route = Router;

module.exports = Router;

},{}],4:[function(require,module,exports){
"use strict";

var addThis = function addThis(apiKey) {

    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0],
            t = window.addthis || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "//s7.addthis.com/js/300/addthis_widget.js#pubid=" + apiKey;
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    })(document, "script", "add-this-js");

    var init = function init() {
        window.addthis.ready(function () {
            if (['#home', '#contact'].indexOf(window.location.hash) >= 0) {
                var tryCount = 0;
                var hideShares = function hideShares(keepGoing) {
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
                };
                hideShares(true);
            }
        });
    };
    return init;
};

module.exports = addThis;

},{}],5:[function(require,module,exports){
'use strict';

var facebookApi = function facebookApi(apiKey) {

    window.fbAsyncInit = function () {
        window.FB.init({
            appId: '847702775304906',
            xfbml: true,
            version: 'v2.3'
        });

        window.FB.Event.subscribe('edge.create', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'like', targetUrl);
        });

        window.FB.Event.subscribe('edge.remove', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'unlike', targetUrl);
        });

        window.FB.Event.subscribe('message.send', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'send', targetUrl);
        });
    };

    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    return window.fbAsyncInit;
};

module.exports = facebookApi;

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Firebase = window.Firebase; //require('firebase');
var Promise = window.Promise;
var localforage = window.localforage;

var MetaFire = (function () {
    function MetaFire(config) {
        _classCallCheck(this, MetaFire);

        this.config = config;
        this.fb = new Firebase('https://' + this.config.site.db + '.firebaseio.com');
    }

    _createClass(MetaFire, [{
        key: 'login',
        value: function login() {
            var _this = this;

            if (!this._login) {
                this._login = new Promise(function (fulfill, reject) {
                    window.ThinkWater.Auth0.getSession().then(function (profile) {

                        window.ThinkWater.Auth0.lock.getClient().getDelegationToken({
                            target: _this.config.site.auth0.api,
                            id_token: profile.id_token,
                            api_type: 'firebase'
                        }, function (err, delegationResult) {
                            if (err) {
                                reject(err);
                            } else {
                                profile.firebase_token = delegationResult.id_token;
                                _this.firebase_token = delegationResult.id_token;
                                localforage.setItem('firebase_token', _this.firebase_token);
                                _this.fb.authWithCustomToken(_this.firebase_token, function (error, authData) {
                                    if (error) {
                                        window.FrontEnd.error(error);
                                        reject(error);
                                    } else {
                                        fulfill(authData);
                                    }
                                });
                            }
                        });
                    })['catch'](function (err) {
                        console.log(err);
                        debugger;
                    });
                });
                this._onReady = this._login;
            }
            return this._login;
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            if (!this._onReady) {
                this._onReady = new Promise(function (fulfill, reject) {
                    fulfill();
                });
            }
            return this._onReady;
        }
    }, {
        key: 'getChild',
        value: function getChild(path) {
            return this.fb.child(path);
        }
    }, {
        key: 'getData',
        value: function getData(path) {
            var _this2 = this;

            return this.onReady().then(function () {
                var child = _this2.fb;
                if (path) {
                    child = _this2.getChild(path);
                }
                return new Promise(function (resolve, reject) {

                    child.orderByChild('order').once('value', function (snapshot) {
                        var data = snapshot.val();
                        try {
                            resolve(data);
                        } catch (e) {
                            window.FrontEnd.error(e);
                        }
                    }, function (error) {
                        window.FrontEnd.error({ message: 'Cannot access ' + path });
                        reject(error);
                    });
                });
            });
        }
    }, {
        key: 'on',
        value: function on(path, callback) {
            var _this3 = this;

            var event = arguments.length <= 2 || arguments[2] === undefined ? 'value' : arguments[2];

            if (path) {
                this.onReady().then(function () {
                    var child = _this3.getChild(path);
                    child.orderByChild('order').on(event, function (snapshot) {
                        var data = snapshot.val();
                        try {
                            callback(data);
                        } catch (e) {
                            window.FrontEnd.error(e);
                        }
                    });
                });
            }
        }
    }, {
        key: 'off',
        value: function off(path, method, callback) {
            var _this4 = this;

            if (method === undefined) method = 'value';

            if (path) {
                this.onReady().then(function () {
                    var child = _this4.getChild(path);
                    if (callback) {
                        child.off(method, callback);
                    } else {
                        child.off(method);
                    }
                });
            }
        }
    }, {
        key: 'setData',
        value: function setData(data, path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            try {
                return child.set(data);
            } catch (e) {
                window.FrontEnd.error(e);
            }
        }
    }, {
        key: 'pushData',
        value: function pushData(data, path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            try {
                return child.push(data);
            } catch (e) {
                window.FrontEnd.error(e);
            }
        }
    }, {
        key: 'setDataInTransaction',
        value: function setDataInTransaction(data, path, callback) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            try {
                return child.transaction(function (currentValue) {
                    try {
                        return data;
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
                });
            } catch (e) {
                window.FrontEnd.error(e);
            }
        }
    }, {
        key: 'logout',
        value: function logout() {
            this._login = null;
            this._onReady = null;
            localforage.removeItem('firebase_token');
            this.fb.unauth();
        }
    }]);

    return MetaFire;
})();

module.exports = MetaFire;

},{}],7:[function(require,module,exports){
'use strict';

var googleAnalytics = function googleAnalytics(api) {

    // Google Plus API
    (function () {
        var po = document.createElement('script');po.type = 'text/javascript';po.async = true;
        po.src = 'https://apis.google.com/js/platform.js';
        var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(po, s);
    })();

    //Google Tag Manager API
    (function (w, d, s, l, i) {
        w[l] = w[l] || [];w[l].push({
            'gtm.start': new Date().getTime(), event: 'gtm.js'
        });var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';j.async = true;j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', api.tagmanager);

    // Google Analytics API
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    window.ga('create', api.analytics, 'auto');
    window.ga('send', 'pageview');
    return window.ga;
};

module.exports = googleAnalytics;

},{}],8:[function(require,module,exports){
// Define our custom event handlers
'use strict';

function clickEventToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.region;
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function tweetIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = "tweet";
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function favIntentToAnalytics(intentEvent) {
    tweetIntentToAnalytics(intentEvent);
}

function retweetIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.data.source_tweet_id;
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function followIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.data.user_id + " (" + intentEvent.data.screen_name + ")";
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

var twitterApi = function twitterApi(apiKey) {

    window.twttr = (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    })(document, "script", "twitter-wjs");

    window.twttr.ready(function (twitter) {
        twitter.widgets.load();
        twitter.events.bind('click', clickEventToAnalytics);
        twitter.events.bind('tweet', tweetIntentToAnalytics);
        twitter.events.bind('retweet', retweetIntentToAnalytics);
        twitter.events.bind('favorite', favIntentToAnalytics);
        twitter.events.bind('follow', followIntentToAnalytics);
    });

    var tryCount = 0;
    var load = function load() {
        if (window.twttr && window.twttr.widgets) {
            return window.twttr.widgets.load();
        } else if (tryCount < 5) {
            tryCount += 1;
            _.delay(load, 250);
        }
    };

    return load;
};

module.exports = twitterApi;

},{}],9:[function(require,module,exports){
'use strict';

var userSnap = function userSnap(config) {
    var apiKey = '032baf87-8545-4ebc-a557-934859371fa5.js',
        s,
        x;
    if (config == null) {
        config = {};
    }
    apiKey = config.USER_SNAP_API_KEY;
    if (apiKey && window.location.hostname !== 'localhost') {
        window.usersnapconfig = {
            mode: 'report',
            shortcut: true,
            beforeOpen: function beforeOpen(obj) {
                return UserSnap.setEmailBox(Doc.app.user.userName);
            }
        };
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//api.usersnap.com/load/' + apiKey + '.js';
        x = document.getElementsByTagName('head')[0];
        return x.appendChild(s);
    }
};

module.exports = userSnap;

},{}],10:[function(require,module,exports){
'use strict';

var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if (!num || (num = num.toString()).length > 9) return 'overflow';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;var str = '';
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += n[5] != 0 ? (str != '' ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str;
}

var config = {
    pathImg: function pathImg(folder) {
        var ret = '' + window.FrontEnd.config.site.imageUrl;
        if (folder) {
            ret += folder + '/';
        }
        return ret;
    },
    getData: function getData(path, callback, that) {
        window.FrontEnd.MetaFire.on(window.FrontEnd.site + '/' + path, function (data) {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    },
    watchData: function watchData(path, callback) {
        window.FrontEnd.MetaFire.on(window.FrontEnd.site + '/' + path, function (data) {
            if (callback) {
                callback(data);
            }
        });
    },
    numberToWords: inWords
};

module.exports = config;

},{}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('buttons', '<div class="row center-heading"> <span each="{ _.sortBy(opts.buttons,\'order\') }"> <a if="{ !amazonid }" role="button" href="{ link }" target="_blank" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { title } </a> <div if="{ amazonid }" class="col-sm-{ parent.cell } "> <iframe style="width: 120px; height: 240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" riot-src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=cabrreselab-20&marketplace=amazon&region=US&placement={ amazonid }&asins={ amazonid }&linkId=DIY3TUOPDFH3NQWF&show_border=false&link_opens_in_new_window=true"></iframe> </div> </span> </div>', function(opts) {var _this = this;

this.cell = 6;
this.on('mount', function () {
    if (opts && opts.buttons) {
        _this.cell = Math.round(12 / _.keys(opts.buttons).length);
        _this.update();
    }
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('dynamic-page', '<section id="{ _.kebabCase(data.title) }" > <div class="divide50"></div> <div class="container"> <div id="modal_dialog_container"> </div> </div> </section>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();
this.height = window.innerHeight - 75;
this.on('mount', function () {
    if (opts && opts.id && opts.id != '#') {

        FrontEnd.MetaFire.getData(FrontEnd.site + '/explore/items/' + opts.id).then(function (data) {
            var dialogClass = 'blog-page';

            if (opts.id == 'the-systems-thinking-manifesto-poster') {
                data = data || {};
                dialogClass = 'manifesto-page';
            } else if (opts.id == 'stms') {
                data = data || {};
                dialogClass = 'stms-page';
            } else if (!data) {
                data = data || {};
                dialogClass = 'not-found-page';
            }

            if (data) {

                _this.update();

                opts.event = {
                    item: data,
                    id: opts.id,
                    dialog: _this.modal
                };

                riot.mount(_this.modal_dialog_container, dialogClass, opts);
            }
        });
    }
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li each="{ data }" data-transition="fade" data-slotamount="5" data-title="{ title }" style="background: rgb(240,110,30);" >  <img if="{ !youtubeid && img && img != \'undefined\' }" riot-src="{parent.url+img}?tag=banner" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div if="{ !youtubeid && title }" class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> <raw content="{ title }"></raw> </div> <div if="{ !youtubeid && subtext }" class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> <raw content="{ subtext }"></raw> </div> <div if="{ !youtubeid }" each="{ val, i in _.sortBy(buttons, \'order\') }"> <div class="caption sfb rev-buttons tp-resizeme" data-x="{ 50 + i*200 }" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut" onclick="{ parent.getLink }"> <a href="{ val.link || \'\' }" target="{ _blank: val.link.startsWith(\'http\') }" class="btn btn-lg btn-theme-dark">{ val.title }</a> </div> </div> <div if="{ youtubeid }" class="tp-caption sft customout tp-videolayer" data-x="center" data-hoffset="0" data-y="center" data-voffset="0" data-customin="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:5;scaleY:5;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-customout="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:0.75;scaleY:0.75;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-speed="600" data-start="1000" data-easing="Power4.easeOut" data-endspeed="500" data-endeasing="Power4.easeOut" data-autoplay="true" data-autoplayonlyfirsttime="false" data-nextslideatend="false" data-thumbimage="https://img.youtube.com/vi/{ youtubeid }/mqdefault.jpg"> <iframe riot-src="https://www.youtube.com/embed/{ youtubeid }?hd=1&wmode=opaque&controls=1&showinfo=0" width="1066px" height="600px" style="width:1066px;height:600px;" > </iframe> </div> </li> </ul> </div> </div>', 'id="home"', function(opts) {var _this = this;

this.data = [];
this.mixin('config');
this.url = this.pathImg('site');
this.mounted = false;

this.watchData('/banner', function (data) {
    try {
        if (false == _this.mounted) {
            _this.mounted = true;
            _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
                return i.archive != true;
            });
            _this.update();

            $(_this.tp_banner).revolution({
                stopAtSlide: 1,
                stopAfterLoops: 0,
                startwidth: 1170,
                startheight: 600,
                hideThumbs: 10
                //fullWidth: "on",
                //forceFullWidth: "on",
                //lazyLoad: "on"
                // navigationStyle: "preview4"
            });
        }
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section if="{ data }" style="background: rgb(212, 214, 215);"> <div class="divide50"></div> <div class="container"> <div class="row"> <div id="impact_img" class="col-md-6"> <img class="img-responsive" alt="7 billion thinkers" riot-src="{ url+impact.img}?tag=countmein"></img> </div> <div class="col-md-6"> <br> <div class="facts-in"> <h3> <span id="counter" class="counter">{ Humanize.formatNumber(data.total) }</span>+ </h3> <br> <h3 style="font-size: 35px; font-weight: 700;">{ engage.subtext }</h3> <div id="mc_embed_signup"> <form action="//cabreralabs.us4.list-manage.com/subscribe/post?u=58947385383d323caf9047f39&amp;id=9799d3a7b9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="" target="_blank" novalidate=""> <p style="color: #fff;">{ data.newsletter.text }</p> <div id="mc_embed_signup_scroll"> <div class="mc-field-group"> <div class="input-group"> <input type="email" placeholder="{ data.newsletter[\'subscribe-text\'] || \'Enter your email to subscribe\' }" style="height: 31px;" value="" name="EMAIL" class="form-control" id="mce-EMAIL"> <span class="input-group-btn"> <input role="button" type="submit" style="font-variant: small-caps; text-transform: none;" value="{ impact.text }" name="subscribe" id="mc-embedded-subscribe" class="btn btn-theme-bg">{ impact.text }</input> </span> </div> </div>  <div style="position: absolute; left: -5000px;"> <input type="text" name="b_58947385383d323caf9047f39_9799d3a7b9" tabindex="-1" value=""> </div> <div id="mce-responses" class="clear" style="margin-top: 5px;"> <div class="response" id="mce-error-response" style="color: red; display:none"></div> <div class="response" id="mce-success-response" style="color: #fff; display:none"></div> </div> </div> </form> </div> <div class="row"> <div class="col-md-4 col-sm-4 col-xs-4"> </div> <div class="col-md-6 col-sm-4 col-xs-4"> <div class="addthis_horizontal_follow_toolbox"></div> </div> <div class="col-md-3 margin30 hidden-xs hidden-sm"> </div> </div> </div> </div> <div class="row"> <div class="col-md-12"> <div class="row"> <div class="col-md-12"> <div class="no-padding-inner gray"> <h3 class="wow animated fadeInDownfadeInRight animated" style="visibility: visible; text-align: center;"> { numberToWords(engage.options.length) } more things you can do: </h3> <div class="row"> <div class="col-md-4" each="{ val, i in engage.options }"> <div class="services-box margin30 wow animated fadeInRight animated" style="visibility: visible; animation-name: fadeInRight; -webkit-animation-name: fadeInRight;"> <div class="services-box-icon"> <i class="{ val.icon }"></i> </div> <div class="services-box-info"> <h4>{ val.title }</h4> <p>{ val.text }</p> <div if="{ val.buttons }" each="{ _.sortBy(val.buttons, \'order\') }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </section>', 'id="countmein"', function(opts) {var _this = this;

this.data = null;
this.mixin('config');
this.url = this.pathImg('site');

FrontEnd.MetaFire.getData(FrontEnd.site + '/count-me-in').then(function (data) {
    try {
        _this.data = data;
        _this.data.newsletter = _this.data.newsletter || {};
        _this.data.newsletter['subscribe-text'] = _this.data.newsletter['subscribe-text'] || 'Subscribe to our newsletter';
        _this.impact = data.impact;
        _this.engage = data.engage;
        _this.engage.options = _.filter(_.sortBy(data.engage.options, 'order'), function (opt) {
            return opt.archive != true;
        });
        _this.header = data.header;

        _this.update();

        $(_this.counter).counterUp({
            delay: 100,
            time: 800
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-explore', '<div if="{ header }" class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div if="{ filters }" class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <a id="{ id }" href="{ link || \'#!\'+id }" target="_blank" onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption"> <div class="cbp-caption-defaultWrap"> <img if="{ img && img.length }" riot-src="{parent.url+type}/{img}?tag=explore" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ title }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </a> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="javascript:;" onclick="{ showAll }" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', 'id="explore"', function(opts) {var _this = this;

this.filters = [];
this.header = [];
this.content = [];

this.mixin('config');
this.url = this.pathImg();

this.showAll = function () {
    $(_this.masonry_container).cubeportfolio('filter', '*');
};

this.onClick = function (e) {
    if (this.link) return true;
    FrontEnd.Router.to(_.kebabCase(e.item.id), e, this);
};

FrontEnd.MetaFire.getData(FrontEnd.site + '/explore').then(function (data) {
    try {
        _this.filters = _.filter(_.sortBy(data.filters, 'order'), function (i) {
            return i.archive != true;
        });
        _this.header = data.header;
        _this.items = _.sortBy(_.map(data.items, function (val, key) {
            if (val && !(val.archive === true)) {
                val.id = key;
                return val;
            }
        }), 'order');
        _this.content = _this.items;
        _this.update();

        var defaultFilter = _.first(_this.filters, function (filter) {
            return filter['default'] === true;
        });

        $(_this.masonry_container).cubeportfolio({
            filters: '#filters_container',
            layoutMode: 'grid',
            defaultFilter: '.' + defaultFilter.tag,
            animationType: 'flipOutDelay',
            gapHorizontal: 25,
            gapVertical: 25,
            gridAdjustment: 'responsive',
            mediaQueries: [{
                width: 1100,
                cols: 4
            }, {
                width: 800,
                cols: 3
            }, {
                width: 500,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
            displayType: 'lazyLoading',
            displayTypeSpeed: 100
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div id="contact" class="container"> <div class="row"> <div class="col-md-4 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p style="color: #fff;">{ data.about.text }</p> <ul class="list-unstyled contact"> <li each="{ _.sortBy(data.contact,\'order\') }"> <p style="color: #fff;"> <strong> <i class="{ icon }"></i>{ title || \'\' } </strong> <a if="{ link }" href="{ link }" style="color: #fff" >{ text || link }</a> <span if="{ !link }">{ text }</span> </p> </li> </ul> <ul id="social_follow" class="list-inline social-1"> <li each="{ _.sortBy(data.about.social, \'order\') }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-4 col-sm-6 margin30 hidden-xs hidden-sm"> <div class="footer-col"> <h3>Follow Us</h3> <a if="{ social.twitter }" class="twitter-timeline" href="https://twitter.com/{ social.twitter.title }" data-widget-id="{ social.twitter.api }">Tweets by @{ social.twitter.title }</a> </div> </div>  <div class="col-md-4 col-sm-6 margin30 hidden-xs hidden-sm" style="padding-right: 1px;"> <div class="footer-col"> <h3>Like Us</h3> <div if="{ social.facebook }" class="fb-page" data-href="https://www.facebook.com/{ social.facebook.title }" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-height="300" data-show-posts="true"> <div class="fb-xfbml-parse-ignore"> <blockquote cite="https://www.facebook.com/{ social.facebook.title }"> <a href="https://www.facebook.com/{ social.facebook.title }">{ title }</a> </blockquote> </div> </div> </div> </div> </div> <div if="{ data.copyright }" class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span> <raw content="{ data.copyright.text }"></raw> </span> <img style="display: block; margin-left: auto; margin-right: auto; height: 5%; width: 5%;" riot-src="{ url+data.copyright.img+\'?copy1\' }"></img> <span style="font-size: 8px;">{ data.copyright.license }</span> <img style="display: block; margin-left: auto; margin-right: auto; height: 3%; width: 3%;" riot-src="{ url+data.copyright.img2+\'?copy2\' }"></img> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg('site');

this.social = null;
this.data = null;
this.title = FrontEnd.config.site.title;

FrontEnd.MetaFire.getData(FrontEnd.site + '/footer').then(function (data) {
    try {
        _this.data = data;
        _this.update();

        FrontEnd.MetaFire.getData(FrontEnd.site + '/social').then(function (social) {
            _this.social = social;
            _this.update();
            FrontEnd.initSocial();
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-impact', '<section> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2 if="{ header }">{ header.title }</h2> <span class="center-line"></span> <p if="{ header }" class="lead"> { header.text } </p> </div> </div> </div> <div id="impact_slider" class="owl-carousel"> <div class="item" each="{ items }"> <a href="javascript:;"> <img if="{ img }" width="200px" height="125px" riot-src="{ parent.url }impact/{ img }?tag=impact&title={title}" alt="{ title }"> </a> </div> </div> </div> </section>', 'id="impact"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/impact').then(function (data) {
    try {
        _this.header = data.header;
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();

        $(_this.impact_slider).owlCarousel({
            autoPlay: 5000,
            pagination: false,
            items: 4,
            loop: true,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [991, 2]
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],18:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-main', '<page-banner></page-banner> <div class="divide60"></div> <page-message></page-message> <div class="divide80"></div> <page-methodology></page-methodology> <div class="divide50"></div> <page-testimonials></page-testimonials> <div class="divide50"></div> <page-impact></page-impact> <div class="divide50"></div> <page-countmein></page-countmein> <div class="divide70"></div> <page-news></page-news> <div class="divide50"></div> <div id="explore_container"> </div> <div class="divide40"></div>', 'id="main"', function(opts) {var _this = this;

var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
if (!isSafari) {
    this.on('mount', function () {
        window.setTimeout(function () {
            riot.mount(_this.explore_container, 'page-explore', { items: [] });
        }, 250);
    });
}
});
},{"riot":"riot"}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-message', '<div class="container"> <div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p><raw content="{ header.text }"></raw> </p> </div> </div> </div> <div class="row special-feature"> <div each="{ items }" class="col-md-4 col-sm-4 margin10"> <div class="s-feature-box text-center wow animated fadeIn" data-wow-duration="700ms" data-wow-delay="200ms"> <div class="mask-top">  <i class="{ icon }"></i>  <h4>{ title }</h4> </div> <div class="mask-bottom">  <i class="{ icon }"></i>  <h4>{ title }</h4>  <p>{ text }</p> </div> </div> </div> </div> </div>', 'id="message"', function(opts) {var _this = this;

this.header = {};
this.items = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/message').then(function (data) {

    try {
        _this.header = data.header;
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],20:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-methodology', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p class="lead">{ header.text }</p> </div> </div> </div> <div class="divide30"></div> <div class="row"> <div class="col-md-6"> <div class="center-heading"> <h4>{ frameworks.header.title }</h4> <p class="lead">{ frameworks.header.text }</p> </div> <div class="panel-group" id="frameworks"> <div each="{ val, i in _.sortBy(frameworks.items, \'order\') }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#frameworks" href="#collapseFrameworks_{ i }"> { val.title } </a> </h4> </div> <div id="collapseFrameworks_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div>  <div class="col-md-6"> <div class="center-heading"> <h4>{ partners.header.title }</h4> <p class="lead">{ partners.header.text }</p> </div> <div class="panel-group" id="accordion"> <div each="{ val, i in _.sortBy(partners.items, \'order\') }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne_{ i }"> { val.title } </a> </h4> </div> <div id="collapseOne_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div> </div> </div>', 'id="methodology"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/methodology').then(function (data) {
    try {
        _this.header = data.header;
        _this.frameworks = data.frameworks;
        _this.partners = data.partners;

        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],21:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-menu-navbar', '<div class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }"> <a if="{ val.title }" href="{ val.link || \'#\' }" target="{ _blank: val.link.startsWith(\'http\') }" > <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i> </a> </li> </ul> </div>', function(opts) {var _this = this;

this.data = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/navbar').then(function (data) {

    try {
        _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],22:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <div> <a href="#home"><img if="{ data }" style="margin-top: 7px; margin-right: 15px;" riot-src="{ url }site/{ data.img }?tag=navbar" alt="{ data.alt }"> </a> </div> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then(function (data) {

    try {
        _this.data = data;
        _this.update();
        $(".sticky").sticky({ topSpacing: 0 });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});

$(window).resize(function () {
    $(".navbar-collapse").css({ maxHeight: $(window).height() - $(".navbar-header").height() + "px" });
});
});
},{"riot":"riot"}],23:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-news', '<div class="container"> <div class="row"> <div class="col-md-12"> <h3 class="heading">Latest News</h3> <div id="news_carousel" class="owl-carousel owl-spaced"> <div each="{ data }"> <div class="news-desc"> <p> <a href="{ link }" target="_blank">{ Humanize.truncate(title, 125) }</a> </p> </div> </div> </div> </div> </div> </div>', 'id="news"', function(opts) {var _this = this;

this.data = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/news').then(function (data) {
    try {
        _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();
        $(_this.news_carousel).owlCarousel({
            // Most important owl features
            items: 4,
            itemsCustom: false,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [980, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            startDragging: true,
            autoPlay: 5000,
            loop: true
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],24:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-testimonials', '<div id="testimonials-carousel" class="testimonials testimonials-v-2 wow animated fadeInUp" data-wow-duration="700ms" data-wow-delay="100ms"> <div class="container"> <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p>{ header.text }</p> </div> </div> </div>  <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div id="testimonial_slide" class="testi-slide"> <ul class="slides"> <li each="{ items }"> <img riot-src="{ parent.url + img }?tag=testimonials&user={user}" alt="{ user }"> <h4> <i class="fa fa-quote-left ion-quote"></i> { text} </h4> <p class="test-author"> { user } - <em>{ subtext }</em> </p> </li> </ul> </div> </div> </div> <div class="divide30"></div> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg('testimonials');

FrontEnd.MetaFire.getData(FrontEnd.site + '/testimonials').then(function (data) {
    try {
        _this.header = data.header;
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();

        $(_this.testimonial_slide).flexslider({
            slideshowSpeed: 5000,
            directionNav: false,
            animation: "fade"
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],25:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('blog-page', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> </div> <iframe if="{ data.youtubeid }" id="ytplayer" type="text/html" width="720" height="405" riot-src="https://www.youtube.com/embed/{ data.youtubeid }?autoplay=1" frameborder="0" allowfullscreen="" class="fitvids" style="height: 405px; width: 720px; display: block; margin-left: auto; margin-right: auto;"></iframe> <iframe if="{ data.vimeoid }" riot-src="https://player.vimeo.com/video/{ data.vimeoid }" width="720" height="405" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" class="fitvids" style="height: 405px; width: 720px; display: block; margin-left: auto; margin-right: auto;"></iframe> <div if="{ blog }" class="row"> <div class="col-sm-12 "> <div > <raw content="{ blog }"></raw> </div> <buttons buttons="{ data.buttons }"></buttons> </div> </div> <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.event.id) {
        _this.data = opts.event.item;

        _this.url = window.location.href;

        _this.update();

        var ref = FrontEnd.MetaFire.getChild(FrontEnd.site + '/content/' + opts.event.id);
        var firepad = new Firepad.Headless(ref);
        firepad.getHtml(function (html) {
            _this.blog = html;
            _this.update();
        });
    }
});
});
},{"riot":"riot"}],26:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('manifesto-page', '<div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <img src="https://c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/crlab/site/manifesto_poster_no_diagram.png" alt="Systems Thinking Manifesto" class="img-responsive"></img> </div> <div if="{ blog }" class="row"> <div class="col-sm-12 "> <div > <raw content="{ blog }"></raw> </div> <buttons buttons="{ data.buttons }"></buttons> </div> </div> <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.event.id) {
        _this.data = opts.event.item;

        _this.url = window.location.href;

        _this.update();

        var ref = FrontEnd.MetaFire.getChild(FrontEnd.site + '/content/systems-thinking-manifesto');
        var firepad = new Firepad.Headless(ref);
        firepad.getHtml(function (html) {
            _this.blog = html;
            _this.update();
        });
    }
});
});
},{"riot":"riot"}],27:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('not-found-page', '<div class="divide80"></div> <div class="container"> <div class="row"> <div class="col-md-12 text-center error-text"> <div class="divide30"></div> <h1 class="error-digit wow animated fadeInUp margin20 animated" style="visibility: visible; animation-name: fadeInUp; -webkit-animation-name: fadeInUp;"><i class="fa fa-thumbs-down"></i></h1> <h2>{ data.message }</h2> <p><a href="#explore" class="btn btn-lg btn-theme-dark">Go Back</a></p> </div> </div> </div>', function(opts) {var _this = this;

this.data = {
    message: 'Oops, that page could not be found!'
};

this.on('mount', function () {
    _this.update();
});
});
},{"riot":"riot"}],28:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('stms-page', '<div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.header.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.header.text }"></raw> </p> </div> <div class="row"> <div each="{ _.sortBy(data.items,\'order\') }" class="col-sm-6"> <div > <iframe if="{ youtubeid }" id="ytplayer_{ youtubeid }" type="text/html" height="400" riot-src="https://www.youtube.com/embed/{ youtubeid }?autoplay=0" frameborder="0" allowfullscreen=""></iframe> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.data = null;
this.on('mount', function () {
    FrontEnd.MetaFire.getData(FrontEnd.site + '/stms').then(function (data) {
        _this.data = data;
        _this.update();
    });
});
});
},{"riot":"riot"}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9HaXRodWIvdGhpbmstd2F0ZXIvZnJvbnRlbmQvc3JjL0Zyb250RW5kLmpzIiwiRDovR2l0aHViL3RoaW5rLXdhdGVyL2Zyb250ZW5kL3NyYy9lbnRyeS5qcyIsIkQ6L0dpdGh1Yi90aGluay13YXRlci9mcm9udGVuZC9zcmMvanMvY29yZS9Sb3V0ZXIuanMiLCJEOi9HaXRodWIvdGhpbmstd2F0ZXIvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9hZGR0aGlzLmpzIiwiRDovR2l0aHViL3RoaW5rLXdhdGVyL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZmFjZWJvb2suanMiLCJEOi9HaXRodWIvdGhpbmstd2F0ZXIvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkQ6L0dpdGh1Yi90aGluay13YXRlci9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIkQ6L0dpdGh1Yi90aGluay13YXRlci9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL3R3aXR0ZXIuanMiLCJEOi9HaXRodWIvdGhpbmstd2F0ZXIvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcC5qcyIsIkQ6L0dpdGh1Yi90aGluay13YXRlci9mcm9udGVuZC9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvYnV0dG9ucy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9jb21wb25lbnRzL2R5bmFtaWMtcGFnZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWJhbm5lci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWNvdW50bWVpbi50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWV4cGxvcmUudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1mb290ZXIudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1pbXBhY3QudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tYWluLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbWVzc2FnZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW1ldGhvZG9sb2d5LnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbmF2YmFyLW1lbnUudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uYXZiYXIudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uZXdzLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtdGVzdGltb25pYWxzLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2VzL2Jsb2ctcGFnZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlcy9tYW5pZmVzdG8tcGFnZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlcy9ub3QtZm91bmQtcGFnZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlcy9zdG1zLXBhZ2UudGFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN6QyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUNoRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUN0RCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUN4RCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FB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QUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUVqRyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDbEIsUUFBSSxDQUFDLEdBQUcsSUFBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUEsQ0FBRSxNQUFNLEdBQUcsQ0FBQyxBQUFDLEVBQUUsT0FBTyxVQUFVLENBQUM7QUFDbkUsUUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFBLENBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7QUFDdEYsUUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLEFBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQzdCLE9BQUcsSUFBSSxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3hGLE9BQUcsSUFBSSxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3ZGLE9BQUcsSUFBSSxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQzNGLE9BQUcsSUFBSSxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQzFGLE9BQUcsSUFBSSxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUksQ0FBQyxBQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQSxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNoSCxXQUFPLEdBQUcsQ0FBQztDQUNkOztBQUVELElBQUksTUFBTSxHQUFHO0FBQ1QsV0FBTyxFQUFFLGlCQUFDLE1BQU0sRUFBSztBQUNqQixZQUFJLEdBQUcsUUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxBQUFFLENBQUM7QUFDcEQsWUFBSSxNQUFNLEVBQUU7QUFDUixlQUFHLElBQU8sTUFBTSxNQUFHLENBQUM7U0FDdkI7QUFDRCxlQUFPLEdBQUcsQ0FBQztLQUNkO0FBQ0QsV0FBTyxFQUFFLGlCQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFLO0FBQy9CLGNBQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksU0FBSSxJQUFJLEVBQUksVUFBQyxJQUFJLEVBQUs7QUFDckUsZ0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxnQkFBSSxRQUFRLEVBQUU7QUFDVix3QkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xCO1NBQ0osQ0FBQyxDQUFDO0tBQ047QUFDRCxhQUFTLEVBQUUsbUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBSztBQUMzQixjQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFNBQUksSUFBSSxFQUFJLFVBQUMsSUFBSSxFQUFLO0FBQ3JFLGdCQUFJLFFBQVEsRUFBRTtBQUNWLHdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEI7U0FDSixDQUFDLENBQUM7S0FDTjtBQUNELGlCQUFhLEVBQUUsT0FBTztDQUN6QixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7QUMxQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgTWV0YUZpcmUgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZScpO1xyXG5sZXQgdXNlcnNuYXAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcCcpO1xyXG5sZXQgcmlvdCA9IHdpbmRvdy5yaW90O1xyXG5sZXQgUm91dGVyID0gcmVxdWlyZSgnLi9qcy9jb3JlL1JvdXRlcicpO1xyXG5sZXQgZ2EgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9nb29nbGUuanMnKTtcclxubGV0IHR3aXR0ZXIgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy90d2l0dGVyLmpzJyk7XHJcbmxldCBmYWNlYm9vayA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2ZhY2Vib29rLmpzJyk7XHJcbmxldCBhZGRUaGlzID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvYWRkdGhpcy5qcycpO1xyXG5cclxuY29uc3QgY29uZmlnID0gKCkgPT4ge1xyXG4gICAgY29uc3QgU0lURVMgPSB7XHJcbiAgICAgICAgQ1JMOiB7XHJcbiAgICAgICAgICAgIGRiOiAnbWV0YS1tYXAtcHJvZHVjdGlvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIENSTF9TVEFHSU5HOiB7XHJcbiAgICAgICAgICAgIGRiOiAnbWV0YS1tYXAtc3RhZ2luZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIFRISU5LX1dBVEVSOiB7XHJcbiAgICAgICAgICAgIGRiOiAndGhpbmt3YXRlci1wcm9kdWN0aW9uJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXQgPSB7XHJcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3QsXHJcbiAgICAgICAgc2l0ZToge31cclxuICAgIH1cclxuICAgIGxldCBzZWdtZW50cyA9IHJldC5ob3N0LnNwbGl0KCcuJyk7XHJcbiAgICBsZXQgZmlyc3QgPSBzZWdtZW50c1swXTtcclxuICAgIGlmIChmaXJzdCA9PT0gJ3d3dycpIHtcclxuICAgICAgICBmaXJzdCA9IHNlZ21lbnRzWzFdO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcclxuICAgICAgICBjYXNlICdtZXRhLW1hcC1zdGFnaW5nJzpcclxuICAgICAgICAgICAgcmV0LnNpdGUgPSBTSVRFUy5DUkxfU1RBR0lORztcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ2NybGFiJzpcclxuICAgICAgICBjYXNlICdmcm9udGVuZCc6XHJcbiAgICAgICAgICAgIHJldC5zaXRlID0gU0lURVMuQ1JMO1xyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAndGhpbmt3YXRlci1wcm9kdWN0aW9uJzpcclxuICAgICAgICBjYXNlICd0aGlua3dhdGVyLXN0YWdpbmcnOlxyXG4gICAgICAgIGNhc2UgJ3RoaW5rd2F0ZXInOlxyXG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTLlRISU5LX1dBVEVSO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuY2xhc3MgRnJvbnRFbmQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ3MpIHtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XHJcblxyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHRoaXMuc29jaWFsRmVhdHVyZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0U29jaWFsKCkge1xyXG4gICAgICAgIF8uZWFjaCh0aGlzLnNvY2lhbEZlYXR1cmVzLCAoZmVhdHVyZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihmZWF0dXJlKSBmZWF0dXJlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdmcm9udGVuZCc7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ2NvbmZpZycsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQodGhpcy5jb25maWcuc2l0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5jb25maWcuc2l0ZS50aXRsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZhdmljbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYXZpY28nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmF2aWNvLnNldEF0dHJpYnV0ZSgnaHJlZicsIGAke3RoaXMuY29uZmlnLnNpdGUuaW1hZ2VVcmx9ZmF2aWNvbi5pY29gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwodGhpcy5jb25maWcuc2l0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vblJlYWR5KCkudGhlbigoY29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgIGdhKHRoaXMuY29uZmlnLnNpdGUuZ29vZ2xlKTtcclxuICAgICAgICAgICAgdGhpcy5zb2NpYWxGZWF0dXJlcy5wdXNoKHR3aXR0ZXIoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc29jaWFsRmVhdHVyZXMucHVzaChmYWNlYm9vaygpKTtcclxuICAgICAgICAgICAgdGhpcy5zb2NpYWxGZWF0dXJlcy5wdXNoKGFkZFRoaXModGhpcy5jb25maWcuc2l0ZS5hZGR0aGlzLnB1YmlkKSk7XHJcbiAgICAgICAgICAgIHVzZXJzbmFwKCk7XHJcblxyXG4gICAgICAgICAgICByaW90Lm1vdW50KCcqJyk7XHJcbiAgICAgICAgICAgIHRoaXMuUm91dGVyID0gbmV3IFJvdXRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZyh2YWwpIHtcclxuICAgICAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdldmVudCcsICdsb2cnLCAnbGFiZWwnLCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGVycm9yKHZhbCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgICAgICAgd2luZG93LmdhKCdzZW5kJywgJ2V4Y2VwdGlvbicsIHtcclxuICAgICAgICAgICAgICAgICdleERlc2NyaXB0aW9uJzogdmFsLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAnZXhGYXRhbCc6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dpbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRnJvbnRFbmQ7IiwicmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxucmVxdWlyZSgnY29yZS1qcycpO1xyXG53aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcclxucmVxdWlyZSgnanF1ZXJ5LXVpJyk7XHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xyXG53aW5kb3cuRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xyXG53aW5kb3cuRmlyZXBhZCA9IHJlcXVpcmUoJ2ZpcmVwYWQnKTtcclxud2luZG93Lkh1bWFuaXplID0gcmVxdWlyZSgnaHVtYW5pemUtcGx1cycpO1xyXG53aW5kb3cubW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbndpbmRvdy5VUkkgPSByZXF1aXJlKCdVUklqcycpO1xyXG53aW5kb3cubG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpO1xyXG53aW5kb3cuUHMgPSByZXF1aXJlKCdwZXJmZWN0LXNjcm9sbGJhcicpO1xyXG5cclxubGV0IHRhZ3MgPSBbXHJcbiAgICAncGFnZS1oZWFkJyxcclxuICAgICdwYWdlLWJhbm5lcicsXHJcbiAgICAncGFnZS1pbXBhY3QnLFxyXG4gICAgJ3BhZ2UtY291bnRtZWluJyxcclxuICAgICdwYWdlLWZvb3RlcicsXHJcbiAgICAncGFnZS1uYXZiYXItbWVudScsXHJcbiAgICAncGFnZS1uYXZiYXInLFxyXG4gICAgJ3BhZ2UtbmV3cycsXHJcbiAgICAncGFnZS1leHBsb3JlJyxcclxuICAgICdwYWdlLW1lc3NhZ2UnLFxyXG4gICAgJ3BhZ2UtbWV0aG9kb2xvZ3knLFxyXG4gICAgJ3BhZ2UtdGVzdGltb25pYWxzJ1xyXG5dO1xyXG5cclxucmVxdWlyZSgnLi90YWdzL3BhZ2VzL2Jsb2ctcGFnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2VzL21hbmlmZXN0by1wYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZXMvc3Rtcy1wYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZXMvbm90LWZvdW5kLXBhZ2UudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9jb21wb25lbnRzL2J1dHRvbnMudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9jb21wb25lbnRzL2R5bmFtaWMtcGFnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtYmFubmVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1pbXBhY3QudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWNvdW50bWVpbi50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZm9vdGVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uZXdzLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1leHBsb3JlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tZXRob2RvbG9neS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtdGVzdGltb25pYWxzLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tYWluLnRhZycpO1xyXG5cclxudmFyIGNvbmZpZ01peGluID0gcmVxdWlyZSgnLi9qcy9taXhpbnMvY29uZmlnLmpzJyk7XHJcbnJpb3QubWl4aW4oJ2NvbmZpZycsIGNvbmZpZ01peGluKTtcclxuXHJcbnJpb3QudGFnKCdyYXcnLCAnPHNwYW4+PC9zcGFuPicsIGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IChvcHRzKSA/IChvcHRzLmNvbnRlbnQgfHwgJycpIDogJyc7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xyXG59KTtcclxuXHJcbnZhciBGcm9udEVuZCA9IHJlcXVpcmUoJy4vRnJvbnRFbmQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRnJvbnRFbmQodGFncyk7IiwiY29uc3Qgc3RhdGljUm91dGVzID0ge1xyXG4gICAgJ2NvbnRhY3QnOiB0cnVlLFxyXG4gICAgJ2hvbWUnOiB0cnVlLFxyXG4gICAgJ2V4cGxvcmUnOiB0cnVlLFxyXG4gICAgJ2NvdW50bWVpbic6IHRydWVcclxufVxyXG5cclxubGV0IGlzSGlkZGVuID0gZmFsc2U7XHJcbmxldCB0b2dnbGVNYWluID0gKGhpZGUsIHBhdGgpID0+IHtcclxuICAgIHRyYWNrKHBhdGgpO1xyXG4gICAgaWYgKGhpZGUpIHtcclxuICAgICAgICBpc0hpZGRlbiA9IHRydWU7XHJcbiAgICAgICAgJCgnI21haW4nKS5oaWRlKCk7XHJcbiAgICAgICAgJCgnI2F0NC1zaGFyZScpLnBhcmVudCgpLnNob3coKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlzSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgJCgnI2F0NC1zaGFyZScpLnBhcmVudCgpLmhpZGUoKTtcclxuICAgICAgICAkKCcjbWFpbicpLnNob3coKTtcclxuICAgICAgICAkKCdkeW5hbWljLXBhZ2UnKS5lbXB0eSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgdHJhY2sgPSAocGF0aCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICAgIHdpbmRvdy5nYSgnc2V0Jywge1xyXG4gICAgICAgICAgICBwYWdlOiBwYXRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJvdXRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xyXG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoID0gdGhpcy5nZXRQYXRoKHRhcmdldCk7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGljUm91dGVzW3BhdGhdKSB7XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNYWluKHRydWUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudCgnZHluYW1pYy1wYWdlJywgeyBpZDogcGF0aCB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvZ2dsZU1haW4oZmFsc2UsIHBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50byh3aW5kb3cubG9jYXRpb24uaGFzaCB8fCAnaG9tZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRQYXRoKHBhdGgpIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB3aGlsZSAocGF0aC5zdGFydHNXaXRoKCchJykgfHwgcGF0aC5zdGFydHNXaXRoKCcjJykpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gcm91dGUuZ2V0UGF0aChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdG8ocGF0aCkge1xyXG4gICAgICAgIHBhdGggPSByb3V0ZS5nZXRQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGlmIChzdGF0aWNSb3V0ZXNbcGF0aF0pIHtcclxuICAgICAgICAgICAgICAgIHRvZ2dsZU1haW4oZmFsc2UsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmlvdC5yb3V0ZShwYXRoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvZ2dsZU1haW4odHJ1ZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICByaW90LnJvdXRlKGAhJHtwYXRofWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gcm91dGUudG8ocGF0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHJvdXRlID0gUm91dGVyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXI7IiwidmFyIGFkZFRoaXMgPSBmdW5jdGlvbiAoYXBpS2V5KSB7XHJcbiAgICBcclxuICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcclxuICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgICB0ID0gd2luZG93LmFkZHRoaXMgfHwge307XHJcbiAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcclxuICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgIGpzLnNyYyA9IGAvL3M3LmFkZHRoaXMuY29tL2pzLzMwMC9hZGR0aGlzX3dpZGdldC5qcyNwdWJpZD0ke2FwaUtleX1gO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuXHJcbiAgICAgICAgdC5fZSA9IFtdO1xyXG4gICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgICAgICB0Ll9lLnB1c2goZik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9KGRvY3VtZW50LCBcInNjcmlwdFwiLCBcImFkZC10aGlzLWpzXCIpKTtcclxuXHJcbiAgICBsZXQgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICB3aW5kb3cuYWRkdGhpcy5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKFsnI2hvbWUnLCAnI2NvbnRhY3QnXS5pbmRleE9mKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHJ5Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhpZGVTaGFyZXMgPSBmdW5jdGlvbihrZWVwR29pbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2F0NC1zaGFyZScpICYmICQoJyNhdDQtc2hhcmUnKS5sZW5ndGggPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjYXQ0LXNoYXJlJykucGFyZW50KCkuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2VlcEdvaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmRlbGF5KGhpZGVTaGFyZXMsIDMwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5Q291bnQgKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRyeUNvdW50IDwgNjApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZGVsYXkoaGlkZVNoYXJlcywgMjUwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhpZGVTaGFyZXModHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5pdDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYWRkVGhpcztcclxuXHJcblxyXG4iLCJcclxudmFyIGZhY2Vib29rQXBpID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgXHJcbiAgICB3aW5kb3cuZmJBc3luY0luaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LkZCLmluaXQoe1xyXG4gICAgICAgICAgICBhcHBJZDogJzg0NzcwMjc3NTMwNDkwNicsXHJcbiAgICAgICAgICAgIHhmYm1sOiB0cnVlLFxyXG4gICAgICAgICAgICB2ZXJzaW9uOiAndjIuMydcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LkZCLkV2ZW50LnN1YnNjcmliZSgnZWRnZS5jcmVhdGUnLCBmdW5jdGlvbiAodGFyZ2V0VXJsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCAnZmFjZWJvb2snLCAnbGlrZScsIHRhcmdldFVybCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5GQi5FdmVudC5zdWJzY3JpYmUoJ2VkZ2UucmVtb3ZlJywgZnVuY3Rpb24gKHRhcmdldFVybCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgJ2ZhY2Vib29rJywgJ3VubGlrZScsIHRhcmdldFVybCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5GQi5FdmVudC5zdWJzY3JpYmUoJ21lc3NhZ2Uuc2VuZCcsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsICdmYWNlYm9vaycsICdzZW5kJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcclxuICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgIGpzLnNyYyA9IFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9zZGsuanNcIjtcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcbiAgICB9KGRvY3VtZW50LCAnc2NyaXB0JywgJ2ZhY2Vib29rLWpzc2RrJykpO1xyXG5cclxuICAgIHJldHVybiB3aW5kb3cuZmJBc3luY0luaXQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZhY2Vib29rQXBpO1xyXG5cclxuXHJcbiIsImxldCBGaXJlYmFzZSA9IHdpbmRvdy5GaXJlYmFzZTsgLy9yZXF1aXJlKCdmaXJlYmFzZScpO1xyXG5sZXQgUHJvbWlzZSA9IHdpbmRvdy5Qcm9taXNlO1xyXG5sZXQgbG9jYWxmb3JhZ2UgPSB3aW5kb3cubG9jYWxmb3JhZ2U7XHJcblxyXG5jbGFzcyBNZXRhRmlyZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoYGh0dHBzOi8vJHt0aGlzLmNvbmZpZy5zaXRlLmRifS5maXJlYmFzZWlvLmNvbWApO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuVGhpbmtXYXRlci5BdXRoMC5nZXRTZXNzaW9uKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LlRoaW5rV2F0ZXIuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmNvbmZpZy5zaXRlLmF1dGgwLmFwaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBwcm9maWxlLmlkX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoaXMuZmlyZWJhc2VfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGlzLmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhLCAuLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gdGhpcy5fbG9naW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpbjtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEgKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBjaGlsZC5vcmRlckJ5Q2hpbGQoJ29yZGVyJykub25jZSgndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoeyBtZXNzYWdlOiBgQ2Fubm90IGFjY2VzcyAke3BhdGh9YCB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uIChwYXRoLCBjYWxsYmFjaywgZXZlbnQgPSAndmFsdWUnICkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLm9yZGVyQnlDaGlsZCgnb3JkZXInKS5vbihldmVudCwgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9mZihwYXRoLCBtZXRob2Q9J3ZhbHVlJyxjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhIChkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1c2hEYXRhIChkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhSW5UcmFuc2FjdGlvbiAoZGF0YSwgcGF0aCwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnRyYW5zYWN0aW9uKChjdXJyZW50VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0ICgpIHtcclxuICAgICAgICB0aGlzLl9sb2dpbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fb25SZWFkeSA9IG51bGw7XHJcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnZmlyZWJhc2VfdG9rZW4nKTtcclxuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiXHJcbnZhciBnb29nbGVBbmFseXRpY3MgPSBmdW5jdGlvbiAoYXBpKSB7XHJcbiAgICBcclxuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcclxuICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxyXG4gIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAgICdndG0uc3RhcnQnOlxyXG4gICAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xyXG4gICAgICB9KTsgdmFyIGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cclxuICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgYXBpLnRhZ21hbmFnZXIpO1xyXG5cclxuICAgIC8vIEdvb2dsZSBBbmFseXRpY3MgQVBJXHJcbiAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XHJcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcclxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcclxuXHJcbiAgICB3aW5kb3cuZ2EoJ2NyZWF0ZScsIGFwaS5hbmFseXRpY3MsICdhdXRvJyk7XHJcbiAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgIHJldHVybiB3aW5kb3cuZ2E7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdvb2dsZUFuYWx5dGljcztcclxuXHJcblxyXG4iLCIvLyBEZWZpbmUgb3VyIGN1c3RvbSBldmVudCBoYW5kbGVyc1xyXG5mdW5jdGlvbiBjbGlja0V2ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcclxuICAgIHZhciBsYWJlbCA9IGludGVudEV2ZW50LnJlZ2lvbjtcclxuICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCAndHdpdHRlcicsIGludGVudEV2ZW50LnR5cGUsIGxhYmVsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgdmFyIGxhYmVsID0gXCJ0d2VldFwiO1xyXG4gICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsICd0d2l0dGVyJywgaW50ZW50RXZlbnQudHlwZSwgbGFiZWwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmYXZJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgdHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJldHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgdmFyIGxhYmVsID0gaW50ZW50RXZlbnQuZGF0YS5zb3VyY2VfdHdlZXRfaWQ7XHJcbiAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgJ3R3aXR0ZXInLCBpbnRlbnRFdmVudC50eXBlLCBsYWJlbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvbGxvd0ludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICB2YXIgbGFiZWwgPSBpbnRlbnRFdmVudC5kYXRhLnVzZXJfaWQgKyBcIiAoXCIgKyBpbnRlbnRFdmVudC5kYXRhLnNjcmVlbl9uYW1lICsgXCIpXCI7XHJcbiAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgJ3R3aXR0ZXInLCBpbnRlbnRFdmVudC50eXBlLCBsYWJlbCk7XHJcbn1cclxuXHJcblxyXG52YXIgdHdpdHRlckFwaSA9IGZ1bmN0aW9uIChhcGlLZXkpIHtcclxuICAgIFxyXG4gICAgd2luZG93LnR3dHRyID0gKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgIHQgPSB3aW5kb3cudHd0dHIgfHwge307XHJcbiAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcclxuICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgIGpzLnNyYyA9IFwiaHR0cHM6Ly9wbGF0Zm9ybS50d2l0dGVyLmNvbS93aWRnZXRzLmpzXCI7XHJcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xyXG5cclxuICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgdC5yZWFkeSA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgICAgIHQuX2UucHVzaChmKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH0oZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwidHdpdHRlci13anNcIikpO1xyXG5cclxuICAgIHdpbmRvdy50d3R0ci5yZWFkeSgodHdpdHRlcikgPT4ge1xyXG4gICAgICAgIHR3aXR0ZXIud2lkZ2V0cy5sb2FkKCk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnY2xpY2snLCBjbGlja0V2ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ3R3ZWV0JywgdHdlZXRJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgncmV0d2VldCcsIHJldHdlZXRJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnZmF2b3JpdGUnLCBmYXZJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnZm9sbG93JywgZm9sbG93SW50ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IHRyeUNvdW50ID0gMDtcclxuICAgIGxldCBsb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cudHd0dHIgJiYgd2luZG93LnR3dHRyLndpZGdldHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy50d3R0ci53aWRnZXRzLmxvYWQoKTtcclxuICAgICAgICB9IGVsc2UgaWYodHJ5Q291bnQgPCA1KSB7XHJcbiAgICAgICAgICAgIHRyeUNvdW50ICs9IDE7XHJcbiAgICAgICAgICAgIF8uZGVsYXkobG9hZCwgMjUwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxvYWQ7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0d2l0dGVyQXBpO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgdXNlclNuYXAgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICB2YXIgYXBpS2V5ID0gJzAzMmJhZjg3LTg1NDUtNGViYy1hNTU3LTkzNDg1OTM3MWZhNS5qcycsIHMsIHg7XHJcbiAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICBjb25maWcgPSB7fTtcclxuICAgIH1cclxuICAgIGFwaUtleSA9IGNvbmZpZy5VU0VSX1NOQVBfQVBJX0tFWTtcclxuICAgIGlmIChhcGlLZXkgJiYgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICE9PSAnbG9jYWxob3N0Jykge1xyXG4gICAgICAgIHdpbmRvdy51c2Vyc25hcGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgbW9kZTogJ3JlcG9ydCcsXHJcbiAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxyXG4gICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNuYXAuc2V0RW1haWxCb3goRG9jLmFwcC51c2VyLnVzZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIHMuc3JjID0gJy8vYXBpLnVzZXJzbmFwLmNvbS9sb2FkLycgKyBhcGlLZXkgKyAnLmpzJztcclxuICAgICAgICB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcclxuICAgICAgICByZXR1cm4geC5hcHBlbmRDaGlsZChzKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXNlclNuYXA7XHJcblxyXG5cclxuIiwiY29uc3QgYSA9IFsnJywgJ29uZSAnLCAndHdvICcsICd0aHJlZSAnLCAnZm91ciAnLCAnZml2ZSAnLCAnc2l4ICcsICdzZXZlbiAnLCAnZWlnaHQgJywgJ25pbmUgJywgJ3RlbiAnLCAnZWxldmVuICcsICd0d2VsdmUgJywgJ3RoaXJ0ZWVuICcsICdmb3VydGVlbiAnLCAnZmlmdGVlbiAnLCAnc2l4dGVlbiAnLCAnc2V2ZW50ZWVuICcsICdlaWdodGVlbiAnLCAnbmluZXRlZW4gJ107XHJcbmNvbnN0IGIgPSBbJycsICcnLCAndHdlbnR5JywgJ3RoaXJ0eScsICdmb3J0eScsICdmaWZ0eScsICdzaXh0eScsICdzZXZlbnR5JywgJ2VpZ2h0eScsICduaW5ldHknXTtcclxuXHJcbmZ1bmN0aW9uIGluV29yZHMobnVtKSB7XHJcbiAgICBpZiAoIW51bSB8fCAoKG51bSA9IG51bS50b1N0cmluZygpKS5sZW5ndGggPiA5KSkgcmV0dXJuICdvdmVyZmxvdyc7XHJcbiAgICBsZXQgbiA9ICgnMDAwMDAwMDAwJyArIG51bSkuc3Vic3RyKC05KS5tYXRjaCgvXihcXGR7Mn0pKFxcZHsyfSkoXFxkezJ9KShcXGR7MX0pKFxcZHsyfSkkLyk7XHJcbiAgICBpZiAoIW4pIHJldHVybjsgdmFyIHN0ciA9ICcnO1xyXG4gICAgc3RyICs9IChuWzFdICE9IDApID8gKGFbTnVtYmVyKG5bMV0pXSB8fCBiW25bMV1bMF1dICsgJyAnICsgYVtuWzFdWzFdXSkgKyAnY3JvcmUgJyA6ICcnO1xyXG4gICAgc3RyICs9IChuWzJdICE9IDApID8gKGFbTnVtYmVyKG5bMl0pXSB8fCBiW25bMl1bMF1dICsgJyAnICsgYVtuWzJdWzFdXSkgKyAnbGFraCAnIDogJyc7XHJcbiAgICBzdHIgKz0gKG5bM10gIT0gMCkgPyAoYVtOdW1iZXIoblszXSldIHx8IGJbblszXVswXV0gKyAnICcgKyBhW25bM11bMV1dKSArICd0aG91c2FuZCAnIDogJyc7XHJcbiAgICBzdHIgKz0gKG5bNF0gIT0gMCkgPyAoYVtOdW1iZXIobls0XSldIHx8IGJbbls0XVswXV0gKyAnICcgKyBhW25bNF1bMV1dKSArICdodW5kcmVkICcgOiAnJztcclxuICAgIHN0ciArPSAobls1XSAhPSAwKSA/ICgoc3RyICE9ICcnKSA/ICdhbmQgJyA6ICcnKSArIChhW051bWJlcihuWzVdKV0gfHwgYltuWzVdWzBdXSArICcgJyArIGFbbls1XVsxXV0pICsgJycgOiAnJztcclxuICAgIHJldHVybiBzdHI7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcbiAgICBwYXRoSW1nOiAoZm9sZGVyKSA9PiB7XHJcbiAgICAgICAgbGV0IHJldCA9IGAke3dpbmRvdy5Gcm9udEVuZC5jb25maWcuc2l0ZS5pbWFnZVVybH1gO1xyXG4gICAgICAgIGlmIChmb2xkZXIpIHtcclxuICAgICAgICAgICAgcmV0ICs9IGAke2ZvbGRlcn0vYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0sXHJcbiAgICBnZXREYXRhOiAocGF0aCwgY2FsbGJhY2ssIHRoYXQpID0+IHtcclxuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuTWV0YUZpcmUub24oYCR7d2luZG93LkZyb250RW5kLnNpdGV9LyR7cGF0aH1gLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGF0LmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGF0LnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgd2F0Y2hEYXRhOiAocGF0aCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuTWV0YUZpcmUub24oYCR7d2luZG93LkZyb250RW5kLnNpdGV9LyR7cGF0aH1gLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgbnVtYmVyVG9Xb3JkczogaW5Xb3Jkc1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdidXR0b25zJywgJzxkaXYgY2xhc3M9XCJyb3cgY2VudGVyLWhlYWRpbmdcIj4gPHNwYW4gZWFjaD1cInsgXy5zb3J0Qnkob3B0cy5idXR0b25zLFxcJ29yZGVyXFwnKSB9XCI+IDxhIGlmPVwieyAhYW1hem9uaWQgfVwiIHJvbGU9XCJidXR0b25cIiBocmVmPVwieyBsaW5rIH1cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB0aXRsZSB9IDwvYT4gPGRpdiBpZj1cInsgYW1hem9uaWQgfVwiIGNsYXNzPVwiY29sLXNtLXsgcGFyZW50LmNlbGwgfSBcIj4gPGlmcmFtZSBzdHlsZT1cIndpZHRoOiAxMjBweDsgaGVpZ2h0OiAyNDBweDtcIiBtYXJnaW53aWR0aD1cIjBcIiBtYXJnaW5oZWlnaHQ9XCIwXCIgc2Nyb2xsaW5nPVwibm9cIiBmcmFtZWJvcmRlcj1cIjBcIiByaW90LXNyYz1cIi8vd3MtbmEuYW1hem9uLWFkc3lzdGVtLmNvbS93aWRnZXRzL3E/U2VydmljZVZlcnNpb249MjAwNzA4MjImT25lSlM9MSZPcGVyYXRpb249R2V0QWRIdG1sJk1hcmtldFBsYWNlPVVTJnNvdXJjZT1hYyZyZWY9dGZfdGlsJmFkX3R5cGU9cHJvZHVjdF9saW5rJnRyYWNraW5nX2lkPWNhYnJyZXNlbGFiLTIwJm1hcmtldHBsYWNlPWFtYXpvbiZyZWdpb249VVMmcGxhY2VtZW50PXsgYW1hem9uaWQgfSZhc2lucz17IGFtYXpvbmlkIH0mbGlua0lkPURJWTNUVU9QREZIM05RV0Ymc2hvd19ib3JkZXI9ZmFsc2UmbGlua19vcGVuc19pbl9uZXdfd2luZG93PXRydWVcIj48L2lmcmFtZT4gPC9kaXY+IDwvc3Bhbj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuY2VsbCA9IDY7XG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLmJ1dHRvbnMpIHtcbiAgICAgICAgX3RoaXMuY2VsbCA9IE1hdGgucm91bmQoMTIgLyBfLmtleXMob3B0cy5idXR0b25zKS5sZW5ndGgpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnZHluYW1pYy1wYWdlJywgJzxzZWN0aW9uIGlkPVwieyBfLmtlYmFiQ2FzZShkYXRhLnRpdGxlKSB9XCIgPiA8ZGl2IGNsYXNzPVwiZGl2aWRlNTBcIj48L2Rpdj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGlkPVwibW9kYWxfZGlhbG9nX2NvbnRhaW5lclwiPiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xudGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSA3NTtcbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuaWQgJiYgb3B0cy5pZCAhPSAnIycpIHtcblxuICAgICAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2V4cGxvcmUvaXRlbXMvJyArIG9wdHMuaWQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkaWFsb2dDbGFzcyA9ICdibG9nLXBhZ2UnO1xuXG4gICAgICAgICAgICBpZiAob3B0cy5pZCA9PSAndGhlLXN5c3RlbXMtdGhpbmtpbmctbWFuaWZlc3RvLXBvc3RlcicpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgICAgICBkaWFsb2dDbGFzcyA9ICdtYW5pZmVzdG8tcGFnZSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMuaWQgPT0gJ3N0bXMnKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgICAgICAgICAgZGlhbG9nQ2xhc3MgPSAnc3Rtcy1wYWdlJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgICAgICBkaWFsb2dDbGFzcyA9ICdub3QtZm91bmQtcGFnZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIG9wdHMuZXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBvcHRzLmlkLFxuICAgICAgICAgICAgICAgICAgICBkaWFsb2c6IF90aGlzLm1vZGFsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoX3RoaXMubW9kYWxfZGlhbG9nX2NvbnRhaW5lciwgZGlhbG9nQ2xhc3MsIG9wdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1iYW5uZXInLCAnPGRpdiBjbGFzcz1cImZ1bGx3aWR0aGJhbm5lclwiPiA8ZGl2IGlkPVwidHBfYmFubmVyXCIgY2xhc3M9XCJ0cC1iYW5uZXJcIj4gPHVsPiAgPGxpIGVhY2g9XCJ7IGRhdGEgfVwiIGRhdGEtdHJhbnNpdGlvbj1cImZhZGVcIiBkYXRhLXNsb3RhbW91bnQ9XCI1XCIgZGF0YS10aXRsZT1cInsgdGl0bGUgfVwiIHN0eWxlPVwiYmFja2dyb3VuZDogcmdiKDI0MCwxMTAsMzApO1wiID4gIDxpbWcgaWY9XCJ7ICF5b3V0dWJlaWQgJiYgaW1nICYmIGltZyAhPSBcXCd1bmRlZmluZWRcXCcgfVwiIHJpb3Qtc3JjPVwie3BhcmVudC51cmwraW1nfT90YWc9YmFubmVyXCIgYWx0PVwiZGFya2JsdXJiZ1wiIGRhdGEtYmdmaXQ9XCJjb3ZlclwiIGRhdGEtYmdwb3NpdGlvbj1cImxlZnQgdG9wXCIgZGF0YS1iZ3JlcGVhdD1cIm5vLXJlcGVhdFwiPiA8ZGl2IGlmPVwieyAheW91dHViZWlkICYmIHRpdGxlIH1cIiBjbGFzcz1cImNhcHRpb24gdGl0bGUtMiBzZnRcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjEwMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjEwMDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IDxyYXcgY29udGVudD1cInsgdGl0bGUgfVwiPjwvcmF3PiA8L2Rpdj4gPGRpdiBpZj1cInsgIXlvdXR1YmVpZCAmJiBzdWJ0ZXh0IH1cIiBjbGFzcz1cImNhcHRpb24gdGV4dCBzZmxcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjIyMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IDxyYXcgY29udGVudD1cInsgc3VidGV4dCB9XCI+PC9yYXc+IDwvZGl2PiA8ZGl2IGlmPVwieyAheW91dHViZWlkIH1cIiBlYWNoPVwieyB2YWwsIGkgaW4gXy5zb3J0QnkoYnV0dG9ucywgXFwnb3JkZXJcXCcpIH1cIj4gPGRpdiBjbGFzcz1cImNhcHRpb24gc2ZiIHJldi1idXR0b25zIHRwLXJlc2l6ZW1lXCIgZGF0YS14PVwieyA1MCArIGkqMjAwIH1cIiBkYXRhLXk9XCIzNTVcIiBkYXRhLXNwZWVkPVwiNTAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cIlNpbmUuZWFzZU91dFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5nZXRMaW5rIH1cIj4gPGEgaHJlZj1cInsgdmFsLmxpbmsgfHwgXFwnXFwnIH1cIiB0YXJnZXQ9XCJ7IF9ibGFuazogdmFsLmxpbmsuc3RhcnRzV2l0aChcXCdodHRwXFwnKSB9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCI+eyB2YWwudGl0bGUgfTwvYT4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlmPVwieyB5b3V0dWJlaWQgfVwiIGNsYXNzPVwidHAtY2FwdGlvbiBzZnQgY3VzdG9tb3V0IHRwLXZpZGVvbGF5ZXJcIiBkYXRhLXg9XCJjZW50ZXJcIiBkYXRhLWhvZmZzZXQ9XCIwXCIgZGF0YS15PVwiY2VudGVyXCIgZGF0YS12b2Zmc2V0PVwiMFwiIGRhdGEtY3VzdG9taW49XCJ4OjA7eTowO3o6MDtyb3RhdGlvblg6MDtyb3RhdGlvblk6MDtyb3RhdGlvblo6MDtzY2FsZVg6NTtzY2FsZVk6NTtza2V3WDowO3NrZXdZOjA7b3BhY2l0eTowO3RyYW5zZm9ybVBlcnNwZWN0aXZlOjYwMDt0cmFuc2Zvcm1PcmlnaW46NTAlIDUwJTtcIiBkYXRhLWN1c3RvbW91dD1cIng6MDt5OjA7ejowO3JvdGF0aW9uWDowO3JvdGF0aW9uWTowO3JvdGF0aW9uWjowO3NjYWxlWDowLjc1O3NjYWxlWTowLjc1O3NrZXdYOjA7c2tld1k6MDtvcGFjaXR5OjA7dHJhbnNmb3JtUGVyc3BlY3RpdmU6NjAwO3RyYW5zZm9ybU9yaWdpbjo1MCUgNTAlO1wiIGRhdGEtc3BlZWQ9XCI2MDBcIiBkYXRhLXN0YXJ0PVwiMTAwMFwiIGRhdGEtZWFzaW5nPVwiUG93ZXI0LmVhc2VPdXRcIiBkYXRhLWVuZHNwZWVkPVwiNTAwXCIgZGF0YS1lbmRlYXNpbmc9XCJQb3dlcjQuZWFzZU91dFwiIGRhdGEtYXV0b3BsYXk9XCJ0cnVlXCIgZGF0YS1hdXRvcGxheW9ubHlmaXJzdHRpbWU9XCJmYWxzZVwiIGRhdGEtbmV4dHNsaWRlYXRlbmQ9XCJmYWxzZVwiIGRhdGEtdGh1bWJpbWFnZT1cImh0dHBzOi8vaW1nLnlvdXR1YmUuY29tL3ZpL3sgeW91dHViZWlkIH0vbXFkZWZhdWx0LmpwZ1wiPiA8aWZyYW1lIHJpb3Qtc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQveyB5b3V0dWJlaWQgfT9oZD0xJndtb2RlPW9wYXF1ZSZjb250cm9scz0xJnNob3dpbmZvPTBcIiB3aWR0aD1cIjEwNjZweFwiIGhlaWdodD1cIjYwMHB4XCIgc3R5bGU9XCJ3aWR0aDoxMDY2cHg7aGVpZ2h0OjYwMHB4O1wiID4gPC9pZnJhbWU+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+JywgJ2lkPVwiaG9tZVwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygnc2l0ZScpO1xudGhpcy5tb3VudGVkID0gZmFsc2U7XG5cbnRoaXMud2F0Y2hEYXRhKCcvYmFubmVyJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAoZmFsc2UgPT0gX3RoaXMubW91bnRlZCkge1xuICAgICAgICAgICAgX3RoaXMubW91bnRlZCA9IHRydWU7XG4gICAgICAgICAgICBfdGhpcy5kYXRhID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgJChfdGhpcy50cF9iYW5uZXIpLnJldm9sdXRpb24oe1xuICAgICAgICAgICAgICAgIHN0b3BBdFNsaWRlOiAxLFxuICAgICAgICAgICAgICAgIHN0b3BBZnRlckxvb3BzOiAwLFxuICAgICAgICAgICAgICAgIHN0YXJ0d2lkdGg6IDExNzAsXG4gICAgICAgICAgICAgICAgc3RhcnRoZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgICBoaWRlVGh1bWJzOiAxMFxuICAgICAgICAgICAgICAgIC8vZnVsbFdpZHRoOiBcIm9uXCIsXG4gICAgICAgICAgICAgICAgLy9mb3JjZUZ1bGxXaWR0aDogXCJvblwiLFxuICAgICAgICAgICAgICAgIC8vbGF6eUxvYWQ6IFwib25cIlxuICAgICAgICAgICAgICAgIC8vIG5hdmlnYXRpb25TdHlsZTogXCJwcmV2aWV3NFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvdW50bWVpbicsICc8c2VjdGlvbiBpZj1cInsgZGF0YSB9XCIgc3R5bGU9XCJiYWNrZ3JvdW5kOiByZ2IoMjEyLCAyMTQsIDIxNSk7XCI+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBpZD1cImltcGFjdF9pbWdcIiBjbGFzcz1cImNvbC1tZC02XCI+IDxpbWcgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIjcgYmlsbGlvbiB0aGlua2Vyc1wiIHJpb3Qtc3JjPVwieyB1cmwraW1wYWN0LmltZ30/dGFnPWNvdW50bWVpblwiPjwvaW1nPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxicj4gPGRpdiBjbGFzcz1cImZhY3RzLWluXCI+IDxoMz4gPHNwYW4gaWQ9XCJjb3VudGVyXCIgY2xhc3M9XCJjb3VudGVyXCI+eyBIdW1hbml6ZS5mb3JtYXROdW1iZXIoZGF0YS50b3RhbCkgfTwvc3Bhbj4rIDwvaDM+IDxicj4gPGgzIHN0eWxlPVwiZm9udC1zaXplOiAzNXB4OyBmb250LXdlaWdodDogNzAwO1wiPnsgZW5nYWdlLnN1YnRleHQgfTwvaDM+IDxkaXYgaWQ9XCJtY19lbWJlZF9zaWdudXBcIj4gPGZvcm0gYWN0aW9uPVwiLy9jYWJyZXJhbGFicy51czQubGlzdC1tYW5hZ2UuY29tL3N1YnNjcmliZS9wb3N0P3U9NTg5NDczODUzODNkMzIzY2FmOTA0N2YzOSZhbXA7aWQ9OTc5OWQzYTdiOVwiIG1ldGhvZD1cInBvc3RcIiBpZD1cIm1jLWVtYmVkZGVkLXN1YnNjcmliZS1mb3JtXCIgbmFtZT1cIm1jLWVtYmVkZGVkLXN1YnNjcmliZS1mb3JtXCIgY2xhc3M9XCJcIiB0YXJnZXQ9XCJfYmxhbmtcIiBub3ZhbGlkYXRlPVwiXCI+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+eyBkYXRhLm5ld3NsZXR0ZXIudGV4dCB9PC9wPiA8ZGl2IGlkPVwibWNfZW1iZWRfc2lnbnVwX3Njcm9sbFwiPiA8ZGl2IGNsYXNzPVwibWMtZmllbGQtZ3JvdXBcIj4gPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+IDxpbnB1dCB0eXBlPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cInsgZGF0YS5uZXdzbGV0dGVyW1xcJ3N1YnNjcmliZS10ZXh0XFwnXSB8fCBcXCdFbnRlciB5b3VyIGVtYWlsIHRvIHN1YnNjcmliZVxcJyB9XCIgc3R5bGU9XCJoZWlnaHQ6IDMxcHg7XCIgdmFsdWU9XCJcIiBuYW1lPVwiRU1BSUxcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwibWNlLUVNQUlMXCI+IDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+IDxpbnB1dCByb2xlPVwiYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiIHN0eWxlPVwiZm9udC12YXJpYW50OiBzbWFsbC1jYXBzOyB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcIiB2YWx1ZT1cInsgaW1wYWN0LnRleHQgfVwiIG5hbWU9XCJzdWJzY3JpYmVcIiBpZD1cIm1jLWVtYmVkZGVkLXN1YnNjcmliZVwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1iZ1wiPnsgaW1wYWN0LnRleHQgfTwvaW5wdXQ+IDwvc3Bhbj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogLTUwMDBweDtcIj4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImJfNTg5NDczODUzODNkMzIzY2FmOTA0N2YzOV85Nzk5ZDNhN2I5XCIgdGFiaW5kZXg9XCItMVwiIHZhbHVlPVwiXCI+IDwvZGl2PiA8ZGl2IGlkPVwibWNlLXJlc3BvbnNlc1wiIGNsYXNzPVwiY2xlYXJcIiBzdHlsZT1cIm1hcmdpbi10b3A6IDVweDtcIj4gPGRpdiBjbGFzcz1cInJlc3BvbnNlXCIgaWQ9XCJtY2UtZXJyb3ItcmVzcG9uc2VcIiBzdHlsZT1cImNvbG9yOiByZWQ7IGRpc3BsYXk6bm9uZVwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwicmVzcG9uc2VcIiBpZD1cIm1jZS1zdWNjZXNzLXJlc3BvbnNlXCIgc3R5bGU9XCJjb2xvcjogI2ZmZjsgZGlzcGxheTpub25lXCI+PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9mb3JtPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgY29sLXNtLTQgY29sLXhzLTRcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBjb2wtc20tNCBjb2wteHMtNFwiPiA8ZGl2IGNsYXNzPVwiYWRkdGhpc19ob3Jpem9udGFsX2ZvbGxvd190b29sYm94XCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgbWFyZ2luMzAgaGlkZGVuLXhzIGhpZGRlbi1zbVwiPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwibm8tcGFkZGluZy1pbm5lciBncmF5XCI+IDxoMyBjbGFzcz1cIndvdyBhbmltYXRlZCBmYWRlSW5Eb3duZmFkZUluUmlnaHQgYW5pbWF0ZWRcIiBzdHlsZT1cInZpc2liaWxpdHk6IHZpc2libGU7IHRleHQtYWxpZ246IGNlbnRlcjtcIj4geyBudW1iZXJUb1dvcmRzKGVuZ2FnZS5vcHRpb25zLmxlbmd0aCkgfSBtb3JlIHRoaW5ncyB5b3UgY2FuIGRvOiA8L2gzPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNFwiIGVhY2g9XCJ7IHZhbCwgaSBpbiBlbmdhZ2Uub3B0aW9ucyB9XCI+IDxkaXYgY2xhc3M9XCJzZXJ2aWNlcy1ib3ggbWFyZ2luMzAgd293IGFuaW1hdGVkIGZhZGVJblJpZ2h0IGFuaW1hdGVkXCIgc3R5bGU9XCJ2aXNpYmlsaXR5OiB2aXNpYmxlOyBhbmltYXRpb24tbmFtZTogZmFkZUluUmlnaHQ7IC13ZWJraXQtYW5pbWF0aW9uLW5hbWU6IGZhZGVJblJpZ2h0O1wiPiA8ZGl2IGNsYXNzPVwic2VydmljZXMtYm94LWljb25cIj4gPGkgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIj48L2k+IDwvZGl2PiA8ZGl2IGNsYXNzPVwic2VydmljZXMtYm94LWluZm9cIj4gPGg0PnsgdmFsLnRpdGxlIH08L2g0PiA8cD57IHZhbC50ZXh0IH08L3A+IDxkaXYgaWY9XCJ7IHZhbC5idXR0b25zIH1cIiBlYWNoPVwieyBfLnNvcnRCeSh2YWwuYnV0dG9ucywgXFwnb3JkZXJcXCcpIH1cIj4gPGEgaHJlZj1cInsgbGluayB8fCBcXCdcXCcgfVwiIHRhcmdldD1cInsgdGFyZ2V0IHx8IFxcJ1xcJ31cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIj57IHRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCAnaWQ9XCJjb3VudG1laW5cIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBudWxsO1xudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygnc2l0ZScpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2NvdW50LW1lLWluJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBfdGhpcy5kYXRhLm5ld3NsZXR0ZXIgPSBfdGhpcy5kYXRhLm5ld3NsZXR0ZXIgfHwge307XG4gICAgICAgIF90aGlzLmRhdGEubmV3c2xldHRlclsnc3Vic2NyaWJlLXRleHQnXSA9IF90aGlzLmRhdGEubmV3c2xldHRlclsnc3Vic2NyaWJlLXRleHQnXSB8fCAnU3Vic2NyaWJlIHRvIG91ciBuZXdzbGV0dGVyJztcbiAgICAgICAgX3RoaXMuaW1wYWN0ID0gZGF0YS5pbXBhY3Q7XG4gICAgICAgIF90aGlzLmVuZ2FnZSA9IGRhdGEuZW5nYWdlO1xuICAgICAgICBfdGhpcy5lbmdhZ2Uub3B0aW9ucyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuZW5nYWdlLm9wdGlvbnMsICdvcmRlcicpLCBmdW5jdGlvbiAob3B0KSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0LmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMuY291bnRlcikuY291bnRlclVwKHtcbiAgICAgICAgICAgIGRlbGF5OiAxMDAsXG4gICAgICAgICAgICB0aW1lOiA4MDBcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZXhwbG9yZScsICc8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPiA8c3Ryb25nPnsgaGVhZGVyLnRpdGxlIH08L3N0cm9uZz4gPC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWY9XCJ7IGZpbHRlcnMgfVwiIGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJjdWJlLW1hc29ucnlcIj4gPGRpdiBpZD1cImZpbHRlcnNfY29udGFpbmVyXCIgY2xhc3M9XCJjYnAtbC1maWx0ZXJzLWFsaWduQ2VudGVyXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIGZpbHRlcnMgfVwiIGRhdGEtZmlsdGVyPVwiLnsgdmFsLnRhZyB9XCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW0geyBcXCdjYnAtZmlsdGVyLWl0ZW0tYWN0aXZlXFwnOiBpID09IDAgfVwiPiB7IHZhbC5uYW1lIH0gPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9XCJtYXNvbnJ5X2NvbnRhaW5lclwiIGNsYXNzPVwiY2JwXCI+IDxhIGlkPVwieyBpZCB9XCIgaHJlZj1cInsgbGluayB8fCBcXCcjIVxcJytpZCB9XCIgdGFyZ2V0PVwiX2JsYW5rXCIgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiIGVhY2g9XCJ7IGNvbnRlbnQgfVwiIGNsYXNzPVwiY2JwLWl0ZW0geyB0eXBlIH0geyBfLmtleXModGFncykuam9pbihcXCcgXFwnKSB9XCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvblwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBpZj1cInsgaW1nICYmIGltZy5sZW5ndGggfVwiIHJpb3Qtc3JjPVwie3BhcmVudC51cmwrdHlwZX0ve2ltZ30/dGFnPWV4cGxvcmVcIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBpZj1cInsgdGl0bGUgfVwiIGNsYXNzPVwieyBcXCdjYnAtbC1jYXB0aW9uLXRpdGxlXFwnOiB0cnVlIH1cIiA+eyB0aXRsZSB9PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8L2Rpdj4gIDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlNTBcIj48L2Rpdj4gPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBvbmNsaWNrPVwieyBzaG93QWxsIH1cIiBjbGFzcz1cImJ0biBidG4tdGhlbWUtZGFyayBidG4tbGdcIj5FeHBsb3JlIEFsbDwvYT4gPC9kaXY+JywgJ2lkPVwiZXhwbG9yZVwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZmlsdGVycyA9IFtdO1xudGhpcy5oZWFkZXIgPSBbXTtcbnRoaXMuY29udGVudCA9IFtdO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbnRoaXMuc2hvd0FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKF90aGlzLm1hc29ucnlfY29udGFpbmVyKS5jdWJlcG9ydGZvbGlvKCdmaWx0ZXInLCAnKicpO1xufTtcblxudGhpcy5vbkNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAodGhpcy5saW5rKSByZXR1cm4gdHJ1ZTtcbiAgICBGcm9udEVuZC5Sb3V0ZXIudG8oXy5rZWJhYkNhc2UoZS5pdGVtLmlkKSwgZSwgdGhpcyk7XG59O1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2V4cGxvcmUnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuZmlsdGVycyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuZmlsdGVycywgJ29yZGVyJyksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gaS5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuaXRlbXMgPSBfLnNvcnRCeShfLm1hcChkYXRhLml0ZW1zLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcbiAgICAgICAgICAgIGlmICh2YWwgJiYgISh2YWwuYXJjaGl2ZSA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YWwuaWQgPSBrZXk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksICdvcmRlcicpO1xuICAgICAgICBfdGhpcy5jb250ZW50ID0gX3RoaXMuaXRlbXM7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIHZhciBkZWZhdWx0RmlsdGVyID0gXy5maXJzdChfdGhpcy5maWx0ZXJzLCBmdW5jdGlvbiAoZmlsdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyWydkZWZhdWx0J10gPT09IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoX3RoaXMubWFzb25yeV9jb250YWluZXIpLmN1YmVwb3J0Zm9saW8oe1xuICAgICAgICAgICAgZmlsdGVyczogJyNmaWx0ZXJzX2NvbnRhaW5lcicsXG4gICAgICAgICAgICBsYXlvdXRNb2RlOiAnZ3JpZCcsXG4gICAgICAgICAgICBkZWZhdWx0RmlsdGVyOiAnLicgKyBkZWZhdWx0RmlsdGVyLnRhZyxcbiAgICAgICAgICAgIGFuaW1hdGlvblR5cGU6ICdmbGlwT3V0RGVsYXknLFxuICAgICAgICAgICAgZ2FwSG9yaXpvbnRhbDogMjUsXG4gICAgICAgICAgICBnYXBWZXJ0aWNhbDogMjUsXG4gICAgICAgICAgICBncmlkQWRqdXN0bWVudDogJ3Jlc3BvbnNpdmUnLFxuICAgICAgICAgICAgbWVkaWFRdWVyaWVzOiBbe1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMTAwLFxuICAgICAgICAgICAgICAgIGNvbHM6IDRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogODAwLFxuICAgICAgICAgICAgICAgIGNvbHM6IDNcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogNTAwLFxuICAgICAgICAgICAgICAgIGNvbHM6IDJcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMzIwLFxuICAgICAgICAgICAgICAgIGNvbHM6IDFcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgZGlzcGxheVR5cGU6ICdsYXp5TG9hZGluZycsXG4gICAgICAgICAgICBkaXNwbGF5VHlwZVNwZWVkOiAxMDBcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgJzxmb290ZXIgaWQ9XCJmb290ZXJcIj4gPGRpdiBpZD1cImNvbnRhY3RcIiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+eyBkYXRhLmFib3V0LnRpdGxlIH08L2gzPiA8cCBzdHlsZT1cImNvbG9yOiAjZmZmO1wiPnsgZGF0YS5hYm91dC50ZXh0IH08L3A+IDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgY29udGFjdFwiPiA8bGkgZWFjaD1cInsgXy5zb3J0QnkoZGF0YS5jb250YWN0LFxcJ29yZGVyXFwnKSB9XCI+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+IDxzdHJvbmc+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+eyB0aXRsZSB8fCBcXCdcXCcgfSA8L3N0cm9uZz4gPGEgaWY9XCJ7IGxpbmsgfVwiIGhyZWY9XCJ7IGxpbmsgfVwiIHN0eWxlPVwiY29sb3I6ICNmZmZcIiA+eyB0ZXh0IHx8IGxpbmsgfTwvYT4gPHNwYW4gaWY9XCJ7ICFsaW5rIH1cIj57IHRleHQgfTwvc3Bhbj4gPC9wPiA8L2xpPiA8L3VsPiA8dWwgaWQ9XCJzb2NpYWxfZm9sbG93XCIgY2xhc3M9XCJsaXN0LWlubGluZSBzb2NpYWwtMVwiPiA8bGkgZWFjaD1cInsgXy5zb3J0QnkoZGF0YS5hYm91dC5zb2NpYWwsIFxcJ29yZGVyXFwnKSB9XCI+IDxhIGhyZWY9XCJ7IGxpbmsgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNiBtYXJnaW4zMCBoaWRkZW4teHMgaGlkZGVuLXNtXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5Gb2xsb3cgVXM8L2gzPiA8YSBpZj1cInsgc29jaWFsLnR3aXR0ZXIgfVwiIGNsYXNzPVwidHdpdHRlci10aW1lbGluZVwiIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL3sgc29jaWFsLnR3aXR0ZXIudGl0bGUgfVwiIGRhdGEtd2lkZ2V0LWlkPVwieyBzb2NpYWwudHdpdHRlci5hcGkgfVwiPlR3ZWV0cyBieSBAeyBzb2NpYWwudHdpdHRlci50aXRsZSB9PC9hPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgY29sLXNtLTYgbWFyZ2luMzAgaGlkZGVuLXhzIGhpZGRlbi1zbVwiIHN0eWxlPVwicGFkZGluZy1yaWdodDogMXB4O1wiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+TGlrZSBVczwvaDM+IDxkaXYgaWY9XCJ7IHNvY2lhbC5mYWNlYm9vayB9XCIgY2xhc3M9XCJmYi1wYWdlXCIgZGF0YS1ocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3sgc29jaWFsLmZhY2Vib29rLnRpdGxlIH1cIiBkYXRhLXNtYWxsLWhlYWRlcj1cInRydWVcIiBkYXRhLWFkYXB0LWNvbnRhaW5lci13aWR0aD1cInRydWVcIiBkYXRhLWhpZGUtY292ZXI9XCJmYWxzZVwiIGRhdGEtc2hvdy1mYWNlcGlsZT1cInRydWVcIiBkYXRhLWhlaWdodD1cIjMwMFwiIGRhdGEtc2hvdy1wb3N0cz1cInRydWVcIj4gPGRpdiBjbGFzcz1cImZiLXhmYm1sLXBhcnNlLWlnbm9yZVwiPiA8YmxvY2txdW90ZSBjaXRlPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3sgc29jaWFsLmZhY2Vib29rLnRpdGxlIH1cIj4gPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS97IHNvY2lhbC5mYWNlYm9vay50aXRsZSB9XCI+eyB0aXRsZSB9PC9hPiA8L2Jsb2NrcXVvdGU+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZj1cInsgZGF0YS5jb3B5cmlnaHQgfVwiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1jZW50ZXJcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1idG1cIj4gPHNwYW4+IDxyYXcgY29udGVudD1cInsgZGF0YS5jb3B5cmlnaHQudGV4dCB9XCI+PC9yYXc+IDwvc3Bhbj4gPGltZyBzdHlsZT1cImRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tbGVmdDogYXV0bzsgbWFyZ2luLXJpZ2h0OiBhdXRvOyBoZWlnaHQ6IDUlOyB3aWR0aDogNSU7XCIgcmlvdC1zcmM9XCJ7IHVybCtkYXRhLmNvcHlyaWdodC5pbWcrXFwnP2NvcHkxXFwnIH1cIj48L2ltZz4gPHNwYW4gc3R5bGU9XCJmb250LXNpemU6IDhweDtcIj57IGRhdGEuY29weXJpZ2h0LmxpY2Vuc2UgfTwvc3Bhbj4gPGltZyBzdHlsZT1cImRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tbGVmdDogYXV0bzsgbWFyZ2luLXJpZ2h0OiBhdXRvOyBoZWlnaHQ6IDMlOyB3aWR0aDogMyU7XCIgcmlvdC1zcmM9XCJ7IHVybCtkYXRhLmNvcHlyaWdodC5pbWcyK1xcJz9jb3B5MlxcJyB9XCI+PC9pbWc+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Zvb3Rlcj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygnc2l0ZScpO1xuXG50aGlzLnNvY2lhbCA9IG51bGw7XG50aGlzLmRhdGEgPSBudWxsO1xudGhpcy50aXRsZSA9IEZyb250RW5kLmNvbmZpZy5zaXRlLnRpdGxlO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2Zvb3RlcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9zb2NpYWwnKS50aGVuKGZ1bmN0aW9uIChzb2NpYWwpIHtcbiAgICAgICAgICAgIF90aGlzLnNvY2lhbCA9IHNvY2lhbDtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgRnJvbnRFbmQuaW5pdFNvY2lhbCgpO1xuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1pbXBhY3QnLCAnPHNlY3Rpb24+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDIgaWY9XCJ7IGhlYWRlciB9XCI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwIGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwibGVhZFwiPiB7IGhlYWRlci50ZXh0IH0gPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwiaW1wYWN0X3NsaWRlclwiIGNsYXNzPVwib3dsLWNhcm91c2VsXCI+IDxkaXYgY2xhc3M9XCJpdGVtXCIgZWFjaD1cInsgaXRlbXMgfVwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpbWcgaWY9XCJ7IGltZyB9XCIgd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjEyNXB4XCIgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgfWltcGFjdC97IGltZyB9P3RhZz1pbXBhY3QmdGl0bGU9e3RpdGxlfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCAnaWQ9XCJpbXBhY3RcIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvaW1wYWN0JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuaXRlbXMsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy5pbXBhY3Rfc2xpZGVyKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICBhdXRvUGxheTogNTAwMCxcbiAgICAgICAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICBpdGVtc0Rlc2t0b3BTbWFsbDogWzk5MSwgMl1cbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWFpbicsICc8cGFnZS1iYW5uZXI+PC9wYWdlLWJhbm5lcj4gPGRpdiBjbGFzcz1cImRpdmlkZTYwXCI+PC9kaXY+IDxwYWdlLW1lc3NhZ2U+PC9wYWdlLW1lc3NhZ2U+IDxkaXYgY2xhc3M9XCJkaXZpZGU4MFwiPjwvZGl2PiA8cGFnZS1tZXRob2RvbG9neT48L3BhZ2UtbWV0aG9kb2xvZ3k+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8cGFnZS10ZXN0aW1vbmlhbHM+PC9wYWdlLXRlc3RpbW9uaWFscz4gPGRpdiBjbGFzcz1cImRpdmlkZTUwXCI+PC9kaXY+IDxwYWdlLWltcGFjdD48L3BhZ2UtaW1wYWN0PiA8ZGl2IGNsYXNzPVwiZGl2aWRlNTBcIj48L2Rpdj4gPHBhZ2UtY291bnRtZWluPjwvcGFnZS1jb3VudG1laW4+IDxkaXYgY2xhc3M9XCJkaXZpZGU3MFwiPjwvZGl2PiA8cGFnZS1uZXdzPjwvcGFnZS1uZXdzPiA8ZGl2IGNsYXNzPVwiZGl2aWRlNTBcIj48L2Rpdj4gPGRpdiBpZD1cImV4cGxvcmVfY29udGFpbmVyXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlNDBcIj48L2Rpdj4nLCAnaWQ9XCJtYWluXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudmFyIGlzU2FmYXJpID0gL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQXBwbGUgQ29tcHV0ZXIvLnRlc3QobmF2aWdhdG9yLnZlbmRvcik7XG5pZiAoIWlzU2FmYXJpKSB7XG4gICAgdGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJpb3QubW91bnQoX3RoaXMuZXhwbG9yZV9jb250YWluZXIsICdwYWdlLWV4cGxvcmUnLCB7IGl0ZW1zOiBbXSB9KTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICB9KTtcbn1cbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZXNzYWdlJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD48cmF3IGNvbnRlbnQ9XCJ7IGhlYWRlci50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93IHNwZWNpYWwtZmVhdHVyZVwiPiA8ZGl2IGVhY2g9XCJ7IGl0ZW1zIH1cIiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS00IG1hcmdpbjEwXCI+IDxkaXYgY2xhc3M9XCJzLWZlYXR1cmUtYm94IHRleHQtY2VudGVyIHdvdyBhbmltYXRlZCBmYWRlSW5cIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIyMDBtc1wiPiA8ZGl2IGNsYXNzPVwibWFzay10b3BcIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gPC9kaXY+IDxkaXYgY2xhc3M9XCJtYXNrLWJvdHRvbVwiPiAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gIDxoND57IHRpdGxlIH08L2g0PiAgPHA+eyB0ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCAnaWQ9XCJtZXNzYWdlXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5oZWFkZXIgPSB7fTtcbnRoaXMuaXRlbXMgPSBbXTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9tZXNzYWdlJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLml0ZW1zID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5pdGVtcywgJ29yZGVyJyksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gaS5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZXRob2RvbG9neScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cCBjbGFzcz1cImxlYWRcIj57IGhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGg0PnsgZnJhbWV3b3Jrcy5oZWFkZXIudGl0bGUgfTwvaDQ+IDxwIGNsYXNzPVwibGVhZFwiPnsgZnJhbWV3b3Jrcy5oZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInBhbmVsLWdyb3VwXCIgaWQ9XCJmcmFtZXdvcmtzXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIF8uc29ydEJ5KGZyYW1ld29ya3MuaXRlbXMsIFxcJ29yZGVyXFwnKSB9XCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+IDxoNCBjbGFzcz1cInBhbmVsLXRpdGxlXCI+IDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXBhcmVudD1cIiNmcmFtZXdvcmtzXCIgaHJlZj1cIiNjb2xsYXBzZUZyYW1ld29ya3NfeyBpIH1cIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvaDQ+IDwvZGl2PiA8ZGl2IGlkPVwiY29sbGFwc2VGcmFtZXdvcmtzX3sgaSB9XCIgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZSB7IGluOiBpID09IDAgfVwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPiB7IHZhbC50ZXh0IH0gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDQ+eyBwYXJ0bmVycy5oZWFkZXIudGl0bGUgfTwvaDQ+IDxwIGNsYXNzPVwibGVhZFwiPnsgcGFydG5lcnMuaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJwYW5lbC1ncm91cFwiIGlkPVwiYWNjb3JkaW9uXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIF8uc29ydEJ5KHBhcnRuZXJzLml0ZW1zLCBcXCdvcmRlclxcJykgfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiA8aDQgY2xhc3M9XCJwYW5lbC10aXRsZVwiPiA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS1wYXJlbnQ9XCIjYWNjb3JkaW9uXCIgaHJlZj1cIiNjb2xsYXBzZU9uZV97IGkgfVwiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9oND4gPC9kaXY+IDxkaXYgaWQ9XCJjb2xsYXBzZU9uZV97IGkgfVwiIGNsYXNzPVwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgeyBpbjogaSA9PSAwIH1cIj4gPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4geyB2YWwudGV4dCB9IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsICdpZD1cIm1ldGhvZG9sb2d5XCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL21ldGhvZG9sb2d5JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5mcmFtZXdvcmtzID0gZGF0YS5mcmFtZXdvcmtzO1xuICAgICAgICBfdGhpcy5wYXJ0bmVycyA9IGRhdGEucGFydG5lcnM7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVudS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPiA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj4gPGxpIGNsYXNzPVwieyBkcm9wZG93bjogdHJ1ZSwgYWN0aXZlOiBpID09IDAgfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhIH1cIj4gPGEgaWY9XCJ7IHZhbC50aXRsZSB9XCIgaHJlZj1cInsgdmFsLmxpbmsgfHwgXFwnI1xcJyB9XCIgdGFyZ2V0PVwieyBfYmxhbms6IHZhbC5saW5rLnN0YXJ0c1dpdGgoXFwnaHR0cFxcJykgfVwiID4gPGkgaWY9XCJ7IHZhbC5pY29uIH1cIiBjbGFzcz1cInsgdmFsLmljb24gfVwiID48L2k+IHsgdmFsLnRpdGxlIH0gPGkgaWY9XCJ7IHZhbC5tZW51ICYmIHZhbC5tZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCIgPjwvaT4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5kYXRhID0gW107XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbmF2YmFyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLXN0YXRpYy10b3AgeWFtbSBzdGlja3lcIiByb2xlPVwibmF2aWdhdGlvblwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJuYXZiYXItaGVhZGVyXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmF2YmFyLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj4gPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDwvYnV0dG9uPiA8ZGl2PiA8YSBocmVmPVwiI2hvbWVcIj48aW1nIGlmPVwieyBkYXRhIH1cIiBzdHlsZT1cIm1hcmdpbi10b3A6IDdweDsgbWFyZ2luLXJpZ2h0OiAxNXB4O1wiIHJpb3Qtc3JjPVwieyB1cmwgfXNpdGUveyBkYXRhLmltZyB9P3RhZz1uYXZiYXJcIiBhbHQ9XCJ7IGRhdGEuYWx0IH1cIj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDxwYWdlLW1lbnUtbmF2YmFyPjwvcGFnZS1tZW51LW5hdmJhcj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbG9nbycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgJChcIi5zdGlja3lcIikuc3RpY2t5KHsgdG9wU3BhY2luZzogMCB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcblxuJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XG4gICAgJChcIi5uYXZiYXItY29sbGFwc2VcIikuY3NzKHsgbWF4SGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKFwiLm5hdmJhci1oZWFkZXJcIikuaGVpZ2h0KCkgKyBcInB4XCIgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1uZXdzJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxoMyBjbGFzcz1cImhlYWRpbmdcIj5MYXRlc3QgTmV3czwvaDM+IDxkaXYgaWQ9XCJuZXdzX2Nhcm91c2VsXCIgY2xhc3M9XCJvd2wtY2Fyb3VzZWwgb3dsLXNwYWNlZFwiPiA8ZGl2IGVhY2g9XCJ7IGRhdGEgfVwiPiA8ZGl2IGNsYXNzPVwibmV3cy1kZXNjXCI+IDxwPiA8YSBocmVmPVwieyBsaW5rIH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj57IEh1bWFuaXplLnRydW5jYXRlKHRpdGxlLCAxMjUpIH08L2E+IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCAnaWQ9XCJuZXdzXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5kYXRhID0gW107XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbmV3cycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBfdGhpcy5kYXRhID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gaS5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgJChfdGhpcy5uZXdzX2Nhcm91c2VsKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICAvLyBNb3N0IGltcG9ydGFudCBvd2wgZmVhdHVyZXNcbiAgICAgICAgICAgIGl0ZW1zOiA0LFxuICAgICAgICAgICAgaXRlbXNDdXN0b206IGZhbHNlLFxuICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICBpdGVtc0Rlc2t0b3BTbWFsbDogWzk4MCwgMl0sXG4gICAgICAgICAgICBpdGVtc1RhYmxldDogWzc2OCwgMl0sXG4gICAgICAgICAgICBpdGVtc1RhYmxldFNtYWxsOiBmYWxzZSxcbiAgICAgICAgICAgIGl0ZW1zTW9iaWxlOiBbNDc5LCAxXSxcbiAgICAgICAgICAgIHNpbmdsZUl0ZW06IGZhbHNlLFxuICAgICAgICAgICAgc3RhcnREcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9QbGF5OiA1MDAwLFxuICAgICAgICAgICAgbG9vcDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS10ZXN0aW1vbmlhbHMnLCAnPGRpdiBpZD1cInRlc3RpbW9uaWFscy1jYXJvdXNlbFwiIGNsYXNzPVwidGVzdGltb25pYWxzIHRlc3RpbW9uaWFscy12LTIgd293IGFuaW1hdGVkIGZhZGVJblVwXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMTAwbXNcIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+eyBoZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+IDxkaXYgaWQ9XCJ0ZXN0aW1vbmlhbF9zbGlkZVwiIGNsYXNzPVwidGVzdGktc2xpZGVcIj4gPHVsIGNsYXNzPVwic2xpZGVzXCI+IDxsaSBlYWNoPVwieyBpdGVtcyB9XCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgKyBpbWcgfT90YWc9dGVzdGltb25pYWxzJnVzZXI9e3VzZXJ9XCIgYWx0PVwieyB1c2VyIH1cIj4gPGg0PiA8aSBjbGFzcz1cImZhIGZhLXF1b3RlLWxlZnQgaW9uLXF1b3RlXCI+PC9pPiB7IHRleHR9IDwvaDQ+IDxwIGNsYXNzPVwidGVzdC1hdXRob3JcIj4geyB1c2VyIH0gLSA8ZW0+eyBzdWJ0ZXh0IH08L2VtPiA8L3A+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3Rlc3RpbW9uaWFscycpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3Rlc3RpbW9uaWFscycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLml0ZW1zLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMudGVzdGltb25pYWxfc2xpZGUpLmZsZXhzbGlkZXIoe1xuICAgICAgICAgICAgc2xpZGVzaG93U3BlZWQ6IDUwMDAsXG4gICAgICAgICAgICBkaXJlY3Rpb25OYXY6IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcImZhZGVcIlxuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnYmxvZy1wYWdlJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPC9kaXY+IDxpZnJhbWUgaWY9XCJ7IGRhdGEueW91dHViZWlkIH1cIiBpZD1cInl0cGxheWVyXCIgdHlwZT1cInRleHQvaHRtbFwiIHdpZHRoPVwiNzIwXCIgaGVpZ2h0PVwiNDA1XCIgcmlvdC1zcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC97IGRhdGEueW91dHViZWlkIH0/YXV0b3BsYXk9MVwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj1cIlwiIGNsYXNzPVwiZml0dmlkc1wiIHN0eWxlPVwiaGVpZ2h0OiA0MDVweDsgd2lkdGg6IDcyMHB4OyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bztcIj48L2lmcmFtZT4gPGlmcmFtZSBpZj1cInsgZGF0YS52aW1lb2lkIH1cIiByaW90LXNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby97IGRhdGEudmltZW9pZCB9XCIgd2lkdGg9XCI3MjBcIiBoZWlnaHQ9XCI0MDVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW49XCJcIiBtb3phbGxvd2Z1bGxzY3JlZW49XCJcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBjbGFzcz1cImZpdHZpZHNcIiBzdHlsZT1cImhlaWdodDogNDA1cHg7IHdpZHRoOiA3MjBweDsgZGlzcGxheTogYmxvY2s7IG1hcmdpbi1sZWZ0OiBhdXRvOyBtYXJnaW4tcmlnaHQ6IGF1dG87XCI+PC9pZnJhbWU+IDxkaXYgaWY9XCJ7IGJsb2cgfVwiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgPiA8cmF3IGNvbnRlbnQ9XCJ7IGJsb2cgfVwiPjwvcmF3PiA8L2Rpdj4gPGJ1dHRvbnMgYnV0dG9ucz1cInsgZGF0YS5idXR0b25zIH1cIj48L2J1dHRvbnM+IDwvZGl2PiA8L2Rpdj4gPGJ1dHRvbnMgaWY9XCJ7ICFibG9nIH1cIiBidXR0b25zPVwieyBkYXRhLmJ1dHRvbnMgfVwiPjwvYnV0dG9ucz4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLmV2ZW50LmlkKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG5cbiAgICAgICAgX3RoaXMudXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgdmFyIHJlZiA9IEZyb250RW5kLk1ldGFGaXJlLmdldENoaWxkKEZyb250RW5kLnNpdGUgKyAnL2NvbnRlbnQvJyArIG9wdHMuZXZlbnQuaWQpO1xuICAgICAgICB2YXIgZmlyZXBhZCA9IG5ldyBGaXJlcGFkLkhlYWRsZXNzKHJlZik7XG4gICAgICAgIGZpcmVwYWQuZ2V0SHRtbChmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICAgICAgX3RoaXMuYmxvZyA9IGh0bWw7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ21hbmlmZXN0by1wYWdlJywgJzxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGltZyBzcmM9XCJodHRwczovL2M2OGY3OTgxYThiYmU5MjZhMWUwMTU0Y2JmYmQ1YWYxYjRkZjBmMjEuZ29vZ2xlZHJpdmUuY29tL2hvc3QvMEI2R0FONGdYMWJuU2ZsUm5kVFJKZUZaNU5Fc3pTRUZsU3pWS1pEWkpTekZ4ZURkaWNGcG9MWFZ3U0RORlJXTjBSRmhmUzJjL2NybGFiL3NpdGUvbWFuaWZlc3RvX3Bvc3Rlcl9ub19kaWFncmFtLnBuZ1wiIGFsdD1cIlN5c3RlbXMgVGhpbmtpbmcgTWFuaWZlc3RvXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiPjwvaW1nPiA8L2Rpdj4gPGRpdiBpZj1cInsgYmxvZyB9XCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiA+IDxyYXcgY29udGVudD1cInsgYmxvZyB9XCI+PC9yYXc+IDwvZGl2PiA8YnV0dG9ucyBidXR0b25zPVwieyBkYXRhLmJ1dHRvbnMgfVwiPjwvYnV0dG9ucz4gPC9kaXY+IDwvZGl2PiA8YnV0dG9ucyBpZj1cInsgIWJsb2cgfVwiIGJ1dHRvbnM9XCJ7IGRhdGEuYnV0dG9ucyB9XCI+PC9idXR0b25zPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuZXZlbnQuaWQpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcblxuICAgICAgICBfdGhpcy51cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICB2YXIgcmVmID0gRnJvbnRFbmQuTWV0YUZpcmUuZ2V0Q2hpbGQoRnJvbnRFbmQuc2l0ZSArICcvY29udGVudC9zeXN0ZW1zLXRoaW5raW5nLW1hbmlmZXN0bycpO1xuICAgICAgICB2YXIgZmlyZXBhZCA9IG5ldyBGaXJlcGFkLkhlYWRsZXNzKHJlZik7XG4gICAgICAgIGZpcmVwYWQuZ2V0SHRtbChmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICAgICAgX3RoaXMuYmxvZyA9IGh0bWw7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ25vdC1mb3VuZC1wYWdlJywgJzxkaXYgY2xhc3M9XCJkaXZpZGU4MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWNlbnRlciBlcnJvci10ZXh0XCI+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8aDEgY2xhc3M9XCJlcnJvci1kaWdpdCB3b3cgYW5pbWF0ZWQgZmFkZUluVXAgbWFyZ2luMjAgYW5pbWF0ZWRcIiBzdHlsZT1cInZpc2liaWxpdHk6IHZpc2libGU7IGFuaW1hdGlvbi1uYW1lOiBmYWRlSW5VcDsgLXdlYmtpdC1hbmltYXRpb24tbmFtZTogZmFkZUluVXA7XCI+PGkgY2xhc3M9XCJmYSBmYS10aHVtYnMtZG93blwiPjwvaT48L2gxPiA8aDI+eyBkYXRhLm1lc3NhZ2UgfTwvaDI+IDxwPjxhIGhyZWY9XCIjZXhwbG9yZVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPkdvIEJhY2s8L2E+PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSB7XG4gICAgbWVzc2FnZTogJ09vcHMsIHRoYXQgcGFnZSBjb3VsZCBub3QgYmUgZm91bmQhJ1xufTtcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc3Rtcy1wYWdlJywgJzxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEuaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLmhlYWRlci50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGVhY2g9XCJ7IF8uc29ydEJ5KGRhdGEuaXRlbXMsXFwnb3JkZXJcXCcpIH1cIiBjbGFzcz1cImNvbC1zbS02XCI+IDxkaXYgPiA8aWZyYW1lIGlmPVwieyB5b3V0dWJlaWQgfVwiIGlkPVwieXRwbGF5ZXJfeyB5b3V0dWJlaWQgfVwiIHR5cGU9XCJ0ZXh0L2h0bWxcIiBoZWlnaHQ9XCI0MDBcIiByaW90LXNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgeW91dHViZWlkIH0/YXV0b3BsYXk9MFwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj1cIlwiPjwvaWZyYW1lPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IG51bGw7XG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3N0bXMnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcbn0pO1xufSk7Il19
