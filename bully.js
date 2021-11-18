class Bully extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,250,1,0.05,20);
		this.angle = 0;
		
		this.attackReload = 120;
		this.attackCooldown = Math.random()*100;
		this.spreadCooldown = 30;
		this.cooldown = 100;
		this.reload = 100;
		this.shots = 0;
		
		this.modeLength = 0;
		
		this.mode = "idle";
		this.phase = 1;
  }
  numMines () {
    let result = 0;
    for(let i = 0; i < entities.length; i++) {
      if(entities[i] instanceof Mine) {
        result++;
      }
    }
    return result;
  }
  attack() {
    if(this.attackCooldown >= this.attackReload) {
      if(this.phase === 3) {
        this.scatter();
      } else {
        let number = 0;
        if(this.phase === 1) {
          number = Math.random()*5;
        } else if(this.phase === 2) {
          number = Math.random()*11;
        }
        if(number < 1){
          this.parallelShoot();
        } else if(number < 2){
          this.split();
        } else if(number < 3){
          this.skimmer();
        } else if(number < 4){
          this.laser();
        } else if(this.numMines() < 5 && number < 5) {
          this.mines();
        } else if(number < 7) {
          this.laserII();
        } else if(number < 9) {
          this.splitSpread();
        } else if(number < 11) {
          this.skimSpread();
        }
      }
    }
  }
    
  parallelShoot() {
    for(let i = -5; i <= 5; i++) {
      let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
      new DelayBullet(this.pos.x,this.pos.y,Math.cos(angle+Math.PI/2)*i*1.5,Math.sin(angle+Math.PI/2)*i*1.5,angle,45);
      
    }
    this.attackCooldown = 0;
  }
  skimmer() {
    let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
    new Skimmer(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5,15);
    
    this.attackCooldown = 0;
  }
  skimSpread() {
    let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
    for(let i = 0; i < 3; i++) {
      let angle = this.angle+Math.PI/4*(i-1)+(Math.random()-0.5)*Math.PI/60; 
      new Skimmer(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5,20);
      
    }
    this.attackCooldown = -30;
  }
  splitSpread() {
    let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
    for(let i = 0; i < 5; i++) {
      let angle = this.angle+Math.PI/6*(i-2)+(Math.random()-0.5)*Math.PI/60; 
      new Splitter(this.pos.x,this.pos.y,Math.cos(angle)*7.5,Math.sin(angle)*7.5,8);
      
    }
    this.attackCooldown = -30;
  }
  splitShoot = function() {
    if(this.cooldown >= this.reload) {
      let angle = this.angle+Math.PI+(Math.random()-0.5)*Math.PI/60; 
      new Splitter(this.pos.x,this.pos.y,-Math.cos(angle)*7.5,-Math.sin(angle)*7.5,10);
      
      this.modeLength--;
      this.cooldown = this.reload-10;
    }
  }
  mines() {
    for(let i = 0; i < 2; i++) {
      let angle = Math.random()*Math.PI*2; 
      new Mine(this.pos.x,this.pos.y,Math.cos(angle),Math.sin(angle),10);
      if(this.numMines() >= 5) {
        break;
      }
    }
    this.attackCooldown = 0;
    this.shots = 0;
  }
  scatter() {
    for(let i = 0; i < 3; i++) {
      let angle = Math.random()*Math.PI*2; 
      new Splitter(this.pos.x,this.pos.y,Math.cos(angle)*7.5,Math.sin(angle)*7.5,10);
    }
    this.attackCooldown = 0;
    this.shots = 0;
  }
  split() {
    this.mode = "split";
    this.modeLength = 3;
    this.attackCooldown = 0;
    this.shots = 0;
  }
  laser() {
    this.attackCooldown = 0;
    this.mode = "lasers yay";
    this.modeLength = 60;
	let angle = this.angle;
	let laser = new BiggerLaser(this.pos.x, this.pos.y, this.angle);
	laser.shooter = this;
  }
  laserII() {
    this.attackCooldown = 0;
    this.mode = "lasers mk II";
    this.modeLength = 210;
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
      this.pos.y  = canvasY;
      this.v.y = -this.v.y * 1/2;
    }
    if(this.mode === "lasers yay") {    
      this.modeLength--;
       if(this.modeLength === 16) {
          let angle = this.angle+Math.PI;
          this.v.add(p5.Vector.fromAngle(angle).mult(3));
        }
        if(this.modeLength <= 0) {
          this.mode = "idle";
        }
    } else if(this.mode === "lasers mk II") {    
      this.modeLength--;
      let modeLength2 = this.modeLength % 45;
      
      if(modeLength2 > 16 || this.modeLength >= 180) {
        
        strokeWeight(5);
        stroke(127,0,0);
        push();
        translate(this.pos.x,this.pos.y);
        
        line(0,0,Math.cos(this.angle)*2000,Math.sin(this.angle)*2000);
        pop();
        if(modeLength2 === 44) {
			
          if(this.modeLength < 179) {
			  this.angle = p5.Vector.sub(player.pos,this.pos).heading();
		  }
		let laser = new BigLaser(this.pos.x, this.pos.y, this.angle);
		laser.shooter = this;
		laser.life = 45;
        }
      } else {
        if(modeLength2 === 16) {
          let angle = this.angle+Math.PI;
          this.v.add(p5.Vector.fromAngle(angle).mult(3));
        }
        if(this.modeLength <= 0) {
          this.mode = "idle";
        }
      }
    } else {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
    
      let vangle;
      if(this.v.x === 0 && this.v.y === 0) {
        vangle = Math.random()*Math.PI*2;
      } else {
        vangle = this.v.heading();
      }
      this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
      
      let desired = p5.Vector.sub(this.target,this.pos);
      desired.normalize();
      desired.mult(this.speed);
      let steer = p5.Vector.sub(desired,this.v);
      steer.limit(this.accel);
      steer.rotate((Math.random()-0.5)*Math.PI/4);
      this.v.add(steer);
      
      if(this.mode === "idle") {
        this.attackCooldown++;
        this.attack();
      }
      if(this.mode === "split") {
        this.cooldown++;
        this.splitShoot();
        if(this.modeLength <= 0) {
          this.mode = "idle";
        }
      }
      if(this.health < 50) {
        this.phase = 3;
        this.attackReload = 90;
      } else if(this.health < 125) {
        this.phase = 2;
        this.attackReload = 90;
      }
    }
    if(this.dead) {
      new RedParticle(this.pos.x,this.pos.y,60,100);
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
    vertex(-15, 10);
    vertex(-15, -10);
    endShape(CLOSE);
    pop();
  }
}
