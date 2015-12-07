define([],function(){
	var scene, camera, renderer;
	var webglRenderer, zmesh;
	
	init();
	animate();
	
	function init( mesh ) {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // camera
    camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
    camera.position.z = 75;

    //scene
    scene = new THREE.Scene();

    // lights
    var ambient = new THREE.AmbientLight( 0x404040 );
    scene.add( ambient );

	var hemiLight = new THREE.HemisphereLight( 0xfafafa, 0x080820 , 0.95 ); // 0xffffbb
	scene.add(hemiLight);
	  
    // renderer
    webglRenderer = new THREE.WebGLRenderer({antialias: true});
    webglRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    webglRenderer.domElement.style.position = "relative";
	webglRenderer.setClearColor(0xffffff, 0.5);
	webglRenderer.sortObjects = false;
    container.appendChild( webglRenderer.domElement );

	//load mesh
	zmesh = mesh;
	zmesh.scale.set(2, 2, 2);
	zmesh.rotation.set(1.57, 1.57 * 2, 0);
	scene.add(zmesh);   
    }
	

			
	return {
		dataInit: function( mesh, penaltyFunc(a, b, c)) {
			init(mesh);
			//load penalty function
			
		},
		
		
		dataUpdate: function( eulerAngle ) {
			var newEuler = penaltyFunc( eulerAngle );
			requestAnimationFrame( animate );
			mesh.rotation.x = newEuler.x;
			mesh.rotation.y = newEuler.y;
			mesh.rotation.z = newEuler.z;
			
			renderer.render( scene, camera );
			
		}
	};
	
	
	
});