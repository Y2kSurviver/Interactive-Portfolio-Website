const vehicles = [];
const separationWeight = 0.3;
const cohesionWeight = 0.3;
const alignmentWeight = 0.1;
const avoidenceWeight = 0.9; 
const aheadLen = 50;
const obstacles = getObstacles();

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 100; i++) {
      const vehicle = new Vehicle(width, height);
      vehicles.push(vehicle);
  } 

  //console.log(obstacles); 
  //vehicles[0].pos.set(100, 100);
  //vehicles[0].vel.set(0, 1);
  //vehicles[1].pos.set(width - 200, height / 2);
  //vehicles[1].vel.set(-1, 0);
}

function draw() {
  background(0);
  vehicles.forEach(vehicle => {
      vehicle.behaviors();
      vehicle.update();
      vehicle.show();

  });

  // Debugging
  /*
  const m = createVector(mouseX, mouseY);
  obstacles.forEach(o => {
    if (vehicles[0].collision(m, o)) {
      fill(255, 0, 0);
    }
  });
  circle(m.x, m.y, 20);
  */
}

function getObstacles() {
  const elts = document.getElementsByClassName('obstacle'); 
  const obs = Object.values(elts);
  return obs.map(elt => elt.getBoundingClientRect());
}
