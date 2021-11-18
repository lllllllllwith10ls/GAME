let eliteFleet = [];
function makeFleet() {
	eliteFleet = [
	new Jerry(Math.random()*canvasX,0,0,0), 
	new Steve(Math.random()*canvasX,0,0,0), 
	new Kevin(Math.random()*canvasX,0,0,0), 
	new Kyle(Math.random()*canvasX,0,0,0)];
	pickFleetAttack();

}

function pickFleetAttack() {
	if(eliteFleet.length > 0) {
		let i = Math.floor(Math.random()*eliteFleet.length);
		if(eliteFleet[i].mode === "idle" || eliteFleet[i].mode === "back away") {
			eliteFleet[i].attack(true);
		} else {
			queueAttack1(1);
		}
	}

}
let timeUntilAttack = Infinity;
let timeUntilAttack2 = Infinity;
function queueAttack1(time) {
	timeUntilAttack = time;
}
function queueAttack2(time) {
	timeUntilAttack2 = time;
}

class Jerry extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,2,0.1,5);
		this.angle = 0;
		this.reload = 300;
		this.reload2 = 30;
		this.reload3 = 15;
		this.reload4 = 60;
		this.cooldown = Math.random()*600;
		this.cooldown2 = Math.random()*0;
		this.cooldown3 = 0;
		this.mode = "idle";
		this.modeLength = 0;
		this.phase = 1;
    
    this.angle = Math.PI/2;
    
    this.target = new p5.Vector(0,0);
  }
  attack(force) {
    if(Math.random() < 0.5) {
      this.charge(force);
    } else {
      this.charge2(force);
    }
  }
  charge(force) {
    if(this.cooldown >= this.reload || force) {
      this.speed = 4;
      this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
      this.cooldown -= this.reload;
      this.mode = "charge! and shoot";
      this.modeLength = 100;
    }
  }
  chargeForever() {
    let number = Math.floor(Math.random()*4);
    if(number === 0) {
      this.pos = new p5.Vector(Math.random()*canvasX,0);
    } else if(number === 1) {
      this.pos = new p5.Vector(Math.random()*canvasX,canvasX);
    } else if(number === 2) {
      this.pos = new p5.Vector(canvasY,Math.random()*canvasY);
    } else {
      this.pos = new p5.Vector(0,Math.random()*canvasY);
    }
    this.angle = p5.Vector.sub(p5.Vector.add(player.pos,p5.Vector.mult(player.v,50)),this.pos).heading();
    let angle = this.angle+Math.PI;
    this.speed = 4;
    this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
    this.mode = "charge! and shoot";
    this.modeLength = 100000;
  }
  shoot() {
    if(this.cooldown2 >= this.reload3) {
      let angle = this.angle+Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
      let angle2 = this.angle-Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*5,-Math.sin(angle)*5);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle2)*5,-Math.sin(angle2)*5);
      this.cooldown2 -= this.reload3;
    }
  }
  charge2(force) {
    if(this.cooldown >= this.reload || force) {
      this.speed = 4;
      this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
      this.cooldown -= this.reload;
      this.mode = "charge! but shoot at the end";
      this.modeLength = 100;
      this.circle();
    }
  }
  circle() {
    let amount = 16;
    for(let i = 0; i < amount; i++) {
      let angle = this.angle+Math.PI/amount*2*i+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*5,-Math.sin(angle)*5);
    }
  }
  minicharge() {
    if(this.cooldown >= this.reload2) {
      if(this.dodge) {
        let randy;
        if(Math.random() < 0.5) {
          randy = 1;
        } else {
          randy = -1;
        }
        this.angle = p5.Vector.sub(this.targ.pos,this.pos).heading()+Math.PI/2*randy;
        let angle = this.angle;
        this.speed = 4;
        this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
        this.cooldown -= this.reload2;
        this.mode = "charge!";
        this.modeLength = 10;
      } else {
        this.speed = 4;
        this.angle = Math.PI*2*Math.random();
        this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
        this.cooldown -= this.reload3;
        this.mode = "charge!";
        this.modeLength = 10;
      }
    }
  }
  move() {
    super.move();
    if(this.phase === 4) {
      if(this.pos.x < 0 || this.pos.x > canvasX || this.pos.y < 0 || this.pos.y > canvasY) {
        this.chargeForever();
      }
      if(this.mode === "charge! and shoot") {
        this.shoot();
      } else {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        let difference = p5.Vector.sub(player.pos,this.pos);
        difference.mult(-1);          
        this.target = p5.Vector.add(this.pos,difference);
        
        let desired = p5.Vector.sub(this.target,this.pos);
        desired.normalize();
        desired.mult(this.speed);
        let steer = p5.Vector.sub(desired,this.v);
        steer.limit(this.accel);
        steer.rotate((Math.random()-0.5)*Math.PI/4);
        this.v.add(steer);
      }
      
      this.cooldown++;
      this.cooldown2++;
      if(this.cooldown > this.reload) {
        this.cooldown = this.reload;
      }
      if(this.cooldown2 > this.reload3) {
        this.cooldown2 = this.reload3;
      }
    } else {
      if(this.pos.x < 0) {
        this.pos.x = 0;
        this.v.x = -this.v.x * 1/2;
      }
      if(this.pos.x > canvasX) {
        this.pos.x  = canvasX;
        this.v.x = -this.v.x * 1/2;
      }
      if(this.pos.y < 0) {
        this.pos.y = 0;
        this.v.y = -this.v.y * 1/2;
      }
      if(this.pos.y > canvasY) {
        this.pos.y = canvasY;
        this.v.y = -this.v.y * 1/2;
      }
      this.cooldown++;
      this.cooldown2++;
      this.cooldown3++;
      if(this.cooldown > this.reload) {
        this.cooldown = this.reload;
      }
      if(this.cooldown2 > this.reload3) {
        this.cooldown2 = this.reload3;
      }
      if(this.cooldown3 > this.reload4) {
        this.cooldown3 = this.reload4;
      }
      if(this.mode === "charge!" || this.mode === "charge! and shoot" || this.mode === "charge! but shoot at the end") {
        this.modeLength--;
        if(this.mode === "charge! and shoot") {
          
          this.shoot();
        }
        if(this.modeLength <= 0) {
          
          this.speed = 2;
          if(this.mode === "charge! but shoot at the end") {
            
            this.circle();
          }
          this.mode = "idle";
          
        }
      } else {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        this.target = player.pos.copy();
        let dodge = false;
        for(let i = 0; i < entities.length; i++) {
          if((p5.Vector.sub(entities[i].pos,this.pos).mag() <= entities[i].radius+this.radius*5) && !entities[i].dead && entities[i].friendly && !(entities[i] instanceof Player)) {
            this.dodge = true;
            dodge = true;
            this.targ = entities[i];

          }
        }
        if(dodge === false) {
          this.dodge = false;
        }
        if(this.dodge && this.cooldown3 >= this.reload4) {
          this.minicharge();
          this.cooldown3 = 0;
        } else if(Math.random() < 0.001) {
          this.minicharge();
        } else if(this.phase === 3) {
          this.attack(false);
        }
        let desired = p5.Vector.sub(this.target,this.pos);
        desired.normalize();
        desired.mult(this.speed);
        let steer = p5.Vector.sub(desired,this.v);
        steer.limit(this.accel);
        steer.rotate((Math.random()-0.5)*Math.PI/4);
        this.v.add(steer);
      }        
    }
    if(this.dead) {
      new RedParticle(this.pos.x,this.pos.y,30,75);
    }
  }
  show() {
    
    fill(255,0,0);	
    noStroke();
    let angle = this.angle;      
    push();
    translate(this.pos.x,this.pos.y);
    rotate(angle);
    beginShape();
    vertex(5, 0);
    vertex(0, 5);
    vertex(-10, 5);
    vertex(-5, 0);
    vertex(-10, -5);
    vertex(0, -5);
    endShape(CLOSE);
    beginShape();
    vertex(-7.5, 0);
    vertex(-10, -2.5);
    vertex(-10, 2.5);
    endShape(CLOSE);
    pop();
  }
}


