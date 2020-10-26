import gameConfig from "../gameConfig"
import Phaser from "phaser";

function _check(factor: number) {
    if (factor < 0.0 || factor > 1.0) {
        throw new Error("factor is out of bounds")
    }
}

function _scaler(factor: number, wh: number): number {
    _check(factor)
    return wh * factor
}

/**
 * Returns a width between 0 and game width, by factor.
 * Defaults to game width, i.e. factor of 1.0
 * @param factor
 */
function w(factor: number = 1.0): number {
    return _scaler(factor, gameConfig.width)
}

/**
 * Returns a height between 0 and game height, by factor.
 * Defaults to game height, i.e. factor of 1.0
 * @param factor
 */
function h(factor: number = 1.0): number {
    return _scaler(factor, gameConfig.height)
}

/**
 * Gets an X coordinate between 0 and width, by factor.
 * Defaults to half-way between 0 and width, i.e. factor of 0.5
 * @param factor
 */
function x(factor: number = 0.5) {
    return _scaler(factor, gameConfig.width)
}

/**
 * Gets a Y coordinate between 0 and height, by factor.
 * Defaults to half-way between 0 and height, i.e. factor of 0.5
 * @param factor
 */
function y(factor: number = 0.5) {
    return _scaler(factor, gameConfig.height)
}

function rect(x: number, y: number, width: number, height: number, centered: boolean = true) {
    let _x = x
    let _y = y
    if (centered) {
        _x = x - (width / 2)
        _y = y - (height / 2)
    }
    return new Phaser.Geom.Rectangle(_x, _y, width, height)
}

export default {
    w, h, x, y, rect,
    randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    },
}
