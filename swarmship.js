class Swarmship extends Entity {
	constructor(x,y,vx,vy) {
		super(x,y,vx,vy,1,2.5,0.2,5);
		this.angle = 0;
		this.ais = ["Flanker","Chaser","Erratic"];
		this.ai = this.ais[Math.floor(Math.random()*this.ais.length)];
  }
  move() {
    super.move();
    if(this.pos.x < 0) {
      this.pos.x = 0;
      this.v.x = -this.v.x * 1/2;
    }
    if(this.pos.x > canvasX) {
      this.pos.x  = canvasX;
      this.v.x = -this.v.x * 1/2;
    }
    if(this.pos.y < 0) {
      this.pos.y = 0;
      this.v.y = -this.v.y * 1/2;
    }
    if(this.pos.y > canvasY) {
      this.pos.y = canvasY;
      this.v.y = -this.v.y * 1/2;
    }
    if(this.ai === "Chaser") {
      this.target = player.pos.copy();
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();        
    } else if(this.ai === "Flanker") {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      this.target = p5.Vector.sub(player.pos,p5.Vector.fromAngle(player.angle).mult(50));
	  if(p5.Vector.sub(player.pos,this.pos).mag() < 60)
	  {
		this.target = player.pos.copy();
	  }
      
    } else if(this.ai === "Erratic") {
      this.angle = p5.Vector.sub(player.pos,this.pos).heading();
      let vangle;
      if(this.v.x === 0 && this.v.y === 0) {
        vangle = Math.random()*Math.PI*2;
      } else {
        vangle = this.v.heading();
      }
      this.target = p5.Vector.add(p5.Vector.fromAngle((this.angle+vangle)/2, this.accel),this.pos);
    }
    let desired = p5.Vector.sub(this.target,this.pos);
    desired.normalize();
    desired.mult(this.speed);
    let steer = p5.Vector.sub(desired,this.v);
    steer.limit(this.accel);
    steer.rotate((Math.random()-0.5)*Math.PI/4);
    this.v.add(steer);
    if(this.dead) {
      new RedParticle(this.pos.x,this.pos.y,30,20);
    }
  }
  show() {
    fill(255,0,0);	
    noStroke();
    let angle = this.angle;      
    push();
    translate(this.pos.x,this.pos.y);
    rotate(angle);
    beginShape();
    vertex(2.5, 0);
    vertex(-3.75, 2.5);
    vertex(-3.75, -2.5);
    endShape(CLOSE);
    pop();
  }
}
