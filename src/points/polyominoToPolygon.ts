import {IPoint} from "../polys/model";

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

    // TODO fix this rubbish...

    const lookup = polyomino.reduce((acc, point) => {
        let key = `${point.x}-${point.y}`;
        return Object.assign(acc, {
            [key]: point,
        })
    }, {})

    return polyomino.reduce((acc, point: IPoint) => {
        const shiftedX = point.x * width
        const shiftedY = point.y * width
        const shift = width / 2

        return acc.concat([
            { x: shiftedX + shift, y: shiftedY + shift, },
            { x: shiftedX + shift, y: shiftedY - shift, },
            { x: shiftedX - shift, y: shiftedY + shift, },
            { x: shiftedX - shift, y: shiftedY - shift, },
        ])
    }, [])
}
