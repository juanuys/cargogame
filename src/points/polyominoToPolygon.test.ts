import {describe, expect, test} from "@jest/globals"
import convert from "./polyominoToPolygon"
import {IPoint} from "../polys/model";


describe('convert', () => {
    test('variety1', () => {
        const points: IPoint[] = [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ]

        expect(convert(points, 10)).toStrictEqual([
            [ 20, 20 ],
            [ 10, 20 ],
            [ 0, 20 ],
            [ 0, 10 ],
            [ 0, 0 ],
            [ 10, 0 ],
            [ 10, 10 ],
            [ 20, 10 ],
            [ 30, 10 ],
            [ 30, 20 ],
        ])
    })

    test('variety2', () => {
        const points: IPoint[] = [
            { x: 0, y: 0},
            { x: 1, y: 0},
            { x:-1, y: 1},
            { x: 0, y: 1},
            { x:-1, y: 2},
        ]

        expect(convert(points, 10)).toStrictEqual([
            [ 0, 20 ],
            [ 0, 30 ],
            [ -10, 30 ],
            [ -10, 20 ],
            [ -10, 10 ],
            [ 0, 10 ],
            [ 0, 0 ],
            [ 10, 0 ],
            [ 20, 0 ],
            [ 20, 10 ],
            [ 10, 10 ],
            [ 10, 20 ],
        ])
    })
})

