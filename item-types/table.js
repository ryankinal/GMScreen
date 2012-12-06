itemTypes.table = (function() { 
    var tableObject = Object.create(itemTypes.base);

    var makeStartEditCell = function(i, j)
        {
            var self = this;

            return function(e) {
                e = e || window.event;

                var target = e.target || e.srcElement,
                    value = self.data.body[i][j],
                    input = dom.create('input');

                input.type = 'text';
                input.value = value || '';
                dom.empty(target);
                target.appendChild(input);

                input.addEventListener('keypress', makeEndEditCell.call(self, i, j));
                input.addEventListener('keyup', makeCancelEditCell.call(self, i, j));
                input.focus();
            };
        },
        makeEndEditCell = function(i, j)
        {
            var self = this,
                numCheck = /[\d]+\.?[\d]+/;

            return function(e) {
                e = e || window.event;

                var target = e.target || e.srcElement,
                    key = e.keyCode || e.which,
                    value = target.value;

                if (key === 13)
                {
                    if (value.match(numCheck))
                    {
                        self.data.body[i][j] = parseFloat(value);
                    }
                    else
                    {
                        self.data.body[i][j] = value;
                    }
                    
                    self.render();
                    return false;
                }
            };
        },
        makeCancelEditCell = function(i, j)
        {
            var self = this;

            return function(e) {
                e = e || window.event;

                var key = e.keyCode || e.which;

                if (key === 27)
                {
                    self.render();
                    return false;
                }
            };
        },
        makeBlurEditCell = function(i, j)
        {
            var self = this;

            return function(e) {
                self.render();
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
            };
        },
        makeSortHandler = function(colIndex)
        {
            var self = this;

            return function(e) {
                e = e || window.event;

                var target = e.target || e.srcElement;

                if (typeof self.sortOrder[colIndex] === 'undefined')
                {
                    self.sortOrder[colIndex] = 'desc';
                }
                else if (self.sortOrder[colIndex] === 'desc')
                {
                    self.sortOrder[colIndex] = 'asc';
                }
                else
                {
                    self.sortOrder[colIndex] = 'desc';
                }

                if (self.sortOrder[colIndex] === 'desc')
                {
                    self.data.body.sort(function(x, y) {
                        return x[colIndex] < y[colIndex] ? 1 : -1;
                    });
                }
                else
                {
                    self.data.body.sort(function(x, y) {
                        return x[colIndex] < y[colIndex] ? -1 : 1;
                    });   
                }
                
                self.render();
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
                self.data.body.splice(i, 1);
                self.render();
                return false;
            }
        };

    tableObject.load = function(data)
    {
        itemTypes.base.load.call(this, data);

        if (typeof this.data.headers === 'undefined')
        {
            throw('A table must contain headers');
            return false;
        }

        if (typeof this.data.body === 'undefined')
        {
            this.data.body = [];
        }

        this.sortOrder = [];
    }

    tableObject.render = function(parent)
    {
        if (this.element)
        {
            this.element.parentNode.removeChild(this.element);
        }

        parent = parent || this.parent || document.body;

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
            addColumn = dom.create('input');
        
        row.appendChild(cell);
        row.appendChild(cell.cloneNode());

        for (i = 0; i < headerLength; i++)
        {
            cell = dom.create('th');
            cell.appendChild(dom.text(this.data.headers[i]));
            cell.addEventListener('click', makeSortHandler.call(this, i));
            row.appendChild(cell);

            if (typeof this.sortOrder[i] !== 'undefined')
            {
                cell.className = this.sortOrder[i];
            }
        }

        head.appendChild(row);

        for (i = 0; i < bodyLength; i++)
        {
            rowLength = this.data.body[i].length;
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
                cell.appendChild(dom.text(this.data.body[i][j]));
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

            this.data.body.push(data);
        }
        else
        {
            this.data.body.push(new Array(this.data.headers.length));
        }
        
        this.render();
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
            this.data.body[i].push('');
        }

        this.render();
    }

    return tableObject;
})();