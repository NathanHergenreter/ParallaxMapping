var material;
var textureSet;
var mode;
var minLayers;
var maxLayers;
var diffuseTex;
var normalTex;
var depthTex;

function start()
{
  window.onkeypress = handleKeyPress;

  var scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 30, 1.5, 0.1, 1000 );
  camera.rotation.order = "YXZ";
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 2;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});

  // Choose a geometry
  // var geometry = new THREE.SphereBufferGeometry(1, 24, 18);
  var geometry = new THREE.PlaneBufferGeometry();
  THREE.BufferGeometryUtils.computeTangents(geometry);
  geometry.rotateZ(THREE.Math.degToRad(180));

  material = genMaterial();
  scene.add(new THREE.Mesh(geometry, material));

  // Generate Axes
  //genAxes(scene);
  
  // Put in an ambient light
  light = new THREE.AmbientLight(0x555555);
  scene.add(light);

  var render = function () {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };


  render();
}

function changeMode()
{
  mode = document.getElementById("parallaxMode").value;
  
  material.defines = {};
  material.defines[modes[mode]] = '';
  material.needsUpdate = true;
}

function changeTextures()
{
  textureSet = parseInt(document.getElementById("textureSet").value);

  setTextures();

  material.uniforms.diffuseMap.value = new THREE.TextureLoader().load(diffuseTex);
  material.uniforms.normalMap.value = new THREE.TextureLoader().load(normalTex);
  material.uniforms.depthMap.value = new THREE.TextureLoader().load(depthTex);

  material.needsUpdate = true;
}

function changeMinLayers(val)
{
  minLayers = val;
  document.getElementById("minLayers").value = minLayers;
  document.getElementById("minLayersNum").value = minLayers;

  material.uniforms.minLayers.value = minLayers;
  material.needsUpdate = true;
}

function changeMaxLayers(val)
{
  maxLayers = val;
  document.getElementById("maxLayers").value = maxLayers;
  document.getElementById("maxLayersNum").value = maxLayers;

  material.uniforms.maxLayers.value = maxLayers;
  material.needsUpdate = true;
}

function genMaterial()
{
  mode = document.getElementById("parallaxMode").value;
  textureSet = parseInt(document.getElementById("textureSet").value);
  minLayers = parseInt(document.getElementById("minLayers").value);
  maxLayers = parseInt(document.getElementById("maxLayers").value);

  setTextures();

  modes = {
    none: "NO_PARALLAX",
    basic: "USE_BASIC_PARALLAX",
    steep: "USE_STEEP_PARALLAX",
    occlusion: "USE_OCCLUSION_PARALLAX",
    relief: "USE_RELIEF_PARALLAX"
  };
  
  var material = new THREE.ShaderMaterial({
    uniforms: genUniforms(),
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });
  material.defines = {};
  material.defines[modes[mode]] = '';

  return material;
}

function setTextures()
{
  switch(textureSet)
  {
    case 0:
      diffuseTex = "/textures/bricks2.jpg";
      normalTex = "/textures/bricks2_normal.jpg";
      depthTex = "/textures/bricks2_disp.jpg";
      break;

    case 1:
      diffuseTex = "/textures/wood.png";
      normalTex = "/textures/toy_box_normal.png";
      depthTex = "/textures/toy_box_disp.png";
      break;

    case 2:
      diffuseTex = "/textures/landscape_diffuse.png";
      normalTex = "/textures/landscape_normal.png";
      depthTex = "/textures/landscape_depth.png";
      break;
  }
}

function genUniforms()
{
  let uniforms = {
    lightPosition: { type: "vec4", value: new THREE.Vector4(1.0, 1.0, 2.0, 1.0) },
    
    materialProperties: { type: "mat3", value: (new THREE.Matrix3).set(0.75, 0.38, 0.26,
                                                                      0.75, 0.38, 0.26,
                                                                      0.25, 0.20, 0.15) },

    lightProperties:    { type: "mat3", value: (new THREE.Matrix3).set(0.20, 0.70, 0.80,
                                                                      0.20, 0.70, 0.80,
                                                                      0.20, 0.70, 0.80) },
                                                                      
    shininess:  { type: "float", value: 10.0 },
    diffuseMap: { type: "t", value: new THREE.TextureLoader().load(diffuseTex) },
    normalMap:  { type: "t", value: new THREE.TextureLoader().load(normalTex) },
    depthMap:   { type: "t", value: new THREE.TextureLoader().load(depthTex) },                                                   
    minLayers:  { type: "float", value: minLayers },                                               
    maxLayers:  { type: "float", value: maxLayers }
  };

  return uniforms;
}

function genAxes(scene)
{
  // Make some axes
  var material = new THREE.LineBasicMaterial({color: 0xff0000});
  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 2, 0, 0 )
  );
  var line = new THREE.Line( geometry, material );
  scene.add(line);
  
  material = new THREE.LineBasicMaterial({color: 0x00ff00});
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 0, 2, 0 )
  );
  line = new THREE.Line( geometry, material );
  scene.add(line);

  material = new THREE.LineBasicMaterial({color: 0x0000ff});
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 0, 0, 2 )
  );
  line = new THREE.Line( geometry, material );
  scene.add(line);
}