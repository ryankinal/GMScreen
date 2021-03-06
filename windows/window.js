define(['utilities/efence', 'utilities/dom', 'utilities/cap'], function(pubsub, dom, cap) {
	var minX = 0,
		minY = 0,
		windowObject = {},
		currentMover,
		lastPosition,
		makeCloseHandler = function()
		{
			var self = this;

			return function(e)
			{
				self.remove();
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

				if (e.preventDefault)
				{
					e.preventDefault();
				}
				
				return false;
			}
		},
		mouseUpHandler = function(e)
		{
			lastPosition = null;
			currentMover.update();
			pubsub.pub('UIWindow.WindowMoved');
			window.removeEventListener('mousemove', moveHandler);
			window.removeEventListener('mouseup', mouseUpHandler);
			
			if (e.preventDefault)
			{
				e.preventDefault();
			}

			return false;
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

			if (e.preventDefault)
			{
				e.preventDefault();
			}

			return false;
		};

	windowObject.init = function(name, parent)
	{
		this.snapTo = true;
		
		this.x = 10;
		this.y = 10;
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

		this.shader.title = 'Shade this window';
		this.closer.title = 'Close this window';

		this.header.appendChild(dom.text(name));
		this.shader.appendChild(dom.text('^'));
		this.closer.appendChild(dom.text('X'));

		this.container.appendChild(this.header);
		this.container.appendChild(this.content);
		this.container.appendChild(this.shader);
		this.container.appendChild(this.closer);

		this.header.addEventListener('mousedown', makeMouseDownHandler.call(this));
		this.shader.addEventListener('click', makeShadeHandler.call(this));
		this.closer.addEventListener('click', makeCloseHandler.call(this));

		this.name = name;
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
		currentMover = this;
		this.container.style.position = 'absolute';
		this.parent.appendChild(this.container);
		this.update();
	}

	windowObject.remove = function()
	{
		var self = this;
		cap.confirm({
            message: 'Are you sure you want to delete this window?',
            confirmText: 'Yes',
            cancelText: 'No',
            onConfirm: function(e) {
                self.hide();
				pubsub.pub('UIWindow.Removed', {
					window: self
				});
            }
        });
	}

	windowObject.update = function()
	{
		if (!lastPosition && this.snapTo)
		{
			this.x = Math.round(this.x / 10) * 10;
			this.y = Math.round(this.y / 10) * 10;
		}

		this.x = (this.x < minX) ? minX : this.x;
		this.y = (this.y < minY) ? minY : this.y;

		this.container.style.left = this.x + 'px';
		this.container.style.top = this.y + 'px';
		this.container.style.zIndex = this.z;
	}

	windowObject.hide = function()
	{
		this.container.style.display = 'none';
		pubsub.pub('UIWindow.Hidden', {
			window: this
		});
	}

	windowObject.show = function()
	{
		this.container.style.display = 'block';
		pubsub.pub('UIWindow.Shown', {
			window: this
		});
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

		pubsub.pub('UIWindow.SnapChanged', {
			window: this
		});
	}

	windowObject.shade = function(shade)
	{
		if (shade === true || shade === false)
		{
			this.shaded = !shade;
		}

		if (this.shaded)
		{
			this.shader.title = 'Shade this window';
			this.container.className = this.container.className.replace(/\s*\bshaded\b\s*/g, '');
			this.content.style.display = 'block';
			this.shaded = false;
			pubsub.pub('UIWindow.Unshaded', {
				window: this
			});
		}
		else
		{
			this.shader.title = 'Unshade this window';
			this.container.className += ' shaded';
			this.content.style.display = 'none';
			this.shaded = true;
			pubsub.pub('UIWindow.Shaded', {
				window: this
			});
		}
	}

	windowObject.getSaveData = function()
	{
		return {
			name: this.name,
			x: this.x,
			y: this.y,
			z: this.z,
			snapTo: this.snapTo,
			shaded: this.shaded,
			item: this.item.getSaveData()
		}
	}

	return windowObject;
});