let fishList = [];
let fish;
const DIM = 1000

function preload() {
  for(let i = 0; i < 500; i++) {
    fishList.push(new Boid(Math.random() * DIM,Math.random() * DIM,3, 255, DIM));
    fishList[i].update(i);
  }
  fishList[0].yep = true;
  fishList[0].color = 255;
  // fish = new Boid();
}

function setup() {
  createCanvas(DIM, DIM);
  angleMode(DEGREES);
  // for(let i = 0; i < 10; i++) {
  //   fishList.push(new Boid());
  // }
  console.log(fishList);
}

function draw() {
  background(200);
  for(let i = 0; i < fishList.length; i++) {
    fishList[i].check(fishList,i);
    fishList[i].update(0);
    fishList[i].display();
    // console.log(fishList[i]);
  }
}