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
let speedPool = 0
let img
var click = new Howl({
  src: "https://freesound.org/data/previews/256/256116_4486188-lq.mp3"
})

function setup() {
  let sketch = document.getElementById("sketch")
  container = createDiv()
  container.class('container-fluid')
  container.parent(sketch)

  ui = createDiv()
  output = createDiv()
  output.parent(ui)
  output.class("col-md-6 col-xs-12 border rounded")
  ui.class("row border rounded")
  output.id("ui")
  output.style("overflow-y", "auto")
  output.style("max-height", "200px")
  output.style("height", "200px")
  ui.parent(container)
  c = createCanvas(windowWidth, 600)
  windowResized()
  frameRate(120)
  c.parent(container)
  inp = createElement("textarea", '');
  inp.style("height", "200px")
  inp.input(myInputEvent);
  inp.class("col-md-6 col-xs-12 border rounded")
  inp.parent(ui)
  inp.style("resize", "none")
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
    } else if (tmp[i] == "" && !tmp[i + 1]) {
      tmp.slice(i, 1)
    }
  }
  //console.log(TAU);

}

function windowResized() {
  if (windowWidth <= windowHeight / 1.8) {
    resizeCanvas(windowWidth*0.9, windowWidth * 0.9);
  } else {
    resizeCanvas(windowWidth*0.9, windowHeight / 1.8);
  }
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
  speed += speed < 0.5 ? 10 : speed * 1.001
  if (speed>60) {
    speed=60
  }
}

function draw() {

  speed /= 1.01

  speed = +speed.toFixed(5)
  //console.log(speed);
  if (speed <= 0.5) {
    speed /= 1.001
  }
  if (speed <= 0.002) {
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
      if (arcs[i].selected == false) {
        click.play()

      }
      arcs[i].selected = true
    } else {
      arcs[i].selected = false
    }
    if (spins > 0 && speed == 0) {
      if (arcs[i].selected) {
        line++
        let temp = createDiv(`${line}: ${arcs[i].name}`)
        temp.class('d-block col')
        temp.id(line)
        if (line % 2 == 0) {

          temp.style("background", "#989898")
        } else {
          temp.style("background", "#FFFFFF")
        }
        temp.class("text-center rounded outline font-weight-bold")
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
    this.f = ((stringToNum(this.name)/100) * 16777216) % 255
    this.color = this.f
    this.selected = false
  }
  show() {
    push()
    colorMode(HSB, 255, 255, 255, 255)
    if (this.selected) {
      this.color = lerp(this.color, 255, 0.5)
      fill(this.color, 250, 200, 255)
    } else {
      this.color = lerp(this.color,(this.f),0.1)
      fill(this.color, 200, 200, 255)
    }
    arc(0, 0, height, height, 0, 6.283 / arcs.length, PIE)
    pop()
    fill(0, 0, 0, 255)
    textSize(20)
    textAlign(CENTER);
    //this.selected = false
    push()
    rotate((6.283 / arcs.length) / 2)
    translate(height / 2.5, 0)
    rotate(3.141 / 2)

    text(this.name, 0, 0)

    pop()
  }
}

function stringToNum(str) {
  let tmp = 0
  for (var i = 0; i < str.length; i++) {
    tmp += (str.charCodeAt(i));
  }
  return tmp
}
