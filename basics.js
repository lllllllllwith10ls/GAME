class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
	get abs() {
		return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	};
	
	function this.prototype.add(b) {
		this.x += b.x;
		this.y += b.y;
	}
	static add(a,b) {
		let x = a.x + ybx;
		let y = a.y + b.y;
		return new Vector(x,y);
	};
}

const updateGame = () => {
	clear();
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
};
