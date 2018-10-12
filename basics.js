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
		if (this.v.abs > 2) {
			let angle = -Math.atan2(this.v.y,this.v.x)+Math.PI/2;
			this.v.x = Math.sin(angle)*2
			this.v.y = Math.cos(angle)*2

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
		if(!this.health <= 0) {
			ctx.lineWidth = 0.01;
			ctx.beginPath();
			ctx.moveTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.lineTo(x3,y3);
			ctx.lineTo(x3,y3);
			ctx.lineTo(x1,y1);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		} else {
			stop();
			clear();
			ctx.font="10px Arial";
			ctx.fillText("you died lol",475,500);
		}
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
	if (this.v.abs > this.accel) {
		let angle = -Math.atan2(this.v.y,this.v.x)+Math.PI/2;
		this.v.x = Math.sin(angle)*2
		this.v.y = Math.cos(angle)*2

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
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,1,5,0,3);
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
class Spaceship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,5,0.5,0.1,5);
		this.angle = 0;
		this.reload = 120;
		this.cooldown = 0;
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
				entities.push(new EnemyBullet(this.pos.x,this.pos.y,-Math.sin(angle)*2,-Math.cos(angle)*2));
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
				let rand = Math.random()-0.5*Math.PI/5;
				this.v.x += Math.sin(angle+rand) * this.accel;
				this.v.y += Math.cos(angle+rand) * this.accel;
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
					let rand = Math.random()-0.5*Math.PI/5;
					this.v.x += Math.sin((vangle+rand+this.angle)/2) * this.accel;
					this.v.y += Math.cos((vangle+rand+this.angle)/2) * this.accel;
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
					let rand = Math.random()-0.5*Math.PI/5;
					if(distance < 100) {
						this.v.x += Math.sin((vangle+rand+this.angle+Math.PI)/2) * this.accel;
						this.v.y += Math.cos((vangle+rand+this.angle+Math.PI)/2) * this.accel;
					} else {
						
						this.v.x += Math.sin((vangle+rand+this.angle)/2) * this.accel;
						this.v.y += Math.cos((vangle+rand+this.angle)/2) * this.accel;
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
					let rand = Math.random()-0.5*Math.PI/5;
					this.v.x += Math.sin(angle+rand) * this.accel;
					this.v.y += Math.cos(angle+rand) * this.accel;
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
				let rand = Math.random()-0.5*Math.PI/5;
				
				this.v.x += Math.sin((vangle+rand+this.angle)/2) * this.accel;
				this.v.y += Math.cos((vangle+rand+this.angle)/2) * this.accel;
				
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
			entities.push(new Bullet(player.pos.x,player.pos.y,-Math.sin(angle)*2.5,-Math.cos(angle)*2.5));
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
};
