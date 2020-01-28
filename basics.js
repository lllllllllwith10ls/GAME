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

let canvas = document.getElementById("game area");
let player = {
	pos: new Vector(canvas.width/2,canvas.height/2),
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
		if (this.pos.x > canvas.width) {
			this.pos.x  = canvas.width;
			this.v.x = -this.v.x * 1/2;
		}
		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.v.y = -this.v.y * 1/2;
		}
		if (this.pos.y > canvas.height) {
			this.pos.y = canvas.height;
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
			if (this.pos.x > canvas.width) {
				this.dead = true;
			}
			if (this.pos.y < 0) {
				this.dead = true;
			}
			if (this.pos.y > canvas.height) {
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
			if (this.pos.x > canvas.width) {
				this.dead = true;
			}
			if (this.pos.y < 0) {
				this.dead = true;
			}
			if (this.pos.y > canvas.height) {
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
		this.aliveForOneFrame = false;
		this.show = function() {
			this.aliveForOneFrame = true;
			if(this.aliveForOneFrame) {
				this.health = 0;
			}
		}
	}
}

class Splitter extends EnemyBullet {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,1,7.5,0,3);
		this.move = function() {
			this.pos.add(this.v);
			if (this.pos.x < 0) {
				this.dead = true;
				this.pos.x = 0;
			}
			if (this.pos.x > canvas.width) {
				this.dead = true;
				this.pos.x = canvas.width;
			}
			if (this.pos.y < 0) {
				this.dead = true;
				this.pos.y = 0;
			}
			if (this.pos.y > canvas.height) {
				this.dead = true;
				this.pos.y = canvas.height;
			}
		}
		this.show = function() {
			ctx.fillStyle = "#FF0000";
			
			ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
}
class Spaceship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,2,0.1,5);
		this.angle = 0;
		this.reload = 60;
		this.cooldown = Math.random()*60;
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
				let angle = this.angle+Math.PI+(Math.random()-0.5)*Math.PI/60; 
				new LaserThing(this.pos.x,this.pos.y,-Math.sin(angle)*5,-Math.cos(angle)*5);
				this.cooldown -= this.reload;
			}
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > canvas.width) {
				this.pos.x  = canvas.width;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > canvas.height) {
				this.pos.y = canvas.height;
				this.v.y = -this.v.y * 1/2;
			}
			this.cooldown++;
			if(this.cooldown > this.reload) {
				this.cooldown = this.reload;
			}
			if(this.ai === "Charger") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let angle = this.angle;
				let randy = (Math.random()-0.5)*Math.PI/5;
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
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let angle = this.angle+Math.PI;
					let randy = (Math.random()-0.5)*Math.PI/5
					this.v.x += Math.sin(angle+randy) * this.accel;
					this.v.y += Math.cos(angle+randy) * this.accel;
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
					let randy = (Math.random()-0.5)*Math.PI/5;
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
					let randy = (Math.random()-0.5)*Math.PI/5;
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
					let randy = (Math.random()-0.5)*Math.PI/5;
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
				let randy = (Math.random()-0.5)*Math.PI/5;
				
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
		this.reload = 60;
		this.reload2 = 15;
		this.cooldown = Math.random()*60;
		this.ais = ["Predictor","Flanker","Dodgy","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		this.mode = "idle";
		this.modeLength = 0;
		this.charge = function() {
			if(this.cooldown >= this.reload) {
				let angle = this.angle+Math.PI;
				this.speed = 4;
				this.v.x = -Math.sin(angle)*4;
				this.v.y = -Math.cos(angle)*4;
				this.cooldown -= this.reload;
				this.mode = "charge!";
				this.modeLength = 50;
			}
		}
		this.minicharge = function() {
			if(this.cooldown >= this.reload2) {
				if(this.ai === "Dodgy" && this.dodge) {
					let randy;
					if(Math.random() < 0.5) {
						randy = 1;
					} else {
						randy = -1;
					}
					this.angle = Math.atan2(this.targ.pos.x-this.pos.x,this.targ.pos.y-this.pos.y)+Math.PI/2*randy;
					let angle = this.angle+Math.PI;
					this.speed = 4;
					this.v.x = -Math.sin(angle)*4;
					this.v.y = -Math.cos(angle)*4;
					this.cooldown -= this.reload2;
					this.mode = "charge!";
					this.modeLength = 10;
				} else {
					this.angle += (Math.random()-0.5)*Math.PI;
					let angle = this.angle+Math.PI;
					this.speed = 4;
					this.v.x = -Math.sin(angle)*4;
					this.v.y = -Math.cos(angle)*4;
					this.cooldown -= this.reload2;
					this.mode = "charge!";
					this.modeLength = 10;
				}
			}
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > canvas.width) {
				this.pos.x  = canvas.width;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > canvas.height) {
				this.pos.y = canvas.height;
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
				let randy = (Math.random()-0.5)*Math.PI/5;
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
				let randy = (Math.random()-0.5)*Math.PI/5;
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
				let randy = (Math.random()-0.5)*Math.PI/5;
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
				let randy = (Math.random()-0.5)*Math.PI/5;
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
		super(x,y,vx,vy,5,1.5,0.05,5);
		this.angle = 0;
		this.reload = 300;
		this.cooldown = Math.random()*300;
		this.ais = ["Skittish","Random","Predictor"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
		this.shooting = false;
		this.shootLength = 0;
		this.mode = "attack";
		this.modeLength = 0;
		
		this.shoot = function() {
			if(this.cooldown >= this.reload) {
				this.shooting = true;
				this.shootLength = 60;
			}
			
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > canvas.width) {
				this.pos.x  = canvas.width;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > canvas.height) {
				this.pos.y = canvas.height;
				this.v.y = -this.v.y * 1/2;
			}
			this.cooldown++;
			if(this.cooldown > this.reload) {
				this.cooldown = this.reload;
			}
			if(this.shooting) {
				if(this.shootLength > 16) {
					this.shootLength--;
					this.pos.add(this.v);
					
					ctx.strokeStyle = "#7F0000";
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(this.pos.x,this.pos.y);
					ctx.lineTo(this.pos.x+Math.sin(this.angle)*2000,this.pos.y+Math.cos(this.angle)*2000);
					ctx.stroke();
					ctx.closePath();
				} else {
					if(this.shootLength <= 16 && this.shootLength > 15) {
						let angle = this.angle + Math.PI;
						this.v.x += Math.sin(angle)*3;
						this.v.y += Math.cos(angle)*3;
						this.cooldown -= this.reload;
					}
					let angle = this.angle+Math.PI;
					let x = this.pos.x;
					let y = this.pos.y;
					while(y >= 0 && y <= canvas.height && x >= 0 && x <= canvas.height) { 
						new LaserSegment(x,y);
						x -= Math.sin(angle) * 3;
						y -= Math.cos(angle) * 3;
					}
					angle = this.angle;

					ctx.strokeStyle = "#FF0000";
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(this.pos.x,this.pos.y);
					ctx.lineTo(this.pos.x+Math.sin(angle)*2000,this.pos.y+Math.cos(angle)*2000);
					ctx.stroke();
					ctx.closePath();

					this.shootLength--;
					if(this.shootLength <= 0) {
						this.shooting = false;
					}
					this.pos.add(this.v);
				}
			} else if(this.ai === "Skittish") {
				let distance = Vector.sub(player.pos,this.pos).abs;
				if(distance < 250) {
					this.mode = "back away";
					this.modeLength = Math.random()*60;
				}
				if(this.mode === "back away") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let angle = this.angle+Math.PI;
					let randy = (Math.random()-0.5)*Math.PI/5
					this.v.x += Math.sin(angle+randy) * this.accel;
					this.v.y += Math.cos(angle+randy) * this.accel;
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
					let randy = (Math.random()-0.5)*Math.PI/5;
					this.v.x += Math.sin((vangle+randy+this.angle)/2) * this.accel;
					this.v.y += Math.cos((vangle+randy+this.angle)/2) * this.accel;
					
				}
				this.shoot();
				this.pos.add(this.v);
			} else if(this.ai === "Random") {
				let distance = Vector.sub(player.pos,this.pos).abs;
				if(distance < 300) {
					this.mode = "back away";
					this.modeLength = Math.random()*60;
				}
				if(this.mode === "back away") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let angle = this.angle+Math.PI;
					let randy = (Math.random()-0.5)*Math.PI/5
					this.v.x += Math.sin(angle+randy) * this.accel;
					this.v.y += Math.cos(angle+randy) * this.accel;
					this.modeLength--;
				}
				if(this.modeLength <= 0) {
					this.mode = "attack";
				}
				if(this.mode === "attack") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let randy = (Math.random()-0.5)*Math.PI/5;
					this.v.x += Math.sin(randy+this.angle) * this.accel;
					this.v.y += Math.cos(randy+this.angle) * this.accel;
					
				}
				this.shoot();
				this.pos.add(this.v);
			} else if(this.ai === "Predictor") {
				let distance = Vector.sub(player.pos,this.pos).abs;
				if(distance < 300) {
					this.mode = "back away";
					this.modeLength = Math.random()*60;
				}
				if(this.mode === "back away") {
					this.angle = Math.atan2(player.pos.x+player.v.x*10-this.pos.x,player.pos.y+player.v.y*10-this.pos.y);
					let angle = this.angle+Math.PI;
					let randy = (Math.random()-0.5)*Math.PI/5
					this.v.x += Math.sin(angle+randy) * this.accel;
					this.v.y += Math.cos(angle+randy) * this.accel;
					this.modeLength--;
				}
				if(this.modeLength <= 0) {
					this.mode = "attack";
				}
				if(this.mode === "attack") {
					this.angle = Math.atan2(player.pos.x+player.v.x*10-this.pos.x,player.pos.y+player.v.y*10-this.pos.y);
					let randy = (Math.random()-0.5)*Math.PI/5;
					this.v.x += Math.sin(randy+this.angle) * this.accel;
					this.v.y += Math.cos(randy+this.angle) * this.accel;
					
				}
				this.shoot();
				this.pos.add(this.v);
			}
		}
		this.show = function() {
			let angle = this.angle;
			let x1 = Math.sin(angle)*7.5+this.pos.x;
			let y1 = Math.cos(angle)*7.5+this.pos.y;
			let x2 = Math.sin(angle+Math.PI-Math.atan(5/15))*Math.sqrt(225+56.25)+x1;
			let y2 = Math.cos(angle+Math.PI-Math.atan(5/15))*Math.sqrt(225+56.25)+y1;
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

class Jerry extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,2,0.1,5);
		this.angle = 0;
		this.reload = 300;
		this.reload2 = 15;
		this.reload3 = 15;
		this.cooldown = Math.random()*600;
		this.cooldown2 = Math.random()*0;
		this.mode = "idle";
		this.modeLength = 0;
		this.phase = 1;
		this.attack = function() {
			if(Math.random() < 0.5) {
				this.charge(true);
			} else {
				this.charge2(true);
			}
		}
		this.charge = function(force) {
			if(this.cooldown >= this.reload || force) {
				let angle = this.angle+Math.PI;
				this.speed = 4;
				this.v.x = -Math.sin(angle)*4;
				this.v.y = -Math.cos(angle)*4;
				this.cooldown -= this.reload;
				this.mode = "charge! and shoot";
				this.modeLength = 100;
			}
		}
		this.chargeForever = function() {
			let number = Math.floor(Math.random()*4);
			if(number === 0) {
				this.pos.x = Math.random()*canvas.width;
				this.pos.y = 0;
			} else if(number === 1) {
				this.pos.x = Math.random()*canvas.width;
				this.pos.y = canvas.height;
			} else if(number === 2) {
				this.pos.x = canvas.width;
				this.pos.y = Math.random()*canvas.height;
			} else {
				this.pos.x = 0;
				this.pos.y = Math.random()*canvas.height;
			}
			this.angle = Math.atan2(player.pos.x+player.v.x*3-this.pos.x,player.pos.y+player.v.y*3-this.pos.y);
			let angle = this.angle+Math.PI;
			this.speed = 4;
			this.v.x = -Math.sin(angle)*4;
			this.v.y = -Math.cos(angle)*4;
			this.mode = "charge! and shoot";
			this.modeLength = 100000;
		}
		this.shoot = function() {
			if(this.cooldown2 >= this.reload3) {
				let angle = this.angle+Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
				let angle2 = this.angle-Math.PI/2+(Math.random()-0.5)*Math.PI/60; 
				new LaserThing(this.pos.x,this.pos.y,-Math.sin(angle)*5,-Math.cos(angle)*5);
				new LaserThing(this.pos.x,this.pos.y,-Math.sin(angle2)*5,-Math.cos(angle2)*5);
				this.cooldown2 -= this.reload3;
			}
		}
		this.charge2 = function(force) {
			if(this.cooldown >= this.reload || force) {
				let angle = this.angle+Math.PI;
				this.speed = 4;
				this.v.x = -Math.sin(angle)*4;
				this.v.y = -Math.cos(angle)*4;
				this.cooldown -= this.reload;
				this.mode = "charge! but shoot at the end";
				this.modeLength = 100;
				this.circle();
			}
		}
		this.circle = function() {
			let amount = 16;
			for(let i = 0; i < amount; i++) {
				let angle = this.angle+Math.PI/amount*2*i+(Math.random()-0.5)*Math.PI/60; 
				new LaserThing(this.pos.x,this.pos.y,-Math.sin(angle)*5,-Math.cos(angle)*5);
			}
		}
		this.minicharge = function() {
			if(this.cooldown >= this.reload2) {
				if(this.dodge) {
					let randy;
					if(Math.random() < 0.5) {
						randy = 1;
					} else {
						randy = -1;
					}
					this.angle = Math.atan2(this.targ.pos.x-this.pos.x,this.targ.pos.y-this.pos.y)+Math.PI/2*randy;
					let angle = this.angle+Math.PI;
					this.speed = 4;
					this.v.x = -Math.sin(angle)*4;
					this.v.y = -Math.cos(angle)*4;
					this.cooldown -= this.reload2;
					this.mode = "charge!";
					this.modeLength = 10;
				} else {
					this.angle += (Math.random()-0.5)*Math.PI;
					let angle = this.angle+Math.PI;
					this.speed = 4;
					this.v.x = -Math.sin(angle)*4;
					this.v.y = -Math.cos(angle)*4;
					this.cooldown -= this.reload2;
					this.mode = "charge!";
					this.modeLength = 10;
				}
			}
		}
		this.move = function() {
			if(this.phase === 4) {
				if(this.pos.x < 0 || this.pos.x > canvas.width || this.pos.y < 0 || this.pos.y > canvas.height) {
					this.chargeForever();
				}
				if(this.mode === "charge! and shoot") {
					this.shoot();
				} else {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let angle = this.angle+Math.PI;
					let randy = (Math.random()-0.5)*Math.PI/5
					this.v.x += Math.sin(angle+randy) * this.accel;
					this.v.y += Math.cos(angle+randy) * this.accel;
				}
				this.pos.add(this.v);
				
				this.cooldown++;
				this.cooldown2++;
				if(this.cooldown > this.reload) {
					this.cooldown = this.reload;
				}
				if(this.cooldown2 > this.reload3) {
					this.cooldown2 = this.reload3;
				}
			} else {
				if(this.pos.x < 0) {
					this.pos.x = 0;
					this.v.x = -this.v.x * 1/2;
				}
				if(this.pos.x > canvas.width) {
					this.pos.x  = canvas.width;
					this.v.x = -this.v.x * 1/2;
				}
				if(this.pos.y < 0) {
					this.pos.y = 0;
					this.v.y = -this.v.y * 1/2;
				}
				if(this.pos.y > canvas.height) {
					this.pos.y = canvas.height;
					this.v.y = -this.v.y * 1/2;
				}
				this.cooldown++;
				this.cooldown2++;
				if(this.cooldown > this.reload) {
					this.cooldown = this.reload;
				}
				if(this.cooldown2 > this.reload3) {
					this.cooldown2 = this.reload3;
				}
				if(this.mode === "charge!" || this.mode === "charge! and shoot" || this.mode === "charge! but shoot at the end") {
					this.modeLength--;
					this.pos.add(this.v);
					if(this.mode === "charge! and shoot") {
						
						this.shoot();
					}
					if(this.modeLength <= 0) {
						
						this.speed = 2;
						if(this.mode === "charge! but shoot at the end") {
							
							this.circle();
						}
						this.mode = "idle";
						
					}
				} else {
					this.angle = Math.atan2(player.pos.x+player.v.x*3-this.pos.x,player.pos.y+player.v.y*3-this.pos.y);
					let angle = this.angle;
					let randy = (Math.random()-0.5)*Math.PI/5;
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
					} else if(Math.random() < 0.001) {
						this.minicharge();
					} else if(this.phase === 3) {
						if(Math.random() < 0.5) {
							this.charge(false);
						} else {
							this.charge2(false);
						}
					}
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


class Steve extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,3,0.1,5);
		this.angle = 0;
		this.reload = 300;
		this.reload2 = 20;
		this.reload3 = 50;
		this.cooldown = Math.random()*600;
		this.cooldown2 = 30;
		this.cooldown3 = 50;

		this.phase = 1;

		this.mode = "idle";
		this.modeLength = 0;

		this.attack = function() {
			if(Math.random() < 0.5) {
				this.predict(true);
			} else {
				this.spreader(true);
			}
		}
		this.predict = function(force) {
			if(this.cooldown >= this.reload || force) {
				this.cooldown -= this.reload;
				this.mode = "predict";
				this.modeLength = 150;
			}
		}
		this.shoot = function() {
			if(this.cooldown2 >= this.reload2) {
				let angle = this.angle+Math.PI+(Math.random()-0.5)*Math.PI/60; 
				new LaserThing(this.pos.x,this.pos.y,-Math.sin(angle)*5,-Math.cos(angle)*5);
				this.cooldown2 -= this.reload2;
			}
		}
		this.spreader = function(force) {
			if(this.cooldown >= this.reload || force) {
				this.cooldown -= this.reload;
				this.mode = "spreader";
				this.modeLength = 150;
			}
		}
		this.shoot2 = function() {
			if(this.cooldown3 >= this.reload3) {
				for(let i = 0; i < 3; i++) {
					let angle = this.angle+Math.PI+Math.PI/6*(i-1)+(Math.random()-0.5)*Math.PI/60; 
					new LaserThing(this.pos.x,this.pos.y,-Math.sin(angle)*5,-Math.cos(angle)*5);
					
				}
				this.cooldown3 -= this.reload3;
			}
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > canvas.width) {
				this.pos.x  = canvas.width;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > canvas.height) {
				this.pos.y = canvas.height;
				this.v.y = -this.v.y * 1/2;
			}
			this.cooldown++;
			if(this.cooldown > this.reload) {
				this.cooldown = this.reload;
			}
			this.cooldown2++;
			if(this.cooldown2 > this.reload2) {
				this.cooldown2 = this.reload2;
			}
			this.cooldown3++;
			if(this.cooldown3 > this.reload3) {
				this.cooldown3 = this.reload3;
			}
			this.modeLength--;
			if(this.phase === 4) {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let angle = this.angle;
				let randy = (Math.random()-0.5)*Math.PI/5;
				this.v.x += Math.sin(angle+randy) * this.accel;
				this.v.y += Math.cos(angle+randy) * this.accel;
				this.pos.add(this.v);
				this.shoot2();
			} else {
				if(this.mode === "predict") {
					this.angle = Math.atan2(player.pos.x+player.v.x*50-this.pos.x,player.pos.y+player.v.y*50-this.pos.y);
					this.shoot();
					if(this.modeLength <= 0) {
						this.mode = "idle";
					}
				} else {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				}
				if(this.mode === "spreader") {
					this.shoot2();
					if(this.modeLength <= 0) {
						this.mode = "idle";
						
					}
				}
				let vangle;
				if(this.v.x === 0 && this.v.y === 0) {
					vangle = Math.random()*Math.PI*2;
				} else {
					vangle = Math.atan2(this.v.x,this.v.y);
				}
				let randy = (Math.random()-0.5)*Math.PI/5;
				
				this.v.x += Math.sin((vangle+randy+this.angle)/2) * this.accel;
				this.v.y += Math.cos((vangle+randy+this.angle)/2) * this.accel;
				
				this.pos.add(this.v);
				if(this.mode === "idle") {
					if(this.phase === 3) {
						if(Math.random() < 0.5) {
							this.predict(false);
						} else {
							this.spreader(false);
						}
					}
				}
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

class Kevin extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,1.5,0.05,5);
		this.angle = 0;
		this.reload = 300;
		this.cooldown = Math.random()*600;
		this.reload2 = 50;
		this.cooldown2 = Math.random()*600;
		this.shooting = false;
		this.shootLength = 0;
		this.mode = "idle";
		this.modeLength = 0;
		
		this.phase = 1;

		this.attack = function() {
			if(Math.random() < 0.5) {
				this.laser(true);
			} else {
				this.splitter(true);
			}
		}
		this.laser = function(force) {
			if(this.cooldown >= this.reload || force) {
				this.cooldown -= this.reload;
				this.mode = "lasers yay";
				this.modeLength = 150;
			}
		}
		this.shoot = function() {
			if(this.cooldown2 >= this.reload2) {
				this.shooting = true;
				this.shootLength = 45;
			}
		}
		this.splitter = function(force) {
			if(this.cooldown >= this.reload || force) {
				this.cooldown -= this.reload*2;
				let angle = this.angle+Math.PI+(Math.random()-0.5)*Math.PI/60; 
				new Splitter(this.pos.x,this.pos.y,-Math.sin(angle)*7.5,-Math.cos(angle)*7.5);
				
			}
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > canvas.width) {
				this.pos.x  = canvas.width;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > canvas.height) {
				this.pos.y = canvas.height;
				this.v.y = -this.v.y * 1/2;
			}
			this.cooldown++;
			if(this.cooldown > this.reload) {
				this.cooldown = this.reload;
			}

			this.cooldown2++;
			if(this.cooldown2 > this.reload2) {
				this.cooldown2 = this.reload2;
			}
			
			this.modeLength--;
			if(this.shooting) {
				if(this.shootLength > 16) {
					this.shootLength--;
					this.pos.add(this.v);
					
					ctx.strokeStyle = "#7F0000";
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(this.pos.x,this.pos.y);
					ctx.lineTo(this.pos.x+Math.sin(this.angle)*2000,this.pos.y+Math.cos(this.angle)*2000);
					ctx.stroke();
					ctx.closePath();
				} else {
					if(this.shootLength <= 16 && this.shootLength > 15) {
						let angle = this.angle + Math.PI;
						this.v.x += Math.sin(angle)*3;
						this.v.y += Math.cos(angle)*3;
						this.cooldown -= this.reload;
					}
					let angle = this.angle+Math.PI;
					let x = this.pos.x;
					let y = this.pos.y;
					while(y >= 0 && y <= canvas.height && x >= 0 && x <= canvas.height) { 
						new LaserSegment(x,y);
						x -= Math.sin(angle) * 3;
						y -= Math.cos(angle) * 3;
					}
					angle = this.angle;

					ctx.strokeStyle = "#FF0000";
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(this.pos.x,this.pos.y);
					ctx.lineTo(this.pos.x+Math.sin(angle)*2000,this.pos.y+Math.cos(angle)*2000);
					ctx.stroke();
					ctx.closePath();

					this.shootLength--;
					if(this.shootLength <= 0) {
						this.shooting = false;
					}
					this.pos.add(this.v);
				}
			} else {
				let distance = Vector.sub(player.pos,this.pos).abs;
				if(distance < 250 && this.mode === "idle") {
					this.mode = "back away";
					this.modeLength = Math.random()*60;
				}

				if(this.mode === "back away") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let angle = this.angle+Math.PI;
					let randy = (Math.random()-0.5)*Math.PI/5
					this.v.x += Math.sin(angle+randy) * this.accel;
					this.v.y += Math.cos(angle+randy) * this.accel;
				}
				if(this.modeLength <= 0) {

					this.mode = "idle";
				}
				if(this.mode === "idle" || this.mode === "lasers yay") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let vangle;
					if(this.v.x === 0 && this.v.y === 0) {
						vangle = Math.random()*Math.PI*2;
					} else {
						vangle = Math.atan2(this.v.x,this.v.y);
					}
					let randy = (Math.random()-0.5)*Math.PI/5;
					this.v.x += Math.sin((vangle+randy+this.angle)/2) * this.accel;
					this.v.y += Math.cos((vangle+randy+this.angle)/2) * this.accel;
					
				}
				if(this.mode === "lasers yay") {
					this.shoot();
				}
				if((this.mode === "idle" || this.mode === "back away") && (this.phase === 3 || this.phase === 4)) {
					if(Math.random() < 0.5) {
						this.laser(false);
					} else {
						this.splitter(false);
					}
				}
				if(this.phase === 4) {
					this.reload = 60;
				}
				this.pos.add(this.v);
			}

		}
		this.show = function() {
			let angle = this.angle;
			let x1 = Math.sin(angle)*7.5+this.pos.x;
			let y1 = Math.cos(angle)*7.5+this.pos.y;
			let x2 = Math.sin(angle+Math.PI-Math.atan(5/15))*Math.sqrt(225+56.25)+x1;
			let y2 = Math.cos(angle+Math.PI-Math.atan(5/15))*Math.sqrt(225+56.25)+y1;
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

class Kyle extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,10,4,0.1,5);
		this.angle = 0;
		this.reload = 300;
		this.reload2 = 20;
		this.cooldown = Math.random()*600;
		this.cooldown2 = 20;

		this.phase = 1;

		this.mode = "idle";
		this.modeLength = 0;

		this.attack = function() {
			this.charge(true);
		}
		this.shoot = function() {
			if(this.cooldown2 >= this.reload2) {
				let angle = this.angle+Math.PI+(Math.random()-0.5)*Math.PI/30; 
				new LaserThing(this.pos.x,this.pos.y,-Math.sin(angle)*5,-Math.cos(angle)*5);
				this.cooldown2 -= this.reload2;
			}
		}
		this.charge = function(force) {
			if(this.cooldown >= this.reload || force) {
				this.cooldown -= this.reload;
				this.mode = "CHARGE";
				this.modeLength = 150;
			}
		}
		this.move = function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.x > canvas.width) {
				this.pos.x  = canvas.width;
				this.v.x = -this.v.x * 1/2;
			}
			if(this.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.pos.y > canvas.height) {
				this.pos.y = canvas.height;
				this.v.y = -this.v.y * 1/2;
			}
			this.cooldown++;
			if(this.cooldown > this.reload) {
				this.cooldown = this.reload;
			}
			this.cooldown2++;
			if(this.cooldown2 > this.reload2) {
				this.cooldown2 = this.reload2;
			}
			this.modeLength--;
			if(this.mode === "CHARGE") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let angle = this.angle;
				let randy = (Math.random()-0.5)*Math.PI/5;
				this.v.x += Math.sin(angle+randy) * this.accel;
				this.v.y += Math.cos(angle+randy) * this.accel;
				this.pos.add(this.v);
				this.shoot();
				if(this.modeLength <= 0) {

					this.mode = "idle";
				}
			}
			
			if(this.mode === "idle") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let vangle;
				if(this.v.x === 0 && this.v.y === 0) {
					vangle = Math.random()*Math.PI*2;
				} else {
					vangle = Math.atan2(this.v.x,this.v.y);
				}
				let randy = (Math.random()-0.5)*Math.PI/5;
				
				this.v.x += Math.sin((vangle+randy+this.angle)/2) * this.accel;
				this.v.y += Math.cos((vangle+randy+this.angle)/2) * this.accel;
				
				this.pos.add(this.v);
				if(this.phase === 3) {
					this.charge(false);
				}
			}
			if(this.phase === 4) {
				this.mode = "CHARGE";
				this.modeLength = 10000;
			}
		}
		this.show = function() {
			let angle = this.angle;
			let x1 = Math.sin(angle)*5+this.pos.x;
			let y1 = Math.cos(angle)*5+this.pos.y;
			let x2 = Math.sin(angle+Math.PI-Math.atan(5/12.5))*Math.sqrt(156.25+25)+x1;
			let y2 = Math.cos(angle+Math.PI-Math.atan(5/12.5))*Math.sqrt(156.25+25)+y1;
			let x3 = Math.sin(angle)*-2.5+this.pos.x;
			let y3 = Math.cos(angle)*-2.5+this.pos.y;
			let x4 = Math.sin(angle-Math.PI/2)*10+x2;
			let y4 = Math.cos(angle-Math.PI/2)*10+y2;
			ctx.fillStyle = "#FF0000";
			ctx.lineWidth = 0.01;
			ctx.beginPath();
			ctx.moveTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.lineTo(x3,y3);
			ctx.lineTo(x4,y4);
			ctx.lineTo(x1,y1);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}
}

