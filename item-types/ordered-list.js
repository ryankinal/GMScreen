define(['./list'], function(list) {
    var olObject = Object.create(list);
    olObject.tagName = 'ol';
    return olObject;
});