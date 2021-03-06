//
// index.js
// clock-p5js
//
// Created by Johannes Jakob
// © 2018 Johannes Jakob
//
// Find the project repository on github.com/JohJakob/clock-p5js
//

// Declare global variables

var backgroundColor, dayDisplayColor, dayDisplayTextColor, hourScaleColor, minuteScaleColor, hourHandColor, minuteHandColor, secondHandColor;
var dayDisplayStrokeWeight, hourScaleStrokeWeight, minuteScaleStrokeWeight, hourHandStrokeWeight, minuteHandStrokeWeight, secondHandStrokeWeight;
var clockRadius, longestSide;
var isDay;
var dayToCheck;
var sunrise, sunset, sunriseDate, sunsetDate;
var displayHourScaleLabels, displayDay;

function setup() {
	// Create canvas and set modes

	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	angleMode(DEGREES);

	// Initialize sketch

	setSizes();
	setColors();
	setStrokeWeights();

	// Hour scale labels and day display should be visible by default

	displayHourScaleLabels = true;
	displayDay = true;

	// Set day to get sunrise and sunset times for

	var date = new Date();

	dayToCheck = date.toISOString().substring(0, 10);

	// Retrieve current position using p5.geolocation

	getCurrentPosition(getLocation);
}

function draw() {
	background(backgroundColor);

	// Transform coordinate system

	push();

	translate(width / 2, height / 2);

	if (displayDay) {
		drawDayDisplay();
	}

	rotate(-90);

	drawHourScale();
	drawMinuteScale();

	drawHourHand();
	drawMinuteHand();
	drawSecondHand();

	pop();
}

function windowResized() {
	// Resize canvas and recalculate relative sizes and stroke weights

	resizeCanvas(windowWidth, windowHeight);
	setSizes();
	setStrokeWeights();
}

function keyPressed() {
	// Toggle hour scale labels and day display when specific keys have been pressed

	switch (keyCode) {
		case 72:
			// Keycode 72 is key H

			displayHourScaleLabels = !displayHourScaleLabels;

			if (displayHourScaleLabels) {
				print("Key H has been pressed. Enabling hour scale labels");
			} else {
				print("Key H has been pressed. Disabling hour scale labels");
			}
			break;
		case 68:
			// Keycode 68 is key D

			displayDay = !displayDay;

			if (displayDay) {
				print("Key D has been pressed. Enabling day display");
			} else {
				print("Key D has been pressed. Disabling day display");
			}
			break;
		default:
			break;
	}
}

function setSizes() {
	// Set clock radius based on longest screen side

	if (width < height) {
		clockRadius = width / 2 - width / 10;
	} else {
		clockRadius = height / 2 - height / 10;
	}
}

function setColors() {
	// Set initial colors

	backgroundColor = color(0, 0, 255);

	dayDisplayColor = color(0, 0, 40);
	dayDisplayTextColor = color(0, 0, 0);
	hourScaleColor = color(0, 0, 0);
	minuteScaleColor = color(0, 0, 0);
	hourHandColor = color(0, 0, 50);
	minuteHandColor = color(0, 0, 0);
	secondHandColor = color(45, 100, 100);
}

function setStrokeWeights() {
	dayDisplayStrokeWeight = clockRadius / 100;
	hourScaleStrokeWeight = clockRadius / 40;
	minuteScaleStrokeWeight = clockRadius / 120;
	hourHandStrokeWeight = clockRadius / 20;
	minuteHandStrokeWeight = clockRadius / 40;
	secondHandStrokeWeight = clockRadius / 60;
}

function drawDayDisplay() {
	push();

	translate(clockRadius / 2.5, 0);

	noFill();
	stroke(dayDisplayColor);
	strokeWeight(dayDisplayStrokeWeight);
	rectMode(CENTER);
	rect(0, 0, clockRadius / 4, clockRadius / 5, clockRadius / 30);

	fill(dayDisplayTextColor);
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(clockRadius / 8);
	text(day(), 0, clockRadius / 240);

	pop();
}

function drawHourScale() {
	push();

	// Draw 12 lines as hour scale

	for (var i = 0; i < 12; i++) {
		stroke(hourScaleColor);
		strokeWeight(hourScaleStrokeWeight);
		line(clockRadius, 0, clockRadius - clockRadius / 8, 0);

		rotate(30);

		if (displayHourScaleLabels) {
			push();

			// Draw scale labels

			translate(clockRadius - clockRadius / 4, 0);
			rotate(-30 * (i + 1) + 90);

			fill(hourScaleColor);
			noStroke();
			textSize(clockRadius / 6);
			textAlign(CENTER, CENTER);
			text(i + 1, 0, 0);

			pop();
		}
	}

	pop();
}

function drawMinuteScale() {
	push();

	// Draw 60 lines as minute scale

	for (var i = 0; i < 60; i++) {
		stroke(minuteScaleColor);
		strokeWeight(minuteScaleStrokeWeight);
		line(clockRadius, 0, clockRadius - clockRadius / 16, 0);
		rotate(6);
	}

	pop();
}

