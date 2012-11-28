dom = {
    create: function(tagName, context)
    {
        context = context || document;

        return context.createElement(tagName)
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
    }
}