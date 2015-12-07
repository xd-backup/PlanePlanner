define([
		"esri/map", "esri/graphic",
		"baidu/BaiduSatLayer", "baidu/BaiduLblLayer", "baidu/ProjectionTrans",
		"esri/SpatialReference", "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol"], 
		function(
		Map, Graphic, 
		BaiduSatLayer, BaiduLblLayer, ProjectionTrans,
        SpatialReference, Point, PictureMarkerSymbol) 
	{
		// param
		var markerLength = 32;
		
		// private
		var map;
		var centerType;
		var home;
		var plane;
		
		// helper
		var setMapCenterType = function(type) {
			if (type == "static")
				centerType = type;
			else // dynamic
				centerType = "dynamic";
		};
			
		var calcMapZoom = function(p1, p2) {
			var resList = map.__tileInfo.lods; // level 0 - 19
			var dx = Math.abs(p1.x - p2.x);
			var dy = Math.abs(p1.y - p2.y);

			// search from the last one
			for (var i = resList.length - 1; i > 2; i--) // from lvl 19 to 3
			{
				var res = resList[i].resolution;
				var dw = dx / res;
				var dh = dy / res;
				
				if (dw >= (map.width - markerLength) / 2 ||
					dh >= (map.height - markerLength) / 2)
				{
					// go to next
					;
				}
				else
				{
					return i;
				}
			}
			
			return 0;
		};
		
		var convertPoint = function(p)
		{
			console.log(JSON.stringify(p));	
			// convert WGS84 to GCJ-02
			var gcjPoint = ProjectionTrans.wgs2gcj(p.x, p.y);
			console.log(JSON.stringify(gcjPoint));	
			// convert GCJ-02 to BD-09
			var bdPoint = ProjectionTrans.gcj2bd(gcjPoint.gcjLat, gcjPoint.gcjLon);
			console.log(JSON.stringify(bdPoint));
			// convert WGS84 (GCJ-02 / BD-09) to Mercator
			var merPoint = ProjectionTrans.wgs2mercator(bdPoint.bdLat, bdPoint.bdLon);
			console.log(JSON.stringify(merPoint));
			// convert Mercator to bd9mc
			var bdMerPoint = ProjectionTrans.mercator2bd9mc(merPoint.merLat, merPoint.merLon);
			console.log(JSON.stringify(bdMerPoint));
			
			return bdMerPoint;
		};
		
		var refreshMarkers = function() {
			for (var i = 0; i < map.graphics.graphics.length; i++)
			{
				if (map.graphics.graphics[i].name !== undefined)
				map.graphics.graphics[i].draw();
			}
		};
		
		// interface
		var initMap = function(center, type, mapContainerName) {
			setMapCenterType(type);
			
			map = new Map(mapContainerName, {
				logo: false
			});

			// chengdu - in the form of Lat, Lon
			// var center = new Point(30.714943, 103.984044, new SpatialReference({wkid: 4326})); // WGS84
			var bdMerCenter = convertPoint(center);
			home = bdMerCenter;
			// go to center
			map.centerAndZoom({x: bdMerCenter.bdMerLon, y: bdMerCenter.bdMerLat}, 19);
			
			// add layers
			var satLayer = new BaiduSatLayer();
			var lblLayer = new BaiduLblLayer();
			map.addLayers([satLayer, lblLayer]);
			
			// add home marker
			var homeMarkerPoint = new Point(bdMerCenter.bdMerLon, bdMerCenter.bdMerLat, new SpatialReference({wkid: 102100}));
			var homeMarkerPicSymbol = new PictureMarkerSymbol({
				url: 'img/Home_32px.png',
				height: 32, 
				width: 32,
				angle: 0,
				xoffset: 0,
				yoffset: 0
				});
			var homeMarkerGraphic = new Graphic(homeMarkerPoint, homeMarkerPicSymbol);
			homeMarkerGraphic.name = "homeMarker";
			map.graphics.add(homeMarkerGraphic);
			
			// add plane marker
			var planeMarkerPoint = new Point(bdMerCenter.bdMerLon, bdMerCenter.bdMerLat, new SpatialReference({wkid: 102100}));
			var planeMarkerPicSymbol = new PictureMarkerSymbol({
				url: 'img/Plane_32px.png',
				height: 32, 
				width: 32,
				angle: 0,
				xoffset: 0,
				yoffset: 0
				});
			var planeMarkerGraphic = new Graphic(planeMarkerPoint, planeMarkerPicSymbol);
			planeMarkerGraphic.name = "planeMarker";
			map.graphics.add(planeMarkerGraphic);
			
			dojo.connect(map, "onUpdateEnd", function() {
			  refreshMarkers();
			  console.log('up end');
			});
		};
			
		var updatePlane = function(loc) {
			var point = convertPoint(loc);
			if (plane.x == point.x && plane.y == point.y)
				return;
			
			plane = point;
			
			// zoom
			var zoom = calcMapZoom(home, plane);
			if (centerType == "static")
			{
				// center pinned to home
				if (zoom != map.getZoom())
					map.setZoom(zoom);
				
			}
			else if(centerType == "dynamic")
			{
				// center goes to plane
				map.centerAndZoom({x: plane.bdMerLon, y: plane.bdMerLat}, zoom);
			}
			
			// update plane marker
			var graphics = map.graphics.graphics;
			for (var i = 0; i < graphics.length; i++)
			{
				if (graphics[i].name !== undefined)
					if (graphics[i].name == "planeMarker")
					{
						map.graphics.graphics[i].setGeometry(new Point(point.bdMerLon, 
							point.bdMerLat, 
							new SpatialReference({wkid: 102100})));
						map.graphics.graphics[i].draw();
						break;
					}
			}
			refreshMarkers();
		};
		
		// interface
		return {
			convertPoint: convertPoint,
			initMap: initMap,
			updatePlane: updatePlane
		};
});