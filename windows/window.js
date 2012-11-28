UIWindow = (function() {
	var windowObject = {},
		currentMover,
		lastPosition,
		makeMouseDownHandler = function()
		{
			var self = this;

			return function(e)
			{
				e = e || window.event;
				currentMover = self;
				lastPosition = dom.mousePosition(e);
				window.addEventListener('mousemove', moveHandler);
				window.addEventListener('mouseup', mouseUpHandler);
			}
		},
		mouseUpHandler = function(e)
		{
			currentMover = null;
			lastPosition = null;
			window.removeEventListener('mousemove', moveHandler);
		},
		moveHandler = function(e)
		{
			e = e || window.event;

			var position = dom.mousePosition(e);

			if (currentMover && lastPosition)
			{
				console.dir(position);
				console.dir(lastPosition);
				console.dir(currentMover);
				currentMover.x += (position.x - lastPosition.x);
				currentMover.y += (position.y - lastPosition.y);
				lastPosition = position;
				currentMover.update();
			}
		};

	windowObject.init = function(title, parent)
	{
		this.width = 500;
		this.height = 300;
		
		this.x = window.innerWidth / 2 - 250;
		this.y = window.innerHeight / 2 - 150;

		this.container = dom.create('div');
		this.header = dom.create('div');
		this.content = dom.create('div');

		this.container.className = 'ui-window';
		this.header.className = 'ui-header';
		this.content.className = 'ui-content';

		this.header.appendChild(dom.text(title));
		this.container.appendChild(this.header);
		this.container.appendChild(this.content);

		this.header.addEventListener('mousedown', makeMouseDownHandler.call(this));

		this.parent = parent || document.body;
	};

	windowObject.render = function()
	{
		this.container.style.position = 'absolute';
		this.parent.appendChild(this.container);
		this.update();
	}

	windowObject.update = function()
	{
		this.container.style.left = this.x + 'px';
		this.container.style.top = this.y + 'px';
		this.container.style.width = this.width + 'px';
		this.container.style.height = this.height + 'px';
	}

	return windowObject;
})();