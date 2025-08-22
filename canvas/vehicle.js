class Vehicle {
  constructor(x, y) {
    this.home = createVector(random(width), random(height));
    this.pos = this.home.copy();
    // this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = 10;
    this.maxspeed = 4;
    this.detection = 120;
  }
  
  screenWrap() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }
  
  
  behaviors() {
    // behaviors
//    const seek = this.seek(this.target);
    const separation = this.separation(vehicles);
    const cohesion = this.cohesion(vehicles); 
    const alignment = this.alignment(vehicles);
    // weights
  //  seek.mult(0.1);
    separation.mult(separationWeight);
    cohesion.mult(cohesionWeight);
    
    // applying the force
    this.applyForce(separation);
    this.applyForce(cohesion);

    //this.vel.setHeading(this.vel.heading() + alignment * alignmentWeight);
   // this.applyForce(seek);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.vel.limit(this.maxspeed);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.screenWrap();
  }

  show() {
    push();
    /*
    strokeWeight(1);
    fill(255);
    stroke(255);
    circle(0, 0, this.r * 2);
    */
    noFill();
    stroke(255);
    translate(this.pos);
    rotate(this.vel.heading());
    triangle(-this.r * 2, -this.r, -this.r * 2, this.r, this.r, 0);
    /*
    // detection zone
    noFill();
    stroke(255);
    circle(0, 0, this.detection * 2);

    //direction
    stroke(0, 255, 0);
    strokeWeight(2);
    rotate(this.vel.heading());
    line(0, 0, this.r*10, 0);
    */
    pop();

  }

  alignment(vehicles) {
    let avgAngle = 0;
    let count = 0;
    vehicles.forEach(vehicle => {
      const dist = p5.Vector.dist(this.pos, vehicle.pos);
      if (dist < this.detection && this != vehicle) {
        avgAngle += vehicle.vel.heading();
        count++;
      }
    });

    if (count > 0) {
      //console.log(avgAngle / count);
      //avgAngle /= count;
      const diff = this.vel.heading() - avgAngle;
      return diff;
    }
    return count;
  }

  cohesion(vehicles) {
    const center = createVector();
    let count = 0;
    vehicles.forEach(vehicle => {
      const dist = p5.Vector.dist(this.pos, vehicle.pos);
      if (dist < this.detection && this != vehicle) {
        center.add(vehicle.pos); 
        count++;
      }
    });
    
    if (count > 0) {
      center.mult(1 / count);
      const steer = p5.Vector.sub(center, this.pos);
      return steer.normalize();
    }
    
    return createVector();
  }

  separation(vehicles) {
    const resultant = createVector();
    let count = 0;
    vehicles.forEach(vehicle => {
      const dist = p5.Vector.dist(this.pos, vehicle.pos);
      if (dist < this.detection && this != vehicle) {
        const toward = p5.Vector.sub(vehicle.pos, this.pos);
        resultant.add(toward);
        count++;
      }
    });
    resultant.mult(-1);
    //resultant.div(count);
    return resultant.normalize();
  }

  seek(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    /*var speed = this.maxspeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxspeed);
    }*/
    var steer = p5.Vector.sub(desired, this.vel);
    return steer.normalize();
  }

  flee(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    if (d < 50) {
      desired.setMag(this.maxspeed);
      desired.mult(-1);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
}
