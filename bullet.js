class Bullet extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,1,Infinity,0,3);
		this.damagable = false;
	}
  move() {
    super.move();
    if (this.pos.x < 0) {
      this.dead = true;
    }
    if (this.pos.x > canvasX) {
      this.dead = true;
    }
    if (this.pos.y < 0) {
      this.dead = true;
    }
    if (this.pos.y > canvasY) {
      this.dead = true;
    }
  }
}
class FriendlyBullet extends Bullet {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy);
		this.friendly = true;
  }
  move() {
    super.move();
  }
  show() {
    strokeWeight(1);
    stroke(255);
    push();
    translate(this.pos.x,this.pos.y);
    
    line(-this.v.x*2,-this.v.y*2,this.v.x*2,this.v.y*2);
    pop();
  }
}
class EnemyBullet extends Bullet {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy);
		this.friendly = false;
  }
  move() {
    super.move();
  }
  show() {
    strokeWeight(1);
    stroke(255,0,0);
    push();
    translate(this.pos.x,this.pos.y);
    
    line(-this.v.x*2,-this.v.y*2,this.v.x*2,this.v.y*2);
    pop();
  }
}

class LaserSegment extends Entity {
	constructor(x,y,size) {
		super(x,y,0,0,1,Infinity,0,size);
		this.aliveForOneFrame = false;
		this.damagable = false;
  }
  move() {
    this.aliveForOneFrame = true;
    if(this.aliveForOneFrame) {
      this.health = 0;
    }
  }
  show() {
    
	}
}

class Splitter extends EnemyBullet {
	constructor(x,y,vx,vy,bullets) {
		super(x,y,vx,vy);
    this.bullets = bullets;
  }
  move() {
    this.pos.add(this.v);
    if (this.pos.x < 0) {
      this.dead = true;
      this.pos.x = 0;
    }
    if (this.pos.x > canvasX) {
      this.dead = true;
      this.pos.x = canvasX;
    }
    if (this.pos.y < 0) {
      this.dead = true;
      this.pos.y = 0;
    }
    if (this.pos.y > canvasY) {
      this.dead = true;
      this.pos.y = canvasY;
    }
  }
  show() {
    noStroke();
    fill(255,0,0);
    push();
    translate(this.pos.x,this.pos.y);
    circle(0, 0, 10);
    pop();
	}
}

class Telebullet extends EnemyBullet {
	constructor(x,y,vx,vy,owner,targ) {
		super(x,y,vx,vy);
		this.owner = owner;
		this.targ = targ;
    this.countdown = Infinity;
  }
  move() {
    super.move();
    if(this.dead) {
      this.owner.pos = this.pos.copy();
    }
    if(p5.Vector.sub(this.targ,this.pos).mag() <= 5+this.radius) {
      this.countdown = 5
    }
    if(this.countdown <= 0) {
      this.owner.pos = this.targ.copy();
      this.dead = true;
    }
    this.countdown--;
  }
  show() {
    noStroke();
    fill(0,0,255);
    push();
    translate(this.pos.x,this.pos.y);
    circle(0, 0, 10);
    pop();
  }
}

function bulletCircle(xPos,yPos,amount) {
  let pos = new p5.Vector(xPos,yPos);
  let angle2 = p5.Vector.sub(player.pos,pos).heading();
	for(let i = 0; i < amount; i++) {
    let angle = angle2 + Math.PI/amount*2*i+(Math.random()-0.5)*Math.PI/60; 
		if(xPos+Math.cos(angle)*5 >= 0 && yPos+Math.sin(angle)*5 >= 0 && xPos+Math.cos(angle)*5 <= canvas.width && yPos+Math.sin(angle)*5 <= canvas.height) {
      new EnemyBullet(xPos+Math.cos(angle)*5,yPos+Math.sin(angle)*5,Math.cos(angle)*5,Math.sin(angle)*5);
    }
	}
}

Telebullet.prototype.collide = function() {
	for(let i = 0; i < entities.length; i++) {
		if(this.friendly || this.dead) {
			break;
		}
		if(p5.Vector.sub(entities[i].pos,this.pos).mag() <= entities[i].radius+this.radius && !entities[i].dead && entities[i].friendly && !entities[i].invincible && !(!this.damagable && !entities[i].damagable)) {
			entities[i].pos = this.owner.pos.copy();
      this.health--;
			entities[i].health--;
      if(entities[i] instanceof Player) {
        entities[i].invincible = true;
				entities[i].iframe = 100;
      }
		}
	}
}


