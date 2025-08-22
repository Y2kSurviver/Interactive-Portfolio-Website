const vehicles = [];
const separationWeight = 1;
const cohesionWeight = 1;
const alignmentWeight = 1;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 100; i++) {
        const vehicle = new Vehicle(width, height);
        vehicles.push(vehicle);
    }

    /*
    vehicles[0].pos.set(200, height / 2);
    vehicles[0].vel.set(1, 0);
    vehicles[1].pos.set(width - 200, height / 2);
    vehicles[1].vel.set(-1, 0);
    */
}

function draw() {
    background(0);
    vehicles.forEach(vehicle => {
        vehicle.target = createVector(mouseX, mouseY);
        vehicle.behaviors();
        vehicle.update();
        vehicle.show();

    });
}
