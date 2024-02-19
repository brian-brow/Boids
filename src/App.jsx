import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const App = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = new p5((p) => {
      let fishList = [];
      let dimWidth = p.windowWidth;
      let dimHeight = p.windowHeight - 100;

      class Boid {
        constructor(xPos = 200, yPos = 200, v = 4, color = 255, dimX, dimY) {
          p.angleMode(p.DEGREES);
          this.xPos = xPos;
          this.yPos = yPos;
          this.verticies = [xPos - 5, yPos + 10, xPos, yPos - 10, xPos + 5, yPos + 10];
          this.v = -v;
          this.vel = p.createVector(0, v);
          this.theta = 90;
          this.cX = -1;
          this.cY = -1;
          this.yep = false;
          this.color = color;
          this.dimX = dimX;
          this.dimY = dimY;
        }

        update(angle) {
          this.theta += angle;
          this.theta %= 360;

          for (let i = 0; i < 6; i += 2) {
            let x = p.cos(angle) * (this.verticies[i] - this.xPos) - p.sin(angle) * (this.verticies[i + 1] - this.yPos) + this.xPos;
            let y = p.sin(angle) * (this.verticies[i] - this.xPos) + p.cos(angle) * (this.verticies[i + 1] - this.yPos) + this.yPos;
            this.verticies[i] = x;
            this.verticies[i + 1] = y;
          }
          this.move(this.xPos + this.v * p.cos(this.theta), this.yPos + this.v * p.sin(this.theta));
        }

        display() {
          if (this.yep) {
            p.noFill();
            p.circle(this.xPos, this.yPos, 100);
            p.fill(255);
          }
          p.fill(this.color);
          p.triangle(this.verticies[0], this.verticies[1], this.verticies[2], this.verticies[3], this.verticies[4], this.verticies[5]);
        }

        move(x, y) {
          if (y < 0) {
            y = this.dimY;
          }
          if (y > this.dimY) {
            y = 0;
          }
          if (x < 0) {
            x = this.dimX;
          }
          if (x > this.dimX) {
            x = 0;
          }
          for (let i = 0; i < 6; i += 2) {
            this.verticies[i] -= this.xPos;
            this.verticies[i] += x;
            this.verticies[i + 1] -= this.yPos;
            this.verticies[i + 1] += y;
          }
          this.xPos = x;
          this.yPos = y;
        }

        check(fishList, I) {
          let gamma = 0;
          let avgX = this.xPos;
          let avgY = this.yPos;
          let avgC = 1;
          for (let i = 0; i < fishList.length; i++) {

            let dis = p.sqrt(p.pow(this.xPos - fishList[i].xPos, 2) + p.pow(this.yPos - fishList[i].yPos, 2));
            if (I != i && dis < 75 && this.color == fishList[i].color) {
              avgX += fishList[i].xPos;
              avgY += fishList[i].yPos;
              avgC++;

              let phi = 90 - this.theta;
              let tempX = fishList[i].xPos * p.cos(phi) - fishList[i].yPos * p.sin(phi);
              let tempX2 = this.xPos * p.cos(phi) - this.yPos * p.sin(phi);
              let tempY = fishList[i].xPos * p.sin(phi) + fishList[i].yPos * p.cos(phi);
              let tempY2 = this.xPos * p.sin(phi) + this.yPos * p.cos(phi);

              if (this.theta < fishList[i].theta) {
                gamma += 1 * (10 / dis);
              } else {
                gamma -= 1 * (10 / dis);
              }

              if (dis < 50) {

                if (tempY < tempY2 + 10) {

                  if (dis < 100) {
                    if (tempX > tempX2) {
                      gamma += -(1) * (10 / dis);
                    } else {
                      gamma += (1) * (10 / dis);
                    }
                  }
                }

              }

              this.cX = fishList[i].xPos;
              this.cY = fishList[i].yPos;
              if (this.yep) {
                p.line(this.xPos, this.yPos, this.cX, this.cY);
              }
            }
          }
          avgX = avgX / avgC;
          avgY = avgY / avgC;
          let phi = 90 - this.theta;
          let tempX = avgX * p.cos(phi) - avgY * p.sin(phi);
          let tempX2 = this.xPos * p.cos(phi) - this.yPos * p.sin(phi);
          let tempXM = p.mouseX * p.cos(phi) - p.mouseY * p.sin(phi);
          let tempY = avgX * p.sin(phi) + avgY * p.cos(phi);
          let tempY2 = this.xPos * p.sin(phi) + this.yPos * p.cos(phi);
          let tempYM = p.mouseX * p.sin(phi) + p.mouseY * p.cos(phi);
          if (tempX < tempX2) {
            gamma += (-1);
          } else {
            gamma += (1);
          }
          if (p.sqrt(p.pow(this.xPos - p.mouseX, 2) + p.pow(this.yPos - p.mouseY, 2)) < 25) {
            p.circle(p.mouseX, p.mouseY, 25);
            if (tempXM < tempX2) {
              gamma += 15;
            } else {
              gamma += -15;
            }
          }
          if (this.yep) {
            p.fill(this.color);
            p.circle(avgX, avgY, 5);
          }
          this.update(gamma);
        }
      }

      p.setup = () => {
        p.createCanvas(dimWidth, dimHeight).parent(sketchRef.current);
        // Initialize your sketch here
        for (let i = 0; i < 250; i++) {
          fishList.push(new Boid(p.random() * dimWidth, p.random() * dimHeight, 3, 255, dimWidth, dimHeight));
          fishList[i].update(i);
        }
        fishList[0].yep = true;
        fishList[0].color = 255;
      };

      p.draw = () => {
        p.background(200);
        for (let i = 0; i < fishList.length; i++) {
          fishList[i].check(fishList, i);
          fishList[i].update(0);
          fishList[i].display();
        }
      };
    });
    return () => {
      // Cleanup function to remove p5 sketch when component unmounts
      sketch.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default App;
