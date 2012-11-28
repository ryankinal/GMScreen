itemTypes.unorderedList = (function() {
	var ulObject = Object.create(itemTypes.list);
	ulObject.tagName = 'ul';
	return ulObject;
})();