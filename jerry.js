class JerryRevenge extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,30,1.5,0.1,5);
		this.angle = 0;
		this.reload = 600;
		this.reload2 = 60;
		this.reload3 = 20;
		this.reload4 = 60;
		this.reload5 = 120;
		this.cooldown = Math.random()*600;
		this.cooldown2 = Math.random()*0;
		this.cooldown3 = 0;
		this.cooldown4 = 0;
		this.mode = "idle";
		this.modeLength = 0;
		this.modeLength2 = 0;
		this.phase = 1;
		this.offScreen = false;
		this.offScreenLast = true;
    this.angle = Math.PI/2;
    
	this.pos2 = new p5.Vector(0,0);
    this.target = new p5.Vector(0,0);
  }
  attack() {
	if(this.cooldown >= this.reload)
	{
	  let rand = Math.random();
      if(this.offScreenLast)
	  {
			if(rand < 1/2) {
			this.charge();
		  } else {
			this.charge2();
		  }
		  this.offScreenLast = false;
	  }
	  else
	  {
		  if(rand < 1/2) {
			this.offScreenCharge();
		  } else {
			this.offScreenCharge2();
		  }
		  this.offScreenLast = true;
	  }
	}
  }
  
  
  prepareOffScreen() {
	  this.pos = new p5.Vector(-100,-100);
	  if(this.mode === "charge mode 1 active")
	  {
		  this.mode = "off screen mode 1";
		  this.reload5 = 120;
		  this.cooldown4 = 60;
	  }
	  else if(this.mode === "charge mode 2 active")
	  {
		  this.mode = "off screen mode 2";
		  this.reload5 = 120;
		  this.cooldown4 = 0;
	  }
  }
  
  charge() {
    if(this.cooldown >= this.reload) {
      this.cooldown -= this.reload;
      this.mode = "charge mode 1";
	  this.reload5 = 120;
	  this.reload2 = 30;
      this.modeLength = 300;
    }
  }
  chargeActive() {
    if(this.cooldown4 >= this.reload5) {
      this.speed = 4;
      this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
      this.cooldown4 -= this.reload5;
      this.mode = "charge mode 1 active";
      this.modeLength2 = 100;
    }
  }
  offScreenCharge() {
	  if(this.cooldown >= this.reload) {
      this.speed = 4;
		  this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
		  this.cooldown -= this.reload * 1.5;
		  this.mode = "charge mode 1 active";
		  this.reload5 = 120;
		  this.reload2 = 30;
		  this.modeLength2 = 10000;
		  this.modeLength = 600;
		  this.offScreen = true;
		}
  }
  
  shoot() {
    if(this.cooldown2 >= this.reload3) {
      let angle = this.angle+Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
      let angle2 = this.angle-Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*5,-Math.sin(angle)*5);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle2)*5,-Math.sin(angle2)*5);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*4,-Math.sin(angle)*4);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle2)*4,-Math.sin(angle2)*4);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*3,-Math.sin(angle)*3);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle2)*3,-Math.sin(angle2)*3);
      this.cooldown2 -= this.reload3;
    }
  }
  
  
  shoot2() {
    if(this.cooldown2 >= this.reload3) {
      let angle = this.angle+Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
      let angle2 = this.angle-Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*5,-Math.sin(angle)*5);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle2)*5,-Math.sin(angle2)*5);
      this.cooldown2 -= this.reload3;
    } else if(this.cooldown2 % this.reload3 == this.reload3/3) {
	  let angle = this.angle+Math.PI/2+Math.PI/6+(Math.random()-0.5)*Math.PI/60; 
      let angle2 = this.angle-Math.PI/2-Math.PI/6+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*5,-Math.sin(angle)*5);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle2)*5,-Math.sin(angle2)*5);
      this.cooldown2 -= this.reload3;
    	
	} else if(this.cooldown2 % this.reload3 == 2*this.reload3/3) {
	  let angle = this.angle+Math.PI/2-Math.PI/6+(Math.random()-0.5)*Math.PI/60; 
      let angle2 = this.angle-Math.PI/2+Math.PI/6+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*5,-Math.sin(angle)*5);
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle2)*5,-Math.sin(angle2)*5);
      this.cooldown2 -= this.reload3;
    	
	}
		
  }
  
  
  shootLaser() {
    if(this.cooldown4 >= this.reload5 && this.modeLength > 90) {
	  let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
      
      if(this.mode == "off screen mode 1")
	  {
		  new JerryLaser1(this.pos2.x,this.pos2.y,angle);
	  }
	  else if(this.mode == "off screen mode 2")
	  {
		  new JerryLaser2(this.pos2.x,this.pos2.y,angle);
	  }
	  this.cooldown4 -= this.reload5;
    }
  }
  
  charge2() {
    if(this.cooldown >= this.reload) {
      this.speed = 4;
      this.cooldown -= this.reload;
      this.mode = "charge mode 2";
	  this.reload5 = 120;
      this.modeLength = 300;
    }
  }
  chargeActive2() {
    if(this.cooldown4 >= this.reload5) {
      this.speed = 4;
      this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
      this.cooldown4 -= this.reload5;
      this.mode = "charge mode 2 active";
      this.modeLength2 = 100;
    }
  }
  offScreenCharge2() {
	  if(this.cooldown >= this.reload) {
      this.speed = 4;
		  this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
		  this.cooldown -= this.reload * 1.5;
		  this.mode = "charge mode 2 active";
		  this.reload5 = 120;
		  this.reload2 = 30;
		  this.modeLength2 = 10000;
		  this.modeLength = 600;
		  this.offScreen = true;
		}
  }
  charge3() {
    if(this.cooldown >= this.reload) {
      this.cooldown -= this.reload;
      this.mode = "charge mode 3";
      this.modeLength = 300;
      this.modeLength2 = 300;
	  this.speed = 4;
	  this.reload2 = 15;
	  this.accel = 0.1;
    }
  }
  circle(amount) {
    for(let i = 0; i < amount; i++) {
      let angle = this.angle+Math.PI/amount*2*i+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*5,-Math.sin(angle)*5);
    }
	for(let i = 0; i < amount; i++) {
      let angle = this.angle+Math.PI/amount*(2*i+1)+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*4,-Math.sin(angle)*4);
    }
	for(let i = 0; i < amount; i++) {
      let angle = this.angle+Math.PI/amount*2*i+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*3,-Math.sin(angle)*3);
    }
	for(let i = 0; i < amount; i++) {
      let angle = this.angle+Math.PI/amount*(2*i+1)+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x,this.pos.y,-Math.cos(angle)*2,-Math.sin(angle)*2);
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
        this.cooldown -= this.reload3;
        this.mode = "charge!";
        this.modeLength = 10;
        this.modeLength2 = 10;
      } else {
        this.speed = 4;
        this.angle = Math.PI*2*Math.random();
        this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
        this.cooldown -= this.reload3;
        this.mode = "charge!";
        this.modeLength = 10;
        this.modeLength2 = 10;
      }
    }
  }
  move() {
    super.move();
	  
	  if(this.offScreen && ((this.pos.x < 0) || (this.pos.x > canvasX) || (this.pos.y < 0) || (this.pos.y > canvasY)))
	  {
		  if(this.pos.x < 0) {
			this.pos.x = 0;
		  }
		  if(this.pos.x > canvasX) {
			this.pos.x  = canvasX;
		  }
		  if(this.pos.y < 0) {
			this.pos.y = 0;
		  }
		  if(this.pos.y > canvasY) {
			this.pos.y = canvasY;
		  }
		  if(this.mode == "charge mode 2 active")
		  {
			  this.circle(12);
		  }
		  this.prepareOffScreen();
	  }
	  else
	  {
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
	  }
      this.cooldown++;
      this.cooldown2++;
      this.cooldown3++;
      this.cooldown4++;
      if(this.cooldown > this.reload) {
        this.cooldown = this.reload;
      }
      if(this.cooldown2 > this.reload3) {
        this.cooldown2 = this.reload3;
      }
      if(this.cooldown3 > this.reload4) {
        this.cooldown3 = this.reload4;
      }
      if(this.cooldown4 > this.reload5) {
        this.cooldown4 = this.reload5;
      }
      if(this.mode === "charge!" || this.mode === "charge mode 1" || this.mode === "charge mode 1 active"
	  || this.mode === "charge mode 2" || this.mode === "charge mode 2 active" || this.mode === "charge mode 3") {
        this.modeLength--;
		this.modeLength2--;
        if(this.mode === "charge mode 1 active") {
          
          this.shoot();
        }
		if(this.mode === "charge mode 3") {
			this.shoot();
		}
        if(this.modeLength2 <= 0) {
          
          this.speed = 1.5;
		  this.accel = 0.1;
          if(this.mode === "charge mode 1 active") {
            this.mode = "charge mode 1";
          } else if(this.mode === "charge mode 1") {
            this.chargeActive();
          } else if(this.mode === "charge mode 2 active") {
            this.mode = "charge mode 2";
			this.circle(12);
          } else if(this.mode === "charge mode 2") {
            this.chargeActive2();
          } else {
			this.mode = "idle";
          }
        }
		if(this.modeLength <= 0 && (this.mode === "charge mode 1" || this.mode === "charge mode 2" || this.mode === "charge mode 3" || this.mode === "charge!")) {
          this.speed = 1.5;
		  this.accel = 0.1;
		  this.mode = "idle";
        }
      } 
	  if(this.mode === "off screen mode 1" || this.mode === "off screen mode 2")
	  {
        this.modeLength--;
		let number = Math.floor(Math.random()*4);
		if(number === 0) {
		  this.pos2 = new p5.Vector(Math.random()*canvasX,0);
		} else if(number === 1) {
		  this.pos2 = new p5.Vector(Math.random()*canvasX,canvasX);
		} else if(number === 2) {
		  this.pos2 = new p5.Vector(canvasY,Math.random()*canvasY);
		} else {
		  this.pos2 = new p5.Vector(0,Math.random()*canvasY);
		}
		  this.angle = p5.Vector.sub(player.pos,this.pos2).heading();
		  this.target = player.pos.copy();
		this.shootLaser();
		if(this.modeLength <= 0) {
		  this.modeLength2 = 0;
			this.v = new p5.Vector(0,0);
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
			this.speed = 1.5;
		  this.accel = 0.1;
		  this.angle = p5.Vector.sub(player.pos,this.pos).heading();
		  this.target = player.pos.copy();
		  if(this.mode === "off screen mode 2")
		  {
			  this.mode = "charge mode 2 active";
		  }
		  else
		  {
			  this.mode = "charge mode 1 active";
		  }
			this.modeLength2 = 100;
      this.speed = 4;
		  this.v = p5.Vector.fromAngle(this.angle).mult(this.speed);
		  this.offScreen = false;
        }
	  }
      if(!(this.mode === "charge!" || this.mode === "charge mode 1 active" || this.mode === "charge mode 2 active" || this.mode === "off screen mode 1" || this.mode === "off screen mode 2"))	  {
		if(this.mode === "charge mode 3") {
		  let playerAngle = p5.Vector.sub(player.pos,this.pos).heading();
		  this.angle = this.angle % (Math.PI*2);
		  if((this.angle-playerAngle+Math.PI*2)%(Math.PI*2)>Math.PI) {
		    this.angle += Math.PI/60;
		  } else {
		    this.angle -= Math.PI/60;
    	  }
		  this.target = p5.Vector.add(this.pos,p5.Vector.fromAngle(this.angle));
		} else {
		  this.angle = p5.Vector.sub(player.pos,this.pos).heading();
		  this.target = player.pos.copy();
        }
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
        if (this.mode !== "charge mode 1" && this.mode !== "charge mode 2" && this.mode !== "charge mode 3") {
			if(this.dodge && this.cooldown3 >= this.reload4) {
			  this.minicharge();
			  this.cooldown3 = 0;
			} else if(Math.random() < 0.001) {
			  this.minicharge();
			} else {
			  this.attack();
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