class Steve extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,1.5,0.1,5);
		this.angle = 0;
		this.reload = 300;
		this.reload2 = 20;
		this.reload3 = 50;
		this.cooldown = Math.random()*600;
		this.cooldown2 = 40;
		this.cooldown3 = 50;

		this.phase = 1;

    this.angle = Math.PI/2;
    
		this.mode = "idle";
		this.modeLength = 0;
    this.target = new p5.Vector(0,0);
  }

  attack(force) {
    if(Math.random() < 0.5) {
      this.predict(force);
    } else {
      this.spreader(force);
    }
  }
  predict(force) {
    if(this.cooldown >= this.reload || force) {
      this.cooldown -= this.reload;
      this.mode = "predict";
      this.modeLength = 150;
    }
  }
  shoot() {
    if(this.cooldown2 >= this.reload2) {
      let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5);
      this.cooldown2 -= this.reload2;
    }
  }
  spreader(force) {
    if(this.cooldown >= this.reload || force) {
      this.cooldown -= this.reload;
      this.mode = "spreader";
      this.modeLength = 150;
    }
  }
  shoot2() {
    if(this.cooldown3 >= this.reload3) {
      for(let i = 0; i < 3; i++) {
        let angle = this.angle+Math.PI/6*(i-1)+(Math.random()-0.5)*Math.PI/60; 
        new EnemyBullet(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5);
        
      }
      this.cooldown3 -= this.reload3;
    }
  }
  move() {
    super.move()
    if(this.pos.x < 0) {
      this.pos.x = 0;
      this.v.x = -this.v.x * 1/2;
    }
    if(this.pos.x > canvasX) {
      this.pos.x  = canvasX;
      this.v.x = -this.v.x * 1/2;
    }
    if(this.pos.y < 0) {
      this.pos.y = 0;
      this.v.y = -this.v.y * 1/2;
    }
    if(this.pos.y > canvasY) {
      this.pos.y = canvasY;
      this.v.y = -this.v.y * 1/2;
    }
    this.cooldown++;
    if(this.cooldown > this.reload) {
      this.cooldown = this.reload;
    }
    this.cooldown2++;
    if(this.cooldown2 > this.reload2) {
      this.cooldown2 = this.reload2;
    }
    this.cooldown3++;
    if(this.cooldown3 > this.reload3) {
      this.cooldown3 = this.reload3;
    }
    this.modeLength--;
    if(this.phase === 4) {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      let angle = this.angle;
      let randy = (Math.random()-0.5)*Math.PI/5;
      this.target = player.pos.copy();
      this.shoot2();
    } else {
      if(this.mode === "predict") {
        this.angle = p5.Vector.sub(p5.Vector.add(player.pos,p5.Vector.mult(player.v,50)),this.pos).heading();
        this.shoot();
        if(this.modeLength <= 0) {
          this.mode = "idle";
        }
      } else {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      }
      if(this.mode === "spreader") {
        this.shoot2();
        if(this.modeLength <= 0) {
          this.mode = "idle";
          
        }
      }
      let vangle;
      if(this.v.x === 0 && this.v.y === 0) {
        vangle = Math.random()*Math.PI*2;
      } else {
        vangle = this.v.heading();
      }
      this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
      if(this.mode === "idle") {
        if(this.phase === 3) {
          this.attack(false);
        }
      }
    }    
    let desired = p5.Vector.sub(this.target,this.pos);
    desired.normalize();
    desired.mult(this.speed);
    let steer = p5.Vector.sub(desired,this.v);
    steer.limit(this.accel);
    steer.rotate((Math.random()-0.5)*Math.PI/4);
    this.v.add(steer);
    if(this.dead) {
      new RedParticle(this.pos.x,this.pos.y,30,75);
    }
  }
  show() {
    fill(255,0,0);	
    noStroke();
    let angle = this.angle;      
    push();
    translate(this.pos.x,this.pos.y);
    rotate(angle);
    beginShape();
    vertex(5, 0);
    vertex(-7.5, 5);
    vertex(-7.5, -5);
    endShape(CLOSE);
    beginShape();
    vertex(-12.5, 0);
    vertex(-7.5, 2.5);
    vertex(-7.5, -2.5);
    endShape(CLOSE);
    pop();
  }
}


