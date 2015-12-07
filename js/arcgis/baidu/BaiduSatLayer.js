define(["dojo/_base/declare",
	"esri/layers/tiled"],
	function (declare) {
		return declare(esri.layers.TiledMapServiceLayer, {
			constructor: function () {
				this.spatialReference = new esri.SpatialReference({ wkid: 102100 });
				this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892, this.spatialReference));
				this.scale = [990780471.4303488,
					495390235.7151744,
					247695117.8575872,
					123847558.9287936,
					61923779.4643968,
					30961889.7321984,
					15480944.8660992,
					7740472.4330496,
					3870236.2165248,
					1935118.1082624,
					967559.0541312,
					483779.5270656,
					241889.7635328,
					120944.8817664,
					60472.4408832,
					30236.2204416,
					15118.1102208,
					7559.0551104,
					3779.5275552,
					1889.7637776];
				// res * 96dpi = 屏幕上每inch相当于实际的meter
				// 屏幕上每inch相当于实际的meter * (meter:inch) = 屏幕上每meter相当于实际的meter
				this.resolution = [262144,
					131072,
					65536,
					32768,
					16384,
					8192,
					4096,
					2048,
					1024,
					512,
					256,
					128,
					64,
					32,
					16,
					8,
					4,
					2,
					1,
					0.5];
				this.tileInfo = new esri.layers.TileInfo({
					"rows": 256,
					"cols": 256,
					"dpi": 96,
					"compressionQuality": 90,
					"origin": {
						"x": -20037508.342787,
						"y": 20037508.342787
					},
					"spatialReference": this.spatialReference,
					"lods": [{ "level": 0, "resolution": this.resolution[0], "scale": this.scale[0] },
						{ "level": 1, "resolution": this.resolution[1], "scale": this.scale[1] },
						{ "level": 2, "resolution": this.resolution[2], "scale": this.scale[2] },
						{ "level": 3, "resolution": this.resolution[3], "scale": this.scale[3] },
						{ "level": 4, "resolution": this.resolution[4], "scale": this.scale[4] },
						{ "level": 5, "resolution": this.resolution[5], "scale": this.scale[5] },
						{ "level": 6, "resolution": this.resolution[6], "scale": this.scale[6] },
						{ "level": 7, "resolution": this.resolution[7], "scale": this.scale[7] },
						{ "level": 8, "resolution": this.resolution[8], "scale": this.scale[8] },
						{ "level": 9, "resolution": this.resolution[9], "scale": this.scale[9] },
						{ "level": 10, "resolution": this.resolution[10], "scale": this.scale[10] },
						{ "level": 11, "resolution": this.resolution[11], "scale": this.scale[11] },
						{ "level": 12, "resolution": this.resolution[12], "scale": this.scale[12] },
						{ "level": 13, "resolution": this.resolution[13], "scale": this.scale[13] },
						{ "level": 14, "resolution": this.resolution[14], "scale": this.scale[14] },
						{ "level": 15, "resolution": this.resolution[15], "scale": this.scale[15] },
						{ "level": 16, "resolution": this.resolution[16], "scale": this.scale[16] },
						{ "level": 17, "resolution": this.resolution[17], "scale": this.scale[17] },
						{ "level": 18, "resolution": this.resolution[18], "scale": this.scale[18] },
						{ "level": 19, "resolution": this.resolution[19], "scale": this.scale[19] }
					]
				});
				this.loaded = true;
				this.onLoad(this);
			},
			
			getTileUrl: function (level, row, col) {
				console.log(row);
				var div = Math.pow(2, 18 - level);
				var numX = Math.floor(col - 20037508.342787 / 256 / div);
				numY = Math.floor(20037508.342787 / 256 / div  - row);	
				var num = (col + row) % 4; // load balance
				
				// sat map
				// var url = "http://shangetu" + num + ".map.bdimg.com/it/u=x="+numX+";y="+numY+";z="+level+";v=009;type=sate&fm=46&udt=20141015"
				var url = 'img/tiles/satTiles/x' + numX + '_y' + numY + '_z' + level + '.jpg';
				
				// label map
				// var url = "http://online" + num + ".map.bdimg.com/tile/?qt=tile&x="+numX+"&y="+numY+"&z="+level+"&styles=sl&udt=20141015";
				
				console.log(url);
				return url;
			}
		});
	}
);