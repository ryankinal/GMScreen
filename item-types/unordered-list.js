define(['./list'], function(list) {
	var ulObject = Object.create(list);
	ulObject.tagName = 'ul';
	return ulObject;
});