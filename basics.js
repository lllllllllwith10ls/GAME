const updateGame = () => {
	theGame.clear();
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
}
