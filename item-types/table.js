define(['./item-types', 'utilities/dom', 'utilities/efence', 'utilities/cap', 'utilities/dice'], function(base, dom, pubsub, cap, dice) { 
    var tableObject = Object.create(base);

    var numCheck = /^[\d]+\.?[\d]*$/,
        makeStartEditCell = function(i, j)
        {
            var self = this;

            return function(e) {
                e = e || window.event;

                var target = e.target || e.srcElement,
                    value = self.data.body[i].values[j],
                    input = dom.create('input');

                input.type = 'text';
                input.value = value || '';
                dom.empty(target);
                target.appendChild(input);

                input.addEventListener('keyup', makeEndEditCell.call(self, i, j));
                input.addEventListener('blur', makeBlureEditCell.call(self, i, j));
                input.focus();
            };
        },
        makeEndEditCell = function(i, j)
        {
            var self = this;

            return function(e) {
                e = e || window.event;

                var target = e.target || e.srcElement,
                    key = e.keyCode || e.which,
                    value = target.value;

                if (key === 13)
                {
                    value = dice.replace(value);

                    if (value.match(numCheck))
                    {
                        self.data.body[i].values[j] = parseFloat(value);
                    }
                    else
                    {
                        self.data.body[i].values[j] = value;
                    }
                    
                    target.parentNode.removeChild(target);
                    self.render();
                    pubsub.pub('Table.CellEdited', {
                        table: self,
                        i: i,
                        j: j,
                        value: value
                    });
                    return false;
                }
                else if (key === 27)
                {
                    self.render();
                    return false;
                }
            };
        },
        makeBlureEditCell = function(i, j)
        {
            var self = this;

            return function(e) {
                e = e || window.event;

                var target = e.target || e.srcElement,
                    value = target.value;

                value = dice.replace(value);

                if (value.match(numCheck))
                {
                    self.data.body[i].values[j] = parseFloat(value);
                }
                else
                {
                    self.data.body[i].values[j] = value;
                }

                self.render();
                pubsub.pub('Table.CellEdited', {
                    table: self,
                    i: i,
                    j: j,
                    value: value
                });
                return false;
            };
        },
        makeMarkHandler = function(i)
        {
            var self = this;

            return function(e) {
                e = e || window.event;

                var target = e.target || e.srcElement,
                    parentRow = e.target.parentNode;

                self.data.body[i].marked = !self.data.body[i].marked;

                if (self.data.body[i].marked)
                {
                    parentRow.className = 'marked';
                }
                else
                {
                    parentRow.className = '';
                }

                pubsub.pub('Table.RowMarked', {
                    table: self,
                    row: self.data.body[i]
                });
            };
        },
        makeSortHandler = function(colIndex)
        {
            var self = this;

            return function(e) {
                e = e || window.event;

                var target = e.target || e.srcElement,
                    currentSort = self.data.sortOrder[colIndex];

                self.data.sortOrder = [];

                if (!currentSort || currentSort === 'asc')
                {
                    currentSort = 'desc';
                }
                else if (currentSort === 'desc')
                {
                    currentSort = 'asc';
                }

                self.data.sortOrder[colIndex] = currentSort;
                self.render();

                pubsub.pub('Table.Sorted', {
                    table: self,
                    order: self.data.sortOrder[colIndex],
                    column: colIndex
                });
            };
        },
        makeAddColumnHandler = function(e)
        {
            var self = this;

            return function(e)
            {
                cap.prompt({
                    content: 'Please enter header text for your column',
                    confirmText: 'Create',
                    allowCancel: true,
                    onConfirm: function(e, data) {
                        self.addColumn(data)
                    }
                });
                return false;
            }
        },
        makeAddRowHandler = function(e)
        {
            var self = this;

            return function(e)
            {
                self.addRow();
                return false;
            }
        },
        makeDeleteRowHandler = function(i)
        {
            var self = this;

            return function(e)
            {
                var row = self.data.body[i];
                self.data.body.splice(i, 1);
                self.render();
                pubsub.pub('Table.RowDeleted', {
                    table: self,
                    row: row
                });
                return false;
            }
        },
        sortFunction = function(x, y, invert)
        {
            if (typeof x === 'string' && typeof y === 'string')
            {
                x = x.toLowerCase();
                y = y.toLowerCase();
            }

            if (x === y)
            {
                return 0;
            }
            else if (typeof x === 'undefined' || x === null || x === '')
            {
                return 1;
            }
            else if (typeof y === 'undefined' || y === null || y === '')
            {
                return -1;
            }
            else if (invert)
            {
                return x < y ? 1 : -1;
            }
            else
            {
                return x < y ? -1 : 1;
            }
        };

    tableObject.load = function(data)
    {
        base.load.call(this, data);

        if (typeof this.data.headers === 'undefined') 
        {
            this.data.headers = [];
        }

        if (typeof this.data.body === 'undefined')
        {
            this.data.body = [];
        }

        if (typeof this.data.sortOrder === 'undefined')
        {
            this.data.sortOrder = [];
        }

        pubsub.pub('Table.DataLoaded', {
            table: this,
        });
    }

    tableObject.render = function(parent)
    {
        parent = parent || this.parent || document.body;

        dom.empty(parent);

        var i,
            j,
            headerLength = this.data.headers.length,
            bodyLength = this.data.body.length,
            rowLength,
            container = dom.create('div'),
            table = dom.create('table'),
            head = dom.create('thead'),
            body = dom.create('tbody'),
            row = dom.create('tr'),
            cell = dom.create('th'),
            addRow = dom.create('input'),
            addColumn = dom.create('input'),
            sortElement;
        
        row.appendChild(cell);
        row.appendChild(cell.cloneNode(false));

        for (i = 0; i < headerLength; i++)
        {
            cell = dom.create('th');
            cell.appendChild(dom.text(this.data.headers[i]));
            cell.addEventListener('click', makeSortHandler.call(this, i));
            row.appendChild(cell);

            if (this.data.sortOrder[i])
            {
                sortElement = dom.create('div');
                sortElement.className = 'sort';
                cell.appendChild(sortElement);
                cell.className = this.data.sortOrder[i];

                if (this.data.sortOrder[i] === 'desc')
                {
                    this.data.body.sort(function(x, y) {
                        return sortFunction(x.values[i], y.values[i], true);
                    });
                }
                else
                {
                    this.data.body.sort(function(x, y) {
                        return sortFunction(x.values[i], y.values[i], false);
                    });   
                }
            }
        }

        head.appendChild(row);

        for (i = 0; i < bodyLength; i++)
        {
            rowLength = this.data.body[i].values.length;
            row = dom.create('tr');

            if (this.data.body[i].marked)
            {
                row.className = 'marked';
            }

            cell = dom.create('td');
            cell.title = 'Mark item';
            cell.className = 'mark';
            cell.addEventListener('click', makeMarkHandler.call(this, i));
            cell.appendChild(dom.text('M'));
            row.appendChild(cell);

            cell = dom.create('td');
            cell.title = 'Delete item';
            cell.className = 'delete';
            cell.addEventListener('click', makeDeleteRowHandler.call(this, i));
            cell.appendChild(dom.text('X'));
            row.appendChild(cell);

            for (j = 0; j < rowLength; j++)
            {
                cell = dom.create('td');
                cell.appendChild(dom.text(this.data.body[i].values[j]));
                cell.addEventListener('click', makeStartEditCell.call(this, i, j));
                row.appendChild(cell);
            }

            body.appendChild(row);
        }

        addRow.className = 'add-row control';
        addRow.type = 'button';
        addRow.value = 'Add Row';
        addRow.addEventListener('click', makeAddRowHandler.call(this));

        addColumn.className = 'add-column control';
        addColumn.type = 'button';
        addColumn.value = 'Add Column';
        addColumn.addEventListener('click', makeAddColumnHandler.call(this));

        table.appendChild(head);
        table.appendChild(body);
        container.appendChild(table);
        container.appendChild(addRow);
        container.appendChild(addColumn);
        parent.appendChild(container);

        this.element = container;
        this.parent = parent;

        pubsub.pub('Table.Rendered', {
            table: this
        });
    };

    tableObject.addRow = function(data)
    {
        if (data)
        {
            if (data.length !== this.data.headers.length)
            {
                throw('Number of data elements must be the same as the number of headers');
                return false;
            }

            this.data.body.push({
                marked: false,
                values: data
            });
        }
        else
        {
            this.data.body.push({
                marked: false,
                values: new Array(this.data.headers.length)
            });
        }
        
        this.render();

        pubsub.pub('Table.RowAdded', {
            table: this,
            row: this.data.body[this.data.body.length - 1]
        });
    };

    tableObject.addColumn = function(header)
    {
        var i,
            bodyLength = this.data.body.length;

        if (!header)
        {
            throw('Header value is required when adding a column to a table');
            return false;
        }

        this.data.headers.push(header);
        
        for (i = 0; i < bodyLength; i++)
        {
            this.data.body[i].values.push('');
        }

        this.render();

        pubsub.pub('Table.ColumnAdded', {
            table: this,
            header: header
        });
    }

    tableObject.getSaveData = function()
    {
        return {
            data: this.data,
            type: 'Table'
        }
    }

    return tableObject;
});