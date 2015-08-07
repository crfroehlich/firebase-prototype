
var rayGun = function (config) {
    var apiKey;
    if (config == null) {
        config = {};
    }
    apiKey = config.RAYGUN_API_KEY;
    if (apiKey && window.location.hostname !== 'localhost') {
        if (Raygun != null) {
            Raygun.init(apiKey, {
                ignore3rdPartyErrors: true
            }).attach();
        }
        return Raygun != null ? Raygun.filterSensitiveData(['password']) : void 0;
    }
};

module.exports = rayGun;