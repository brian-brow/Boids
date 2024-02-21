import React from 'react';
import p5 from 'p5';

const Sketch = () => {
  const sketchRef = React.useRef();

  React.useEffect(() => {
    const sketch = new p5((p) => {
      let dimWidth, dimHeight;
      let fishList = [];

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

            let offscreen = 200;

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
                p.circle(this.Pos.x, this.Pos.y, this.visionRadius*2);
                p.circle(this.Pos.x, this.Pos.y, this.avoidRadius*2);
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
            let maxSpeed = 10;
            let minSpeed = 3;

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
      
        
        for (let i = 0; i < 500; i++) {
          let color;
          const randomColor = p.floor(p.random(3));
      
          if (randomColor === 0) {
            color = p.color(168, 50, 90); 
          } else if (randomColor === 1) {
            color = p.color(90, 168, 50); 
          } else {
            color = p.color(50, 98, 168); 
          }
      
          fishList.push(new Boid(p.random() * dimWidth, p.random() * dimHeight, 1, color, dimWidth, dimHeight));
          fishList[i].update(i);
        }

        for(let i = 0; i < fishList.length; i++) {
            console.log(fishList[i].color.toString());
        }
        
        fishList[0].yep = true;
        // fishList[0].color = 255;
        // fishList[1].shark = true;
        // fishList[1].color = 0;
      };

      p.draw = () => {
        p.background(20);
        p.fill(255);
        p.textSize(50);
        p.text("Text would look good here if we picked the right word",dimWidth/2,dimHeight/2);
        p.noFill();
        p.stroke(255);
        p.rect(200,200,dimWidth-400,dimHeight-400);
        for (let i = 0; i < fishList.length; i++) {
          fishList[i].check(fishList, i);
          fishList[i].update();
          fishList[i].display();
        }
      };

      p.windowResized = () => {
        dimWidth = sketchRef.current.offsetWidth;
        dimHeight = window.innerHeight - 100; // Adjust as needed for your layout
        p.resizeCanvas(dimWidth, dimHeight);
      };
    });
    return () => {
      sketch.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Sketch;
