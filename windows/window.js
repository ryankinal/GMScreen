UIWindow = (function() {
	var windowObject = {},
		currentMover,
		lastPosition,
		makeCloseHandler = function()
		{
			var self = this;

			return function(e)
			{
				self.hide();
				delete self;
			}
		},
		makeShadeHandler = function()
		{
			var self = this;

			return function(e)
			{
				self.shade();
			}
		},
		makeMouseDownHandler = function()
		{
			var self = this;

			return function(e)
			{
				e = e || window.event;
				
				if (currentMover)
				{
					currentMover.z = 1;
					currentMover.update();
				}

				currentMover = self;
				lastPosition = dom.mousePosition(e);
				currentMover.z = 200;
				currentMover.update();
				window.addEventListener('mousemove', moveHandler);
				window.addEventListener('mouseup', mouseUpHandler);
			}
		},
		mouseUpHandler = function(e)
		{
			lastPosition = null;
			currentMover.update();
			window.removeEventListener('mousemove', moveHandler);
			window.removeEventListener('mouseup', mouseUpHandler);
		},
		moveHandler = function(e)
		{
			e = e || window.event;

			var position = dom.mousePosition(e);

			if (currentMover && lastPosition)
			{
				currentMover.x += (position.x - lastPosition.x);
				currentMover.y += (position.y - lastPosition.y);
				lastPosition = position;
				currentMover.update();
			}
		};

	windowObject.init = function(title, parent)
	{
		this.snapTo = true;

		this.width = 500;
		this.height = 300;
		
		this.x = window.innerWidth / 2 - 250;
		this.y = window.innerHeight / 2 - 150;
		this.z = 1;

		this.container = dom.create('div');
		this.header = dom.create('div');
		this.content = dom.create('div');
		this.shader = dom.create('div');
		this.closer = dom.create('div');

		this.container.className = 'ui-window';
		this.header.className = 'ui-header';
		this.content.className = 'ui-content';
		this.shader.className = 'ui-shader';
		this.closer.className = 'ui-closer';

		this.header.appendChild(dom.text(title));
		this.shader.appendChild(dom.text('^'));
		this.closer.appendChild(dom.text('X'));

		this.container.appendChild(this.header);
		this.container.appendChild(this.content);
		this.container.appendChild(this.shader);
		this.container.appendChild(this.closer);

		this.header.addEventListener('mousedown', makeMouseDownHandler.call(this));
		this.shader.addEventListener('click', makeShadeHandler.call(this));
		this.closer.addEventListener('click', makeCloseHandler.call(this));

		this.title = title;
		this.parent = parent || document.body;
	};

	windowObject.render = function()
	{
		if (currentMover)
		{
			currentMover.z = 1;
			currentMover.update();
		}

		this.z = 200;
		this.container.style.position = 'absolute';
		this.parent.appendChild(this.container);
		this.update();
	}

	windowObject.update = function()
	{
		if (!lastPosition && this.snapTo)
		{
			this.x = Math.round(this.x / 10) * 10;
			this.y = Math.round(this.y / 10) * 10;
		}

		this.container.style.left = this.x + 'px';
		this.container.style.top = this.y + 'px';
		this.container.style.zIndex = this.z;
	}

	windowObject.hide = function()
	{
		this.container.style.display = 'none';
	}

	windowObject.show = function()
	{
		this.container.style.display = 'block';
	}

	windowObject.snap = function(value)
	{
		if (typeof value === 'undefined')
		{
			this.snapTo = !this.snapTo;
		}
		else
		{
			this.snapTo = value;
		}
	}

	windowObject.shade = function()
	{
		if (this.shaded)
		{
			this.container.className = this.container.className.replace(/\s*\bshaded\b\s*/g, '');
			this.content.style.display = 'block';
			this.shaded = false;
		}
		else
		{
			this.container.className += ' shaded';
			this.content.style.display = 'none';
			this.shaded = true;
		}
	}

	return windowObject;
})();