define(function() {
	var eventSubscriptions = {};

	return {
		pub: function(eventName, data)
		{
			if (typeof eventSubscriptions[eventName] !== 'undefined')
			{
				eventSubscriptions[eventName].forEach(function(callback, index) {
					callback(data);
				});
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
			if (typeof eventSubscriptions[eventName] !== 'undefined')
			{
				eventSubscriptions[eventName] = eventSubscriptions[eventName].filter(function(value) {
					return value !== callback;
				});
			}

			return false;
		}
	}
});