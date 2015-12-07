var map;
      require([
        "esri/map", "esri/graphic",
		"baidu/BaiduSatLayer", "baidu/BaiduLblLayer", "baidu/ProjectionTrans",
		"esri/SpatialReference", "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol",
        "dojo/parser",    
		"js/DataReceiver.js",
        "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
      ], function(
        Map, Graphic, 
		BaiduSatLayer, BaiduLblLayer, ProjectionTrans,
        SpatialReference, Point, PictureMarkerSymbol,
        parser,
		DataReceiver
      ) {
        parser.parse();
		
		// setup udp
		DataReceiver.startUdp();
		
        map = new Map("map", {
			logo: false,
        });
		
		// chengdu - in the form of Lat, Lon
		var center = new Point(30.714943, 103.984044, new SpatialReference({wkid: 4326})); // WGS84
		console.log(JSON.stringify(center));
		
		// Mercator - x:11786508.574107038 y:4428168.03367177
		// var center = new Point(63.22803636033048, 22.979087314920573, new SpatialReference({wkid: 4326})); // WGS84??
		// var center = new Point(105.880008, 36.921482, new SpatialReference({wkid: 4326})); // WGS84	
		
		// beijing
		// var center = new Point(116.404, 39.915, new SpatialReference({wkid: 4326}));
		
		// convert WGS84 to GCJ-02
		var gcjCenter = ProjectionTrans.wgs2gcj(center.x, center.y);
		console.log(JSON.stringify(gcjCenter));
		
		// convert GCJ-02 to BD-09
		var bdCenter = ProjectionTrans.gcj2bd(gcjCenter.gcjLat, gcjCenter.gcjLon);
		console.log(JSON.stringify(bdCenter));
		
		// convert WGS84 (GCJ-02 / BD-09) to Mercator
		var merCenter = ProjectionTrans.wgs2mercator(bdCenter.bdLat, bdCenter.bdLon);
		console.log(JSON.stringify(merCenter));
		
		// convert Mercator to bd9mc
		var bdMerCenter = ProjectionTrans.mercator2bd9mc(merCenter.merLat, merCenter.merLon);
		console.log(JSON.stringify(bdMerCenter));
		
		/* just for debugging
		// convert Mercator to WGS84
		// WGS84 - x:63.22803636033048 y:22.979087314920573
		// 105.880008, 36.921482
		var mx = 7038512.810510807;
		var my = 2629489.7975553474;
		var wx = mx / 20037508.34 * 180;
		var wy = my / 20037508.34 * 180;
		wy = 180 / Math.PI * (2 * Math.atan(Math.exp(wy * Math.PI / 180)) - Math.PI / 2);
		console.log('WGS84 - x:' + wx + ' y:' + wy);
		*/	
		
		map.centerAndZoom({x: bdMerCenter.bdMerLon, y: bdMerCenter.bdMerLat}, 17);
		
		// add marker
		var markerPoint = new Point(bdMerCenter.bdMerLon, bdMerCenter.bdMerLat, new SpatialReference({wkid: 102100}));
		// var markerPoint = new Point(merCenter.merLon, merCenter.merLat, new SpatialReference({wkid: 102100}));
		var markerPicSymbol = new PictureMarkerSymbol({
			url: 'img/Cross_32px.png',
			height: 32, 
			width: 32,
			angle: 0,
			xoffset: 0,
			yoffset: 0
			});
		var markerGraphic = new Graphic(markerPoint, markerPicSymbol);
		
		// for debugging
		// map.centerAndZoom({x: 7038512.810510807, y: 2629489.7975553474}, 17);
		
		satLayer = new BaiduSatLayer();
		map.addLayer(satLayer);
		lblLayer = new BaiduLblLayer();
		map.addLayer(lblLayer);
		
		map.graphics.add(markerGraphic);
      });
