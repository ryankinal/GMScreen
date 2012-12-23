define(['./list'], function(list) {
    var olObject = Object.create(list);
    olObject.tagName = 'ol';

    olObject.getSaveData = function()
    {
        var data = list.getSaveData.call(this);
        data.type = 'OrderedList';
        return data; 
    }

    olObject.render = function(parent)
    {
        list.render.call(this, parent, true);
    }

    return olObject;
});