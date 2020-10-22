import {describe, expect, test} from "@jest/globals"
import convert from "./polyominoToPolygon"
import {IPoint} from "../polys/model";


describe.skip('convert', () => {
    test('variety1', () => {
        const points: IPoint[] = [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
        ]

        /**
         * [
         *      [0 , 0],
         *      [0 ,10],
         *      [0 ,20],
         *      [10,20],
         *      [20,20],
         *      [30,20],
         *      [30,10],
         *      [20,10],
         *      [10,10],
         *      [10, 0],
         *   ]
         */
        expect(convert(points, 10)).toStrictEqual([
            { x: 0, y: 0 },
            { x: 0, y: 10 },
            { x: 0, y: 20 },
            { x: 10, y: 20 },
            { x: 20, y: 20 },
            { x: 30, y: 20 },
            { x: 30, y: 10 },
            { x: 20, y: 10 },
            { x: 10, y: 10 },
            { x: 10, y: 0 },
        ])
    })

})

