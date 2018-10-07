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
	show: function() {
		this.angle = -Math.atan2(this.pos.y-mouse.pos.y,this.pos.x-mouse.pos.x)-Math.PI/2;
		angle = this.angle;
		let x1 = Math.sin(angle)*3+this.pos.x;
		let y1 = Math.cos(angle)*3+this.pos.y;
		let x2 = Math.sin(angle+Math.atan(10/25))*Math.sqrt(625+100)+x1;
		let y2 = Math.cos(angle+Math.atan(10/25))*Math.sqrt(625+100)+y1;
		let x3 = Math.sin(angle-Math.PI/4)*Math.sqrt(200)+x2;
		let y3 = Math.cos(angle-Math.PI/4)*Math.sqrt(200)+y2;
		let x4 = Math.sin(angle-3*Math.PI/4)*Math.sqrt(200)+x3;
		let y4 = Math.cos(angle-3*Math.PI/4)*Math.sqrt(200)+y3;
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.lineTo(x3,y3);
		ctx.lineTo(x3,y3);
		ctx.lineTo(x4,y4);
		ctx.lineTo(x1,y1);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
};
const updateGame = () => {
	clear();
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,1000,1000);
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
		if(player.v.y > 3) {
			player.v.y = 3;
		} else if(player.v.y < -3) {
			player.v.y = -3;
		} else {
			 player.v.y += vy * 0.1;
		}
	}
	if(vx === 1 || vx === -1) {
		if(player.v.x > 3) {
			player.v.x = 3;
		} else if(player.v.y < -3) {
			player.v.x = -3;
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
	if (player.pos.x  > 1000) {
		player.pos.x  = 1000;
		player.v.x = -player.v.x * 1/2;
	}
	if (player.pos.y < 0) {
		player.pos.y = 0;
		player.v.y = -player.v.y * 1/2;
	}
	if (player.pos.y > 400) {
		player.pos.y = 400;
		player.v.y = -player.v.y * 1/2;
	}
	player.pos.add(player.v);
	
	if (mouse.down === true) {
		window.addEventListener("mousemove", function (e) {
			let margin = document.getElementById("game area").getBoundingClientRect();
			mouse.x = e.clientX - margin.left;
			mouse.y = e.clientY - margin.top;
		})
		if(player.cooldown >= player.reload) {
			let angle = Math.atan2(player.xPos-mouse.x,player.yPos-mouse.y); 
			bullets.push(new Bullet(player.xPos,player.yPos,-Math.sin(angle)*7.5,-Math.cos(angle)*7.5));
			player.cooldown = 0;
		}
	}
	player.show();
};
