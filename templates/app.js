import * as THREE from './threeM.js';

import Stats from './stats.module.js';

import { STLLoader } from './STLLoaderTest.js';
import { OrbitControls } from './OrbitControls.js';
import { TransformControls } from './TransformControls.js';
import { GUI } from './dat.gui.module.js';
let firstMoveF = false;
let moveFJ1 = false;
let moveFJ2 = false;
let moveFJ3 = false;
let moveFJ4 = false;
let moveFJ5 = false;
let moveFJ6 = false;
let sendJoints = true;
let SendScriptTrue = true;
let SendScriptStop = true;
let tJ1;
let teJ1 = 0;
let tJ2;
let teJ2 = 0;
let tJ3;
let teJ3 = 0;
let tJ4;
let teJ4 = 0;
let tJ5;
let teJ5 = 0;
let tJ6;
let teJ6 = 0;
let ConnectedOnce = true;

let whatToDo = 6;

let rtJ1 = 0.062;
let rtJ2 = 0.157;
let rtJ3 = -0.028;
let rtJ4 = -0.014;
let rtJ5 = -1.74;
let rtJ6 = -0.025;

let rtpickJ1 = 0.062;
let rtpickJ2 = -0.66;
let rtpickJ3 = -0.17;
let rtpickJ4 = -0.014;
let rtpickJ5 = -1.1216;
let rtpickJ6 = -0.025;


let rtpJ1 = -1.52;
let rtpJ2 = -1.084;
let rtpJ3 = 1.08;
let rtpJ4 = -0.066;
let rtpJ5 = -0.723;
let rtpJ6 = 0.106;


var moveF = false;
let container, stats;
let initF = false;
let camera, controls, cameraTarget, scene, renderer, b;
let base;
var shoulder;
let armS = 0;
let flagArmS = true;

var ArmMesh;
var ArmPosition = new THREE.Vector3();
var ForArmPosition = new THREE.Vector3();
var HandPosition = new THREE.Vector3();


var Robot;
var Settings;
var ForArmmesh;
var ElbowMesh;
var Handmesh;
var wristmesh;
var wristPosition = new THREE.Vector3();
var ElbowPosition = new THREE.Vector3();

let sizes;

var BaseGroup = new THREE.Group();
var ShoulderGroup = new THREE.Group();
var ArmGroup = new THREE.Group();
var ElbowGroup = new THREE.Group();
var ForeArmGroup = new THREE.Group();
var HandGroup = new THREE.Group();
var WristGroup = new THREE.Group();
var GripperGroup = new THREE.Group();
var xAxis = new THREE.Vector3(1, 0, 0).normalize();
var yAxis = new THREE.Vector3(0, 1, 0).normalize()
var zAxis = new THREE.Vector3(0, 0, 1).normalize()
var flagw = false;
var cw;
const HandPointOfRotation = new THREE.Vector3(-0.01161075335741042, 0.958, 0);
const ElbowPointOfRotation = new THREE.Vector3(0, 0.787, 0);
const ForArmPointOfRotation = new THREE.Vector3(0, 0.955, 0);
const ArmPointOfRotation = new THREE.Vector3(0, 0.365, 0);
const WristPointOfRotation = new THREE.Vector3(0.002258776575326915, 0.963, -0.49934718728065467);


let s = 0
var control
var leftGrip;
var rightGripper;
var wr;
var leftGripPosition = new THREE.Vector3();

var OrangeColor = 0xE26310;

var meshFruit;
var meshFruitTrue = false;
var catchedOnce = false;



var loadDone = false;
var gui;
let fruits = [];

let group;

var laodDone1 = false;

let ConvRun = false;

const sendHTTPRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onload = function () {
            resolve(xhr.response);
        }
        xhr.send(data);
    });
    return promise;
}

