import {expect, test} from "@jest/globals"
import find from "./uniquePoints"
import {IPoint} from "../polys/model";


test('uniquePoints', () => {
    const points: IPoint[] = [
        { x: 7, y: 7 },
        { x: -10, y: 30 },
        { x: 10, y: -20 },
        { x: -10, y: 30 },
        { x: 7, y: 7 },
    ]

    expect(find(points)).toStrictEqual([
        { x: 7, y: 7 },
        { x: -10, y: 30 },
        { x: 10, y: -20 },
    ])
})
