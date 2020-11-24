import {describe, expect, test} from "@jest/globals"
import convert from "./polyominoToPolygon"
import {IPoint} from "../polys/model";


describe('convert', () => {
    test('variety1', () => {
        const points: IPoint[] = [
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1},
            {x: 2, y: 1},
        ]

        expect(convert(points, 10)).toStrictEqual([
            [15, 15],
            [5, 15],
            [-5, 15],
            [-5, 5],
            [-5, -5],
            [5, -5],
            [5, 5],
            [15, 5],
            [25, 5],
            [25, 15],
        ])
    })

    test('variety2', () => {
        const points: IPoint[] = [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: -1, y: 1},
            {x: 0, y: 1},
            {x: -1, y: 2},
        ]

        expect(convert(points, 10)).toStrictEqual([
            [-5, 15],
            [-5, 25],
            [-15, 25],
            [-15, 15],
            [-15, 5],
            [-5, 5],
            [-5, -5],
            [5, -5],
            [15, -5],
            [15, 5],
            [5, 5],
            [5, 15],
        ])
    })
})

