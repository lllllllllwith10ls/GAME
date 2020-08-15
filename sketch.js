let canvasX = 500;
let canvasY = 500;
let cnv;
function setup() {
  cnv = createCanvas(canvasX, canvasY);
  strokeCap(SQUARE);
  frameRate(60);
  cnv.parent("canvasArea");
}

let entities = [];
let player = new Player(canvasX/2,canvasY/2,0,0);
let waveNum = 0;
let keys = {
  87: false,
  65: false,
  83: false,
  68: false
}
function keyPressed(){
  keys[keyCode] = true;
}
function keyReleased(){
  keys[keyCode] = false;
}
function clearBoard() {
  entities = [player];
}
function alive() {
  for(let i = 0; i < entities.length; i++) {
    if(!entities[i].dead && entities[i] instanceof Player) {
      return true;
    }
  }
  return false;
}
function newPlayer() {
  for(let i = 0; i < entities.length; i++) {
    if(!entities[i].dead && entities[i] instanceof Player) {
      player = entities[i];
      break;
    }
  }
}
function shoot() {
  for(let i = 0; i < entities.length; i++) {
    if(!entities[i].dead && entities[i] instanceof Player) {
      entities[i].shoot();
    }
  }
}
function draw() {
  background(0);
  if(alive()) {
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
    if(doingNothing && eliteFleet[0] && timeUntilAttack === Infinity && timeUntilAttack2 === Infinity) {
      if(eliteFleet[0].phase === 1) {
        queueAttack1(175);
      } else if(eliteFleet[0].phase === 2) {
        queueAttack1(175);
        queueAttack2(350);
      }
    }
    timeUntilAttack--;
    timeUntilAttack2--;
    if(timeUntilAttack <= 0) {
      pickFleetAttack();
      timeUntilAttack = Infinity;
    }
    if(timeUntilAttack2 <= 0) {
      pickFleetAttack();
      timeUntilAttack2 = Infinity;
    }
    for(let i = entities.length-1; i >= 0; i--) {
      if(entities[i].dead) {
        if(entities[i] instanceof Splitter || entities[i] instanceof Mine || entities[i] instanceof Missile) {
          bulletCircle(entities[i].pos.x,entities[i].pos.y,entities[i].bullets);          
        }       
        if(eliteFleet.includes(entities[i])) {
          for(let j = 0; j < eliteFleet.length; j++) {
            eliteFleet[j].phase++;
            eliteFleet[j].health += 2;
            eliteFleet[j].cooldown = Math.random()*eliteFleet[j].reload;
            if(eliteFleet[j].health < 10){
              eliteFleet[j].health = 10;
            }
            if(eliteFleet[j].phase === 4) {
              eliteFleet[j].health = 15;
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
    if (mouseIsPressed) {
      shoot();
    }
    document.getElementById("hp").innerHTML = player.health;
    document.getElementById("wave").innerHTML = waveNum;
    newPlayer();
    addEnemy();
    if(waveNum > 40) {
      document.getElementById("checkpoint").innerHTML = "you ever just realize that the bosses spawn at multiples of 15?";
    } else if(waveNum > 35) {
      document.getElementById("checkpoint").innerHTML = "oh god these are disorienting";
    } else if(waveNum > 30) {
      document.getElementById("checkpoint").innerHTML = "yaaaaaaaaaaaay more levels";
    } else if(waveNum > 25) {
      document.getElementById("checkpoint").innerHTML = "spoiler: the next boss is called the big boi";
    } else if(waveNum > 20) {
      document.getElementById("checkpoint").innerHTML = "why do they have so many ships?";
    } else if(waveNum > 15) {
      document.getElementById("checkpoint").innerHTML = "hey, that wasn't fair, it was 4 against one!";
    } else if(waveNum > 10) {
      document.getElementById("checkpoint").innerHTML = "fast bois are the worst and should die";
    } else if(waveNum > 5) {
      document.getElementById("checkpoint").innerHTML = "FIRING MA VERY DEAD MEME!";
    } else {
      document.getElementById("checkpoint").innerHTML = "N/A";
    }
  } else {  
    fill(255, 255, 255);
    text("you died lol",canvasX/2-25,canvasY/2);
  }
}

function checkpoint() {
  let code = document.getElementById("code").value;
  if(code === "you ever just realize that the bosses spawn at multiples of 15?") {
    waveNum = 40;
  } else if(code === "oh god these are disorienting") {
    waveNum = 35;
  } else if(code === "yaaaaaaaaaaaay more levels") {
    waveNum = 30;
  } else if(code === "spoiler: the next boss is called the big boi") {
    waveNum = 25;
  } else if(code === "why do they have so many ships?") {
    waveNum = 20;
  } else if(code === "hey, that wasn't fair, it was 4 against one!") {
    waveNum = 15;
  } else if(code === "fast bois are the worst and should die") {
    waveNum = 10;
  } else if(code === "FIRING MA VERY DEAD MEME!") {
    waveNum = 5;
  } else {
    waveNum = 0;
  }
  entities = [];
  player = new Player(canvasX/2,canvasY/2,0,0);
  hell = false;
}