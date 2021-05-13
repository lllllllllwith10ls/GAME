
class Chargeship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,2,0.1,5);
		this.angle = 0;
		this.reload = 60;
		this.reload2 = 30;
		this.cooldown = Math.random()*60;
		this.ais = ["Predictor","Flanker","Dodgy","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		this.mode = "idle";
		this.modeLength = 0;
    this.target = new p5.Vector(0,0);
  }
  charge() {
    if(this.cooldown >= this.reload) {
      this.speed = 4;
      this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
      this.cooldown -= this.reload;
      this.mode = "charge!";
      this.modeLength = 50;
    }
  }
	minicharge() {
    if(this.cooldown >= this.reload2) {
      if(this.ai === "Dodgy" && this.dodge) {
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
        this.cooldown = 0;
        this.mode = "charge!";
        this.modeLength = 10;
      } else {
        this.speed = 4;
        this.angle = Math.PI*2*Math.random();
        this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
        this.cooldown -= this.reload2;
        this.mode = "charge!";
        this.modeLength = 10;
      }
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
    if(this.mode === "charge!") {
      this.modeLength--;
      if(this.modeLength <= 0) {
        this.speed = 2;
        this.mode = "idle";
      }
    } else {
      if(this.ai === "Predictor") {
        this.angle = p5.Vector.sub(p5.Vector.add(player.pos,p5.Vector.mult(player.v,50)),this.pos).heading();
        this.target = p5.Vector.add(player.pos,p5.Vector.mult(player.v,50));
        if(Math.random() < 0.005) {
          this.minicharge();
        } else if(Math.random() < 0.01) {
          this.charge();
        }
      } else if(this.ai === "Flanker") {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        this.target = p5.Vector.sub(player.pos,p5.Vector.fromAngle(player.angle).mult(50));
        if(Math.random() < 0.005) {
          this.minicharge();
        } else if(this.angle <= player.angle+3*Math.PI/4 && this.angle >= player.angle-3*Math.PI/4) { 
          if(Math.random() < 0.01) {
            this.charge();
          }
        }
      } else if(this.ai === "Dodgy") {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        this.target = p5.Vector.add(player.pos);
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
        if(this.dodge) {
          this.minicharge();
        } else if(Math.random() < 0.005) {
          this.minicharge();
        } else if(Math.random() < 0.01) {
          this.charge();
        }
      } else if( this.ai === "Erratic") {
        this.angle = p5.Vector.sub(player.pos,this.pos).heading();
        this.target = p5.Vector.add(player.pos);
        if(Math.random() < 0.02) {
          this.minicharge();
        } else if(Math.random() < 0.01) {
          this.charge();
        }
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
    vertex(5, 0);
    vertex(0, 5);
    vertex(-10, 5);
    vertex(-5, 0);
    vertex(-10, -5);
    vertex(0, -5);
    endShape(CLOSE);
    pop();
  }
}