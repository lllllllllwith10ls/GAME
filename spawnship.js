class Spawnship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,1,0.1,10);
		this.angle = 0;
		this.reload = 150;
		this.cooldown = Math.random()*150;
		this.ais = ["Circler","Coward","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		if(this.ai === "Circler") {
			let array = ["clockwise","counterclockwise"];
			this.mode = array[Math.floor(Math.random()*array.length)];
			this.modeLength = Math.random()*300;
		} else if(this.ai === "Coward") {
			this.mode = "attack";
			this.modeLength = 0;
		}
  }
  shoot() {
    if(this.cooldown >= this.reload) { 
      new Swarmship(this.pos.x,this.pos.y,0,0);
      this.cooldown -= this.reload;
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
    if(this.ai === "Circler") {
      let difference = p5.Vector.sub(player.pos,this.pos);
      let mag = difference.mag();
      let angle2;
      if(this.mode === "clockwise") {
        difference.rotate(Math.PI/4);
      } else {
        difference.rotate(-Math.PI/4);
      }
      difference.limit(mag-5);
      this.target = p5.Vector.add(this.pos,difference);
      this.modeLength --;
      if(this.modeLength <= 0) {
        if(this.mode === "clockwise") {
          this.mode = "counterclockwise";
        } else {
          this.mode = "clockwise";
        }
        this.modeLength = Math.random()*300;
      }
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      this.shoot();
    } else if(this.ai === "Coward") {
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      if(distance < 100) {
        this.mode = "run";
        this.modeLength = Math.random()*60;
      }
      if(this.mode === "run") {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading()+Math.PI;
        let difference = p5.Vector.sub(player.pos,this.pos);
        difference.mult(-1);          
        this.target = p5.Vector.add(this.pos,difference);
        
        this.modeLength--;
      }
      if(this.modeLength <= 0) {
        this.mode = "attack";
      }
      if(this.mode === "attack") {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        let vangle;
        if(this.v.x === 0 && this.v.y === 0) {
          vangle = Math.random()*Math.PI*2;
        } else {
          vangle = Math.atan2(this.v.x,this.v.y);
        }
        let angle = this.angle;
        this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
        this.shoot();
      }
    } else if(this.ai === "Erratic") {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      let vangle;
      if(this.v.x === 0 && this.v.y === 0) {
        vangle = Math.random()*Math.PI*2;
      } else {
        vangle = this.v.heading();
      }
      this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
      this.shoot();
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
    vertex(15, 0);
    vertex(5, 10);
    vertex(-15, 10);
    vertex(-15, -10);
    vertex(5, -10);
    endShape(CLOSE);
    pop();
	}
}

class Mineship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,1,0.1,10);
		this.angle = 0;
		this.reload = 150;
		this.cooldown = Math.random()*150;
		this.ais = ["Circler","Coward","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		if(this.ai === "Circler") {
			let array = ["clockwise","counterclockwise"];
			this.mode = array[Math.floor(Math.random()*array.length)];
			this.modeLength = Math.random()*300;
		} else if(this.ai === "Coward") {
			this.mode = "attack";
			this.modeLength = 0;
		}
  }
  shoot() {
    if(this.cooldown >= this.reload && this.canMakeMine()) { 
      new Mine(this.pos.x,this.pos.y,Math.cos(this.angle+Math.PI),Math.sin(this.angle+Math.PI),10);
      this.cooldown -= this.reload;
    }
  }
  canMakeMine = function() {
    let mines = 0;
    for(let i = 0; i < entities.length; i++) {
      if(entities[i] instanceof Mineship) {
        mines += 9;
      }
    }
    mines = Math.sqrt(mines);
    
    for(let i = 0; i < entities.length; i++) {
      if(entities[i] instanceof Mine) {
        mines--;
      }
    }
    if(mines <= 0) {
      return false;
    }
    return true;
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
    if(this.ai === "Circler") {
      let difference = p5.Vector.sub(player.pos,this.pos);
      let mag = difference.mag();
      let angle2;
      if(this.mode === "clockwise") {
        difference.rotate(Math.PI/4);
      } else {
        difference.rotate(-Math.PI/4);
      }
      difference.limit(mag-5);
      this.target = p5.Vector.add(this.pos,difference);
      this.modeLength --;
      if(this.modeLength <= 0) {
        if(this.mode === "clockwise") {
          this.mode = "counterclockwise";
        } else {
          this.mode = "clockwise";
        }
        this.modeLength = Math.random()*300;
      }
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      this.shoot();
    } else if(this.ai === "Coward") {
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      if(distance < 100) {
        this.mode = "run";
        this.modeLength = Math.random()*60;
      }
      if(this.mode === "run") {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading()+Math.PI;
        let difference = p5.Vector.sub(player.pos,this.pos);
        difference.mult(-1);          
        this.target = p5.Vector.add(this.pos,difference);
        
        this.modeLength--;
      }
      if(this.modeLength <= 0) {
        this.mode = "attack";
      }
      if(this.mode === "attack") {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        let vangle;
        if(this.v.x === 0 && this.v.y === 0) {
          vangle = Math.random()*Math.PI*2;
        } else {
          vangle = Math.atan2(this.v.x,this.v.y);
        }
        let angle = this.angle;
        this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
        this.shoot();
      }
    } else if(this.ai === "Erratic") {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      let vangle;
      if(this.v.x === 0 && this.v.y === 0) {
        vangle = Math.random()*Math.PI*2;
      } else {
        vangle = this.v.heading();
      }
      this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
      this.shoot();
    }
    
    let desired = p5.Vector.sub(this.target,this.pos);
    desired.normalize();
    desired.mult(this.speed);
    let steer = p5.Vector.sub(desired,this.v);
    steer.limit(this.accel);
    steer.rotate((Math.random()-0.5)*Math.PI/4);
    this.v.add(steer);
    if(this.dead) {
      new RedParticle(this.pos.x,this.pos.y,30,50);
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
    vertex(-7.5, -7.5);
    vertex(4.5, -7.5);
    vertex(4.5, 7.5);
    vertex(-7.5, 7.5);
    vertex(-7.5, 3);
    vertex(0, 3);
    vertex(0, -3);
    vertex(-7.5, -3);
    endShape(CLOSE);
    pop();
	}
}