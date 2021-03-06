let y = [],
	x = [];
let fourierX, fourierY;
let path = [],
	time = 0;
const USER = 0,
	FOURIER = 1;
var state = FOURIER;
var drawing = [];

// function mousePressed() {
// 	state = USER;
// 	path = [];
// 	time = 0;
// 	x = [];
// 	y = [];
// 	drawing = [];
// }
// function mouseReleased() {
// 	state = FOURIER;
// 	for (let point of drawing) {
// 		x.push(point.x - width / 2);
// 		y.push(point.y - height / 2);
// 	}
// 	fourierX = dft(x);
// 	fourierY = dft(y);

// 	fourierX.sort((a, b) => b.amp - a.amp);
// 	fourierY.sort((a, b) => b.amp - a.amp);
// }
function keyPressed() {
	if (key === " ") {
		if (state === USER) {
			state = FOURIER;
			for (let point of drawing) {
				x.push(point.x - width / 2);
				y.push(point.y - height / 2);
			}
			fourierX = dft(x);
			fourierY = dft(y);

			fourierX.sort((a, b) => b.amp - a.amp);
			fourierY.sort((a, b) => b.amp - a.amp);
		} else {
			state = USER;
			path = [];
			time = 0;
			x = [];
			y = [];
			drawing = [];
		}
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	// for (let i = 0; i < 500; i++) {
	// 	let angle = map(i, 0, 100, 0, TWO_PI);
	// 	// x.push(150 * noise(i / 50));
	// 	// y.push(150 * noise(i / 50 + 1000));
	// 	x.push(cos(angle) * 100);
	// 	y.push(sin(angle) * 100);
	// 	// x.push(random(100, 300));
	// 	// y.push(random(40, 300));
	// }
	let data = ALL_DATA[floor(random(0, ALL_DATA.length))].drawing;
	for (let d of data) {
		for (let i = 0; i < d[0].length; i++) {
			x.push(d[0][i]);
			y.push(d[1][i]);
		}
	}
	fourierX = dft(x);
	fourierY = dft(y);

	fourierX.sort((a, b) => b.amp - a.amp);
	fourierY.sort((a, b) => b.amp - a.amp);
}

function epiCycles(x, y, rotation, fourier) {
	for (let i = 0; i < fourier.length; i++) {
		let prevX = x;
		let prevY = y;

		let { freq, phase, amp } = fourier[i];
		x += amp * cos(freq * time + phase + rotation);
		y += amp * sin(freq * time + phase + rotation);

		stroke(255);
		line(prevX, prevY, x, y);
		noFill();
		stroke(255, 50);
		circle(prevX, prevY, amp * 2);
	}
	return createVector(x, y);
}

function draw() {
	background(51);

	if (state === FOURIER) {
		let vx = epiCycles(width / 2, 100, 0, fourierX);
		let vy = epiCycles(100, height / 2, HALF_PI, fourierY);
		let v = createVector(vx.x, vy.y);
		path.push(v);

		dt = TWO_PI / fourierX.length;
		time += dt;

		line(vx.x, vx.y, v.x, v.y);
		line(vy.x, vy.y, v.x, v.y);

		push();
		beginShape();
		noFill();
		stroke("red");
		for (let i = 0; i < path.length; i++) {
			vertex(path[i].x, path[i].y);
		}
		endShape();
		pop();
		if (time > TWO_PI) {
			time = 0;
			path = [];
		}
		fill(250, 160, 40, 50);
		noStroke();
		textSize(20);
		textAlign(CENTER);
		text("Press Space to draw yourself!", width / 2, height - 20);
	} else {
		if (mouseIsPressed) drawing.push(createVector(mouseX, mouseY));

		push();
		beginShape();
		noFill();
		stroke("green");
		for (let i = 0; i < drawing.length; i++) vertex(drawing[i].x, drawing[i].y);
		endShape();
	}
	// if (path.length > 200) path.shift();
}
