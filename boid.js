class Boid {
    constructor(xPos=200, yPos=200, v=4, color=255, dim) {
      angleMode(DEGREES);
      this.xPos = xPos;
      this.yPos = yPos;
      this.verticies = [xPos - 5, yPos + 10, xPos, yPos - 10, xPos + 5, yPos + 10];
      this.v = -v;
      this.vel = createVector(0,v);
      this.theta = 90;
      this.cX = -1;
      this.cY = -1;
      this.yep = false;
      this.color = color;
      this.dim = dim
    }
  
    update(angle) {
      this.theta += angle;
      this.theta %= 360;
      
      for(let i = 0; i < 6; i += 2) {
        let x = cos(angle) * (this.verticies[i] - this.xPos) - sin(angle) * (this.verticies[i+1] - this.yPos) + this.xPos;
        let y = sin(angle) * (this.verticies[i] - this.xPos) + cos(angle) * (this.verticies[i+1] - this.yPos) + this.yPos;
        this.verticies[i] = x;
        this.verticies[i+1] = y;
      }
      this.move(this.xPos + this.v * cos(this.theta), this.yPos + this.v * sin(this.theta));
    }
  
    display() {
      if(this.yep) {
        noFill();
        // circle(this.xPos,this.yPos,100);
        fill(255);
      }
      fill(this.color);
      triangle(this.verticies[0], this.verticies[1], this.verticies[2], this.verticies[3], this.verticies[4], this.verticies[5]);
    }
  
    move(x, y) {
      if(y < 0) {
        y = this.dim;
      }
      if(y > this.dim) {
        y = 0;
      }
      if(x < 0) {
        x = this.dim;
      }
      if(x > this.dim) {
        x = 0;
      }
      for(let i = 0; i < 6; i += 2) {
        this.verticies[i] -= this.xPos;
        this.verticies[i] += x;
        this.verticies[i+1] -= this.yPos;
        this.verticies[i+1] += y;
      }
      this.xPos = x;
      this.yPos = y;
    }

    check(fishList,I) {
        let gamma = 0;
        let avgX = this.xPos;
        let avgY = this.yPos;
        let avgC = 1;
        for(let i = 0; i < fishList.length; i++) {

            let dis = sqrt(pow(this.xPos - fishList[i].xPos,2) + pow(this.yPos - fishList[i].yPos,2));
            if(I != i && dis < 50 && this.color == fishList[i].color) {
                avgX += fishList[i].xPos;
                avgY += fishList[i].yPos;
                avgC++;
                
                

                let phi = 90 - this.theta;
                let tempX = fishList[i].xPos * cos(phi) - fishList[i].yPos * sin(phi);
                let tempX2 = this.xPos * cos(phi) - this.yPos * sin(phi);
                let tempY = fishList[i].xPos * sin(phi) + fishList[i].yPos * cos(phi);
                let tempY2 = this.xPos * sin(phi) + this.yPos * cos(phi);

                if(this.theta < fishList[i].theta) {
                    gamma += 1;
                } else {
                    gamma -= 1;
                }

                if(dis < 50) {
                    
                    if(tempY < tempY2 + 10) {
                        
                        if(dis < 50) {
                            if(tempX > tempX2) {
                                gamma += -(1);
                            } else {
                                gamma += (1 );
                            }
                        }
                    } 
                    
                }


                
                this.cX = fishList[i].xPos;
                this.cY = fishList[i].yPos;
                if(this.yep) {
                  line(this.xPos,this.yPos,this.cX,this.cY);
                }
            }
        }
        // console.log(avgX);
        avgX = avgX / avgC;
        avgY = avgY / avgC;
        let phi = 90 - this.theta;
        let tempX = avgX * cos(phi) - avgY * sin(phi);
        let tempX2 = this.xPos * cos(phi) - this.yPos * sin(phi);
        let tempXM = mouseX * cos(phi) - mouseY * sin(phi);
        let tempY = avgX * sin(phi) + avgY * cos(phi);
        let tempY2 = this.xPos * sin(phi) + this.yPos * cos(phi);
        let tempYM = mouseX * sin(phi) + mouseY * cos(phi);
        // if(tempY < tempY2) {
            if(tempX < tempX2) {
                gamma += (-1);
            } else {
                gamma += (1);
            }
        // } 
        if(sqrt(pow(this.xPos - mouseX,2) + pow(this.yPos - mouseY,2)) < 9) {
            circle(mouseX,mouseY,25);
            if(tempXM < tempX2) {
                gamma += -15;
            } else {
                gamma += 15;
            }
        }         
        if(this.yep) {
            fill(this.color);
            circle(avgX,avgY,5);
        }
        this.update(gamma);
    }
  }
  