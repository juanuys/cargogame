import {IPoint} from "../polys/model"
import {polygon} from 'polygon-tools'
import howManyPointsInCommon from "./similarity"

/**
 * Accepts an array of polyomino points, and converts it to polygon points.
 *
 * E.g. the tetromino L shape
 *
 * [ [0,0], [0,1], [1,1], [2,1] ]
 *
 *     y
 *     ^
 *   3 |
 *   2 |
 *   1 |  b  c  d
 *   0 |  a
 *     +--.--.--.--.------->x
 *        0  1  2  3  4
 *
 *   Given width 10, convert it to
 *   [
 *      [0 , 0], // a
 *      [0 ,10], // b
 *      [0 ,20], // c
 *      [10,20], // d
 *      [20,20], // e
 *      [30,20], // f
 *      [30,10], // g
 *      [20,10], // h
 *      [10,10], // i
 *      [10, 0], // j
 *   ]
 *
 *     y
 *     ^
 *  20 |  c     d     e     f
 *  15 |
 *  10 |  b     i     h     g
 *   5 |
 *   0 |  a     j
 *     +--.--.--.--.--.--.--.--->x
 *        0  5 10 15 20 25 30 35
 *
 *
 * "normalise" would not matter here. We have to walk the squares ourselves.
 *
 * @param polyomino
 * @param width
 */
export default function convert(polyomino: IPoint[], width: number): IPoint[] {
    const pointsToRects = polyomino.reduce((acc, point: IPoint) => {
        const x = point.x * width
        const y = point.y * width

        acc.push([
            [x, y],
            [x + width, y],
            [x + width, y + width],
            [x, y + width],
        ])
        return acc
    }, [])


    return arrOfRectsToPolygon(pointsToRects)
}

/**
 * Accepts this shape:
 * [
 *      [
 *          [0,0],
 *          [10,10]
 *      ],
 *      [
 *          [20,10],
 *          [30,20]
 *      ]
 * ]
 *
 * @param pointsToRects
 */
function arrOfRectsToPolygon(pointsToRects) {

    const base = {
        remainder: [],
        union: pointsToRects[0]
    }

    const result = pointsToRects.splice(1).reduce((acc, val, idx) => {
        // if the poly doesn't have at least 2 points in common with the acc,
        // then move it to the end of the remainder for later processing
        if (howManyPointsInCommon(acc.union, val) < 2) {
            return {
                remainder: acc.remainder.concat(val),
                union: acc.union
            }
        } else {
            return {
                remainder: acc.remainder,
                union: polygon.union(acc.union, val)[0]
            }
        }
    }, base)

    if (result.remainder.length === 0) {
        // nothing left to process
        return result.union
    } else {
        const unionAndRemainder = [
            result.union,
            result.remainder
        ]
        return arrOfRectsToPolygon(unionAndRemainder)
    }
}
