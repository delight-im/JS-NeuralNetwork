/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

var ActivationFunction = require("./ActivationFunction.js");

/**
 * ArcTangent (also `arctan`, `atan` or `tan^(-1)`), a sigmoid function, that can be used as an activation function
 *
 * @constructor
 * @extends ActivationFunction
 */
function ArcTangent() {

	// call the super class's constructor
	ActivationFunction.call(this);

	this.evaluate = function (x) {
		return Math.atan(x);
	};

	this.evaluateDerivative = function (x) {
		return 1 / (Math.pow(x, 2) + 1);
	};

	this.getLowerBound = function () {
		return - Math.PI / 2;
	};

	this.getUpperBound = function () {
		return Math.PI / 2;
	};

	this.isMonotonic = function () {
		return true;
	};

	this.isDerivativeMonotonic = function () {
		return false;
	};

	this.isCenteredAroundZero = function () {
		return true;
	};

}

// create a prototype that inherits from the super class's prototype
ArcTangent.prototype = Object.create(ActivationFunction.prototype);
// fix the constructor pointer so that it doesn't point to the super class
ArcTangent.prototype.constructor = ArcTangent;

module.exports = ArcTangent;
