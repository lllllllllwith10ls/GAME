class BigBoi extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,250,2,0.1,75);
		this.angle = 0;
		
		this.attackReload = 500;
		this.reload = 20;
		this.reload2 = 20;
		this.attackCooldown = Math.random()*200+300;
		this.attackCooldown2 = 500;
		this.cooldown = 20;
		this.cooldown2 = 20;
		
		this.modeLength = 0;
		this.modeLength2 = 0;
		
		this.gunPos = new p5.Vector(50,5);
		this.gunPos2 = new p5.Vector(-50,5);
		this.gunAngle = 0;
		this.gunAngle2 = 0;
		
		this.phase = 1;
		
		this.mode = "idle";
		this.mode2 = "idle";
		
		this.spamDir = 0;
		this.spamDir2 = 0;
		this.phase = 1;
	}
  attack(gun1,gun2) {
    if(this.attackCooldown >= this.attackReload && this.phase === 1 && (this.noMinions() || hell)) {
      let number = Math.random()*5;
      if(number < 1) {
        this.charge();
      } else if(number < 2){
        this.spread(true,true);
      } else if(number < 3){
        this.spam(true,true);
      } else if(number < 4){
        this.rocket(true,true);
      } else {
        this.split(true,true);
      }
    } else if(this.attackCooldown >= this.attackReload && this.phase === 2 && gun1 && this.noMinions()) {
      let number = Math.random()*3;
      if(number < 1){
        this.spread(true,false);
      } else {
        this.spam(true,false);
      } 
    } else if(this.attackCooldown2 >= this.attackReload && this.phase === 2 && gun2 && this.noMinions()) {
      let number = Math.random()*2;
      if(number < 1){
        this.spread(false,true);
      } else {
        this.spam(false,true);
      }
    }
  }
    
  noMinions() {
    for(let i = 0; i < entities.length; i++) {
      if(entities[i] instanceof Spaceship) {
        return false;
      }
    }
    return true;
  }
  shootOutBack() {
    if(this.cooldown >= this.reload) {
      let angle = -Math.PI/2+(Math.random()-0.5)*Math.PI*1.4; 
      new EnemyBullet(this.pos.x+this.gunPos.x,this.pos.y+this.gunPos.y,Math.cos(angle)*5,Math.sin(angle)*5);
      this.cooldown -= 3;
    }
    if(this.cooldown2 >= this.reload2) {
      let angle = -Math.PI/2+(Math.random()-0.5)*Math.PI*1.4; 
      new EnemyBullet(this.pos.x+this.gunPos2.x,this.pos.y+this.gunPos2.y,Math.cos(angle)*5,Math.sin(angle)*5);
      this.cooldown2 -= 3;
    }
  }
		
  spreadShoot(gun1,gun2) {
    if(this.cooldown >= this.reload && gun1) {
      for(let i = 0; i < 5; i++) {
        let angle = this.gunAngle+Math.PI/8*(i-2)+(Math.random()-0.5)*Math.PI/60; 
        new EnemyBullet(this.pos.x+this.gunPos.x,this.pos.y+this.gunPos.y,Math.cos(angle)*5,Math.sin(angle)*5);
        
      }
      this.cooldown -= this.reload;
    }
    if(this.cooldown2 >= this.reload2 && gun2) {
      for(let i = 0; i < 5; i++) {
        let angle = this.gunAngle2+Math.PI/8*(i-2)+(Math.random()-0.5)*Math.PI/60; 
        new EnemyBullet(this.pos.x+this.gunPos2.x,this.pos.y+this.gunPos2.y,Math.cos(angle)*5,Math.sin(angle)*5);
        
      }
      this.cooldown2 -= this.reload2;
    }
  }
  spamShoot(gun1,gun2) {
    if(this.cooldown >= this.reload && gun1) {
      let angle = Math.sin(this.spamDir/10)*Math.PI/4+this.gunAngle+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x+this.gunPos.x,this.pos.y+this.gunPos.y,Math.cos(angle)*5,Math.sin(angle)*5);
      
      this.cooldown -= 7;
    }
    if(this.cooldown2 >= this.reload2 && gun2) {
      let angle = Math.sin(this.spamDir2/10)*Math.PI/4+this.gunAngle2+(Math.random()-0.5)*Math.PI/60; 
      new EnemyBullet(this.pos.x+this.gunPos2.x,this.pos.y+this.gunPos2.y,Math.cos(angle)*5,Math.sin(angle)*5);
      
      this.cooldown2 -= 7;
    }
  }
  splitShoot(gun1,gun2) {
    if(this.cooldown >= this.reload && gun1) {
      let angle = this.gunAngle+(Math.random()-0.5)*Math.PI/60; 
      new Splitter(this.pos.x+this.gunPos.x,this.pos.y+this.gunPos.y,Math.cos(angle)*5,Math.sin(angle)*5,20);
      
      this.cooldown -= 100;
    }
    if(this.cooldown2 >= this.reload2 && gun2) {
      let angle = this.gunAngle2+(Math.random()-0.5)*Math.PI/60; 
      new Splitter(this.pos.x+this.gunPos2.x,this.pos.y+this.gunPos2.y,Math.cos(angle)*5,Math.sin(angle)*5,20);
      
      this.cooldown2 -= 100;
    }
  }
  makeRocket() {
    if(this.cooldown >= this.reload) {
      let angle = -Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
      new Missile(this.pos.x+this.gunPos.x,this.pos.y+this.gunPos.y,0,4,6);
      
      this.cooldown -= 100;
    }
    if(this.cooldown2 >= this.reload2) {
      let angle = -Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
      new Missile(this.pos.x+this.gunPos2.x,this.pos.y+this.gunPos2.y,0,4,6);
      
      this.cooldown2 -= 100;
    }
  }
  charge() {
    this.attackCooldown -= 400;
    this.mode = "CHARGE";
  }
  split() {
    if(this.phase === 1) {
      this.attackCooldown -= this.attackReload;
      this.mode = "splitter";
      this.cooldown -= 100;
      this.cooldown2 -= 50;
      this.modeLength = 400;
    }
  }
	spread(gun1, gun2) {
    if(this.phase === 1) {
      this.attackCooldown -= this.attackReload;
      this.mode = "spreader";
      this.cooldown -= this.reload;
      this.cooldown2 -= this.reload2/2;
      this.modeLength = 400;
    } else if(gun1) {
      this.attackCooldown -= this.attackReload/5+Math.random()*100;
      this.mode = "spreader";
      this.cooldown -= this.reload;
      this.modeLength = 200;
    } else if(gun2) {
      this.attackCooldown2 -= this.attackReload/5+Math.random()*100;
      this.mode2 = "spreader";
      this.cooldown2 -= this.reload2/2;
      this.modeLength2 = 200;
    }
  }
  rocket() {
    if(this.phase === 1) {
      this.attackCooldown -= this.attackReload;
      this.mode = "rocket";
      this.cooldown -= 100;
      this.cooldown2 -= 50;
      this.modeLength = 400;
    }
  }
  spam(gun1, gun2) {
    if(this.phase === 1) {
      this.attackCooldown -= this.attackReload;
    
      this.mode = "spam";
      this.cooldown -= 1;
      this.cooldown2 -= 2;
      this.spamDir = Math.random()*20*Math.PI;
      this.spamDir2 = Math.random()*20*Math.PI;
      this.modeLength = 400;
    } else if(gun1) {
      this.attackCooldown -= this.attackReload/5+Math.random()*100;
    
      this.mode = "spam";
      this.cooldown -= 1;
      this.spamDir = Math.random()*20*Math.PI;
      this.modeLength = 200;
    } else if(gun2) {
      this.attackCooldown2 -= this.attackReload/5+Math.random()*100;
    
      this.mode2 = "spam";
      this.cooldown2 -= 1;
      this.spamDir2 = Math.random()*20*Math.PI;
      this.modeLength2 = 200;
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
    if(this.phase === 2 || this.mode === "idle" || this.mode === "spreader" || this.mode === "spam" || this.mode === "rocket" || this.mode === "splitter") {
      this.gunAngle = p5.Vector.sub(player.pos,p5.Vector.add(this.pos,this.gunPos)).heading();
      this.gunAngle2 = p5.Vector.sub(player.pos,p5.Vector.add(this.pos,this.gunPos2)).heading();
      this.speed = 2;
      if(this.pos.x > player.pos.x) {
        this.v.x -= this.accel;
      }
      if(this.pos.x < player.pos.x) {
        this.v.x += this.accel;
      }
      if(this.pos.y > 0) {
        this.v.y -= this.accel;
      }
      if(this.pos.y < 0) {
        this.v.y += this.accel;
      }
      if(this.phase === 1) {
        if(this.mode === "spreader") {
          this.spreadShoot(true,true);
          this.modeLength--;
          if(this.modeLength <= 0) {
            this.mode = "idle";
          }
        } else if(this.mode === "rocket") {
          this.makeRocket();
          this.modeLength--;
          if(this.modeLength <= 0) {
            this.mode = "idle";
          }
        } else if(this.mode === "spam") {
          this.spamShoot(true,true);
          this.modeLength--;
          this.spamDir++;
          this.spamDir2++;
          if(this.modeLength <= 0) {
            this.mode = "idle";
          }
        } else if(this.mode === "splitter") {
          this.splitShoot(true,true);
          this.modeLength--;
          if(this.modeLength <= 0) {
            this.mode = "idle";
          }
        } else {
          this.attack();
        }
      } else if(this.phase === 2) {
        if(this.mode === "spreader") {
          this.spreadShoot(true,false);
          this.modeLength--;
          if(this.modeLength <= 0) {
            this.mode = "idle";
          }
        } else if(this.mode === "spam") {
          this.spamShoot(true,false);
          this.modeLength--;
          this.spamDir++;
          if(this.modeLength <= 0) {
            this.mode = "idle";
          }
        } else {
          this.attack(true,false);
        }
        if(this.mode2 === "spreader") {
          this.spreadShoot(false,true);
          this.modeLength2--;
          if(this.modeLength2 <= 0) {
            this.mode2 = "idle";
          }
        } else if(this.mode2 === "spam") {
          this.spamShoot(false,true);
          this.modeLength2--;
          this.spamDir2++;
          if(this.modeLength2 <= 0) {
            this.mode2 = "idle";
          }
        } else {
          this.attack(false,true);
        }
      }
    } else if(this.mode === "CHARGE") {
      this.speed = 4;
      this.v.y += this.accel;
      this.shootOutBack();
      if(this.pos.y > canvas.height+50) {
        this.mode = "idle";
        this.pos.y = -50;
      }
    }
    this.attackCooldown++;
    if(this.phase === 2) {
      this.attackCooldown2++;
    }
    this.cooldown++;
    this.cooldown2++;
    if(this.attackCooldown > this.attackReload) {
      this.attackCooldown = this.attackReload;
    }
    if(this.cooldown > this.reload) {
      this.cooldown = this.reload;
    }
    if(this.cooldown2 > this.reload2) {
      this.cooldown2 = this.reload2;
    }
    if(this.health < 50 && this.phase < 2) {
      this.phase = 2;
      this.attackCooldown = 500;
    }
    if(this.dead) {
      new RedParticle(this.pos.x,this.pos.y,120,200);
    }
  }
  show() {
    fill(255,0,0);	
    noStroke();
    push();
    translate(this.pos.x,this.pos.y);
    beginShape();
    vertex(100, 0);
    vertex(100, 20);
    vertex(0, 40);
    vertex(-100, 20);
    vertex(-100, 0);
    endShape(CLOSE);
    pop();
  }
}