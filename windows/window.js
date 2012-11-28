UIWindow = (function() {
	var windowObject = {},
		currentMover,
		makeMouseDownHandler = function()
		{
			var self = this;

			return function(e)
			{
				e = e || window.event;
				currentMover = self;
				document.addEventListener('mousemove', moveHandler);
			}
		},
		mousUpHandler = function(e)
		{
			currentMover = null;
			document.removeEventListener('mousemove', moveHandler);
		},
		moveHandler = function(e)
		{
			e = e || window.event;

			// do mouse move shit
		};

	windowObject.init = function(title, parent)
	{
		this.width = 500;
		this.height = 300;
		
		this.x = document.body.offsetWidth / 2 - 250;
		this.y = document.body.offsetHeight / 2 - 150;

		this.container = dom.create('div');
		this.header = dom.create('div');
		this.content = dom.create('div');

		this.container.className = 'ui-window';
		this.header.className = 'ui-header';
		this.content.className = 'ui-content';

		this.header.appendChild(dom.text(title));
		this.container.appendChild(this.header);
		this.container.appendChild(this.content);

		this.parent = parent || document.body;
	};

	windowObject.render = function(parent)
	{
		this.container.style.left = this.x;
		this.container.style.top = this.y;
		this.container.style.width = this.width;
		this.container.style.height = this.height;
		this.parent.appendChild(this.container);
	}

	return windowObject;
})();