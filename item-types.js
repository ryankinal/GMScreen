(function() {
    var itemTypes = {};
    itemTypes.base = {
        save: function() {
            // save to local storage
        },
        load: function(data) {
            // load from local storage
        },
        render: function() {
            // default rendering code
        }
    };

    itemTypes.table = Object.create(itemTypes.base);
    itemTypes.table.create = function(data) {

    };
    itemTypes.table.render = function() {
        // table rendering code
    };
    itemTypes.table.sort = function(colIndex) {

    };
    itemTypes.table.addRow = function(data) {

    };
})();