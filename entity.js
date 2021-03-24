class Entity {
	constructor(x,y,vx,vy,health,speed,accel,radius) {
		this.pos = new p5.Vector(x,y);
		this.v = new p5.Vector(vx,vy);
		this.health = health;
		this.speed = speed;
		this.accel = accel;
		this.radius = radius;
		this.dead = false;
		this.friendly = false;
		this.damagable = true;
		entities.push(this);
  }
  move() {
  
    this.v.limit(this.speed);
    this.pos.add(this.v);
  }
  show() {
    
  }
}
Entity.prototype.update = function() {
	this.collide();
  if (this.health <= 0) {
		this.dead = true;
	}
	this.move();
	this.show();
	
}
Entity.prototype.collide = function() {
	for(let i = 0; i < entities.length; i++) {
		if(this.friendly || this.dead) {
			break;
		}
		if(p5.Vector.sub(entities[i].pos,this.pos).mag() <= entities[i].radius+this.radius && 
    !entities[i].dead && entities[i].friendly && !(entities[i] instanceof Health) && 
    !entities[i].invincible && !(!this.damagable && !entities[i].damagable)) {
			this.health--;
			entities[i].health--;
      if(entities[i] instanceof Player) {
        entities[i].invincible = true;
				entities[i].iframe = 100;
      }
		}
	}
}