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
	if (keys[87]) {
		if(player.vY < -5) {
			player.vY = -5
		} else {
			 player.vY -= 0.1;
		}
	} 
	if (keys[65]) {
		if(player.vX < -5) {
			player.vX = -5
		} else {
			 player.vX -= 0.1;
		}
	} 
	if (keys[83]) {
		if(player.vY > 5) {
			player.vY = 5
		} else {
			 player.vY += 0.1;
		}
	}
	if (keys[68]) {
		if(player.vX > 5) {
			player.vX = 5
		} else {
			 player.vX += 0.1;
		}
	}
	if (player.xPos < 0) {
		player.xPos = 0;
		player.vX = -player.vX * 1/2;
	}
	if (player.xPos > 400) {
		player.xPos = 400;
		player.vX = -player.vX * 1/2;
	}
	if (player.yPos < 0) {
		player.yPos = 0;
		player.vY = -player.vY * 1/2;
	}
	if (player.yPos > 400) {
		player.yPos = 400;
		player.vY = -player.vY * 1/2;
	}
};