const sendMoveAll = () => {
    var j1Pos = 'j1=0;'
    var j2Pos = 'j2=0;'
    var j3Pos = 'j3=0;'
    var j4Pos = 'j4=0;'
    var j5Pos = 'j5=0;'
    var j6Pos = 'j6=0'
    if (typeof tJ1 != undefined) {
        var j1Pos = 'j1=' + Robot.joint1.toString() + ';'
    }
    if (typeof tJ2 != undefined) {
        var j2Pos = 'j2=' + Robot.joint2.toString() + ';'
    }
    if (typeof tJ3 != undefined) {
        var j3Pos = 'j3=' + Robot.joint3.toString() + ';'
    }
    if (typeof tJ4 != undefined) {
        var j4Pos = 'j4=' + Robot.joint4.toString() + ';'
    }
    if (typeof tJ5 != undefined) {
        var j5Pos = 'j5=' + Robot.joint5.toString() + ';'
    }
    if (typeof tJ6 != undefined) {
        var j6Pos = 'j6=' + Robot.joint6.toString()
    }
    var send = j1Pos + j2Pos + j3Pos + j4Pos + j5Pos + j6Pos
    sendHTTPRequest('POST', 'http://localhost:3000/Movej1j2', send).then(responseData => {
        console.log(responseData)
    })


};

const sendRunScript = () => {
    SendScriptTrue = false
    var send = 'True';
    sendHTTPRequest('POST', 'http://localhost:3000/RunScript', send).then(responseData => {
        console.log(responseData)
    })
};

const sendRunConv = () => {
    // if(bool==true)
    var send = 'True'
    // else
    //     send='False'
    sendHTTPRequest('POST', 'http://localhost:3000/runsConv', send).then(responseData => {
        console.log(responseData)
    })
};
const sendOpenGrip = () => {
    // if(bool==true)
    var send = 'True'
    // else
    //     send='False'
    sendHTTPRequest('POST', 'http://localhost:3000/openGripper', send).then(responseData => {
        console.log(responseData)
    })
};
init();

animate();

