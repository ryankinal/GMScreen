define(
	[
		'windows/window',
		'windows/windowset',
		'utilities/dom',
		'utilities/efence',
		'item-types/all'
	],
	function(UIWindow, UIWindowSet, dom, pubsub, itemTypes)
	{
		var parent = dom.getById('screen'),
			screenController = {},
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

			var set = windowSets.splice(index, 1)[0];

			if (windowSets.length == 0)
			{
				currentSet = -1;
			}
			else if (index === currentSet || index >= windowSets.length - 1)
			{
				currentSet = 0;
			}

			pubsub.pub('ScreenController.SetRemoved', {
				windowSet: set
			});

			return set;
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

		screenController.save = function()
		{
			if (localStorage)
			{
				localStorage.setItem('gmscreen', JSON.stringify(this.getSaveData()));
			}
		}

		screenController.load = function()
		{
			var data, firstSet;

			if (localStorage && (data = JSON.parse(localStorage.getItem('gmscreen'))))
			{
				windowSets = [];

				data.windowSets.forEach(function(set, index) {
					windowSets.push(Object.create(UIWindowSet));
					windowSets[index].init(set.name, set.theme);
					currentSet = index;

					set.windows.forEach(function(win, index) {
						var newWindow,
							item = win.item,
							type = win.item.type;

						if (win.item && win.item.type)
						{
							newWindow = this['add' + win.item.type](win.name, win.item.data);

							if (win.item.marked)
							{
								newWindow.item.marked = win.item.marked;
							}
							
							if (win.item.sortOrder)
							{
								newWindow.item.sortOrder = win.item.sortOrder
							}
						}

						newWindow.x = win.x;
						newWindow.y = win.y;
						newWindow.z = win.z;
						newWindow.update();
					}, this);
					windowSets[index].hide();
				}, this);

				this.changeWindowSet(data.currentSet);

				if (firstSet = this.getCurrentWindowSet().set)
				{
					firstSet.show();	
				}
			}
		}

		screenController.getSaveData = function()
		{
			var sets = [];
			windowSets.forEach(function(set, index) {
				sets.push(set.getSaveData());
			});

			return {
				currentSet: currentSet,
				windowSets: sets
			}
		}

		pubsub.sub('UIWindow.Removed', function(data) {
			windowSets[currentSet].removeWindow(data.window);
		});

		return screenController;
	}
);