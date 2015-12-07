define([], function() {
	//interface
	return {
		loadModel: function( path, callback ) {
			
			var cLoader = new THREE.ColladaLoader();
			cLoader.load( path, function( c ) {
				var mesh = c.scene;				
				callback( mesh );
				//callback.call ( this, objcet );			
			});		
		}
	}	
});