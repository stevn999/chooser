let arcs = []
let speed = 0
let spinCount = 0
let spins = 0
let offset = 0
let c
let container
let ui
let output
let inp
let line = 0

function setup() {
  container = createDiv()
  container.class('container-fluid')
  ui = createDiv()
  output = createDiv()
  output.parent(ui)
  output.class("col-6")
  ui.class("row")
  output.id("ui")
  output.style("overflow-y","auto")
  output.style("max-height","200px")
  output.style("height","200px")
  ui.parent(container)
  c = createCanvas(windowWidth, 600)
  c.parent(container)
  inp = createElement("textarea", '');
  inp.input(myInputEvent);
  inp.class("col-6")
  inp.parent(ui)
  inp.style("resize","none")
  c.mouseClicked(ms)
  if (localStorage.getItem('arcs')) {
    console.log(localStorage.getItem('arcs'));
    if (localStorage.getItem('arcs') == "[object Object]" || localStorage.getItem('arcs') == "") {
      localStorage.removeItem('arcs')
    }
  }
  if (!localStorage.getItem('arcs')) {
    localStorage.setItem('arcs', '["put stuff here"]')
  }
  tmp = JSON.parse(localStorage.getItem('arcs'))
  for (var i = 0; i < tmp.length; i++) {
    if (tmp[i] != "") {
      arcs.push(new slice(tmp[i]))
      inp.html((tmp[i] + "\n"), true)
    }else if(tmp[i]=="" && !tmp[i+1]) {
      tmp.slice(i,1)
    }
  }
  //console.log(TAU);

}

function myInputEvent() {
  let tmp = this.value().split('\n')
  let hold = []
  for (var i = 0; i < tmp.length; i++) {
    if (tmp[i] != "") {
      hold.push(new slice(tmp[i]))
    }
  }
  arcs = hold
  localStorage.setItem('arcs', JSON.stringify(tmp))
  //console.log(localStorage.getItem('arcs'));
}

function ms() {
  offset = random(6.283)
  spinCount = 0
  spins += 1
  speed = 5
}

function draw() {

  speed /= 1.05
  speed = +speed.toFixed(5)
  if (speed <= 0.01) {
    speed /= 1.01
  }
  if (speed <= 0.001) {
    speed = 0
  }
  //console.log(speed);
  spinCount++
  background(51)
  translate(width / 2, height / 2)
  let r = ((6.283 + offset) * speed + offset)
  push()
  rotate(r)
  for (var i = 0; i < arcs.length; i++) {
    push()
    let pr = (6.283 / arcs.length) * i
    rotate(pr)

    if (((r + pr) % TAU) < 4.71 && ((r + pr) % TAU) > 4.71 - (6.283 / arcs.length)) {
      arcs[i].selected = true
    }
    if (spins > 0 && speed == 0) {
      if (arcs[i].selected) {
        line++
        let temp = createDiv(`${line}: ${arcs[i].name}`)
        temp.class('d-block col')
        temp.id(line)

        temp.parent(output)
        spins = 0
      }
      let elmnt = document.getElementById("ui");
      elmnt.scrollTop = elmnt.scrollHeight
    }
    arcs[i].show()
    pop()

  }
  pop()
  push()
  ellipse(0, -height / 2, 10)
  pop()
}
class slice {
  constructor(name = " ") {
    this.name = name
    this.color = random(10, 256)
    this.selected = false
  }
  show() {
    push()
    colorMode(HSB, 255, 255, 255, 255)
    if (this.selected) {
      fill(5, 250, 200, 255)
    } else {
      fill(this.color, 200, 200, 255)
    }
    arc(0, 0, height, height, 0, 6.283 / arcs.length, PIE)
    pop()
    fill(0, 0, 0, 255)
    textSize(20)
    textAlign(CENTER);
    this.selected = false
    push()
    rotate((6.283 / arcs.length) / 2)
    translate(height / 2.5, 0)
    rotate(3.141 / 2)
    text(this.name, 0, 0)
    pop()
  }
}
