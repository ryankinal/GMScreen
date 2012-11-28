itemTypes.orderedList = (function() {
    var olObject = Object.create(itemTypes.list);
    olObject.tagName = 'ol';
    return olObject;
})();