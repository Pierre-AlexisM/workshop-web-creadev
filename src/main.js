import * as THREE from "three";
import WindowContext from "./js/WindowContext";
import SceneBouncingBubbles from "./js/scenarios/BouncingBubbles/SceneBouncingBubbles";
import { askMotionAccess } from "./js/utils/device/DeviceAccess";
import SceneScenario3D from "./js/scenarios/Scenario3D/SceneScenario3D";
import Bubble from "./js/scenarios/BouncingBubbles/Bubbles";

// Getting the button element with id "btn-access" and attaching a click event listener
const btn = document.getElementById("btn-access");
btn.addEventListener("click", askMotionAccess, false);

// Getting the button element with id "btn-reload" and attaching a click event listener
const btnReload = document.getElementById("btn-reload");
btnReload.addEventListener("click", () => {
    window.location.reload();
}, false);

// Creating instances of different scenes
const scene1 = new SceneBouncingBubbles(20);
const scene2 = new SceneScenario3D("canvas-scene-3d");
const scene3 = new SceneBouncingBubbles(10, "canvas-scene-2");

// Creating a new instance of WindowContext and accessing its time property
const windowContext = new WindowContext();
const time = windowContext.time;

// Defining the update function
const update = () => {
    // Removing bubbles that have reached the top of scene1
    const bubblesToRemoveTop = scene1.bubbles.filter(b => b.y - b.radius <= 0);
    scene1.bubbles = scene1.bubbles.filter(b => !bubblesToRemoveTop.includes(b));

    // Creating new bubbles at the top of scene3 for the removed bubbles from scene1
    bubblesToRemoveTop.forEach(bubble => {
        const newBubble = new Bubble(scene3.context, bubble.x, scene3.height + bubble.radius, bubble.radius * 0.8);
        newBubble.vx = bubble.vx;
        newBubble.vy *= -1;
        scene3.bubbles.push(newBubble);
    });

    // Removing bubbles that have reached the bottom of scene1
    const bubblesToRemoveBottom = scene1.bubbles.filter(b => b.y + b.radius >= scene1.height);
    scene1.bubbles = scene1.bubbles.filter(b => !bubblesToRemoveBottom.includes(b));

    // Creating new bubbles at the bottom of scene2 for the removed bubbles from scene1
    bubblesToRemoveBottom.forEach(bubble => {
        const newBubble = new Bubble(scene2.context, bubble.x, -bubble.radius, bubble.radius * 0.8);
        newBubble.vx = bubble.vx;
        newBubble.vy *= -1;
        scene2.addBubble(bubble.x, bubble.y);
    });
};

// Attaching the update function to the 'update' event of the time object
time.on('update', update);
