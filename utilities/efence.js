define(function() {
	var eventSubscriptions = {},
		recentEvents = {},
		recentLifetime = 100;

	return {
		pub: function(eventName, data)
		{
			if (typeof eventSubscriptions[eventName] !== 'undefined')
			{
				eventSubscriptions[eventName].forEach(function(callback, index) {
					callback(data);
				});
			}

			if (eventName !== '*' && !recentEvents[eventName])
			{
				this.pub('*', data);
				recentEvents[eventName] = true;
				setTimeout(function() {
					delete recentEvents[eventName];
				}, recentLifetime);
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