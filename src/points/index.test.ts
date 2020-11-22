import {expect, test} from "@jest/globals"
import {clean} from "./index"
import {IPoint} from "../polys/model";


test('clean', () => {
    debugger
    const points: IPoint[] = [
        {x: 10, y: 5},
        {x: 5, y: 5},
        {x: 5, y: 10},
        {x: 10, y: 5},
        {x: 10, y: 5},
        {x: 10, y: 10},
        {x: 5, y: 5},
    ]

    expect(clean(points)).toStrictEqual([
        {x: 5, y: 0},
        {x: 0, y: 0},
        {x: 0, y: 5},
        {x: 5, y: 5},
    ])
})
