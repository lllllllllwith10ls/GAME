class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
	get abs() {
		return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
	};
	
	static add(a,b) {
		let x = a.x + b.x;
		let y = a.y + b.y;
		return new Vector(x,y);
	};
	static sub(a,b) {
		let x = a.x - b.x;
		let y = a.y - b.y;
		return new Vector(x,y);
	};
}
Vector.prototype.add = function(b) {
	this.x += b.x;
	this.y += b.y;
};
Vector.prototype.sub = function(b) {
	this.x -= b.x;
	this.y -= b.y;
};
Vector.prototype.times = function(b) {
	this.x *= b;
	this.y *= b;
};
let player = {
	pos: new Vector(500,500),
	v: new Vector(0,0),
	cooldown: 0,
	reload: 10,
	health: 5,
	invincible: false,
	iframe: 0,
	show: function() {
		if (keys[87]) {
			this.v.y -= 0.1;
		}
		if (keys[65]) {
			this.v.x -= 0.1;
		} 
		if (keys[83]) {
			this.v.y += 0.1;
		}
		if (keys[68]) {
			this.v.x += 0.1;
		}
		if (this.pos.x < 0) {
			this.pos.x  = 0;
			this.v.x = -this.v.x * 1/2;
		}
		if (this.pos.x > 1000) {
			this.pos.x  = 1000;
			this.v.x = -this.v.x * 1/2;
		}
		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.v.y = -this.v.y * 1/2;
		}
		if (this.pos.y > 1000) {
			this.pos.y = 1000;
			this.v.y = -player.v.y * 1/2;
		}
		if (this.v.abs > 2.5) {
			let angle = -Math.atan2(this.v.y,this.v.x)+Math.PI/2;
			this.v.x = Math.sin(angle)*2.5;
			this.v.y = Math.cos(angle)*2.5;

		}
		this.pos.add(player.v);
		this.collide();
		this.angle = -Math.atan2(this.pos.y-mouse.pos.y,this.pos.x-mouse.pos.x)-Math.PI/2;
		let angle = this.angle;
		let x1 = Math.sin(angle)*5+this.pos.x;
		let y1 = Math.cos(angle)*5+this.pos.y;
		let x2 = Math.sin(angle+Math.PI-Math.atan(5/12.5))*Math.sqrt(156.25+25)+x1;
		let y2 = Math.cos(angle+Math.PI-Math.atan(5/12.5))*Math.sqrt(156.25+25)+y1;
		let x3 = Math.sin(angle-Math.PI/2)*10+x2;
		let y3 = Math.cos(angle-Math.PI/2)*10+y2;
		if(this.iframe % 4 <= 3 && this.iframe % 4 >= 2) {
			ctx.fillStyle = "#000000";
		} else {
			ctx.fillStyle = "#FFFFFF";	
		}
		ctx.lineWidth = 0.01;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.lineTo(x3,y3);
		ctx.lineTo(x1,y1);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	},
	collide: function() {
		for(let i = 0; i < entities.length; i++) {
			if(this.invincible) {
				this.iframe--;
				break;
			}
			if(Vector.sub(entities[i].pos,this.pos).abs <= entities[i].radius+5 && !entities[i].dead && !entities[i].friendly) {
				this.health--;
				entities[i].health--;
				this.invincible = true;
				this.iframe = 100;
				
			}
		}
		if(this.iframe <= 0) {
			this.invincible = false;
		}
	}
};
let entities = [];
class Entity {
	constructor(x,y,vx,vy,health,speed,accel,radius) {
		this.pos = new Vector(x,y);
		this.v = new Vector(vx,vy);
		this.health = health;
		this.speed = speed;
		this.accel = accel;
		this.radius = radius;
		this.dead = false;
		this.friendly = false;
		this.damagable = true;
		this.move = function() {
		
		}
		this.show = function() {
			
		}
		entities.push(this);
	}
}
Entity.prototype.update = function() {
	if (this.v.abs > this.speed) {
		let angle = -Math.atan2(this.v.y,this.v.x)+Math.PI/2;
		this.v.x = Math.sin(angle)*this.speed;
		this.v.y = Math.cos(angle)*this.speed;

	}
	if (this.health <= 0) {
		this.dead = true;
	}
	this.collide();
	this.move();
	this.show();
	
}
Entity.prototype.collide = function() {
	for(let i = 0; i < entities.length; i++) {
		if(this.friendly || this.dead || !this.damagable) {
			break;
		}
		if(Vector.sub(entities[i].pos,this.pos).abs <= entities[i].radius+this.radius && !entities[i].dead && entities[i].friendly) {
			this.health--;
			entities[i].health--;
		}
	}
}
class Bullet extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,1,5,0,3);
		this.friendly = true;
		this.damagable = false;
		this.move = function() {
			this.pos.add(this.v);
			if (this.pos.x < 0) {
				this.dead = true;
			}
			if (this.pos.x > 1000) {
				this.dead = true;
			}
			if (this.pos.y < 0) {
				this.dead = true;
			}
			if (this.pos.y > 1000) {
				this.dead = true;
			}
		}
		this.show = function() {
			ctx.strokeStyle = "#FFFFFF";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.pos.x-this.v.x*2,this.pos.y-this.v.y*2);
			ctx.lineTo(this.pos.x+this.v.x*2,this.pos.y+this.v.y*2);
			ctx.stroke();
			ctx.closePath();
		}
	}
}
class EnemyBullet extends Entity {
	constructor(x,y,vx,vy,h,s,a,r) {
		super(x,y,vx,vy,h,s,a,r);
		this.damagable = false;
		this.move = function() {
		}
		this.show = function() {
		}
	}
}
class LaserThing extends EnemyBullet {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,1,5,0,3);
		this.move = function() {
			this.pos.add(this.v);
			if (this.pos.x < 0) {
				this.dead = true;
			}
			if (this.pos.x > 1000) {
				this.dead = true;
			}
			if (this.pos.y < 0) {
				this.dead = true;
			}
			if (this.pos.y > 1000) {
				this.dead = true;
			}
		}
		this.show = function() {
			ctx.strokeStyle = "#FF0000";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.pos.x-this.v.x*2,this.pos.y-this.v.y*2);
			ctx.lineTo(this.pos.x+this.v.x*2,this.pos.y+this.v.y*2);
			ctx.stroke();
			ctx.closePath();
		}
	}
}
class LaserSegment extends EnemyBullet {
	constructor(x,y) {
		super(x,y,0,0,Infinity,0,0,3);
		
		this.show = function() {
			this.health = 0;
		}
	}
}
class Spaceship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,2,0.1,5);
		this.angle = 0;
		this.reload = 120;
		this.cooldown = Math.random()*120;
		this.ais = ["Charger","Circler","Coward","Hit n run","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
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
		this.shoot = function() {
			if(this.cooldown >= this.reload) {
				let angle = this.angle+Math.PI; 
				new LaserThing(this.pos.x,this.pos.y,-Math.sin(angle)*2,-Math.cos(angle)*2);
				this.cooldown -= this.reload;
			}
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > 1000) {
				this.pos.x  = 1000;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > 1000) {
				this.pos.y = 1000;
				this.v.y = -this.v.y * 1/2;
			}
			this.cooldown++;
			if(this.cooldown > this.reload) {
				this.cooldown = this.reload;
			}
			if(this.ai === "Charger") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let angle = this.angle;
				let randy = Math.random()-0.5*Math.PI/5;
				this.v.x += Math.sin(angle+randy) * this.accel;
				this.v.y += Math.cos(angle+randy) * this.accel;
				this.pos.add(this.v);
				this.shoot();
			} else if(this.ai === "Circler") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let distance = Vector.sub(player.pos,this.pos).abs;
				let angle2;
				if(this.mode === "clockwise") {
					angle2 = this.angle+Math.PI/2;
				} else {
					angle2 = this.angle-Math.PI/2;
				}
				let angle = this.angle;
				this.v.x += Math.sin(angle) * this.accel + Math.sin(angle2) * this.accel;
				this.v.y += Math.cos(angle) * this.accel + Math.cos(angle2) * this.accel;
				this.modeLength --;
				if(this.modeLength <= 0) {
					if(this.mode === "clockwise") {
						this.mode = "counterclockwise";
					} else {
						this.mode = "clockwise";
					}
					this.modeLength = Math.random()*300;
				}
				this.pos.add(this.v);
				this.shoot();
			} else if(this.ai === "Coward") {
				let distance = Vector.sub(player.pos,this.pos).abs;
				if(distance < 200) {
					this.mode = "run";
					this.modeLength = Math.random()*60;
				}
				if(this.mode === "run") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y)+Math.PI;
					let angle = this.angle;
					this.v.x += Math.sin(angle) * this.accel;
					this.v.y += Math.cos(angle) * this.accel;
					this.modeLength--;
				}
				if(this.modeLength <= 0) {
					this.mode = "attack";
				}
				if(this.mode === "attack") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let vangle;
					if(this.v.x === 0 && this.v.y === 0) {
						vangle = Math.random()*Math.PI*2;
					} else {
						vangle = Math.atan2(this.v.x,this.v.y);
					}
					let randy = Math.random()-0.5*Math.PI/5;
					this.v.x += Math.sin((vangle+randy+this.angle)/2) * this.accel;
					this.v.y += Math.cos((vangle+randy+this.angle)/2) * this.accel;
					this.shoot();
					
				}
				this.pos.add(this.v);
			} else if( this.ai === "Hit n run") {
				let distance = Vector.sub(player.pos,this.pos).abs;
				if(this.mode === "idle") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let vangle;
					if(this.v.x === 0 && this.v.y === 0) {
						vangle = Math.random()*Math.PI*2;
					} else {
						vangle = Math.atan2(this.v.x,this.v.y);
					}
					let randy = Math.random()-0.5*Math.PI/5;
					if(distance < 100) {
						this.v.x += Math.sin((vangle+randy+this.angle+Math.PI)/2) * this.accel;
						this.v.y += Math.cos((vangle+randy+this.angle+Math.PI)/2) * this.accel;
					} else {
						
						this.v.x += Math.sin((vangle+randy+this.angle)/2) * this.accel;
						this.v.y += Math.cos((vangle+randy+this.angle)/2) * this.accel;
					}
					
					this.shoot();
					this.modeLength--;
				}
				if(this.modeLength <= 0 && this.mode === "idle") {
					this.mode = "hit";
				}
				if(this.mode === "hit") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let angle = this.angle;
					let randy = Math.random()-0.5*Math.PI/5;
					this.v.x += Math.sin(angle+randy) * this.accel;
					this.v.y += Math.cos(angle+randy) * this.accel;
					this.shoot();
				}
				if(distance < 75 && this.mode === "hit") {
					this.mode = "run";
					this.modeLength = Math.random()*60;
				}
				if(this.mode === "run") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y)+Math.PI;
					let angle = this.angle;
					this.v.x += Math.sin(angle) * this.accel;
					this.v.y += Math.cos(angle) * this.accel;
					this.modeLength--;
				}
				if(this.modeLength <= 0 && this.mode === "run") {
					this.mode = "idle";
					this.modeLength = Math.random()*120;
				}
				this.pos.add(this.v);
			} else if(this.ai === "Erratic") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let vangle;
				if(this.v.x === 0 && this.v.y === 0) {
					vangle = Math.random()*Math.PI*2;
				} else {
					vangle = Math.atan2(this.v.x,this.v.y);
				}
				let randy = Math.random()-0.5*Math.PI/5;
				
				this.v.x += Math.sin((vangle+randy+this.angle)/2) * this.accel;
				this.v.y += Math.cos((vangle+randy+this.angle)/2) * this.accel;
				
				this.pos.add(this.v);
				this.shoot();
			}
		}
		this.show = function() {
			let angle = this.angle;
			let x1 = Math.sin(angle)*5+this.pos.x;
			let y1 = Math.cos(angle)*5+this.pos.y;
			let x2 = Math.sin(angle+Math.PI-Math.atan(5/12.5))*Math.sqrt(156.25+25)+x1;
			let y2 = Math.cos(angle+Math.PI-Math.atan(5/12.5))*Math.sqrt(156.25+25)+y1;
			let x3 = Math.sin(angle-Math.PI/2)*10+x2;
			let y3 = Math.cos(angle-Math.PI/2)*10+y2;
			ctx.fillStyle = "#FF0000";
			ctx.lineWidth = 0.01;
			ctx.beginPath();
			ctx.moveTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.lineTo(x3,y3);
			ctx.lineTo(x1,y1);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}
}
class Chargeship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,2,0.1,5);
		this.angle = 0;
		this.reload = 300;
		this.cooldown = Math.random()*60;
		this.ais = ["Predictor","Flanker","Dodgy","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		this.mode = "idle";
		this.modeLength = 0;
		this.charge = function() {
			if(this.cooldown >= this.reload) {
				let angle = this.angle+Math.PI;
				this.speed = 3;
				this.v.x = -Math.sin(angle)*3;
				this.v.y = -Math.cos(angle)*3;
				this.cooldown -= this.reload;
				this.mode = "charge!";
				this.modeLength = 150;
			}
		}
		this.minicharge = function() {
			if(this.cooldown >= this.reload) {
				if(this.ai === "Dodgy" && this.dodge) {
					let randy;
					if(Math.random() < 0.5) {
						randy = 1;
					} else {
						randy = -1;
					}
					this.angle = Math.atan2(this.targ.pos.x-this.pos.x,this.targ.pos.y-this.pos.y)+Math.PI/2*randy;
					let angle = this.angle+Math.PI;
					this.speed = 3;
					this.v.x = -Math.sin(angle)*3;
					this.v.y = -Math.cos(angle)*3;
					this.cooldown -= 60;
					this.mode = "charge!";
					this.modeLength = 30;
				} else {
					this.angle += (Math.random()-0.5)*Math.PI;
					let angle = this.angle+Math.PI;
					this.speed = 3;
					this.v.x = -Math.sin(angle)*3;
					this.v.y = -Math.cos(angle)*3;
					this.cooldown -= 60;
					this.mode = "charge!";
					this.modeLength = 30;
				}
			}
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > 1000) {
				this.pos.x  = 1000;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > 1000) {
				this.pos.y = 1000;
				this.v.y = -this.v.y * 1/2;
			}
			this.cooldown++;
			if(this.cooldown > this.reload) {
				this.cooldown = this.reload;
			}
			if(this.mode === "charge!") {
				this.modeLength--;
				this.pos.add(this.v);
				if(this.modeLength <= 0) {
					
					this.speed = 2;
					this.mode = "idle";
				}
			} else if(this.ai === "Predictor") {
				this.angle = Math.atan2(player.pos.x+player.v.x*10-this.pos.x,player.pos.y+player.v.y*10-this.pos.y);
				let angle = this.angle;
				let randy = Math.random()-0.5*Math.PI/5;
				this.v.x += Math.sin(angle+randy) * this.accel;
				this.v.y += Math.cos(angle+randy) * this.accel;
				this.pos.add(this.v);
				if(Math.random() < 0.005) {
					this.minicharge();
				} else if(Math.random() < 0.01) {
					this.charge();
				}
			} else if(this.ai === "Flanker") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let angle = Math.atan2(player.pos.x-this.pos.x+Math.sin(player.angle+Math.PI),player.pos.y-this.pos.y+Math.cos(player.angle+Math.PI));
				let randy = Math.random()-0.5*Math.PI/5;
				this.v.x += Math.sin(angle+randy) * this.accel;
				this.v.y += Math.cos(angle+randy) * this.accel;
				this.pos.add(this.v);
				if(Math.random() < 0.005) {
					this.minicharge();
				} else if(this.angle <= player.angle+3*Math.PI/4 && this.angle >= player.angle-3*Math.PI/4) { 
					if(Math.random() < 0.01) {
						this.charge();
					}
				}
			} else if(this.ai === "Dodgy") {
				this.angle = Math.atan2(player.pos.x+player.v.x*3-this.pos.x,player.pos.y+player.v.y*3-this.pos.y);
				let angle = this.angle;
				let randy = Math.random()-0.5*Math.PI/5;
				this.v.x += Math.sin(angle+randy) * this.accel;
				this.v.y += Math.cos(angle+randy) * this.accel;
				this.pos.add(this.v);
				let dodge = false
				for(let i = 0; i < entities.length; i++) {
					if(Vector.sub(entities[i].pos,this.pos).abs <= entities[i].radius+this.radius*5 && !entities[i].dead && entities[i].friendly) {
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
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let angle = this.angle;
				let randy = Math.random()-0.5*Math.PI/5;
				this.v.x += Math.sin(angle+randy) * this.accel;
				this.v.y += Math.cos(angle+randy) * this.accel;
				this.pos.add(this.v);
				if(Math.random() < 0.02) {
					this.minicharge();
				} else if(Math.random() < 0.01) {
					this.charge();
				}
			}
		}
		this.show = function() {
			let angle = this.angle;
			let x1 = Math.sin(angle)*5+this.pos.x;
			let y1 = Math.cos(angle)*5+this.pos.y;
			let x2 = Math.sin(angle-Math.PI*3/4)*Math.sqrt(50)+x1;
			let y2 = Math.cos(angle-Math.PI*3/4)*Math.sqrt(50)+y1;
			let x3 = Math.sin(angle-Math.PI)*10+x2;
			let y3 = Math.cos(angle-Math.PI)*10+y2;
			let x4 = Math.sin(angle+Math.PI/4)*Math.sqrt(50)+x3;
			let y4 = Math.cos(angle+Math.PI/4)*Math.sqrt(50)+y3;
			let x5 = Math.sin(angle+Math.PI*3/4)*Math.sqrt(50)+x4;
			let y5 = Math.cos(angle+Math.PI*3/4)*Math.sqrt(50)+y4;
			let x6 = Math.sin(angle)*10+x5;
			let y6 = Math.cos(angle)*10+y5;
			ctx.fillStyle = "#FF0000";
			ctx.lineWidth = 0.01;
			ctx.beginPath();
			ctx.moveTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.lineTo(x3,y3);
			ctx.lineTo(x4,y4);
			ctx.lineTo(x5,y5);
			ctx.lineTo(x6,y6);
			ctx.lineTo(x1,y1);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}
}
class Snipeyship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,2,0.1,5);
		this.angle = 0;
		this.reload = 200;
		this.cooldown = Math.random*200;
		this.ais = ["Skittish"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		this.shooting = 0;
		if(this.ai === "Skittish") {
			this.mode = "attack";
			this.modeLength = 0;
		}
		this.shoot = function() {
			if(this.cooldown >= this.reload) {
				this.shooting = 20;
				let angle = this.angle+Math.PI;
				this.v.x += Math.sin(angle) * this.accel * 10;
				this.v.y += Math.cos(angle) * this.accel * 10;
				this.cooldown -= this.reload;
			}
			if(this.shooting > 0) {
				let angle = this.angle+Math.PI;
				let x = this.pos.x;
				let y = this.pos.y;
				while(y >= 0 && y <= 400 && x >= 0 && x <= 400) { 
					new LaserSegment(x,y);
					x += Math.sin(angle) * 3;
					y += Math.cos(angle) * 3;
				}
				angle = this.angle;
				
				ctx.strokeStyle = "#FF0000";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(this.pos.x,this.pos.y);
				ctx.lineTo(this.pos.x+Math.sin(angle)*1000,this.pos.y+Math.cos(angle)*1000);
				ctx.stroke();
				ctx.closePath();
				
				this.shooting--;
			}
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > 1000) {
				this.pos.x  = 1000;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > 1000) {
				this.pos.y = 1000;
				this.v.y = -this.v.y * 1/2;
			}
			this.cooldown++;
			if(this.cooldown > this.reload) {
				this.cooldown = this.reload;
			}
			if(this.ai === "Skittish") {
				let distance = Vector.sub(player.pos,this.pos).abs;
				if(distance < 250) {
					this.mode = "back away";
					this.modeLength = Math.random()*60;
				}
				if(this.mode === "back away") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y)+Math.PI;
					let angle = this.angle;
					this.v.x += Math.sin(angle) * this.accel;
					this.v.y += Math.cos(angle) * this.accel;
					this.modeLength--;
				}
				if(this.modeLength <= 0) {
					this.mode = "attack";
				}
				if(this.mode === "attack") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let vangle;
					if(this.v.x === 0 && this.v.y === 0) {
						vangle = Math.random()*Math.PI*2;
					} else {
						vangle = Math.atan2(this.v.x,this.v.y);
					}
					let randy = Math.random()-0.5*Math.PI/5;
					this.v.x += Math.sin((vangle+randy+this.angle)/2) * this.accel;
					this.v.y += Math.cos((vangle+randy+this.angle)/2) * this.accel;
					
				}
				this.shoot();
				this.pos.add(this.v);
			}
		}
		this.show = function() {
			let angle = this.angle;
			let x1 = Math.sin(angle)*5+this.pos.x;
			let y1 = Math.cos(angle)*5+this.pos.y;
			let x2 = Math.sin(angle+Math.PI-Math.atan(5/12.5))*Math.sqrt(156.25+25)+x1;
			let y2 = Math.cos(angle+Math.PI-Math.atan(5/12.5))*Math.sqrt(156.25+25)+y1;
			let x3 = Math.sin(angle-Math.PI/2)*10+x2;
			let y3 = Math.cos(angle-Math.PI/2)*10+y2;
			ctx.fillStyle = "#FF0000";
			ctx.lineWidth = 0.01;
			ctx.beginPath();
			ctx.moveTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.lineTo(x3,y3);
			ctx.lineTo(x1,y1);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}
}

