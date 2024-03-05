import React, { useEffect } from 'react';
import p5 from 'p5';

const Sketch = ({boidColors,sharkEnabled,speed}) => {
  const sketchRef = React.useRef();

  useEffect(() => {
    const sketch = new p5((p) => {
      let dimWidth, dimHeight;
      let redFishList = [];
      let greenFishList = [];
      let blueFishList = [];    
      let redCount = boidColors.redCount;
      let greenCount = boidColors.greenCount;
      let blueCount = boidColors.blueCount;
      let isSharkEnabled = sharkEnabled;
      console.log(speed)
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
            this.v = v;
            if(p.floor(p.random(2)) == 0) {
                this.vel = p.createVector(0, v);
            } else {
                this.vel = p.createVector(0, -v);
            }
            this.yep = false;
            this.shark = false;
            this.color = color;
            this.dimX = dimX;
            this.dimY = dimY;
            this.avoidRadius = 16;
            this.visionRadius = 80;
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

            let centeringFactor = 0.0005;
            let avoidFactor = 0.04;
            let matchingFactor = 0.05;
            let turnFactor = 0.2;
            let bias = 0.01;
            let maxSpeed = stateMaxSpeed;
            let minSpeed = stateMinSpeed;

            for (let i = 0; i < fishList.length; i++) {
                let dis = p.sqrt(
                                p.pow(this.Pos.x - fishList[i].Pos.x, 2) +
                                p.pow(this.Pos.y - fishList[i].Pos.y, 2));
                
                //shark logic
                if(this.shark && I != i && dis < this.visionRadius*4) {
                    if(dis < this.avoidRadius) {
                        close_dx += fishList[i].Pos.x - this.Pos.x;
                        close_dy += fishList[i].Pos.y - this.Pos.y;
                    }
                    if(dis < 10) {
                        fishList[i].color = p.color(255);
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
                this.vel.x += (avg_vx - this.vel.x) * matchingFactor;
                this.vel.y += (avg_vy - this.vel.y) * matchingFactor;

                this.vel.x += (avg_px - this.Pos.x) * centeringFactor;
                this.vel.y += (avg_py - this.Pos.y) * centeringFactor;
            }

            this.vel.x += close_dx * avoidFactor;
            this.vel.y += close_dy * avoidFactor;

            if(this.Pos.x > this.dimX - 200) {
                this.vel.x += -turnFactor;
            }
            if(this.Pos.x < 100) {
                this.vel.x += turnFactor;
            }
            if(this.Pos.y > this.dimY - 200) {
                this.vel.y += -turnFactor;
            }
            if(this.Pos.y < 100) {
                this.vel.y += turnFactor;
            }

            // if(this.color.toString() == "rgba(50,98,168,1)") {
            //     this.vel.x += bias;
            // }

            let speed = p.sqrt(this.vel.x*this.vel.x + this.vel.y*this.vel.y);
            if(speed > maxSpeed) {
                this.vel.x = (this.vel.x/speed) * maxSpeed;
                this.vel.y = (this.vel.y/speed) * maxSpeed;
            }
            if(speed < minSpeed) {
                this.vel.x = (this.vel.x/speed) * minSpeed;
                this.vel.y = (this.vel.y/speed) * minSpeed;
            }
        }
    }

    p.setup = () => {
        p.textAlign(p.CENTER,p.CENTER);
        p.angleMode(p.DEGREES);
        dimWidth = sketchRef.current.offsetWidth;
        dimHeight = window.innerHeight;
        p.createCanvas(dimWidth, dimHeight).parent(sketchRef.current);
      
        

        // + boidColors.greenCount) {
        //     color = p.color(90, 168, 50); 
        // } else {
        //     color = p.color(50, 98, 168); 

        let color;

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
        
        // // fishList[0].yep = true;
        // // fishList[0].color = 255;

      };

      p.draw = () => {
        p.background(20);
        p.fill(255);
        p.noFill();
        p.stroke(255);
        p.rect(200,200,dimWidth-400,dimHeight-400);
        
        for (let i = 0; i < redFishList.length; i++) {
           redFishList[i].check(redFishList, i);
           redFishList[i].update();
           redFishList[i].display();
           redFishList[0].yep = true;
           if (isSharkEnabled){
                redFishList[0].shark = true;
                redFishList[0].color = 255;
           }
        }
        for (let i = 0; i < greenFishList.length; i++) {
            greenFishList[i].check(greenFishList, i);
            greenFishList[i].update();
            greenFishList[i].display();
         }
         greenFishList[0].yep = true;
         for (let i = 0; i < blueFishList.length; i++) {
            blueFishList[i].check(blueFishList, i);
            blueFishList[i].update();
            blueFishList[i].display();
         }
         blueFishList[0].yep = true;
      };

      p.windowResized = () => {
        dimWidth = sketchRef.current.offsetWidth;
        dimHeight = window.innerHeight - 100;
        p.resizeCanvas(dimWidth, dimHeight);
      };
    });
    return () => {
      sketch.remove();
    };
  }, [boidColors,sharkEnabled,speed]);

  return <div ref={sketchRef}></div>;
};

export default Sketch;
