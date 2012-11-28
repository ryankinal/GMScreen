var itemTypes = {},
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
        }
    };

itemTypes.base = {
    load: function(data) {
        if (data.charAt)
        {
            data = JSON.parse(data);
        }

        this.data = data;
    },
    stringify: function()
    {
        return JSON.stringify(this.data);
    }
};