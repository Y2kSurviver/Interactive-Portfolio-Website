class Vehicle {
  constructor(x, y) {
    this.home = createVector(random(width), random(height));
    this.pos = this.home.copy();
    // this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = 6;
    this.maxspeed = 4;
    this.detection = 120;
    this.maxForce = 0.6;
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
    // const mouse = createVector(mouseX, mouseY);
    // const seek = this.seek(mouse);
    const separation = this.separation(vehicles);
    const cohesion = this.cohesion(vehicles); 
    const alignment = this.alignment(vehicles);
    const avoidence = this.avoidence(obstacles, aheadLen);

    // weights
    //seek.mult(0.7);
    avoidence.mult(avoidenceWeight);
    separation.mult(separationWeight);
    cohesion.mult(cohesionWeight);
    alignment.mult(alignmentWeight);

    // applying the force
    this.applyForce(avoidence);
    this.applyForce(separation);
    this.applyForce(cohesion);
    this.applyForce(alignment);

  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.acc.limit(this.maxForce);
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

  // obstacle avoidance
  avoidence(obstacles, aheadLen) {
    const ahead = this.pos.copy();
    ahead.add(this.vel.copy().setMag(aheadLen)); 

    // Debugging
    // fill(255, 0, 0);
    // circle(ahead.x, ahead.y, 5);

    for (let obstacle of obstacles) {
      // Debugging
      // stroke(0, 255, 0);
      // noFill();
      // rect(obstacle.x, obstacle.y, obstacle.width,obstacle.height);
      const center = createVector(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
      //fill(255, 0, 255);
      //circle(center.x, center.y, 20); 
      if (this.collision(ahead, obstacle)) {
        const steer = p5.Vector.sub(ahead, center);
        // Debugging
        /*push()
        translate(center);
        rotate(steer.heading());
        stroke(255, 0, 0);
        line(0, 0, 100, 0);
        pop();
        */
        return steer.normalize();
      }
    }
    return createVector();
  }

  alignment(vehicles) {
    const avgVel = createVector();
    let count = 0;
    vehicles.forEach(vehicle => {
      const dist = p5.Vector.dist(this.pos, vehicle.pos);
      if (dist < this.detection && this != vehicle) {
        avgVel.add(vehicle.vel);
        count++;
      }
    });

    if (count > 0) return avgVel.normalize();
    return createVector();
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
      const seekCenter = this.seek(center);
      return seekCenter;
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
    var steer = p5.Vector.sub(desired, this.vel);
    return steer.normalize();
  }

  flee(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.mult(-1);
    return steer;
  }

  // collision between a point and rectangle
  collision(p, r) {
    return (p.x > r.x && p.x < r.x + r.width && p.y > r.y && p.y < r.y + r.height);
  }
}