function init() {
    gui = new GUI();
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-3, 2.5, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffaf0);

    // Lights

    scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

    addShadowedLight(1, 1, 1, 0xffffff, 1);
    addShadowedLight(0.5, 1, - 1, 0xfffffff, 1);
    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.shadowMap.enabled = true;



    models()
    container.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.listenToKeyEvents( window ); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 1.5;
    controls.maxDistance = 20;

    controls.maxPolarAngle = Math.PI / 2;



    // stats

    stats = new Stats();
    container.appendChild(stats.dom);

    //

    window.addEventListener('resize', onWindowResize);


    initF = true;


}
function setupKeyControls() {
    //0.41
    //1.1
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 81:
                catchedOnce = !catchedOnce;
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                // //console.log((Math.abs(center.x) - Math.abs(fruits[0].x)))
                // //console.log((Math.abs(center.z) - Math.abs(fruits[0].z)))
                // //console.log(center)

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);
                // //console.log(center1);



                if (fruits[0].x > (center.x - 0.06) && fruits[0].x < (center1.x + 0.06) && fruits[0].z > (center.z - 0.06) && fruits[0].z < (center1.z + 0.06)) {
                    //console.log(center.y)
                    if (center.y < 0.15 && catchedOnce) {
                        meshFruitTrue = true;
                        meshFruit.material.color.setHex(0xE21026);
                        meshFruit.position.x = (center.x + center1.x) / 2;
                        meshFruit.position.y = (center.y + center1.y) / 2;
                        meshFruit.position.z = (center.z + center1.z) / 2;
                    }


                }

                break;
            case 37://shmal
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                ArmPosition.setFromMatrixPosition(ArmMesh.matrixWorld);


                if (ArmPosition.y <= 0.61 && center.y > 0.11) {

                    rotateAboutPoint(ArmGroup, ArmPointOfRotation, xAxis, -Math.PI / 120);
                }
                if (meshFruitTrue && catchedOnce) {
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    //console.log(meshFruit.position);

                }
                break;
            case 38://foo2

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);
                if (ElbowPosition.y <= 1.1)
                    rotateAboutPoint(ElbowGroup, ElbowPointOfRotation, xAxis, Math.PI / 120);
                console.log(ElbowPosition.y)



                if (meshFruitTrue && catchedOnce) {
                    //console.log("DAKHALT foo2")
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }



                break;
            case 90://around1
                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);
                rotateAboutPoint(ForeArmGroup, ForArmPointOfRotation, zAxis, Math.PI / 120);


                if (meshFruitTrue && catchedOnce) {
                    //console.log("DAKHALT foo2")
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }



                break;

            case 88://around2
                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);
                rotateAboutPoint(ForeArmGroup, ForArmPointOfRotation, zAxis, -Math.PI / 120);


                if (meshFruitTrue && catchedOnce) {
                    //console.log("DAKHALT foo2")
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }



                break;

            case 66://around1
                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);

                rotateAboutPoint(WristGroup, WristPointOfRotation, xAxis, Math.PI / 120);



                if (meshFruitTrue && catchedOnce) {

                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }



                break;

            case 88://around2
                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);
                rotateAboutPoint(ForeArmGroup, ForArmPointOfRotation, zAxis, -Math.PI / 120);


                if (meshFruitTrue && catchedOnce) {
                    //console.log("DAKHALT foo2")
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }



                break;

            case 78://around1
                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);

                rotateAboutPoint(WristGroup, WristPointOfRotation, xAxis, - Math.PI / 120);



                if (meshFruitTrue && catchedOnce) {

                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }



                break;



            case 39://ymeen
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);
                if (meshFruitTrue && catchedOnce) {
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    //console.log("DAKHALT ymeen")
                    meshFruit.material.color.setHex(0xE21026);

                    ArmPosition.setFromMatrixPosition(ArmMesh.matrixWorld);
                    if (ArmPosition.y >= -2.09 - 0.43292700638122483 && center.y > 0.11) {

                        rotateAboutPoint(ArmGroup, ArmPointOfRotation, xAxis, Math.PI / 120);
                    }
                    // //console.log(ElbowPosition)

                }
                else {
                    ArmPosition.setFromMatrixPosition(ArmMesh.matrixWorld);
                    if (ArmPosition.y >= -0.43 && center.y > 0.11) {
                        rotateAboutPoint(ArmGroup, ArmPointOfRotation, xAxis, Math.PI / 120);
                    }
                }
                break;
            case 40:
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);
                if (meshFruitTrue && catchedOnce) {
                    //console.log("DAKHALT TAHT")
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);
                if (ElbowPosition.y <= 0.401 && center.y > 0.11)
                    console.log(ElbowPosition.y)
                rotateAboutPoint(ElbowGroup, ElbowPointOfRotation, xAxis, -Math.PI / 120);


                break;
            case 82://bylef shaml
                leftGripPosition.setFromMatrixPosition(leftGrip.matrixWorld);
                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);
                console.log(ShoulderGroup.rotation.y)

                if (meshFruitTrue && catchedOnce) {
                    (meshFruit.position.x = (center.x + center1.x) / 2) + 0.5;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    (meshFruit.position.z = (center.z + center1.z) / 2) + 0.5;
                    //console.log(meshFruit.position);
                    s += 1
                    ShoulderGroup.rotation.y = s;
                    meshFruit.material.color.setHex(0xE21026);


                }
                else {
                    s += 0.05
                    ShoulderGroup.rotation.y = s;
                }




                break;
            case 84://bylef ymeen

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);

                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                if (meshFruitTrue && catchedOnce) {
                    meshFruit.material.color.setHex(0xE21026);

                    meshFruit.position.x = ((center.x + center1.x) / 2) - 0.035;
                    meshFruit.position.y = ((center.y + center1.y) / 2) + 0.035;
                    meshFruit.position.z = ((center.z + center1.z) / 2) - 0.035;
                    //console.log(meshFruit.position);
                    s -= 0.05;
                    ShoulderGroup.rotation.y = s;


                }
                else {
                    s -= 0.05;
                    ShoulderGroup.rotation.y = s;
                }


                break;


            case 65://around1
                var geometry1 = rightGripper.geometry;
                geometry1.computeBoundingBox();
                var center1 = new THREE.Vector3();
                geometry1.boundingBox.getCenter(center1);
                rightGripper.localToWorld(center1);

                var geometry = leftGrip.geometry;
                geometry.computeBoundingBox();
                var center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                leftGrip.localToWorld(center);
                ElbowPosition.setFromMatrixPosition(ElbowMesh.matrixWorld);
                console.log(center)
                rotateAboutPoint(HandGroup, HandPointOfRotation, zAxis, Math.PI / 120);


                if (meshFruitTrue && catchedOnce) {
                    //console.log("DAKHALT foo2")
                    meshFruit.position.x = (center.x + center1.x) / 2;
                    meshFruit.position.y = (center.y + center1.y) / 2;
                    meshFruit.position.z = (center.z + center1.z) / 2;
                    meshFruit.material.color.setHex(0xE21026);

                }



                break;

        }
    };
}
function models() {

    const loader = new STLLoader();
    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });


    const gridHelper = new THREE.GridHelper(2, 10)
    scene.add(gridHelper)

    const axisHelper = new THREE.AxisHelper()
    scene.add(axisHelper)

    // loader.load('./Ned Model/Orange3D.stl', function (geometry) {

    //     const material = new THREE.MeshPhongMaterial({ color: OrangeColor, specular: 0x111111, shininess: 200 });

    //     // var mesh = new THREE.Mesh(geometry, material);
    //     // //mesh.rotation.set( 0, s, 0 );
    //     // mesh.rotation.set(- Math.PI / 2, 0, 0);
    //     // mesh.position.set(-(Math.random()), 0, - (Math.random()));

    //     // mesh.scale.set(0.001, 0.001, 0.001);
    //     for (let i = 0; i < 1; i++) {
    //         meshFruit = new THREE.Mesh(geometry, material);
    //         //mesh.rotation.set( 0, s, 0 );
    //         meshFruit.rotation.set(- Math.PI / 2, 0, 0);
    //         meshFruit.position.set(-(Math.random()), 0, -(Math.random()));

    //         meshFruit.scale.set(0.001, 0.001, 0.001);
    //         scene.add(meshFruit);
    //         fruits.push(meshFruit.position)

    //         var box = new THREE.Box3().setFromObject(meshFruit);
    //         sizes = box.getSize();
    //         //console.log(sizes)




    //         // gui.add(person, 'name');


    //         // //console.log(fruits)
    //     }

    //     // for (let i = 0; i < 1; i++) {
    //     // 	var mesh = new THREE.Mesh(geometry, material);
    //     // 	//mesh.rotation.set( 0, s, 0 );
    //     // 	mesh.rotation.set(- Math.PI / 2, 0, 0);
    //     // 	mesh.position.set(-(Math.random()), 0, (Math.random()));

    //     // 	mesh.scale.set(0.001, 0.001, 0.001);
    //     // 	scene.add(mesh);
    //     // 	fruits.push(mesh.position)
    //     // 	// //console.log(fruits)

    //     // }

    // });






    //Awl Haga



    loader.load('./Ned Model/ned/base_link.stl', function (geometry) {
        let material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: true });
        base = new THREE.Mesh(geometry, material);


        base.position.set(0, 0, 0);







        base.rotation.set(- Math.PI / 2, 0, 0);
        base.scale.set(2, 2, 2);
        BaseGroup.add(base);
        BaseGroup.add(ShoulderGroup)


        // Basebox = new THREE.Box3().setFromObject(base);
        // BaseSize = Basebox.getSize();
        // //console.log("BASE")
        // //console.log(base.position)
        // //console.log(BaseSize)


    });


    loader.load('./Ned Model/ned/shOne.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });

        shoulder = new THREE.Mesh(geometry, material);
        //mesh.rotation.set( 0, s, 0 );
        shoulder.rotation.set(- Math.PI / 2, 0, 0);
        shoulder.position.set(0.52, 0, 0.6);

        shoulder.scale.set(2.32, 2.4, 2.06);


        ShoulderGroup.add(shoulder);
        ShoulderGroup.add(ArmGroup)

        // Shoulderbox = new THREE.Box3().setFromObject(shoulder);
        // ShoulderSize = Shoulderbox.getSize();
        // //console.log("Shoulder")
        // //console.log(shoulder.position)
        // //console.log(ShoulderSize)

    });
    //Talet Haga
    loader.load('./Ned Model/ned/armOne.stl', function (geometry) {

        const material = new THREE.MeshPhongMaterial({ color: 0x1d9aff, specular: 0x111111, shininess: 200 });

        ArmMesh = new THREE.Mesh(geometry, material);

        // mesh.position.set(-0.63, 0, 1);
        ArmMesh.position.x = -0.63
        ArmMesh.position.y = 0
        ArmMesh.position.z = 1



        ArmGroup.add(ArmMesh);
        ArmMesh.rotation.x = (- Math.PI / 2);
        ArmMesh.scale.set(2.8, 2, 2);

        ArmGroup.add(ElbowGroup)


        // Armbox = new THREE.Box3().setFromObject(ArmMesh);
        // ArmSize = Armbox.getSize();

        // // //console.log("Arm")
        // //console.log(ArmMesh.position)
        // //console.log(ArmSize)
    });//da el foo2 el base

    loader.load('./Ned Model/ned/elbowOne.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });

        ElbowMesh = new THREE.Mesh(geometry, material);

        ElbowMesh.position.set(1.7188, 0, -0.05);
        ElbowMesh.rotation.set(- Math.PI / 2, 0, 0);
        ElbowMesh.scale.set(2.99, 2, 2.26);



        ElbowGroup.add(ElbowMesh);
        ElbowGroup.add(ForeArmGroup)
        ElbowGroup.position.y -= 0.097

        // Elbowbox = new THREE.Box3().setFromObject(ElbowMesh);
        // ElbowSize = Elbowbox.getSize();
        // //console.log("Elbowbox")
        // //console.log(ElbowMesh.position)
        // //console.log(ElbowSize)
    });
    loader.load('./Ned Model/ned/forearmOne.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0x1414141, specular: 0x111111, shininess: 200 });

        ForArmmesh = new THREE.Mesh(geometry, material);

        ForArmmesh.position.set(-0.3, 0, -0.47);
        ForArmmesh.rotation.set(- Math.PI / 2, 0, 0);
        ForArmmesh.scale.set(2.99, 2, 2.26);


        ForeArmGroup.add(ForArmmesh);
        ForeArmGroup.add(WristGroup)


        // ForeArmbox = new THREE.Box3().setFromObject(mesh);
        // ForeArmSize = ForeArmbox.getSize();
        // //console.log("ForeArmbox")
        // //console.log(mesh.position)
        // //console.log(ForeArmSize)
    });
    loader.load('./Ned Model/ned/wristOne.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });

        wristmesh = new THREE.Mesh(geometry, material);

        wristmesh.position.set(0.87, 0, 0.33);
        wristmesh.rotation.set(- Math.PI / 2, 0, 0);
        wristmesh.scale.set(3.5, 2, 2.26);


        WristGroup.add(wristmesh);
        WristGroup.add(HandGroup)
    });
    loader.load('./Ned Model/ned/handOne.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0x1414141, specular: 0x111111, shininess: 200 });

        Handmesh = new THREE.Mesh(geometry, material);

        Handmesh.position.set(0.655, 0, 0.03);
        Handmesh.rotation.set(- Math.PI / 2, 0, 0);
        Handmesh.scale.set(3.3, 2, 2.26);

        HandGroup.add(Handmesh);
        HandGroup.add(GripperGroup)

        // Handbox = new THREE.Box3().setFromObject(mesh);
        // HandSize = Handbox.getSize();
        // //console.log("Handbox")
        // //console.log(mesh.position)
        // //console.log(HandSize)
    });
    loader.load('./Ned Model/gripper_1/GripOne.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x111111, shininess: 200 });

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(1.14, 0, 0.075);
        mesh.rotation.set(- Math.PI / 2, 0, 0);
        mesh.scale.set(3.5, 2, 2.26);



        GripperGroup.add(mesh);


        // Gripperbox = new THREE.Box3().setFromObject(mesh);
        // GripperSize = Gripperbox.getSize();
        // //console.log("Gripperbox")
        // //console.log(mesh.position)
        // //console.log(GripperSize)
    });
    loader.load('./Ned Model/gripper_1/leftone.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0x111111, shininess: 200 });

        leftGrip = new THREE.Mesh(geometry, material);

        leftGrip.position.set(0.2, 0, -0.52);
        leftGrip.rotation.set(- Math.PI / 2, 0, 0);
        leftGrip.scale.set(2, 2, 2.26);



        GripperGroup.add(leftGrip);
        loadDone = true


        // var box = new THREE.Box3().setFromObject(leftGrip);
        // sizes = box.getSize();
        // //console.log(sizes)

    });
    loader.load('./Ned Model/gripper_1/rightOne.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0x111111, shininess: 200 });
        rightGripper = new THREE.Mesh(geometry, material);
        rightGripper.position.set(-0.037, 0, -0.67);
        rightGripper.rotation.set(- Math.PI / 2, 0, 0);
        rightGripper.scale.set(2, 2, 2.26);
        GripperGroup.add(rightGripper);




        // var box = new THREE.Box3().setFromObject(mesh);
        // sizes = box.getSize();
        // // //console.log(sizes)

    })
    scene.add(BaseGroup);
}
function addShadowedLight(x, y, z, color, intensity) {

    const directionalLight = new THREE.DirectionalLight(color, intensity);

    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

}
//const controls = new OrbitControls( camera, renderer.domElement );
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
function models2() {
    if (loadDone && laodDone1) {
        var geometry = leftGrip.geometry;
        geometry.computeBoundingBox();
        var center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        leftGrip.localToWorld(center);

        var geometry1 = rightGripper.geometry;
        geometry1.computeBoundingBox();
        var center1 = new THREE.Vector3();
        geometry1.boundingBox.getCenter(center1);
        rightGripper.localToWorld(center1);



        if (fruits[0].x > (center.x - 0.06) && fruits[0].x < (center1.x + 0.06) && fruits[0].z > (center.z - 0.06) && fruits[0].z < (center1.z + 0.06)) {
            if (center.y < 0.15 && !catchedOnce) {
                // meshFruitTrue = true;
                meshFruit.material.color.setHex(0xE21026);
            }


        }
        else {
            meshFruit.material.color.setHex(OrangeColor);
            meshFruit.position.y = 0;
        }
        // var geometry = leftGrip.geometry;
        // geometry.computeBoundingBox();
        // var center = new THREE.Vector3();
        // geometry.boundingBox.getCenter(center);
        // leftGrip.localToWorld(center);
    }
}


