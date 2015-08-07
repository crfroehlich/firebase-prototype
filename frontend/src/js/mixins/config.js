const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if (!num || ((num = num.toString()).length > 9)) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str;
}

let config = {
    pathImg: (folder) => {
        let ret = `${window.FrontEnd.config.site.imageUrl}`;
        if (folder) {
            ret += `${folder}/`;
        }
        return ret;
    },
    getData: (path, callback, that) => {
        window.FrontEnd.MetaFire.on(`${window.FrontEnd.site}/${path}`, (data) => {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    },
    watchData: (path, callback) => {
        window.FrontEnd.MetaFire.on(`${window.FrontEnd.site}/${path}`, (data) => {
            if (callback) {
                callback(data);
            }
        });
    },
    numberToWords: inWords
};

module.exports = config;