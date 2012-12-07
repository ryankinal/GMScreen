define(function() {
	var eventSubscriptions = {};

	return {
		pub: function(eventName, data)
		{
			var i;

			if (typeof eventSubscriptions[eventName] !== 'undefined')
			{
				for (i = 0; i < eventSubscriptions[eventName].length; i++)
				{
					eventSubscriptions[eventName][i](data);
				}
			}
		},
		sub: function(eventName, callback)
		{
			if (typeof eventSubscriptions[eventName] === 'undefined')
			{
				eventSubscriptions[eventName] = [];
			}

			eventSubscriptions[eventName].push(callback);

			return callback;
		},
		unsub: function(eventName, callback)
		{
			var i;

			if (typeof eventSubscriptions[eventName] !== 'undefined')
			{
				for (i = 0; i < eventSubscriptions[eventName].length; i++)
				{
					if (eventSubscriptions[eventName][i] === callback)
					{
						return eventSubscriptions[eventName].splice(i, 1);
					}
				}
			}

			return false;
		}
	}
});