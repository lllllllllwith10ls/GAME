class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
	get abs() {
		return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	};
	
	static add(a,b) {
		let x = a.x + ybx;
		let y = a.y + b.y;
		return new Vector(x,y);
	};
}
Vector.prototype.add = function(b) {
	this.x += b.x;
	this.y += b.y;
}
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
		angle = this.angle;
		let x1 = Math.sin(angle)*10+this.pos.x;
		let y1 = Math.cos(angle)*10+this.pos.y;
		let x2 = Math.sin(angle+Math.PI-Math.atan(10/25))*Math.sqrt(625+100)+x1;
		let y2 = Math.cos(angle+Math.PI-Math.atan(10/25))*Math.sqrt(625+100)+y1;
		let x3 = Math.sin(angle-Math.PI/2)*20+x2;
		let y3 = Math.cos(angle-Math.PI/2)*20+y2;
		ctx.fillStyle = "#FFFFFF";
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
			ctx.linewidth = 3;
			ctx.beginPath();
			ctx.moveTo(this.pos.x-this.v.x/2,this.pos.y-this.v.y/2);
			ctx.lineTo(this.pos.x+this.v.x/2,this.pos.y-this.v.y/2);
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
