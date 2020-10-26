import {describe, expect, test} from "@jest/globals"
import sortPoints from "./pointsToPolygon"
import {IPoint} from "../polys/model";

/**
 *
 * Ensures this:
 *
 *    y
 *    ^
 *    |
 * 10 |   2      4
 *    |
 *  5 |   1      3
 *    +-------------> x
 *   0    5      10
 *
 *
 * Is sorted to this:
 *
 *    y
 *    ^
 *    |
 * 10 |   3      4
 *    |
 *  5 |   2      1
 *    +-------------> x
 *   0    5      10
 */
describe('sortPoints', () => {
    test('variety1', () => {
        const points: IPoint[] = [
            {x: 5, y: 5},
            {x: 5, y: 10},
            {x: 10, y: 5},
            {x: 10, y: 10},
        ]

        expect(sortPoints(points)).toStrictEqual([
            {x: 10, y: 5},
            {x: 5, y: 5},
            {x: 5, y: 10},
            {x: 10, y: 10},
        ])
    })

    test('variety2', () => {
        const points: IPoint[] = [
            {x: 5, y: 5},
            {x: 5, y: 10},
            {x: 10, y: 5},
            {x: 10, y: 10},
        ]

        expect(sortPoints(points)).toStrictEqual([
            {x: 10, y: 5},
            {x: 5, y: 5},
            {x: 5, y: 10},
            {x: 10, y: 10},
        ])
    })
})