function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {

    pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

    if (pointIsWorld) {
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if (pointIsWorld) {
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }
    obj.rotateOnAxis(axis, theta);
    // obj.rotation.x = s;
    // rotate the OBJECT


}



// scene.add(BaseGroup);


function render() {
    setupKeyControls()
    renderer.render(scene, camera);

}

// const gui = new GUI()
const movement = gui.addFolder("Movement")
const settingsFolder = gui.addFolder("Settings")
Robot = {
    joint1: 0,
    joint2: 0,
    joint3: 0,
    joint4: 0,
    joint5: 0,
    joint6: 0,
    Move: function () {

        moveF = true
        moveFJ1 = true
        moveFJ2 = true
        moveFJ3 = true
        moveFJ4 = true
        moveFJ5 = true
        moveFJ6 = true
    },
}

Settings = {
    Connection: false,
    Connect: function connectToRobot() {
        if (typeof (Settings) != "undefined") {
            if (!Settings.Connection && ConnectedOnce) {
                ConnectedOnce = false;
                console.log(Settings.Connection)
                connectRobot();
            }
        }
    },
    StartConveyer: function () {
        if (!ConvRun) {
            ConvRun = !ConvRun
            sendRunConv()
        }
    },
    StopConveyer: function () {
        if (ConvRun) {
            ConvRun = !ConvRun
            sendRunConv()
        }
    },
    Stream: false,
    Collect: false,
    Disconnect: function () {
        sendHTTPRequest('GET', 'http://localhost:3000/disconnect').then(responseData => {
            // let x = JSON.parse(responseData.toString())
            console.log(responseData)
        })
    },
    Gripper: function () {
        sendOpenGrip()
    }

}


movement.add(Robot, "joint1", -2.97, 2.97, 0.01)
movement.add(Robot, "joint2", -2.09, 0.61, 0.01)
movement.add(Robot, "joint3", -1.34, 1.57, 0.01)
movement.add(Robot, "joint4", -2.09, 2.09, 0.01)
movement.add(Robot, "joint5", -1.75, 0.96, 0.01)
movement.add(Robot, "joint6", -2.53, 2.53, 0.01)

movement.add(Robot, "Move")

movement.open()
settingsFolder.add(Settings, "Connect").name('Connect to Robot')
settingsFolder.add(Settings, "Disconnect").name('Go to Sleep')
settingsFolder.add(Settings, "StartConveyer").name('Start Conveyer')
settingsFolder.add(Settings, "StopConveyer").name('Stop Conveyer')
settingsFolder.add(Settings, "Gripper").name('Control Gripper')
settingsFolder.add(Settings, "Collect")
// settingsFolder.add(Settings, "Stream")
settingsFolder.open()

const connectRobot = () => {
    sendHTTPRequest('GET', 'http://localhost:3000/connect').then(responseData => {
        // let x = JSON.parse(responseData.toString())
        console.log(responseData)
    })
};

const getJOB = async () => {
    await new Promise(resolve => setTimeout(resolve, 5000)).then(() => {
        sendHTTPRequest('GET', 'http://localhost:3000/requestPP').then(responseData => {
            let x = parseFloat(responseData)
            whatToDo = x
            // console.log(responseData)
        })
    })

};

function connectToRobot() {
    if (typeof (Settings) != "undefined") {
        if (Settings.Connection && ConnectedOnce) {
            ConnectedOnce = false;
            console.log(Settings.Connection)
            connectRobot();
        }
    }
}
async function collectRobot() {
    if (typeof (Settings) != "undefined") {
        if (Settings.Collect && SendScriptTrue) {
            console.log('dakhal hena Collect')
            await sendHTTPRequest('POST', 'http://localhost:3000/getTorF', 'True').then(responseData => {
                console.log(responseData)
            })

            sendRunScript();
        }
        else if (!Settings.Collect && SendScriptStop) {
            SendScriptTrue = true;
            SendScriptStop = false;
            console.log('dakhal stop collect')
            var send = 'False';
            sendHTTPRequest('POST', 'http://localhost:3000/getTorF', send).then(responseData => {
                console.log(responseData)
            })
        }
    }
}

async function moveJ1(j1) {
    tJ1 = await (Math.round(parseFloat(j1) * 100) / 100);
    teJ1 = await Math.round(parseFloat(ShoulderGroup.rotation.y) * 100) / 100;
    var step = 0.01;
    if (tJ1 < teJ1) {
        step = -0.01
    }

    if ((tJ1) != teJ1) {

        // console.log(teJ1, tJ1)
        //hj2()
        ShoulderGroup.rotation.y = ShoulderGroup.rotation.y + step;
    }
    else {
        moveFJ1 = false;
    }

}
async function moveJ2(j2) {
    tJ2 = await (Math.round(parseFloat(j2) * 100) / 100)
    teJ2 = await Math.round(parseFloat(ArmGroup.rotation.x) * 100) / 100

    var step = 0.01

    if (tJ2 < 0) {
        tJ2 = await (Math.round(parseFloat(j2) * 100 / 1.19) / 100)
    }
    if (tJ2 > 0) {
        tJ2 = await (Math.round(parseFloat(j2) * 100 / 1.42) / 100)
    }
    if (teJ2 > tJ2) {
        step = -step
    }
    if ((tJ2) != teJ2) {
        rotateAboutPoint(ArmGroup, ArmPointOfRotation, xAxis, step);
    } else {
        moveFJ2 = false
    }
}
async function moveJ3(j3) {

    tJ3 = await (Math.round(parseFloat(j3) * 100) / 100)
    teJ3 = await Math.round(parseFloat(ElbowGroup.rotation.x) * 100) / 100

    var step = 0.01

    if (tJ3 < 0) {
        tJ3 = (Math.round(parseFloat(j3) * 100 / 1.08) / 100)
    }
    if (tJ3 > 0) {
        tJ3 = (Math.round(parseFloat(j3) * 100 / 0.79) / 100)
    }
    if (teJ3 > tJ3) {
        step = -step
    }
    if ((tJ3) != teJ3) {
        // console.log(tJ3, teJ3)
        await rotateAboutPoint(ElbowGroup, ElbowPointOfRotation, xAxis, step);
    }
    else {
        moveFJ3 = false
    }
}
async function moveJ4(j4) {
    tJ4 = await (Math.round(parseFloat(j4) * 100 / 1.4) / 100);
    teJ4 = -await Math.round(parseFloat(ForeArmGroup.rotation.z) * 100) / 100

    var step = 0.01
    if (teJ4 < tJ4) {
        step = -step
    }


    // console.log(teJ4, tJ4)
    if (teJ4 != tJ4)
        await rotateAboutPoint(ForeArmGroup, ForArmPointOfRotation, zAxis, step);
    else {
        moveFJ4 = false
    }


}
async function moveJ5(j5) {
    var step = 0.01
    if (teJ5 > tJ5) {
        step = -step
    }
    tJ5 = await (Math.round(parseFloat(j5) * 100) / 100);
    teJ5 = await Math.round(parseFloat(WristGroup.rotation.x) * 100) / 100
    // console.log(tJ5, teJ5)
    if (teJ5 != tJ5) {
        // console.log(tJ5, teJ5)
        await rotateAboutPoint(WristGroup, WristPointOfRotation, xAxis, step);
    } else {
        moveFJ5 = false
    }


}
async function moveJ6(j6) {
    var step = 0.01
    if (teJ6 > tJ6) {
        step = -step
    }
    tJ6 = -await (Math.round(parseFloat(j6) * 100 / 1.24) / 100);
    teJ6 = await Math.round(parseFloat(HandGroup.rotation.z) * 100) / 100
    if (teJ6 != tJ6) {
        await rotateAboutPoint(HandGroup, HandPointOfRotation, zAxis, step);
    }
    else {
        moveFJ6 = false
    }
}

async function getMotorsStatus() {
    await sendHTTPRequest('POST', 'http://localhost:3000/getMotorsStatus', 'True').then(responseData => {
        console.log(responseData)
    })
}



function moveAll() {
    if (moveFJ1 == false && moveFJ2 == false && moveFJ3 == false && moveFJ4 == false && moveFJ5 == false && moveFJ6 == false) {
        moveF = false
    }
    if (moveF) {
        // console.log(moveFJ5, moveFJ6)
        if (sendJoints) {
            sendMoveAll()
            sendJoints = false
        }
        if (!Settings.Collect) {
            moveJ1(Robot.joint1)
            moveJ2(Robot.joint2)
            moveJ3(Robot.joint3)
            moveJ4(Robot.joint4)
            moveJ5(Robot.joint5)
            moveJ6(Robot.joint6)

        }
    }
    else {
        sendJoints = true;
    }
    getMotorsStatus()
}
function scriptMove(w) {
    if (Settings.Collect && whatToDo === 0) {
        moveJ1(rtJ1)
        moveJ2(rtJ2)
        moveJ3(rtJ3)
        moveJ4(rtJ4)
        moveJ5(rtJ5)
        moveJ6(rtJ6)

    } else if (Settings.Collect && whatToDo === 1) {
        moveJ1(rtpJ1)
        moveJ2(rtpJ2)
        moveJ3(rtpJ3)
        moveJ4(rtpJ4)
        moveJ5(rtpJ5)
        moveJ6(rtpJ6)

    }
    else if (Settings.Collect && whatToDo === 2) {
        moveJ1(rtpickJ1)
        moveJ2(rtpickJ2)
        moveJ3(rtpickJ3)
        moveJ4(rtpickJ4)
        moveJ5(rtpickJ5)
        moveJ6(rtpickJ6)

    }
    else if (whatToDo === 4) {
        console.log("gowa")
        whatToDo = 6
        moveJ1(0)
        moveJ2(0)
        moveJ3(0)
        moveJ4(0)
        moveJ5(0)
        moveJ6(0)

    }
}

function animate() {
    collectRobot()
    connectToRobot()
    if (typeof (Robot) != "undefined") {
        if (Settings.Collect) {
            firstMoveF = true
            getJOB();
            scriptMove()
        }
        else if (moveF) {


            moveAll()
        }
    }
    if (typeof (Settings) != "undefined") {
        if (!Settings.Connection) {
            ConnectedOnce = true;
        }
        if (!Settings.Collect) {
            SendScriptTrue = true;
        }
        if (Settings.Collect)
            SendScriptStop = true

    }
    models2();
    if (initF) {
        if (armS <= 90 && flagArmS) {
            armS += 0.5
            if (armS >= 90) {
                flagArmS = false
            }
        }
        else if (armS >= 0 && flagArmS == false) {
            armS -= 0.05
            // //console.log("ana hena")
            if (armS <= 0.01)
                flagArmS = true
        }
    }
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();

}