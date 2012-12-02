ScreenController = (function(parent) {
	var screenController = {},
		windowSets = [],
		currentSet = -1,
		addWindow = function(name, item)
		{
			if (currentSet < 0 || !windowSets[currentSet])
			{
				throw('No window set selected');
				return false;
			}

			var set = windowSets[currentSet],
				newWindow = Object.create(UIWindow);

			newWindow.init(name, parent);
			item.render(newWindow.content);
			newWindow.render();
			set.addWindow(newWindow);

			return newWindow;
		};

	screenController.addWindowSet = function(name, theme)
	{
		windowSets.unshift(Object.create(UIWindowSet));
		windowSets[0].init(name, theme);
		currentSet = 0;
		return windowSets[0];
	}

	screenController.changeWindowSet = function(index)
	{
		if (index >= windowSets.length)
		{
			throw('Window set out of range');
		}

		currentSet = index;

		return sets[currentSet];
	}

	screenController.removeWindowSet = function(index)
	{
		if (index >= windowSets.length)
		{
			throw('Window set out of range');
		}

		return windowSets.splice(index, 1);
	}

	screenController.addTable = function(name, data)
	{
		var newTable = Object.create(itemTypes.table);
		newTable.load(data);
		return addWindow(name, newTable);
	}

	screenController.addOrderedList = function(name, data)
	{
		var newList = Object.create(itemTypes.orderedList);
		newList.load(data);
		return addWindow(name, newList);
	}

	screenController.addUnorderedList = function(name, data)
	{
		var newList = Object.create(itemTypes.unorderedList);
		newList.load(data);
		return addWindow(name, newList);
	}

	return screenController;
})(dom.getById('screen'));