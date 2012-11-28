var itemTypes = {};

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