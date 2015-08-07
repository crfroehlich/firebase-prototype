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

let tags = [
    'page-head',
    'page-banner',
    'page-impact',
    'page-countmein',
    'page-footer',
    'page-navbar-menu',
    'page-navbar',
    'page-news',
    'page-explore',
    'page-message',
    'page-methodology',
    'page-testimonials'
];

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
    this.updateContent = function () {
        this.root.innerHTML = (opts) ? (opts.content || '') : '';
    };

    this.on('update', () => {
        this.updateContent();
    });

    this.updateContent();
});

var FrontEnd = require('./FrontEnd');
module.exports = new FrontEnd(tags);