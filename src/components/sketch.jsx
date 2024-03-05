import React, { useEffect } from 'react';
import p5 from 'p5';

const Sketch = ({boidColors,sharkEnabled,speed,linesEnabled,shockWaveRad}) => {
  const sketchRef = React.useRef();

  useEffect(() => {
    const sketch = new p5((p) => {
      let dimWidth, dimHeight;
      let redFishList = [];
      let greenFishList = [];
      let blueFishList = [];

      let shark;

      let shockWaves = [];

      let redCount = boidColors.redCount;
      let greenCount = boidColors.greenCount;
      let blueCount = boidColors.blueCount;

      let isSharkEnabled = sharkEnabled;
      let isLinesEnabled = linesEnabled;

      let stateMaxSpeed = speed.maxSpeed; 
      let stateMinSpeed = speed.minSpeed; 
      class Boid {
        constructor(xPos = 200, yPos = 200, v = 4, color = 255, dimX, dimY) {
            this.Pos = p.createVector(xPos,yPos);
            this.verticies = [
                xPos - 5,
                yPos + 10,
                xPos,
                yPos - 10,
                xPos + 5,
                yPos + 10,
            ];
            if(p.floor(p.random(2)) == 0) {
                this.vel = p.createVector(0, v);
            } else {
                this.vel = p.createVector(0, -v);
            }

            this.yep = false;
            this.shark = false;
            this.ghost = false;
            this.color = color;
            this.dimX = dimX;
            this.dimY = dimY;
            this.avoidRadius = 16;
            this.visionRadius = 80;

            this.centeringFactor = 0.0005;
            this.avoidFactor = 0.04;
            this.matchingFactor = 0.05;
            this.turnFactor = 0.2;
            this.bias = 0.01;
            this.maxSpeed = speed.maxSpeed;
            this.minSpeed = speed.minSpeed;

            this.shockWave = p.createVector(0,0);
        }

        update() {
            this.Pos.add(this.vel);
            this.verticies = [
                this.Pos.x + 5,
                this.Pos.y - 10,
                this.Pos.x,
                this.Pos.y + 10,
                this.Pos.x - 5,
                this.Pos.y - 10,
            ];

            let offscreen = 500;

            if (this.Pos.y < -offscreen) {
                this.Pos.y = this.dimY;
            }
            if (this.Pos.y > this.dimY+offscreen) {
                this.Pos.y = 0;
            }
            if (this.Pos.x < -offscreen) {
                this.Pos.x = this.dimX;
            }
            if (this.Pos.x > this.dimX+offscreen) {
                this.Pos.x = 0;
            }

            let NewAngle = 0;
            if(this.vel.x < 0) {
                if(this.vel.y < 0) {
                    //top left
                    NewAngle = 180 + p.atan(this.vel.y / this.vel.x);
                } else {
                    //bottom left
                    NewAngle = 180 + p.atan(this.vel.y / this.vel.x);
                }
            } else {
                if(this.vel.y < 0) {
                    //top right
                    NewAngle = p.atan(this.vel.y / this.vel.x);
                } else {
                    //bottom right
                    NewAngle = p.atan(this.vel.y / this.vel.x);
                }
            }

            for (let i = 0; i < 6; i += 2) {
                let x =
                    p.cos(NewAngle-90) * (this.verticies[i] - this.Pos.x) -
                    p.sin(NewAngle-90) * (this.verticies[i + 1] - this.Pos.y) +
                    this.Pos.x;
                let y =
                    p.sin(NewAngle-90) * (this.verticies[i] - this.Pos.x) +
                    p.cos(NewAngle-90) * (this.verticies[i + 1] - this.Pos.y) +
                    this.Pos.y;
                this.verticies[i] = x;
                this.verticies[i + 1] = y;
            }
        }

        display() {
            if (this.yep) {
                p.noFill();
                p.stroke(150);
                // p.circle(this.Pos.x, this.Pos.y, this.visionRadius*2);
                // p.circle(this.Pos.x, this.Pos.y, this.avoidRadius*2);
                p.fill(255);
            }
            if(this.shark) {
                p.fill(this.color);
                p.stroke(255,0,0);
                p.triangle(
                    this.verticies[0],
                    this.verticies[1],
                    this.verticies[2],
                    this.verticies[3],
                    this.verticies[4],
                    this.verticies[5]
                );
            } else {
                p.fill(this.color);
                p.stroke(0);
                p.triangle(
                    this.verticies[0],
                    this.verticies[1],
                    this.verticies[2],
                    this.verticies[3],
                    this.verticies[4],
                    this.verticies[5]
                );
            }
        }

        check(fishList, I) {
            let close_dx = 0;
            let close_dy = 0;
            let avg_vx = 0;
            let avg_vy = 0;
            let avg_px = 0;
            let avg_py = 0;
            let neighbors = 0;

            let shockSpeed = 6;

            for (let i = 0; i < fishList.length; i++) {
                let dis = p.sqrt(
                                p.pow(this.Pos.x - fishList[i].Pos.x, 2) +
                                p.pow(this.Pos.y - fishList[i].Pos.y, 2));
                
                //shark logic
                if(this.shark && I != i && dis < this.visionRadius*4 && !fishList[i].ghost) {
                    if(dis < this.avoidRadius) {
                        close_dx += fishList[i].Pos.x - this.Pos.x;
                        close_dy += fishList[i].Pos.y - this.Pos.y;
                    }
                    if(dis < 10) {
                        fishList[i].color = p.color(255,255,255,50);
                        fishList[i].maxSpeed = 1;
                        fishList[i].minSpeed = 0;
                        fishList[i].ghost = true;
                    }
                }

                //standard boid logic
                if (I != i && dis < this.visionRadius && this.color.toString() == fishList[i].color.toString()) {
                    // if (I != i && dis < this.visionRadius) {
                    avg_vx += fishList[i].vel.x;
                    avg_vy += fishList[i].vel.y;

                    avg_px += fishList[i].Pos.x;
                    avg_py += fishList[i].Pos.y;

                    neighbors++;

                    if(dis < this.avoidRadius) {
                        close_dx += this.Pos.x - fishList[i].Pos.x;
                        close_dy += this.Pos.y - fishList[i].Pos.y;
                    }

                    if (this.yep) {
                        p.fill(255);
                        p.stroke((((75-dis)/75) * 255) + 100);
                        p.line(this.Pos.x, this.Pos.y, fishList[i].Pos.x, fishList[i].Pos.y);
                    }
                }
            }

            avg_vx = avg_vx / neighbors;
            avg_vy = avg_vy / neighbors;

            avg_px = avg_px / neighbors;
            avg_py = avg_py / neighbors;

            if(neighbors > 0) {
                this.vel.x += (avg_vx - this.vel.x) * this.matchingFactor;
                this.vel.y += (avg_vy - this.vel.y) * this.matchingFactor;

                this.vel.x += (avg_px - this.Pos.x) * this.centeringFactor;
                this.vel.y += (avg_py - this.Pos.y) * this.centeringFactor;
            }

            this.vel.x += close_dx * this.avoidFactor;
            this.vel.y += close_dy * this.avoidFactor;

            if(this.Pos.x > this.dimX - 200) {
                this.vel.x += -this.turnFactor;
            }
            if(this.Pos.x < 200) {
                this.vel.x += this.turnFactor;
            }
            if(this.Pos.y > this.dimY - 200) {
                this.vel.y += -this.turnFactor;
            }
            if(this.Pos.y < 200) {
                this.vel.y += this.turnFactor;
            }

            // if(this.color.toString() == "rgba(50,98,168,1)") {
            //     this.vel.x += bias;
            // }

            this.vel.x += this.shockWave.x;
            this.vel.y += this.shockWave.y;

            let speed = p.sqrt(this.vel.x*this.vel.x + this.vel.y*this.vel.y);
            if(speed > this.maxSpeed) {
                if(this.shockWave.mag() > 0) {
                    this.vel.x = (this.vel.x/speed) * shockSpeed;
                    this.vel.y = (this.vel.y/speed) * shockSpeed;
                } else {
                    this.vel.x = (this.vel.x/speed) * this.maxSpeed;
                    this.vel.y = (this.vel.y/speed) * this.maxSpeed;
                }
            }
            if(speed < this.minSpeed) {
                this.vel.x = (this.vel.x/speed) * this.minSpeed;
                this.vel.y = (this.vel.y/speed) * this.minSpeed;
            }

            this.shockWave.x = 0;
            this.shockWave.y = 0;
        }
    }
      class ShockWave {
        constructor(xPos, yPos) {
            this.Pos = p.createVector(xPos,yPos);
            this.opacity = 255;
            this.diam = 0;
            this.maxDiam = shockWaveRad * 2;
            this.done = false;
        }

        update(fishList) {
            if(this.opacity <= 0) {
                this.done = true;
            }
            p.fill(255,255,255,this.opacity/3);
            p.stroke(255,255,255,this.opacity);
            p.circle(this.Pos.x,this.Pos.y,this.diam);
            this.opacity -= 255 / (this.maxDiam / 10);
            this.diam += 10;
            
            for(let i = 0; i < fishList.length; i++) {
                let dis = p.createVector(0,0);
                dis.x = fishList[i].Pos.x;
                dis.y = fishList[i].Pos.y
                dis.sub(this.Pos);
                if(dis.mag() < this.diam/2) {
                    fishList[i].shockWave.add(dis);
                }
            }
        }
      }

    p.setup = () => {
        p.textAlign(p.CENTER,p.CENTER);
        p.angleMode(p.DEGREES);
        dimWidth = sketchRef.current.offsetWidth;
        dimHeight = window.innerHeight;
        p.createCanvas(dimWidth, dimHeight).parent(sketchRef.current);

        let color;

        shark = new Boid(p.random() * dimWidth, p.random() * dimHeight, 1, p.color(0,0,0), dimWidth, dimHeight);
        shark.shark = true;
        console.log("shark");

        for (let i = 0; i < redCount; i++) {
            color = p.color(168, 50, 90); 
            redFishList.push(new Boid(p.random() * dimWidth, p.random() * dimHeight, 1, color, dimWidth, dimHeight));
        }
        for (let i = 0; i < greenCount; i++) {
            color = p.color(90, 168, 50); 
            greenFishList.push(new Boid(p.random() * dimWidth, p.random() * dimHeight, 1, color, dimWidth, dimHeight));
        }
        for (let i = 0; i < blueCount; i++) {
            color = p.color(50, 98, 168); 
            blueFishList.push(new Boid(p.random() * dimWidth, p.random() * dimHeight, 1, color, dimWidth, dimHeight));
        }
    };

    p.draw = () => {
        p.background(20);
        p.fill(255);
        p.noFill();
        p.stroke(255);
        p.rect(200,200,dimWidth-400,dimHeight-400);
        
        if (isLinesEnabled) {
            redFishList[0].yep = true;
            greenFishList[0].yep = true;
            blueFishList[0].yep = true;
        } else {
            redFishList[0].yep = false;
            greenFishList[0].yep = false;
            blueFishList[0].yep = false;
        }
        for (let i = 0; i < redFishList.length; i++) {
           redFishList[i].check(redFishList, i);
           redFishList[i].update();
           redFishList[i].display();
        }
        for (let i = 0; i < greenFishList.length; i++) {
            greenFishList[i].check(greenFishList, i);
            greenFishList[i].update();
            greenFishList[i].display();
        }
        for (let i = 0; i < blueFishList.length; i++) {
            blueFishList[i].check(blueFishList, i);
            blueFishList[i].update();
            blueFishList[i].display();
        }
        let fishList = redFishList.concat(blueFishList.concat(greenFishList))
        if (isSharkEnabled){
            shark.check(fishList, 1);
            shark.update();
            shark.display();
        }
        fishList.push(shark);
        for(let i = 0; i < shockWaves.length; i++) {
            if(shockWaves[i].done) {
                shockWaves.splice(i,1);
                continue;
            }
            shockWaves[i].update(fishList);
        }
    };

    p.windowResized = () => {
        dimWidth = sketchRef.current.offsetWidth;
        dimHeight = window.innerHeight - 100;
        p.resizeCanvas(dimWidth, dimHeight);
    };

    p.mouseClicked = () => {
        shockWaves.push(new ShockWave(p.mouseX, p.mouseY));
    };
    });
    return () => {
      sketch.remove();
    };
  }, [boidColors,sharkEnabled,speed]);

  return <div ref={sketchRef}></div>;
};

export default Sketch;
