itemTypes.list = (function() {
	var listObject = Object.create(itemTypes.base);
	listObject.tagName = 'ul';

	var makeMoveUpHandler = function(i)
		{
			var self = this;

			if (i === 0)
			{
				return function(e)
				{
					return false;
				}
			}
			else
			{
				return function(e)
				{
					self.data.splice(i - 1, 2, self.data[i], self.data[i - 1]);
					self.render();
					return false;
				}
			}
		},
		makeMoveDownHandler = function(i)
		{
			var self = this;

			if (i === this.data.length - 1)
			{
				return function(e)
				{
					return false;
				}
			}
			else
			{
				return function(e)
				{
					self.data.splice(i, 2, self.data[i + 1], self.data[i]);
					self.render();
					return false;
				}
			}
		},
		makeStartEditHandler = function(i)
		{
			var self = this;

			return function(e)
			{
				e = e || window.event;

				var target = e.target || e.srcElement,
					value = self.data[i],
					text = dom.create('textarea');

				dom.empty(target);
				text.value = value || '';
				target.appendChild(text);

				text.addEventListener('keypress', makeEndEditHandler.call(self, i));
				text.addEventListener('keyup', makeCancelEditHandler.call(self, i));
				text.addEventListener('click', function(e) {
					e = e || window.event;
					e.cancelBubble = true;
					if (e.stopPropagation)
					{
						e.stopPropagation();
					}
				});
				text.focus();

				return false;
			}
		},
		makeEndEditHandler = function(i)
		{
			var self = this;

			return function(e)
			{
				e = e || window.event;

				var target = e.target || e.srcElement,
					key = e.keyCode || e.which,
					value = target.value;

				if (key === 13)
				{
					self.data[i] = value;
					self.render();
					return false;
				}
			}
		},
		makeCancelEditHandler = function(i)
		{
			var self = this;

			return function(e)
			{
				e = e || window.event;

				var key = e.keyCode || e.which;

				if (key === 27)
				{
					self.render();
					return false;
				}
			}
		},
		makeDeleteHandler = function(i)
		{
			var self = this;

			return function(e)
			{
				self.data.splice(i, 1);
				self.render();
				return false;
			}
		},
		makeAddHandler = function(i)
		{
			var self = this;

			return function(e)
			{
				self.addItem.call(self);
				return false;
			}
		},
		makeMarkHandler = function(i)
		{
			var self = this;

			return function(e)
			{
				e = e || window.event;

				var target = e.target || e.srcElement,
					marked = self.data[i].marked;

				if (marked)
				{
					self.data[i].marked = false;

				}
				else
				{
					self.data[i].marked = true;
				}

				self.render();
				return false;
			}
		};

	listObject.load = function(data)
	{
		itemTypes.base.load.call(this, data);
	}

	listObject.render = function(parent)
	{
		if (this.element && dom.inDocument(this.element))
		{
			this.element.parentNode.removeChild(this.element);
			this.element = null;
		}

		parent = parent || document.body;

		var i,
			dataLength = this.data.length,
			container = dom.create('div'),
			list = dom.create(this.tagName),
			item,
			itemText,
			addItem = dom.create('input'),
			moveUp,
			moveDown,
			markItem,
			deleteItem,
			controls;

		for (i = 0; i < dataLength; i++)
		{
			item = dom.create('li');
			itemText = dom.create('div');
			itemText.appendChild(dom.text(this.data[i]));
			item.appendChild(itemText);
			itemText.addEventListener('click', makeStartEditHandler.call(this, i));

			if (this.data[i].marked)
			{
				itemText.className = 'marked';
			}

			controls = dom.create('div');

			moveUp = dom.create('input');
			moveUp.className = 'move-up';
			moveUp.type = 'button';
			moveUp.value = 'Up';
			moveUp.addEventListener('click', makeMoveUpHandler.call(this, i));

			moveDown = dom.create('input');
			moveDown.className = 'move-down';
			moveDown.type = 'button';
			moveDown.value = 'Down';
			moveDown.addEventListener('click', makeMoveDownHandler.call(this, i));

			markItem = dom.create('input');
			markItem.className = 'mark';
			markItem.type = 'button';
			markItem.value = 'Mark';
			markItem.addEventListener('click', makeMarkHandler.call(this, i));

			deleteItem = dom.create('input');
			deleteItem.className = 'delete';
			deleteItem.type = 'button';
			deleteItem.value = 'Delete';
			deleteItem.addEventListener('click', makeDeleteHandler.call(this, i))

			controls.appendChild(moveUp);
			controls.appendChild(moveDown);
			controls.appendChild(deleteItem);

			item.appendChild(controls);
			list.appendChild(item);
		}

		addItem = dom.create('input');
		addItem.className = 'add-item';
		addItem.type = 'button';
		addItem.value = 'Add Item';
		addItem.addEventListener('click', makeAddHandler.call(this));

		container.appendChild(list);
		container.appendChild(addItem);
		parent.appendChild(container);

		this.element = container;
	}

	listObject.addItem = function(data)
	{
		if (typeof data === 'undefined')
		{
			data = '[click to edit]';
		}

		this.data.push(data);
		this.render();
	}

	return listObject;
})();