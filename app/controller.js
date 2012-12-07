ScreenController = (function(parent, pubsub) {
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
			newWindow.item = item;
			item.render(newWindow.content);
			newWindow.render();
			set.addWindow(newWindow);

			pubsub.pub('ScreenController.WindowAdded', {
				windowSet: windowSets[currentSet],
				window: newWindow
			});

			return newWindow;
		};

	screenController.getCurrentWindowSet = function()
	{
		return {
			set: windowSets[currentSet],
			index: currentSet
		};
	}

	screenController.getWindowSets = function()
	{
		return windowSets;
	}

	screenController.addWindowSet = function(name, theme)
	{
		windowSets.unshift(Object.create(UIWindowSet));
		windowSets[0].init(name, theme);
		currentSet++;
		pubsub.pub('ScreenController.SetAdded', {
			index: 0,
			windowSet: windowSets[0]
		});
		return windowSets[0];
	}

	screenController.changeWindowSet = function(index)
	{
		if (index >= windowSets.length)
		{
			throw('Window set out of range');
		}

		currentSet = index;
		pubsub.pub('ScreenController.SetChanged', {
			windowSet: windowSets[currentSet]
		});

		return windowSets[currentSet];
	}

	screenController.removeWindowSet = function(index)
	{
		if (index >= windowSets.length)
		{
			throw('Window set out of range');
		}

		if (index === currentSet || index >= windowSets.length - 1)
		{
			currentSet = 0;
		}

		pubsub.pub('ScreenController.SetRemoved', {
			windowSet: windowSets[currentSet]
		});

		return windowSets.splice(index, 1)[0];
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
})(dom.getById('screen'), efence);