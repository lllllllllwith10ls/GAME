function noEnemies() {
	for(let i = 0; i < entities.length; i++) {
		if(entities[i].friendly === false && !(entities[i] instanceof Health)) {
			return false;
		}
	}
	return true;
}
let hell = false;
function hard() {
  hell = true;
}
const waves = [
	[],
	["spaceship"],
	["spaceship","spaceship"],
	["spaceship","spaceship","spaceship","spaceship"],
	["spaceship","spaceship","chargeship"],
	["snipeyship","snipeyship"],
	["spaceship","chargeship","chargeship","chargeship"],
	["spaceship","chargeship","snipeyship","spaceship"],
	["fastship","fastship","fastship"],
	["fastship","chargeship","fastship"],
	["snipeyship","snipeyship","snipeyship","snipeyship"],
	["spaceship","chargeship","snipeyship","fastship","chargeship"],
	["spaceship","spaceship","spaceship","spaceship","spaceship","spaceship"],
	["chargeship","spaceship","spaceship","snipeyship","snipeyship","snipeyship"],
	["chargeship","chargeship","fastship","fastship","fastship","snipeyship"],
	["fleet"],
	["missile","missile","spaceship","spaceship"],
	["missile","missile","fastship","fastship"],
	["missile","missile","missile","missile"],
	["swarmship","swarmship","swarmship","swarmship","swarmship","swarmship","swarmship","swarmship","swarmship","swarmship"],
	["spawnship","spawnship","missile","missile","swarmship","swarmship","swarmship","swarmship","swarmship","swarmship"],
	["spawnship","spawnship","spawnship","spawnship","swarmship","swarmship","swarmship"],
	["spawnship","splittyship","splittyship","missile","missile"],
	["splittyship","splittyship","splittyship","splittyship","splittyship"],
	["splittyship","splittyship","spawnship","snipeyship","snipeyship"],
	["spawnship","spawnship","missile","splittyship","splittyship"],
	["spawnship","spawnship","snipeyship","snipeyship","splittyship","swarmship","swarmship","swarmship","swarmship"],
	["missile","missile","chargeship","chargeship","chargeship"],
	["spaceship","spaceship","spaceship","spaceship","spaceship","spaceship","spaceship","spaceship"],
	["spaceship","fastship","chargeship","snipeyship","missile","splittyship","spawnship"],
	["bigboi"],
	["tripleship","tripleship","spaceship","spaceship"],
	["tripleship","tripleship","fastship","fastship"],
	["tripleship","tripleship","tripleship"],
	["tripleship","tripleship","tripleship","snipeyship","snipeyship"],
	["tripleship","tripleship","spawnship","swarmship","swarmship",],
	["spawnship","spawnship","spawnship","teleship","teleship","teleship"],
	["snipeyship","snipeyship","snipeyship","teleship","teleship","teleship"],
	["snipeyship","snipeyship","snipeyship","teleship","teleship","teleship","tripleship","tripleship","tripleship"],
	["tripleship","tripleship","tripleship","teleship","teleship"],
	["mineship","mineship","mineship","mineship","snipeyship","snipeyship","splittyship","splittyship"],
	["mineship","mineship","snipeyship","snipeyship","splittyship","splittyship","splittyship","splittyship"],
	["teleship","teleship","teleship","teleship","teleship"],
	["missile","missile","missile","missile","missile","missile","missile","missile"],
  ["tripleship","tripleship","tripleship","tripleship","tripleship"],
  ["bully"]
	];
function addEnemy() {
  if(hell && entities.length < 75) {
    makeFleet();
    for(let i = 0; i < eliteFleet.length; i++) {
      eliteFleet[i].phase = 3;
    }
    new BigBoi(Math.random()*canvasX,-50,0,0);
    new Bully(Math.random()*canvasX,0,0,0);
  } else if(noEnemies()) {
		waveNum++;
		
    if(waveNum < waves.length) {
			if(player.health < 5 && Math.random() > 0.25) {
        waves[waveNum].push("health");
      }
			
			for(let i = 0; i < waves[waveNum].length; i++) {
				let enemy = waves[waveNum][i];
				switch(enemy) {
					case "spaceship":
						new Spaceship(Math.random()*canvasX,0,0,0);
						break;
					case "chargeship":
						new Chargeship(Math.random()*canvasX,0,0,0);
						break;
					case "snipeyship":
						new Snipeyship(Math.random()*canvasX,0,0,0);
						break;
					case "fastship":
						new Fastship(Math.random()*canvasX,0,0,0);
						break;
					case "health":
						new Health(Math.random()*canvasX,0,0,0);
						break;
					case "fleet":
						makeFleet();
						break;
					case "missile":
						new Missile(Math.random()*canvasX,0,0,1,6);
						break;
					case "swarmship":
						new Swarmship(Math.random()*canvasX,0,0,0);
						break;
					case "spawnship":
						new Spawnship(Math.random()*canvasX,0,0,0);
						break;
					case "splittyship":
						new Splittyship(Math.random()*canvasX,0,0,0);
						break;
					case "bigboi":
						new BigBoi(Math.random()*canvasX,-50,0,0);
						break;
					case "tripleship":
						new Tripleship(Math.random()*canvasX,0,0,0);
						break;
					case "teleship":
						new Teleship(Math.random()*canvasX,0,0,0);
						break;
					case "mineship":
						new Mineship(Math.random()*canvasX,0,0,0);
						break;
					case "bully":
						new Bully(Math.random()*canvasX,0,0,0);
						break;
					default:
						break;
				}
			}	
		} else {
      if(player.health < 5 && Math.random() > 0.25) {
        new Health(Math.random()*canvasX,0,0,0);
      }
      let points = waveNum*2;
      let enemyNames = ["spaceship","chargeship","snipeyship","fastship","missile","spawnship","splittyship","tripleship","teleship","mineship"];
      let enemyCosts = [5          ,5           ,10          ,10        ,2.5      ,15         ,10           ,20          ,15        ,15];
      while(points > 0) {
        let enemyNum = Math.floor(Math.random()*enemyNames.length);
        if(enemyCosts[enemyNum] <= points) {
          points -= enemyCosts[enemyNum];
          switch(enemyNames[enemyNum]) {
            case "spaceship":
              new Spaceship(Math.random()*canvasX,0,0,0);
              break;
            case "chargeship":
              new Chargeship(Math.random()*canvasX,0,0,0);
              break;
            case "snipeyship":
              new Snipeyship(Math.random()*canvasX,0,0,0);
              break;
            case "fastship":
              new Fastship(Math.random()*canvasX,0,0,0);
              break;
            case "missile":
              new Missile(Math.random()*canvasX,0,0,0,6);
              break;
            case "swarmship":
              new Swarmship(Math.random()*canvasX,0,0,0);
              break;
            case "spawnship":
              new Spawnship(Math.random()*canvasX,0,0,0);
              break;
            case "splittyship":
              new Splittyship(Math.random()*canvasX,0,0,0);
            case "tripleship":
              new Tripleship(Math.random()*canvasX,0,0,0);
              break;
            case "teleship":
              new Teleship(Math.random()*canvasX,0,0,0);
              break;
            case "mineship":
              new Mineship(Math.random()*canvasX,0,0,0);
              break;
            default:
              break;
          }
        } else {
          break;
        }
      }
    }
	}
}