const updateGame = () => {
	clear();
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,1000,1000);
	
	player.cooldown++;
	if(player.cooldown > player.reload) {
		player.cooldown = player.reload;
	}
	if (mouse.down === true) {
		window.addEventListener("mousemove", function (e) {
			let margin = document.getElementById("game area").getBoundingClientRect();
			mouse.pos.x = e.clientX - margin.left;
			mouse.pos.y = e.clientY - margin.top;
		})
		if(player.cooldown >= player.reload) {
			let angle = Math.atan2(player.pos.x-mouse.pos.x,player.pos.y-mouse.pos.y); 
			new Bullet(player.pos.x,player.pos.y,-Math.sin(angle)*2.5,-Math.cos(angle)*2.5);
			player.cooldown -= player.reload;
		}
	}
	player.show();
	for(let i = 0; i < entities.length; i++) {
		if(!entities[i].dead) {
			entities[i].update();
		}
	}
	for(let i = entities.length-1; i >= 0; i--) {
		if(entities[i].dead) {
			entities.splice(i,1);
		}
	}
	if(player.health <= 0) {
		clear();
		stop();
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,1000,1000);
		ctx.font="10px Arial";
		ctx.fillStyle="#FFFFFF";
		ctx.fillText("you died lol",475,500);
	}
};
