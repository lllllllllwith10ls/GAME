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
let player = {
	pos: new Vector(500,500),
	v: new Vector(0,0),
	cooldown: 0,
	reload: 10,
	show: function() {
		let vx = 0;
		let vy = 0;
		if (keys[87]) {
			vy -= 1;
		}
		if (keys[65]) {
			vx -= 1;
		} 
		if (keys[83]) {
			vy += 1;
		}
		if (keys[68]) {
			vx += 1;
		}
		if(vy === 1 || vy === -1) {
			if(player.v.y > 2) {
				player.v.y = 2;
			} else if(player.v.y < -2) {
				player.v.y = -2;
			} else {
				 player.v.y += vy * 0.1;
			}
		}
		if(vx === 1 || vx === -1) {
			if(player.v.x > 2) {
				player.v.x = 2;
			} else if(player.v.x < -2) {
				player.v.x = -2;
			} else {
				 player.v.x += vx * 0.1;
			}
		}
		if(vy === 0) {
			if(player.v.y > 0) {
				player.v.y -= 0.1;
			} else if(player.v.y < 0) {
				player.v.y += 0.1;
			}
		}
		if(vx === 0) {
			if(player.v.x > 0) {
				player.v.x -= 0.1;
			} else if(player.v.x < 0) {
				player.v.x += 0.1;
			}
		}
		if (player.pos.x < 0) {
			player.pos.x  = 0;
			player.v.x = -player.v.x * 1/2;
		}
		if (player.pos.x > 1000) {
			player.pos.x  = 1000;
			player.v.x = -player.v.x * 1/2;
		}
		if (player.pos.y < 0) {
			player.pos.y = 0;
			player.v.y = -player.v.y * 1/2;
		}
		if (player.pos.y > 1000) {
			player.pos.y = 1000;
			player.v.y = -player.v.y * 1/2;
		}
		player.pos.add(player.v);
		this.angle = -Math.atan2(this.pos.y-mouse.pos.y,this.pos.x-mouse.pos.x)-Math.PI/2;
		let angle = this.angle;
		let x1 = Math.sin(angle)*10+this.pos.x;
		let y1 = Math.cos(angle)*10+this.pos.y;
		let x2 = Math.sin(angle+Math.PI-Math.atan(10/25))*Math.sqrt(625+100)+x1;
		let y2 = Math.cos(angle+Math.PI-Math.atan(10/25))*Math.sqrt(625+100)+y1;
		let x3 = Math.sin(angle-Math.PI/2)*20+x2;
		let y3 = Math.cos(angle-Math.PI/2)*20+y2;
		ctx.fillStyle = "#FFFFFF";
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
};
let entities = [];
class Entity {
	constructor(x,y,vx,vy,health,speed,accel) {
		this.pos = new Vector(x,y);
		this.v = new Vector(vx,vy);
		this.health = health;
		this.speed = speed;
		this.dead = false;
		this.move = function() {
		
		}
		this.show = function() {
			
		}
		entities.push(this);
	}
}
Entity.prototype.update = function() {
	if(this.v.y > this.speed) {
		this.v.y = this.speed;
	} else if(this.v.y < -this.speed) {
		this.v.y = -this.speed;
	}
	if(this.v.x > this.speed) {
		this.v.x = this.speed;
	} else if(this.v.x < -this.speed) {
		this.v.x = -this.speed;
	}
	this.move();
	this.show();
	
}
class Bullet extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,1,5,0);
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
			ctx.lineWidth = 3;
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
		super(x,y,vx,vy,5,2,0.01);
		this.angle = 0;
		this.ais = ["Charger","Circler","Coward","Hit n run"];
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
		this.move = function() {
			if (this.pos.x < 0) {
				this.pos.x  = 0;
				this.v.x = -this.v.x * 1/2;
			}
			if (this.pos.x > 1000) {
				this.pos.x  = 1000;
				this.v.x = -this.v.x * 1/2;
			}
			if (player.pos.y < 0) {
				this.pos.y = 0;
				this.v.y = -this.v.y * 1/2;
			}
			if (this.pos.y > 1000) {
				this.pos.y = 1000;
				this.v.y = -this.v.y * 1/2;
			}
			if(this.ai === "Charger") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let angle = this.angle;
				this.v.x += Math.sin(angle) * this.accel;
				this.v.y += Math.cos(angle) * this.accel;
				this.pos.add(this.v);
			} else if(this.ai === "Circler") {
				this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
				let distance = Vector.sub(player.pos,this.pos).abs;
				let angle2 = this.angle+Math.PI;
				if(this.mode === "clockwise") {
					angle2 += Math.PI/90;
				} else {
					angle2 -= Math.PI/90;
				}
				let newy = new Vector(Math.sin(angle2)*distance,Math.cos(angle2)*distance);
				newy.add(player.pos);
				angle2 = Math.atan2(newy.x-this.pos.x,newy.y-this.pos.y);
				this.v.x += Math.sin(angle) * this.accel;
				this.v.y += Math.cos(angle) * this.accel;
				this.pos.add(this.v);
				this.modeLength --;
				if(this.modeLength <= 0) {
					if(this.mode === "clockwise") {
						this.mode = "counterclockwise";
					} else {
						this.mode = "clockwise";
					}
				}
			} else if( this.ai === "Coward") {
				let distance = Vector.sub(player.pos,this.pos).abs;
				if(distance < 50) {
					this.mode = "run";
					this.modeLength = Math.random()*30;
				}
				if(this.mode === "run") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y)+Math.PI;
					let angle = this.angle;
					this.v.x += Math.sin(angle) * this.accel;
					this.v.y += Math.cos(angle) * this.accel;
					this.modelength--;
				}
				if(this.modelength <= 0) {
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
					let rand = Math.random()-0.5*Math.PI/4;
					this.v.x += Math.sin((vangle+rand+this.angle)/2) * this.accel;
					this.v.y += Math.cos((vangle+rand+this.angle)/2) * this.accel;
					
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
					let rand = Math.random()-0.5*Math.PI/4;
					if(distance < 50) {
						this.v.x += Math.sin((vangle+rand+this.angle+Math.PI)/2) * this.accel;
						this.v.y += Math.cos((vangle+rand+this.angle+Math.PI)/2) * this.accel;
					} else {
						
						this.v.x += Math.sin((vangle+rand+this.angle)/2) * this.accel;
						this.v.y += Math.cos((vangle+rand+this.angle)/2) * this.accel;
					}
					
					this.modelength--;
				}
				if(this.modelength <= 0 && this.mode === "idle") {
					this.mode = "hit";
				}
				if(this.mode === "hit") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y);
					let angle = this.angle;
					this.v.x += Math.sin(angle) * this.accel;
					this.v.y += Math.cos(angle) * this.accel;
				}
				if(distance < 25 && this.mode === "hit") {
					this.mode = "run";
				}
				if(this.mode === "run") {
					this.angle = Math.atan2(player.pos.x-this.pos.x,player.pos.y-this.pos.y)+Math.PI;
					let angle = this.angle;
					this.v.x += Math.sin(angle) * this.accel;
					this.v.y += Math.cos(angle) * this.accel;
					this.modelength--;
				}
				if(this.modelength <= 0 && this.mode === "run") {
					this.mode = "idle";
				}
				this.pos.add(this.v);
			}
		}
		this.show = function() {
			let angle = this.angle;
			let x1 = Math.sin(angle)*10+this.pos.x;
			let y1 = Math.cos(angle)*10+this.pos.y;
			let x2 = Math.sin(angle+Math.PI-Math.atan(10/25))*Math.sqrt(625+100)+x1;
			let y2 = Math.cos(angle+Math.PI-Math.atan(10/25))*Math.sqrt(625+100)+y1;
			let x3 = Math.sin(angle-Math.PI/2)*20+x2;
			let y3 = Math.cos(angle-Math.PI/2)*20+y2;
			ctx.fillStyle = "#FFFFFF";
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
			entities.push(new Bullet(player.pos.x,player.pos.y,-Math.sin(angle)*5,-Math.cos(angle)*5));
			player.cooldown -= player.reload;
		}
	}
	player.show();
	for(let i = 0; i < entities.length; i++) {
		entities[i].update();
	}
	for(let i = entities.length-1; i >= 0; i--) {
		if(entities[i].dead) {
			entities.splice(i,1);
		}
	}
};