function drawHourHand() {
	push();

	// Set rotation based on current hour and current minute (to move hour hand smoothly between hours)

	var rotation = map(hour(), 0, 24, 0, 360 * 2) + map(minute(), 0, 60, 0, 360 / 12);

	rotate(rotation);

	// Draw hour hand

	stroke(hourHandColor);
	strokeWeight(hourHandStrokeWeight);
	strokeCap(SQUARE);
	line(0, 0, clockRadius - clockRadius / 3, 0);

	pop();
}

function drawMinuteHand() {
	push();

	// Set rotation based on current minute and current second (to move minute hand smoothly between minutes)

	var rotation = map(minute(), 0, 60, 0, 360) + map(second(), 0, 60, 0, 360 / 60);

	rotate(rotation);

	// Draw minute hand

	stroke(minuteHandColor);
	strokeWeight(minuteHandStrokeWeight);
	strokeCap(SQUARE);
	line(0, 0, clockRadius - clockRadius / 6, 0);

	pop();
}

function drawSecondHand() {
	push();

	// Get current millisecond using vanilla JavaScript because p5.js does not offer current millisecond

	var date = new Date();
	var currentMillisecond = date.getMilliseconds();

	// Set rotation based on current second and current millisecond (to move second hand smoothly between seconds)

	var rotation = map(second(), 0, 60, 0, 360) + map(currentMillisecond, 0, 1000, 0, 360 / 60);

	rotate(rotation);

	// Draw second hand

	stroke(secondHandColor);
	strokeWeight(secondHandStrokeWeight);
	line(0, 0, clockRadius - clockRadius / 6, 0);

	// Draw second hand mount

	strokeWeight(secondHandStrokeWeight * 1.5);

	line(0, 0, -clockRadius / 8, 0);

	fill(backgroundColor);
	strokeWeight(secondHandStrokeWeight);

	ellipse(0, 0, clockRadius / 16, clockRadius / 16);

	pop();
}

function getLocation(position) {
	print('Geolocation is available');
	print('Current latitude: ' + position.latitude);
	print('Current longitude: ' + position.longitude);

	// Load JSON data from Sunrise Sunset API and run getSunTimes()

	var apiURL = 'https://api.sunrise-sunset.org/json?lat=' + position.latitude + '&lng=' + position.longitude + '&date=' + dayToCheck + '&formatted=0';

	print('Loading JSON response from ' + apiURL);

	loadJSON(apiURL, getSunTimes);
}

function getSunTimes(data) {
	// Set sun times from JSON data

	sunrise = data.results.sunrise;
	sunset = data.results.sunset;

	// Create dates from date strings

	sunriseDate = new Date(sunrise);
	sunsetDate = new Date(sunset);

	print('Sunrise at current location: ' + sunriseDate);
	print('Sunset at current location: ' + sunsetDate);

	// Update colors

	updateColors();

	// Check time and compare it to sunrise and sunset times

	checkTime(updateColors);
}

function updateColors() {
	var date = new Date();

	// Compare current date with sunrise and sunset and set clock's colors accordingly (night -> dark, day -> light)

	if (date < sunriseDate || date > sunsetDate) {
		print("Enabling night mode");

		isDay = false;

		backgroundColor = color(0, 0, 0);

		dayDisplayColor = color(0, 0, 40);
		dayDisplayTextColor = color(0, 0, 100);
		hourScaleColor = color(0, 0, 100);
		minuteScaleColor = color(0, 0, 100);
		hourHandColor = color(0, 0, 50);
		minuteHandColor = color(0, 0, 100);
		secondHandColor = color(45, 100, 100);
	} else {
		print("Disabling night mode");

		isDay = true;

		backgroundColor = color(0, 0, 255);

		dayDisplayColor = color(0, 0, 40);
		dayDisplayTextColor = color(0, 0, 0);
		hourScaleColor = color(0, 0, 0);
		minuteScaleColor = color(0, 0, 0);
		hourHandColor = color(0, 0, 50);
		minuteHandColor = color(0, 0, 0);
		secondHandColor = color(45, 100, 100);
	}
}

function checkTime(callback) {
	(function loop() {
		print("Checking the current time");

		var date = new Date();

		if (date > sunsetDate) {
			// Get date for tomorrow

			var tomorrow = new Date();

			tomorrow.setDate(date.getDate() + 1);
			dayToCheck = tomorrow.toISOString().substring(0, 10);

			print("The sun has set. Updating location and getting sunrise and sunset times for tomorrow: " + dayToCheck);

			// Update location and get sunrise and sunset times for tomorrow

			getCurrentPosition(getLocation);
		}

		if ((!isDay && (date > sunriseDate && date < sunsetDate)) || (isDay && (date < sunriseDate))) {
			print("Sunrise/Sunset happened. Running the callback function");

			// Run callback function that was given as argument

			callback();
		}

		// Call function loop every exact minute

		date = new Date();

		var delay = 60000 - (date % 60000);

		setTimeout(loop, delay);
	})();
}