class Kevin extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,1.5,0.05,5);
		this.angle = 0;
		this.reload = 100;
		this.cooldown = Math.random()*100;
		this.reload2 = 50;
		this.cooldown2 = Math.random()*50;
		this.shooting = false;
		this.shootLength = 0;
		this.mode = "idle";
		this.modeLength = 0;
		
    this.angle = Math.PI/2;
    
		this.phase = 1;
    this.target = new p5.Vector(0,0);
  }
  attack(force) {
    if(Math.random() < 0.5) {
      this.laser(force);
    } else {
      this.splitter(force);
    }
  }
  laser(force) {
    if(this.cooldown >= this.reload || force) {
      this.cooldown -= this.reload;
      this.mode = "lasers yay";
      this.modeLength = 150;
    }
  }
  shoot() {
    if(this.cooldown2 >= this.reload2) {
      this.shooting = true;
      this.shootLength = 45;
        let angle = this.angle;
		let laser = new Laser(this.pos.x, this.pos.y, this.angle);
		laser.shooter = this;
		laser.life = 45;
    }
  }
  splitter(force) {
    if(this.cooldown >= this.reload || force) {
      this.cooldown -= this.reload*2;
      let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
      new Splitter(this.pos.x,this.pos.y,Math.cos(angle)*7.5,Math.sin(angle)*7.5,20);
      
    }
  }
  move() {
    super.move();
    if(this.pos.x < 0) {
      this.pos.x = 0;
      this.v.x = -this.v.x * 1/2;
    }
    if(this.pos.x > canvasX) {
      this.pos.x  = canvasX;
      this.v.x = -this.v.x * 1/2;
    }
    if(this.pos.y < 0) {
      this.pos.y = 0;
      this.v.y = -this.v.y * 1/2;
    }
    if(this.pos.y > canvasY) {
      this.pos.y = canvasY;
      this.v.y = -this.v.y * 1/2;
    }
    this.cooldown++;
    if(this.cooldown > this.reload) {
      this.cooldown = this.reload;
    }

    this.cooldown2++;
    if(this.cooldown2 > this.reload2) {
      this.cooldown2 = this.reload2;
    }
    
    this.modeLength--;
    if(this.shooting) {    
      this.shootLength--;
      if(this.shootLength === 16) {
          let angle = this.angle+Math.PI;
          this.v.add(p5.Vector.fromAngle(angle).mult(3));
          this.cooldown -= this.reload;
        }
        if(this.shootLength <= 0) {
          this.shooting = false;
        
	}
    } else {
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      if(distance < 250 && this.mode === "idle") {
        this.mode = "back away";
        this.modeLength = Math.random()*60;
      }

      if(this.mode === "back away") {
        let difference = p5.Vector.sub(player.pos,this.pos);
        difference.mult(-1);          
        this.target = p5.Vector.add(this.pos,difference);
        
        this.modeLength--;
      }
      if(this.modeLength <= 0) {

        this.mode = "idle";
      }
      if(this.mode === "idle" || this.mode === "lasers yay") {
        let vangle;
        if(this.v.x === 0 && this.v.y === 0) {
          vangle = Math.random()*Math.PI*2;
        } else {
          vangle = this.v.heading();
        }
        this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
      }
      if(this.mode === "lasers yay") {
        this.shoot();
      }
      if((this.mode === "idle" || this.mode === "back away") && (this.phase === 3 || this.phase === 4)) {
        this.attack(false);
      }
      if(this.phase === 4) {
        this.reload = 60;
      }
      
      let desired = p5.Vector.sub(this.target,this.pos);
      desired.normalize();
      desired.mult(this.speed);
      let steer = p5.Vector.sub(desired,this.v);
      steer.limit(this.accel);
      steer.rotate((Math.random()-0.5)*Math.PI/4);
      this.v.add(steer);
    }
    if(this.dead) {
      new RedParticle(this.pos.x,this.pos.y,30,75);
    }
  }
  show() {
    fill(255,0,0);	
    noStroke();
    let angle = this.angle;      
    push();
    translate(this.pos.x,this.pos.y);
    rotate(angle);
    beginShape();
    vertex(7.5, 0);
    vertex(-7.5, 5);
    vertex(-7.5, -5);
    endShape(CLOSE);
    beginShape();
    vertex(-15, 0);
    vertex(-10, -2.5);
    vertex(-10, 2.5);
    endShape(CLOSE);
    pop();
  }
}

