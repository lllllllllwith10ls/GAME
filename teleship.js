
class Teleship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,1.5,0.05,5);
		this.angle = 0;
		this.reload = 600;
		this.reload2 = 200;
		this.cooldown = Math.random()*200;
		this.ais = ["Chainer","Random","Predictor","Coward"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		this.mode = "attack";
		this.modeLength = 0;
    this.target = new p5.Vector(0,0);
    this.target2 = new p5.Vector(0,0);
    this.bullet = {dead:true};
	}	
  shoot() {
    if(this.cooldown >= this.reload2 && this.bullet.dead) {
			let angle = p5.Vector.sub(this.target2,this.pos).heading()+(Math.random()-0.5)*Math.PI/60; 
			this.bullet = new Telebullet(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5,this,this.target2);
			this.cooldown -= this.reload2;
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
      this.target2 = p5.Vector.sub(player.pos,this.pos).mult(1.5).add(this.pos);
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      if(distance < 200) {
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
    } else if(this.ai === "Coward") {
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      if(distance < 200) {
        this.mode = "back away";
        this.modeLength = Math.random()*60;
      }
      if(this.mode === "back away") {
        let difference = p5.Vector.sub(player.pos,this.pos);
        let dist = p5.Vector.sub(player.pos,this.pos).mag();
        difference.mult(-1); 
        this.target = p5.Vector.add(this.pos,difference);
        if(dist < 175) {
          difference.mult(200-dist);          
          this.target2 = p5.Vector.add(this.pos,difference);
          this.shoot();
        } else {
          difference.mult(-(200-dist)); 
          this.target2 = p5.Vector.sub(player.pos,this.pos).mult(1.5).add(this.pos);
          this.shoot();
        }
        this.modeLength--;
      }
      if(this.modeLength <= 0) {
        this.mode = "attack";
      }
      if(this.mode === "attack") {
        this.target = p5.Vector.sub(player.pos,this.pos).mult(1.5).add(this.pos);
        this.target2 = p5.Vector.sub(player.pos,this.pos).mult(1.5).add(this.pos);
        this.shoot();
      }
    } else if(this.ai === "Chainer") {
      this.target2 = p5.Vector.sub(player.pos,this.pos).mult(1.5).add(this.pos);
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      if(distance < 200 && this.mode !== "chain") {
        this.mode = "back away";
        this.modeLength = Math.random()*60;
      }
      if(this.mode === "back away") {
        let difference = p5.Vector.sub(player.pos,this.pos);
        difference.mult(-1);          
        this.target = p5.Vector.add(this.pos,difference);
        
        this.modeLength--;
        if(this.cooldown >= this.reload) {
          this.mode = "chain";
        }
      }
      if(this.modeLength <= 0 && this.mode !== "chain") {
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
        if(this.cooldown >= 600) {
          this.mode = "chain";
        }
      }      
      if(this.mode === "chain") {
        this.target = p5.Vector.sub(player.pos,this.pos).mult(1.5).add(this.pos);
        this.target2 = p5.Vector.sub(player.pos,this.pos).mult(1.5).add(this.pos);
        this.shoot();
        if(this.cooldown < 200) {
          this.mode = "attack";
        }
      }
    } else if(this.ai === "Predictor") {
      this.target2 = p5.Vector.sub(p5.Vector.add(player.pos,p5.Vector.mult(player.v,50)),this.pos).mult(1.5).add(this.pos);
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      this.angle = p5.Vector.sub(p5.Vector.add(player.pos,p5.Vector.mult(player.v,50)),this.pos).heading();
      if(distance < 200) {
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
      if(this.dead) {
        new RedParticle(this.pos.x,this.pos.y,30,50);
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
    
    fill(0,0,255);
    circle(7.5, 0, 10);
    pop();
  }
}