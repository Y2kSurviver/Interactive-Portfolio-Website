// Getting dom elements
const screen = document.getElementById('screen');

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events;

const engine = Engine.create();

/*const render = Render.create({
    element: document.body,
    engine: engine
});*/

const about = new Button(40, 200, 60, 30);
console.log(about);
// run the renderer
//Render.run(render);

function run() {
    Engine.update(engine, 1000 / 60);
    requestAnimationFrame(run);
}

run();
