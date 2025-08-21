const vehicles = [];
function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 10; i++) {
        const vehicle = new Vehicle(width, height);
        vehicles.push(vehicle);
    }
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
