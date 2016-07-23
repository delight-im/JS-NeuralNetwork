/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

var ActivationFunction = require("./ActivationFunction.js");

/**
 * Rectified Linear Unit (ReLU), also known as a "ramp function", that can be used as an activation function
 *
 * This function inhibits all input below the threshold of zero
 *
 * The major advantages are that this function prevents the vanishing gradient problem and is fast to compute
 *
 * The major downside of this function is that a significant share of neurons may irreversibly "die"
 *
 * The "dying ReLU" problem occurs especially with large learning rates and prevents neurons from activating ever again
 *
 * The "leaky" or parameterized versions of this function are an attempt to fix the "dying ReLU" problem
 *
 * @constructor
 * @extends ActivationFunction
 * @param {number} [parameter] - the parameter for a "leaky" or parameterized version, i.e. a small positive number
 */
function RectifiedLinearUnit(parameter) {

	// call the super class's constructor
	ActivationFunction.call(this);

	/**
	 * The parameter for a "leaky" or parameterized version of this function
	 *
	 * Enabled when using a non-zero value, small positive numbers such as `0.01` should be used
	 *
	 * @type {number}
	 * @private
	 */
	this._parameter = parameter || 0;

	this.evaluate = function (x) {
		if (x < 0) {
			return this._parameter * x;
		}
		else {
			return x;
		}
	};

	this.evaluateDerivative = function (x) {
		if (x < 0) {
			return this._parameter;
		}
		else {
			return 1;
		}
	};

	this.getLowerBound = function () {
		if (this._parameter > 0) {
			return Number.NEGATIVE_INFINITY;
		}
		else {
			return 0;
		}
	};

	this.getUpperBound = function () {
		return Number.POSITIVE_INFINITY;
	};

	this.isMonotonic = function () {
		return true;
	};

	this.isDerivativeMonotonic = function () {
		return true;
	};

	this.isCenteredAroundZero = function () {
		return false;
	};

}

// create a prototype that inherits from the super class's prototype
RectifiedLinearUnit.prototype = Object.create(ActivationFunction.prototype);
// fix the constructor pointer so that it doesn't point to the super class
RectifiedLinearUnit.prototype.constructor = RectifiedLinearUnit;

module.exports = RectifiedLinearUnit;
