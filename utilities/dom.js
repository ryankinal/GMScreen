define({
    create: function(tagName, context)
    {
        context = context || document;

        return context.createElement(tagName)
    },
    fragment: function(context)
    {
        context = context || document;
        return context.createDocumentFragment();
    },
    text: function(value, context)
    {
        context = context || document;
        value = value || '';

        return context.createTextNode(value);
    },
    bind: function(element, type, listener)
    {
        return element.addEventListener(type, listener);
    },
    empty: function(element)
    {
        while (element.childNodes.length)
        {
            element.removeChild(element.firstChild);
        }
    },
    inDocument: function(element)
    {
        do 
        {
            if (element === document)
            {
                return true;
            }
        } while (element = element.parentNode);

        return false;
    },
    mousePosition: function(e)
    {
        var position = {
                x: 0,
                y: 0
            };

        if (e.pageX || e.pageY)
        {
            position.x = e.pageX;
            position.y = e.pageY;
        }
        else if (e.clientX || e.clientY)
        {
            position.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            position.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return position;
    },
    getById: function(id, context)
    {
        context = context || document;
        return context.getElementById(id);
    },
    qsa: function(selector, context)
    {
        context = context || document;
        return context.querySelectorAll(selector);
    }
});