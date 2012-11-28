UIWindowSet = (function() {
	var windowSetObj = {};

	windowSetObj.init = function(name, theme)
	{
		this.name = name;
		this.theme = theme || 'natural';
		this.windows = [];
	}

	windowSetObj.addWindow = function(windowToAdd)
	{
		this.windows.push(windowToAdd);
	}

	windowSetObj.removeWindow = function(windowToRemove)
	{
		var i = 0,
			returnValue = [];
		
		for (i = 0; i < this.windows.length; i++)
		{
			if (this.windows[i].title === windowToRemove)
			{
				returnValue.push(this.windows.splice(i, 1)[0]);
			}
			else if (this.windows[i] === windowToRemove)
			{
				returnValue.push(this.windows.splice(i, 1)[0]);
			}
		}

		if (returnValue.length === 0)
		{
			return false;
		}
		else if (returnValue.length === 1)
		{
			return returnValue[0];
		}
		else
		{
			return returnValue;
		}
	}

	windowSetObj.render = function()
	{
		var i,
			numberOfWindows = this.windows.length;

		for (i = 0; i < numberOfWindows; i++)
		{
			this.windows[i].render();
		}
	}

	windowSetObj.hide = function()
	{
		var i,
			numberOfWindows = this.windows.length;

		for (i = 0; i < numberOfWindows; i++)
		{
			this.windows[i].hide();
		}
	}

	windowSetObj.show = function()
	{
		var i,
			numberOfWindows = this.windows.length;

		for (i = 0; i < numberOfWindows; i++)
		{
			this.windows[i].show();
		}
	}

	return windowSetObj;
})();