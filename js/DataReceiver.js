defineJs([], function() {
	// parameter
	var remoteHost = '192.168.4.1';
	var remotePort = 4501;
	var localPort = 4506;
	
	var handlerList = {};
	
	var Dgram = requireNode('dgram');
	var dgram = Dgram.createSocket('udp4');
	
	dgram.on('error', function(err) {
		console.log('dgram error:\n' + err.stack);
		dgram.close();
	});
	
	dgram.on('message', function(message, rinfo) {
		// TO DO : handle received msg
		// msg sample: type=GPS#lat=30.25&lon=120.45\r\n
		// \r\n
		var now = new Date();
		
		var msgArr = message.split("\r\n");
		for (var iMsg = 0; iMsg < msgArr; iMsg++)
		{
			var msg = msgArr[iMsg];
			var firstArr = msg.split('#');
			var type = (firstArr[0].split('='))[1];
			var dataJson = {ts: now.getTime(), type: type};
			
			var secondArr = firstArr[1].split('&');
			for (var i = 0; i < secondArr.length; i++)
			{
				var thirdArr = secondArr[i].split('=');
				dataJson[thirdArr[0]] = parseFloat(thirdArr[1]);
			}
			
			var handlers = handlerList[type];
			if (handlers !== undefined && handler != null)
			{
				for (var j = 0; j < handlers.length; j++)
				{
					var handler = handlers[j];
					handler(dataJson);
				}
			}
		}
	});
	
	// interface
	return {
		startUdp: function() {
			dgram.bind(localPort, function() {
				var addr = dgram.address();
				console.log('dgram listening:\n' + 
				addr.address + ':' + addr.port);
			});
		},
		
		stopUdp: function() {
			dgram.close();
			console.log('dgram closed\n');
		},
		
		registerHandler: function(type, callback) {
			var handlers = handlerList[type];
			if (handlers === undefined || handlers == null)
			{
				// create
				handlerList[type] = [];
				handlerList[type].push(callback);
			}
			else
			{
				// add directly
				handlerList[type].push(callback);
			}
		}
	};
});