let fishList = [];
let fish;
const dimWidth = screen.availWidth
const dimHieght = screen.availHeight - 100; 

function preload() {
  for(let i = 0; i < 500; i++) {
    fishList.push(new Boid(Math.random() * dimWidth,Math.random() * dimWidth,3, 255, dimWidth));
    fishList[i].update(i);
  }
  fishList[0].yep = true;
  fishList[0].color = 255;
  // fish = new Boid();
}

function setup() {
  console.log(dimWidth)
  let cnv = createCanvas(dimWidth, dimHieght);
  angleMode(DEGREES);
  cnv.position(0, 0, 'relative');
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