
class Snipeyship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,1.5,0.05,5);
		this.angle = 0;
		this.reload = 300;
		this.cooldown = Math.random()*300;
		this.ais = ["Skittish","Random","Predictor"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		this.shooting = false;
		this.shootLength = 0;
		this.mode = "attack";
		this.modeLength = 0;
    this.target = new p5.Vector(0,0);
	}	
  shoot() {
    if(this.cooldown >= this.reload) {
      this.shooting = true;
      this.shootLength = 60;
        let angle = this.angle;
		let laser = new Laser(this.pos.x, this.pos.y, this.angle);
		laser.shooter = this;
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
      }else {
      if(this.ai === "Random") {
        let distance = p5.Vector.sub(player.pos,this.pos).mag();
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        if(distance < 300) {
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
          this.mode = "attack";
        }
        if(this.mode === "attack") {
          let vangle;
          if(this.v.x === 0 && this.v.y === 0) {
            vangle = Math.random()*Math.PI*2;
          } else {
            vangle = this.v.heading();
          }
          this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
          
        }
        this.shoot();
      } else if(this.ai === "Skittish") {
        let distance = p5.Vector.sub(player.pos,this.pos).mag();
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        if(distance < 300) {
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
          this.mode = "attack";
        }
        if(this.mode === "attack") {
          this.target = player.pos.copy();
          
        }
        this.shoot();
      } else if(this.ai === "Predictor") {
        let distance = p5.Vector.sub(player.pos,this.pos).mag();
          this.angle = p5.Vector.sub(p5.Vector.add(player.pos,p5.Vector.mult(player.v,50)),this.pos).heading();
        if(distance < 300) {
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
          this.mode = "attack";
        }
        if(this.mode === "attack") {
          let vangle;
          if(this.v.x === 0 && this.v.y === 0) {
            vangle = Math.random()*Math.PI*2;
          } else {
            vangle = this.v.heading();
          }
          this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
        }
        this.shoot();
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
    vertex(7.5, 0);
    vertex(-7.5, 5);
    vertex(-7.5, -5);
    endShape(CLOSE);
    pop();
  }
}

class Splittyship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,1.5,0.05,5);
		this.angle = 0;
		this.reload = 450;
		this.cooldown = Math.random()*450;
		this.ais = ["Skittish","Random","Predictor"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		this.shooting = false;
		this.shootLength = 0;
		this.mode = "attack";
		this.modeLength = 0;
    this.target = new p5.Vector(0,0);
	}	
  shoot() {
    if(this.cooldown >= this.reload ) {
      this.cooldown -= this.reload;
      let angle = this.angle+Math.PI+(Math.random()-0.5)*Math.PI/60; 
      let splitter = new Splitter(this.pos.x,this.pos.y,-Math.cos(angle)*7.5,-Math.sin(angle)*7.5,10);
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
    if(this.ai === "Random") {
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      if(distance < 300) {
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
        this.mode = "attack";
      }
      if(this.mode === "attack") {
        let vangle;
        if(this.v.x === 0 && this.v.y === 0) {
          vangle = Math.random()*Math.PI*2;
        } else {
          vangle = this.v.heading();
        }
        this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
        
      }
      this.shoot();
    } else if(this.ai === "Skittish") {
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      if(distance < 300) {
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
        this.mode = "attack";
      }
      if(this.mode === "attack") {
        this.target = player.pos.copy();
        
      }
      this.shoot();
    } else if(this.ai === "Predictor") {
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
        this.angle = p5.Vector.sub(p5.Vector.add(player.pos,p5.Vector.mult(player.v,50)),this.pos).heading();
      if(distance < 300) {
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
        this.mode = "attack";
      }
      if(this.mode === "attack") {
        let vangle;
        if(this.v.x === 0 && this.v.y === 0) {
          vangle = Math.random()*Math.PI*2;
        } else {
          vangle = this.v.heading();
        }
        this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
      }
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
    vertex(7.5, 0);
    vertex(-7.5, 5);
    vertex(-7.5, -5);
    endShape(CLOSE);
    
    circle(7.5, 0, 10);
    pop();
  }
}