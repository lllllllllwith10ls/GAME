class Player extends Entity {
	constructor(x,y,vx,vy) {
    super(x,y,vx,vy,5,2.5,0.1,5);
		this.friendly = true;
		this.damagable = true;
    this.reload = 10;
    this.cooldown = 10;
    this.invincible = false;
    this.iframe = 0;
  }
	move() {
    super.move();
    if (keys[87]) {
      this.v.y -= this.accel;
    }
    if (keys[65]) {
      this.v.x -= this.accel;
    } 
    if (keys[83]) {
      this.v.y += this.accel;
    }
    if (keys[68]) {
      this.v.x += 0.1;
    }
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.v.x = -this.v.x * 1/2;
    }
    if (this.pos.x > canvasX) {
      this.pos.x  = canvasX;
      this.v.x = -this.v.x * 1/2;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.v.y = -this.v.y * 1/2;
    }
    if (this.pos.y > canvasY) {
      this.pos.y = canvasY;
      this.v.y = -player.v.y * 1/2;
    }
    this.cooldown++;
    if(this.cooldown > this.reload) {
      this.cooldown = this.reload;
    }
    this.iframe--;
    if(this.iframe < 0) {
      this.iframe = 0;
      this.invincible = false;
    } else {
      this.invincible = true;
    }
    for(let i = 0; i < entities.length; i++) {
      if(p5.Vector.sub(entities[i].pos,this.pos).mag() <= entities[i].radius+this.radius && !entities[i].dead && entities[i] instanceof Health) {
        this.health++;
        entities[i].health--;
        if(entities[i] instanceof Player) {
          entities[i].invincible = true;
          entities[i].iframe = 100;
        }
      }
    }
  }
	show() {
    if(this.iframe % 4 <= 3 && this.iframe % 4 >= 2) {
      fill(0);
    } else {
      fill(255);	
    }
    noStroke();
    this.angle = p5.Vector.sub(new p5.Vector(mouseX,mouseY),this.pos).heading();
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
	shoot() {
    if(this.cooldown >= this.reload) {
			let angle = this.angle+(Math.random()-0.5)*Math.PI/60; 
			new FriendlyBullet(this.pos.x,this.pos.y,Math.cos(angle)*5,Math.sin(angle)*5);
			this.cooldown -= this.reload;
		}
  }
};


class Health extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,1,1,0,10);
		this.friendly = false;
		this.damagable = false;
		let angle = Math.random()*2*Math.PI;
		this.v.x = Math.sin(angle);
		this.v.y = Math.cos(angle);
		this.angle = Math.random()*2*Math.PI;
		this.move = function() {
			this.pos.add(this.v);
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
		this.show = function() {
      fill(0,255,0);
      noStroke();
      let angle = this.angle;      
      push();
      translate(this.pos.x,this.pos.y);
      rotate(angle);
      beginShape();
      vertex(5, 2);
      vertex(2, 2);
      vertex(2, 5);
      vertex(-2, 5);
      vertex(-2, 2);
      vertex(-5, 2);
      vertex(-5, -2);
      vertex(-2, -2);
      vertex(-2, -5);
      vertex(2, -5);
      vertex(2, -2);
      vertex(5, -2);
      endShape(CLOSE);
      pop();
		}
	}
}