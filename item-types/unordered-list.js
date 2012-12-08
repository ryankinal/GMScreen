define(['./list'], function(list) {
	var ulObject = Object.create(list);
	ulObject.tagName = 'ul';

    ulObject.getSaveData = function()
    {
        var data = list.getSaveData.call(this);
        data.type = 'UnorderedList';
        return data;
    }

	return ulObject;
});