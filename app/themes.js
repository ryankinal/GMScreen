define(['utilities/dom', 'utilities/efence'], function(dom, pubsub) {
    var styleLinks = dom.qsa('link'),
        themes = [],
        themeManager = {},
        current;

    styleLinks = Array.prototype.filter.call(styleLinks, function(link) { 
        return link.rel === 'alternate stylesheet' || link.rel === 'stylesheet';
    });

    Array.prototype.forEach.call(styleLinks, function(link) {
        themes.push({
            name: link.getAttribute('data-name'),
            display: link.getAttribute('data-display')
        });
    });

    current = themes[0].name;

    themeManager.changeTheme = function(name)
    {
        Array.prototype.forEach.call(styleLinks, function(link, index) {
            if (link.getAttribute('data-name') === name)
            {
                link.disabled = false;
            }
            else
            {
                link.disabled = 'disabled';
            }
        });

        current = name;
    }

    themeManager.getCurrent = function()
    {
        return current;
    }

    themeManager.themes = themes;

    return themeManager;
});