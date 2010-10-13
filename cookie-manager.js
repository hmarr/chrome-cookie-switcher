
CookieManager = (function() {
    var setCookie = function(cookie) {
        var url = cookie.secure ? "https://" : "http://";
        url += cookie.domain + cookie.path;

        var newCookie = {
            url: url,
            name: cookie.name,
            value: cookie.value,
            expirationDate: cookie.expirationDate,
            domain: cookie.domain,
            path: cookie.path,
            secure: cookie.secure,
            storeId: cookie.storeId,
            httpOnly: cookie.httpOnly
        };
        chrome.cookies.set(newCookie);
    };

    var deleteCookie = function(cookie) {
        var url = cookie.secure ? "https://" : "http://";
        url += cookie.domain + cookie.path;
        chrome.cookies.remove({url: url, name: cookie.name});
    };

    var CookieManager = function(domain) {
        this.domain = domain;
        this.profiles = {};
    };

    CookieManager.prototype = {
        loadProfile: function(name) {
            var profile = this.getProfile(name);
            for (var i = 0; i < profile.length; i++) {
                var cookie = profile[i];
                setCookie(cookie);
            }
        },

        getProfile: function(name) {
            return this.getProfiles()[name];
        },

        getProfiles: function() {
            return JSON.parse(localStorage.getItem(this.domain) || '{}');
        },

        saveProfile: function(name, cookies) {
            var profiles = this.getProfiles();
            profiles[name] = cookies;
            localStorage.setItem(this.domain, JSON.stringify(profiles));
        },

        deleteProfile: function(name) {
            var profiles = this.getProfiles();
            delete profiles[name];
            localStorage.setItem(this.domain, JSON.stringify(profiles));
        },

        clearCookies: function(callback) {
            chrome.cookies.getAll({domain: this.domain}, function(cookies) {
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    deleteCookie(cookie);
                }
                callback && callback();
            });
        }
    };

    return CookieManager;
})();