class Kyle extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,2,0.05,5);
		this.angle = 0;
		this.reload = 300;
		this.reload2 = 20;
		this.cooldown = Math.random()*600;
		this.cooldown2 = 20;
    
    this.angle = Math.PI/2;
    
		this.phase = 1;

		this.mode = "idle";
		this.modeLength = 0;
    this.target = new p5.Vector(0,0);
  }
  attack(force) {
    this.charge(force);
  }
  shoot() {
    if(this.cooldown2 >= this.reload2) {
      let angle = this.angle+(Math.random()-0.5)*(this.phase === 4 ? Math.PI/5 : Math.PI/10); 
      new EnemyBullet(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5);
      this.cooldown2 -= this.reload2;
    }
  }
  charge(force) {
    if(this.cooldown >= this.reload || force) {
      this.cooldown -= this.reload;
      this.mode = "CHARGE";
      this.modeLength = 150;
      this.speed = 2.5
    }
  }
  move() {
    super.move();
    if(this.pos.x < 0) {
      this.pos.x = 0;
      this.v.x = -this.v.x * 1/2;
    }
    if(this.pos.x > canvasX) {
      this.pos.x  = canvasX;
      this.v.x = -this.v.x * 1/2;
    }
    if(this.pos.y < 0) {
      this.pos.y = 0;
      this.v.y = -this.v.y * 1/2;
    }
    if(this.pos.y > canvasY) {
      this.pos.y = canvasY;
      this.v.y = -this.v.y * 1/2;
    }
    this.cooldown++;
    if(this.cooldown > this.reload) {
      this.cooldown = this.reload;
    }
    this.cooldown2++;
    if(this.cooldown2 > this.reload2) {
      this.cooldown2 = this.reload2;
    }
    this.modeLength--;
    
    this.angle = p5.Vector.sub(player.pos,this.pos).heading();
    if(this.mode === "CHARGE") {
      let angle = this.angle;
      let randy = (Math.random()-0.5)*Math.PI/5;
      this.target = player.pos.copy();
      this.shoot();
      if(this.modeLength <= 0) {

        this.mode = "idle";
        this.speed = 2;
      }
    }
    
    if(this.mode === "idle") {
      
      let vangle;
      if(this.v.x === 0 && this.v.y === 0) {
        vangle = Math.random()*Math.PI*2;
      } else {
        vangle = this.v.heading();
      }
      this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
      if(this.phase === 3) {
        this.charge(false);
      }
    }
    if(this.phase === 4) {
      this.mode = "CHARGE";
      this.reload2 = 10;
      this.speed = 2.5;
      this.modeLength = Infinity;
    }
    let desired = p5.Vector.sub(this.target,this.pos);
    desired.normalize();
    desired.mult(this.speed);
    let steer = p5.Vector.sub(desired,this.v);
    steer.limit(this.accel);
    steer.rotate((Math.random()-0.5)*Math.PI/4);
    this.v.add(steer);
    if(this.dead) {
      new RedParticle(this.pos.x,this.pos.y,30,75);
    }
  }
  show() {
    fill(255,0,0);	
    noStroke();
    let angle = this.angle;      
    push();
    translate(this.pos.x,this.pos.y);
    rotate(angle);
    beginShape();
    vertex(5, 0);
    vertex(-7.5, 5);
    vertex(-5, 2);
    vertex(-7.5, 0);
    vertex(-5, -2);
    vertex(-7.5, -5);
    endShape(CLOSE);
    pop();
	}
}


