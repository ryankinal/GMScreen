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

	windowSetObj.callOnAll = function(functionName)
	{
		var i, win;

		for (i = 0; i < this.windows.length; i++)
		{
			win = this.windows[i];
			win[functionName].apply(win, Array.prototype.slice.call(arguments, 1));
		}
	}

	windowSetObj.render = function()
	{
		this.callOnAll('render');
	}

	windowSetObj.hide = function()
	{
		this.callOnAll('hide');
	}

	windowSetObj.show = function()
	{
		this.callOnAll('show');
	}

	windowSetObj.snap = function(value)
	{
		this.callOnAll('snap');
	}

	return windowSetObj;
})();