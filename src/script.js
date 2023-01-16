import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextureLoader } from 'three';

import gsap from 'gsap';

const textureLoader = new TextureLoader();

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.PlaneGeometry(3.6, 5.4);

for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/photographs/${i}.avif`)
    });

    const img = new THREE.Mesh(geometry, material);
    img.position.set(-3+i,i * 7);

    scene.add(img);
}

let objs = []

scene.traverse(object => {
    if (object.isMesh) {
        console.log(object)
        objs.push(object)
    }
})

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.x = -3;
camera.position.y = 30;
camera.position.z = 8;
scene.add(camera)

gui.add(camera.position, 'y').min(1).max(36)

var renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener("wheel", onMouseWheel);

//const clock = new THREE.Clock();

let y = 0;
let position = 27;

function onMouseWheel(event) {

    console.log(event.deltaY);
    y = event.deltaY * 0.006;
}

const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
    
    console.log(mouse)
});

const raycaster = new THREE.Raycaster();

const tick = () => {
    /*const elapsedTime = clock.getElapsedTime();
 
    console.log(elapsedTime)*/
    position += -y;
    y *= .9

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objs)

    console.log(intersects);

    for (const intersect of intersects) {
        console.log('intersected')
        //intersect.object.scale.set(1.1, 1.1)
        gsap.to(intersect.object.scale, { x: 1.7, y: 1.7 });
    }

    for (const object of objs) {
        if (!intersects.find(intersect => intersect.object === object)) {
            console.log('test')
            //object.scale.set(1,1)
            gsap.to(object.scale, { x: 1, y: 1 });
        }
    }

    camera.position.y = position

    renderer.render( scene, camera );

    window.requestAnimationFrame(tick);
}

tick();