function circle(xPos,yPos,amount) {
	let angle2 = Math.PI*2*Math.random();
	for(let i = 0; i < amount; i++) {
		let angle = angle2 + Math.PI/amount*2*i+(Math.random()-0.5)*Math.PI/60; 
		new LaserThing(xPos+Math.sin(angle)*5,yPos+Math.cos(angle)*5,Math.sin(angle)*5,Math.cos(angle)*5);
	}
}

let eliteFleet = [];

function makeFleet() {
	eliteFleet = [
	new Jerry(Math.random()*500,0,0,0), 
	new Steve(Math.random()*500,0,0,0), 
	new Kevin(Math.random()*500,0,0,0), 
	new Kyle(Math.random()*500,0,0,0)]
	pickFleetAttack();

}
function pickFleetAttack() {
	if(eliteFleet.length > 0) {
		let attack = Math.floor(Math.random()*eliteFleet.length);
		if(eliteFleet[attack].mode === "idle" || eliteFleet[attack].mode === "back away") {
			eliteFleet[attack].attack();
			queuedAttack = false;
		} else {
			setTimeout(pickFleetAttack, 10)
		}
	}

}
class EnemyPoolItem {
	constructor(enemies) {
		this.enemies = enemies;
		enemyPool.push(this);
	}
	get value() {
		let value = 0;
		for(let i = 0; i < this.enemies.length; i++) {
			let enemy = this.enemies[i];
			switch(enemy) {
				case "spaceship":
					value += 5;
					break;
				case "chargeship":
					value += 5;
					break;
				case "snipeyship":
					value += 10;
					break;
			}
		}
		return value;
		
	};
}
let queuedAttack;
let enemyPool = [];
new EnemyPoolItem(["spaceship"]);
new EnemyPoolItem(["spaceship"]);
new EnemyPoolItem(["chargeship"]);
let enemyPoolPool = ["spaceship","chargeship","snipeyship"];
let enemyPoints = 0;
let difficulty = 0.01;
let time = 1;
let select = enemyPool[Math.floor(Math.random()*enemyPool.length)];
function addEnemy() {
	enemyPoints += difficulty;
	time += 0.00001;
	difficulty = Math.log10(time);
	if(enemyPoints >= select.value) {
		enemyPoints -= select.value;
		for(let i = 0; i < select.enemies.length; i++) {
			let enemy = select.enemies[i];
			switch(enemy) {
				case "spaceship":
					new Spaceship(Math.random()*canvas.width,0,0,0);
					break;
				case "chargeship":
					new Chargeship(Math.random()*canvas.width,0,0,0);
					break;
				case "snipeyship":
					new Snipeyship(Math.random()*canvas.width,0,0,0);
					break;
			}
		}
		if(Math.random() > 0.5 || enemyPool.length <= 3 && enemyPool.length < 10) {
			let number = Math.ceil(Math.random()*difficulty*10);
			console.log(number);
			let enemies2 = [];
			for (let i = 0; i < number; i++) {
				enemies2.push(enemyPoolPool[Math.floor(Math.random()*enemyPoolPool.length)]);
			}
			new EnemyPoolItem(enemies2);
		} else if(Math.random() > 0.5 || enemyPool.length >= 10) {
			enemyPool.splice(Math.floor(Math.random()*enemyPool.length), 1);
		}
		select = enemyPool[Math.floor(Math.random()*enemyPool.length)];
	}
}
makeFleet();
function updateGame() {
	clear();
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	player.cooldown++;
	if(player.cooldown > player.reload) {
		player.cooldown = player.reload;
	}
	if (mouse.down === true) {
		if(player.cooldown >= player.reload) {
			let angle = Math.atan2(player.pos.x-mouse.pos.x,player.pos.y-mouse.pos.y)+(Math.random()-0.5)*Math.PI/60; 
			new Bullet(player.pos.x,player.pos.y,-Math.sin(angle)*5,-Math.cos(angle)*5);
			player.cooldown -= player.reload;
		}
	}
	player.show();
	for(let i = 0; i < entities.length; i++) {
		if(!entities[i].dead) {
			entities[i].update();
		}
	}
	let doingNothing = true;
	for(let i = 0; i < eliteFleet.length; i++) {
		if(eliteFleet[i].mode !== "idle" && eliteFleet[i].mode !== "back away") {
			doingNothing = false;
		}
	}
	if(doingNothing && eliteFleet[0] && !queuedAttack) {
		if(eliteFleet[0].phase === 1) {
			queuedAttack = true;
			setTimeout(pickFleetAttack,5000);
		} else if(eliteFleet[0].phase === 2) {
			queuedAttack = true;
			setTimeout(pickFleetAttack,5000);
			setTimeout(pickFleetAttack,7500);
		}
	}
	for(let i = entities.length-1; i >= 0; i--) {
		if(entities[i].dead) {
			if(entities[i] instanceof Splitter) {
				circle(entities[i].pos.x,entities[i].pos.y,20)
				
			}
			if(eliteFleet.includes(entities[i])) {
				for(let j = 0; j < eliteFleet.length; j++) {
					eliteFleet[j].phase++;
					eliteFleet[j].hp += 10;
					eliteFleet[j].cooldown = Math.random()*eliteFleet[j].reload;
					if(eliteFleet[j].hp < 25){
						eliteFleet[j].hp = 25;
					}
					if(eliteFleet[j].phase === 4) {
						eliteFleet[j].hp = 30;
					}
				}
				if(eliteFleet[0].phase === 2) {
					pickFleetAttack();
				}
				if(eliteFleet[0].phase === 3) {
					for(let j = 0; j < eliteFleet.length; j++) {
						eliteFleet[j].cooldown = Math.random()*200;
					}
				}
				eliteFleet.splice(eliteFleet.indexOf(entities[i]),1);
			}
			entities.splice(i,1);
		}
	}
	if(player.health <= 0) {
		clear();
		stop();
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.font="10px Arial";
		ctx.fillStyle="#FFFFFF";
		ctx.fillText("you died lol",canvas.width/2-25,canvas.height/2);
	}
	//addEnemy();
};
