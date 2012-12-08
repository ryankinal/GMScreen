define(['./list'], function(list) {
    var olObject = Object.create(list);
    olObject.tagName = 'ol';

    olObject.getSaveData = function()
    {
        var data = list.getSaveData.call(this);
        data.type = 'OrderedList';
        return data; 
    }

    return olObject;
});