
// 3D code partially grabbed from http://dev.opera.com/articles/view/porting-3d-graphics-to-the-web-webgl-intro-part-2/

document.addEventListener('DOMContentLoaded', function() {
    // if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var FLOOR = 0;

    var container;

    var camera, scene;
    var webglRenderer;

    var zmesh, geometry;

    var mouseX = 0, mouseY = 0;
    var mousemoveX = 0, mousemoveY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

    var closeEl = initCloseBtn();

    init();
    animate();

    function init() {
      container = document.getElementById('model');
      //document.body.appendChild( container );

      // camera
      camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 1, 100000 );
      camera.position.z = 75;

      //scene
      scene = new THREE.Scene();

      // lights
      var ambient = new THREE.AmbientLight( 0x404040 );
      scene.add( ambient );
/*
      // more lights
      var directionalLight = new THREE.DirectionalLight( 0xffeedd, 0.5 );
      directionalLight.position.set(  0, -70, 100 ).normalize();
      scene.add( directionalLight );
	  
	  //more lights2
	  var directionalLight2 = new THREE.DirectionalLight( 0xffeedd , 0.5);
	  directionalLight2.position.set(  0, 70, 100 ).normalize();
      scene.add( directionalLight2 );
*/
	  var hemiLight = new THREE.HemisphereLight( 0xfafafa, 0x080820 , 0.95 ); // 0xffffbb
	  scene.add(hemiLight);
	  
      // renderer
      webglRenderer = new THREE.WebGLRenderer({antialias: true});
      webglRenderer.setSize( container.clientWidth , container.clientHeight );
      webglRenderer.domElement.style.position = "relative";
	  webglRenderer.setClearColor(0xffffff, 0.5);
	  webglRenderer.sortObjects = false;
      container.appendChild( webglRenderer.domElement );

      // load ascii model
/*
      var jsonLoader = new THREE.JSONLoader();
      jsonLoader.load( "obj/palm.js", function( geometry, materials ) { createScene( geometry, materials ) } );
	*/  
	
/*
	  var oLoader = new THREE.OBJMTLLoader();
	  oLoader.load('obj/bixler.obj', 'obj/bixler.mtl', function(obj) {
		// obj.position.y = - 80;
		obj.scale.set(2, 2, 2);
		zmesh = obj;
		scene.add(zmesh);  
	  });
*/
	  
/*
	var sLoader = new THREE.STLLoader();
	  sLoader.load('obj/bixler.stl', function(s) {
		//if (s.hasColors) {
			m = new THREE.MeshPhongMaterial({ opacity: 0.5, vertexColors: THREE.VertexColors });
		//}
		zmesh = new THREE.Mesh(s, m);
		zmesh.scale.set(2, 2, 2);
		scene.add(zmesh);  
	  });
	  */
    }

    function initCloseBtn() {
      var closeEl = document.querySelector(".close");
      if (closeEl) {
        closeEl.addEventListener('click', function() {
          window.close();
        });
      };
      return closeEl;
    }

    function createScene( geometry, materials ) {
      zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
      zmesh.position.set( -10, -10, 0 );
      zmesh.scale.set( 1, 1, 1 );
      scene.add( zmesh );
    }

    function onDocumentMouseDown(event) {
      if (event.target == closeEl) return; // it should deliver click to close button

      document.body.requestPointerLock =
        document.body.requestPointerLock ||
        document.body.mozRequestPointerLock ||
        document.body.webkitRequestPointerLock;
      document.body.requestPointerLock();
    }

    function onDocumentMouseUp(event) {
      document.exitPointerLock =
        document.exitPointerLock ||
        document.mozExitPointerLock ||
        document.webkitExitPointerLock;
      document.exitPointerLock();
    }

    function onDocumentMouseWheel(event) {
      camera.position.z -= event.wheelDelta/120*3;
    }

    function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) / 2;
				mouseY = ( event.clientY - windowHalfY ) / 2;

			}

    function animate() {
      requestAnimationFrame( animate );
      render();
    }

    function render() {

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				webglRenderer.render( scene, camera );

			}

});