class Skimmer extends EnemyBullet {
	constructor(x,y,vx,vy,reload) {
		super(x,y,vx,vy,1,Infinity,0,3);
    this.angle = this.v.heading();
    this.reload = reload;
    this.cooldown = 0;
    this.pos.add(this.v);
  }
  move() {
    super.move();
    if (this.pos.x < 0) {
      this.dead = true;
      this.pos.x = 0;
    }
    if (this.pos.x > canvasX) {
      this.dead = true;
      this.pos.x = canvasX;
    }
    if (this.pos.y < 0) {
      this.dead = true;
      this.pos.y = 0;
    }
    if(this.pos.y > canvasY) {
      this.dead = true;
      this.pos.y = canvasY;
    }
    this.cooldown++;
    if(this.cooldown >= this.reload) {
      new EnemyBullet(this.pos.x, this.pos.y, Math.cos(this.angle+Math.PI/2)*5, Math.sin(this.angle+Math.PI/2)*5);
      new EnemyBullet(this.pos.x, this.pos.y, Math.cos(this.angle-Math.PI/2)*5, Math.sin(this.angle-Math.PI/2)*5);
      this.cooldown = 0;
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
    vertex(3, 0);
    vertex(0, 10);
    vertex(0, -10);
    endShape(CLOSE);
    pop();
  }
}

class Mine extends Entity {
	constructor(x,y,vx,vy,bullets) {
		super(x,y,vx,vy,1,2,0,5);
    this.angle = Math.random()*Math.PI*2;
    this.bullets = bullets;
  }
  move() {
    super.move();
    if(this.pos.x < 0) {
      this.pos.x = 0;
      this.v.x = -this.v.x;
    }
    if(this.pos.x > canvasX) {
      this.pos.x  = canvasX;
      this.v.x = -this.v.x;
    }
    if(this.pos.y < 0) {
      this.pos.y = 0;
      this.v.y = -this.v.y;
    }
    if(this.pos.y > canvasY) {
      this.pos.y = canvasY;
      this.v.y = -this.v.y;
    }
    this.angle += Math.PI/100;
  }
  show() {
    fill(255,0,0);	
    noStroke();
    let angle = this.angle;      
    push();
    translate(this.pos.x,this.pos.y);
    rotate(angle);
    beginShape();
    vertex(5, 5);
    vertex(5, -5);
    vertex(-5, -5);
    vertex(-5, 5);
    endShape(CLOSE);
    pop();
	}
}


class DelayBullet extends EnemyBullet {
	constructor(x,y,vx,vy,angle,life) {
		super(x,y,vx,vy,1,Infinity,0,3);
    this.angle = angle;
    this.life = life;
  }
  move() {
    super.move();
    if (this.pos.x < 0) {
      this.dead = true;
    }
    if (this.pos.x > canvasX) {
      this.dead = true;
    }
    if (this.pos.y < 0) {
      this.dead = true;
    }
    if (this.pos.y > canvasY) {
      this.dead = true;
    }
    this.life--;
    if(this.life <= 0) {
      new EnemyBullet(this.pos.x, this.pos.y, Math.cos(this.angle)*5, Math.sin(this.angle)*5);
      this.dead = true;
    }
  }
  
  show() {
    strokeWeight(1);
    stroke(255,0,0);
    push();
    translate(this.pos.x,this.pos.y);
    
    line(-this.v.x*10/this.v.mag(),-this.v.y*10/this.v.mag(),this.v.x*10/this.v.mag(),this.v.y*10/this.v.mag());
    pop();
  }
}

class Missile extends Entity {
	constructor(x,y,vx,vy,bullets) {
		super(x,y,vx,vy,1,4,0.2,5);
		this.angle = new p5.Vector(vx,vy).heading();
		this.vangle = Math.PI/60;
    this.bullets = bullets;
	}
  move() {
    super.move();
    let playerAngle = p5.Vector.sub(player.pos,this.pos).heading();
    this.angle = this.angle % (Math.PI*2);
    if((this.angle-playerAngle+Math.PI*2)%(Math.PI*2)>Math.PI) {
      this.angle += this.vangle;
    } else {
      this.angle -= this.vangle;
    }
    
    let randy = (Math.random()-0.5)*Math.PI/5;
    this.v.add(p5.Vector.fromAngle(this.angle+randy).mult(this.accel));
    if (this.pos.x < 0) {
      this.dead = true;
    }
    if (this.pos.x > canvasX) {
      this.dead = true;
    }
    if (this.pos.y < 0) {
      this.dead = true;
    }
    if (this.pos.y > canvasY) {
      this.dead = true;
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
    vertex(2.5, 2.5);
    vertex(-7.5, 2.5);
    vertex(-10, 5);
    vertex(-10, -5);
    vertex(-7.5, -2.5);
    vertex(2.5, -2.5);
    endShape(CLOSE);
    pop();
	}
}