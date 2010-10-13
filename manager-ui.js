$(function() {
    chrome.tabs.getSelected(null, function(tab) {
        // Get the domain of the current tab - only cookies on this domain
        // will be modified
        var domainRegex = new RegExp(/^[\w-]+:\/*\[?([\w\.-]+)\]?(?::\d+)?/);
        var domain = tab.url.match(domainRegex)[1];
        $('.domain').text(domain);

        var cookieManager = new CookieManager(domain);

        $('#clear-cookies').click(function() {
            cookieManager.clearCookies();
        });

        // Inject a new profile element into the profiles box in the popup
        var injectProfile = function(name) {
            var container = $('<div />').text(name).addClass('profile-item');
            var actions = $('<span />').addClass('actions');

            // Link to load the profile's cookies
            var loadLink = $('<a />').text('Load').click(function() {
                cookieManager.loadProfile(name);
            });
            loadLink = loadLink.attr('href', 'javascript:void(0)');
            actions = actions.append(loadLink.addClass('button'));

            // Link to delete the profile
            var deleteLink = $('<a />').text('Delete').click(function() {
                cookieManager.deleteProfile(name);
                container.remove();
            });
            deleteLink = deleteLink.attr('href', 'javascript:void(0)');
            actions = actions.append(deleteLink.addClass('button'));

            // Add the element into the page
            var profileBox = $('#profiles');
            profileBox.append(container.append(actions));
            profileBox.append($('<div />').addClass('clearfix'));
        };

        // Load previously saved profiles on popup load
        var profiles = cookieManager.getProfiles();
        for (var name in profiles) {
            injectProfile(name);
        }

        $('#save-profile').submit(function() {
            var name = $('#profile-name').val();
            chrome.cookies.getAll({domain: domain}, function(cookies) {
                cookieManager.saveProfile(name, cookies);
                injectProfile(name, cookies);
                $('#profile-name').val('');
            });
            return false;
        });
    });
});
