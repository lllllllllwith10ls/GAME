class Spaceship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,2,0.1,5);
		this.angle = 0;
		this.reload = 60;
		this.cooldown = Math.random()*60;
		this.ais = ["Charger","Circler","Coward","Hit n run","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
    this.target = new p5.Vector(0,0);
		if(this.ai === "Circler") {
			let array = ["clockwise","counterclockwise"];
			this.mode = array[Math.floor(Math.random()*array.length)];
			this.modeLength = Math.random()*300;
		} else if(this.ai === "Coward") {
			this.mode = "attack";
			this.modeLength = 0;
		} else if(this.ai === "Hit n run") {
			this.mode = "idle";
			this.modeLength = Math.random()*120;
		}
  }
  shoot() {
    if(this.cooldown >= this.reload) {
			let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
			new EnemyBullet(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5);
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
      this.pos.x = canvasX;
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
    if(this.ai === "Charger") {
      this.target = player.pos.copy();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      
      this.shoot();
    
    } else if(this.ai === "Circler") {
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
    } else if( this.ai === "Hit n run") {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      if(this.mode === "idle") {
        if(distance < 100) {
          let difference = p5.Vector.sub(player.pos,this.pos);
          difference.mult(-1);          
          this.target = p5.Vector.add(this.pos,difference);
          
        } else {          
          let vangle;
          if(this.v.x === 0 && this.v.y === 0) {
            vangle = Math.random()*Math.PI*2;
          } else {
            vangle = Math.atan2(this.v.x,this.v.y);
          }
          let angle = this.angle;
          this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
        }
        this.modeLength--;
      }
      if(this.modeLength <= 0 && this.mode === "idle") {
        this.mode = "hit";
      }
      if(this.mode === "hit") {
        this.target = player.pos.copy();
      }
      if(distance < 25 && this.mode === "hit") {
        this.mode = "run";
        this.modeLength = Math.random()*60;
      }
      if(this.mode === "run") {
        let difference = p5.Vector.sub(player.pos,this.pos);
        difference.mult(-1);          
        this.target = p5.Vector.add(this.pos,difference);
        this.modeLength--;
      }
      if(this.modeLength <= 0 && this.mode === "run") {
        this.mode = "idle";
        this.modeLength = Math.random()*120;
      }
      this.shoot();
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
    vertex(5, 0);
    vertex(-7.5, 5);
    vertex(-7.5, -5);
    endShape(CLOSE);
    pop();
  }
}

class Fastship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,3,3,0.1,5);
		this.angle = 0;
		this.reload = 90;
		this.cooldown = Math.random()*90;
		this.ais = ["Charger","Circler","Coward","Hit n run","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
    this.target = new p5.Vector(0,0);
		if(this.ai === "Circler") {
			let array = ["clockwise","counterclockwise"];
			this.mode = array[Math.floor(Math.random()*array.length)];
			this.modeLength = Math.random()*300;
		} else if(this.ai === "Coward") {
			this.mode = "attack";
			this.modeLength = 0;
		} else if(this.ai === "Hit n run") {
			this.mode = "idle";
			this.modeLength = Math.random()*120;
		}
  }
  shoot() {
    if(this.cooldown >= this.reload) {
			let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
			new EnemyBullet(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5);
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
      this.pos.x = canvasX;
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
    if(this.ai === "Charger") {
      this.target = player.pos.copy();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      
      this.shoot();
    
    } else if(this.ai === "Circler") {
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
    } else if( this.ai === "Hit n run") {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      if(this.mode === "idle") {
        if(distance < 100) {
          let difference = p5.Vector.sub(player.pos,this.pos);
          difference.mult(-1);          
          this.target = p5.Vector.add(this.pos,difference);
          
        } else {          
          let vangle;
          if(this.v.x === 0 && this.v.y === 0) {
            vangle = Math.random()*Math.PI*2;
          } else {
            vangle = Math.atan2(this.v.x,this.v.y);
          }
          let angle = this.angle;
          this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
        }
        this.modeLength--;
      }
      if(this.modeLength <= 0 && this.mode === "idle") {
        this.mode = "hit";
      }
      if(this.mode === "hit") {
        this.target = player.pos.copy();
      }
      if(distance < 25 && this.mode === "hit") {
        this.mode = "run";
        this.modeLength = Math.random()*60;
      }
      if(this.mode === "run") {
        let difference = p5.Vector.sub(player.pos,this.pos);
        difference.mult(-1);          
        this.target = p5.Vector.add(this.pos,difference);
        this.modeLength--;
      }
      if(this.modeLength <= 0 && this.mode === "run") {
        this.mode = "idle";
        this.modeLength = Math.random()*120;
      }
      this.shoot();
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
    vertex(5, 0);
    vertex(-7.5, 5);
    vertex(-2.5, 0);
    vertex(-7.5, -5);
    endShape(CLOSE);
    pop();
  }
}
class Tripleship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,2,0.1,5);
		this.angle = 0;
		this.reload = 120;
		this.cooldown = Math.random()*120;
		this.ais = ["Charger","Circler","Coward","Hit n run","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
    this.target = new p5.Vector(0,0);
		if(this.ai === "Circler") {
			let array = ["clockwise","counterclockwise"];
			this.mode = array[Math.floor(Math.random()*array.length)];
			this.modeLength = Math.random()*300;
		} else if(this.ai === "Coward") {
			this.mode = "attack";
			this.modeLength = 0;
		} else if(this.ai === "Hit n run") {
			this.mode = "idle";
			this.modeLength = Math.random()*120;
		}
  }
  shoot() {
    if(this.cooldown >= this.reload) {
      for(let i = 0; i < 3; i++) {
        let angle = this.angle+Math.PI/6*(i-1)+(Math.random()-0.5)*Math.PI/60; 
        new EnemyBullet(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5);
      }
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
      this.pos.x = canvasX;
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
    if(this.ai === "Charger") {
      this.target = player.pos.copy();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      
      this.shoot();
    
    } else if(this.ai === "Circler") {
      let difference = p5.Vector.sub(player.pos,this.pos);
      let mag = difference.mag();
      let angle2;
      if(this.mode === "clockwise") {
        difference.rotate(Math.PI/2);
      } else {
        difference.rotate(-Math.PI/2);
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
    } else if( this.ai === "Hit n run") {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      let distance = p5.Vector.sub(player.pos,this.pos).mag();
      if(this.mode === "idle") {
        if(distance < 100) {
          let difference = p5.Vector.sub(player.pos,this.pos);
          difference.mult(-1);          
          this.target = p5.Vector.add(this.pos,difference);
          
        } else {          
          let vangle;
          if(this.v.x === 0 && this.v.y === 0) {
            vangle = Math.random()*Math.PI*2;
          } else {
            vangle = Math.atan2(this.v.x,this.v.y);
          }
          let angle = this.angle;
          this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
        }
        this.modeLength--;
      }
      if(this.modeLength <= 0 && this.mode === "idle") {
        this.mode = "hit";
      }
      if(this.mode === "hit") {
        this.target = player.pos.copy();
      }
      if(distance < 25 && this.mode === "hit") {
        this.mode = "run";
        this.modeLength = Math.random()*60;
      }
      if(this.mode === "run") {
        let difference = p5.Vector.sub(player.pos,this.pos);
        difference.mult(-1);          
        this.target = p5.Vector.add(this.pos,difference);
        this.modeLength--;
      }
      if(this.modeLength <= 0 && this.mode === "run") {
        this.mode = "idle";
        this.modeLength = Math.random()*120;
      }
      this.shoot();
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
    vertex(5, 0);
    vertex(-7.5, 5);
    vertex(-7.5, -5);
    endShape(CLOSE);
    beginShape();
    vertex(-7.5, 0);
    vertex(-10, -2);
    vertex(-10, 2);
    endShape(CLOSE);
    pop();
  }
}