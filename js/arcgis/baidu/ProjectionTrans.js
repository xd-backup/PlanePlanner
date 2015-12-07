define([], function() {
		var isOutOfChina = function(lat, lon) {
			if (lon < 72.004 || lon > 137.8347)
				return true;
			if (lat < 0.8293 || lat > 55.8271)
				return true;
			return false;
		};
		
		var transLat = function(x, y) {
			var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
			ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
			ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
			return ret;
		};
		
		var transLon = function(x, y) {
			var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
            return ret;
		};
		 
		return {
			wgs2gcj: function(wgsLat, wgsLon) {
				// Krasovsky 1940
				// a = 6378245.0, 1/f = 298.3
				// b = a * (1 - f)
				// ee = (a^2 - b^2) / a^2;
				var a = 6378245.0;
				var ee = 0.00669342162296594323;
				
				if (isOutOfChina(wgsLat, wgsLon))
				{
					return {gcjLat: wgsLat, gcjLon: wgsLon};
				}
				
				var dLat = transLat(wgsLon - 105.0, wgsLat - 35.0);
				var dLon = transLon(wgsLon - 105.0, wgsLat - 35.0);
				var radLat = wgsLat / 180.0 * Math.PI;
				var magic = Math.sin(radLat);
				magic = 1 - ee * magic * magic;
				var sqrtMagic = Math.sqrt(magic);
				dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
				dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
				
				return {gcjLat: wgsLat + dLat, gcjLon: wgsLon + dLon};
			},
			
			gcj2bd: function(gcjLat, gcjLon) {
				var pi = Math.PI * 3000.0 / 180.0;
				var z = Math.sqrt(gcjLon * gcjLon + gcjLat * gcjLat) + 0.00002 * Math.sin(gcjLat * pi);
				var theta = Math.atan2(gcjLat, gcjLon) + 0.000003 * Math.cos(gcjLon * pi);
				bdLat = z * Math.sin(theta) + 0.006;
				bdLon = z * Math.cos(theta) + 0.0065;
				return {bdLat: bdLat, bdLon: bdLon};
			},
			
			wgs2mercator: function(wgsLat, wgsLon) {
				var merLon = wgsLon * 20037508.34 / 180;
				var merLat = Math.log(Math.tan((90 + wgsLat) * Math.PI / 360.0)) / (Math.PI / 180.0);;
				merLat = merLat * 20037508.34 / 180;
				
				/*
				if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
					return;

				var num = wgsLon * 0.017453292519943295;
				var x = 6378137.0 * num;
				var a = wgsLat * 0.017453292519943295;

				var merLon = x;
				var merLat = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
				*/
				
				return {merLat: merLat, merLon: merLon};
			},
			
			mercator2bd9mc: function(merLat, merLon)
			{
				var bdMerLon = merLon - 1009.830841321 + 192; // 1009.830841321
				var bdMerLat = merLat - 22425.1029452947 - 64; // 22425.1029452947
				return {bdMerLat: bdMerLat, bdMerLon: bdMerLon};
			}
		}
	}
);