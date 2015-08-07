let Firebase = window.Firebase; //require('firebase');
let Promise = window.Promise;
let localforage = window.localforage;

class MetaFire {

    constructor (config) {
        this.config = config;
        this.fb = new Firebase(`https://${this.config.site.db}.firebaseio.com`);
    }

    login() {
        if (!this._login) {
            this._login = new Promise((fulfill, reject) => {
                window.ThinkWater.Auth0.getSession()
                    .then((profile) => {

                        window.ThinkWater.Auth0.lock.getClient().getDelegationToken({
                            target: this.config.site.auth0.api,
                            id_token: profile.id_token,
                            api_type: 'firebase'
                        }, (err, delegationResult) => {
                            if (err) {
                                reject(err);
                            } else {
                                profile.firebase_token = delegationResult.id_token;
                                this.firebase_token = delegationResult.id_token;
                                localforage.setItem('firebase_token', this.firebase_token);
                                this.fb.authWithCustomToken(this.firebase_token, (error, authData, ...params) => {
                                    if (error) {
                                        window.FrontEnd.error(error);
                                        reject(error);
                                    } else {
                                        fulfill(authData);
                                    }
                                });
                            }
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        debugger;
                    });
            });
            this._onReady = this._login;
        }
        return this._login;
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                fulfill();
            });
        }
        return this._onReady;
    }

    getChild(path) {
        return this.fb.child(path);
    }

    getData (path) {
        return this.onReady().then(() => {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            return new Promise((resolve, reject) => {

                child.orderByChild('order').once('value',
                (snapshot) => {
                    let data = snapshot.val();
                    try {
                        resolve(data);
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
                },
                (error) => {
                    window.FrontEnd.error({ message: `Cannot access ${path}` });
                    reject(error);
                });
            });
        });
    }

    on (path, callback, event = 'value' ) {
        if (path) {
            this.onReady().then(() => {
                let child = this.getChild(path);
                child.orderByChild('order').on(event, (snapshot) => {
                    let data = snapshot.val();
                    try {
                        callback(data);
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
                });
            });
        }
    }

    off(path, method='value',callback) {
        if (path) {
            this.onReady().then(() => {
                let child = this.getChild(path);
                if (callback) {
                    child.off(method, callback);
                } else {
                    child.off(method);
                }
            });
        }
    }

    setData (data, path) {
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

    pushData (data, path) {
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

    setDataInTransaction (data, path, callback) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        try {
            return child.transaction((currentValue) => {
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

    logout () {
        this._login = null;
        this._onReady = null;
        localforage.removeItem('firebase_token');
        this.fb.unauth();
    }
}
module.exports = MetaFire;