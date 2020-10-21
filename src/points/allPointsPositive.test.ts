import {describe, expect, test} from "@jest/globals"
import positivise from "./allPointsPositive"
import {IPoint} from "../polys/model";


test('positivise', () => {
    const points: IPoint[] = [
        { x: -10, y: 30 },
        { x: 10, y: -20 },
    ]

    expect(positivise(points)).toStrictEqual([
        { x: 0, y: 50 },
        { x: 20, y: 0 },
    ])
})

describe("skip already positive", () => {
    test('do nothing if already positive', () => {
        const points: IPoint[] = [
            { x: 10, y: 30 },
            { x: 10, y: 20 },
        ]

        expect(positivise(points, true)).toStrictEqual([
            { x: 10, y: 30 },
            { x: 10, y: 20 },
        ])
    })

    test('only change one axis', () => {
        const points: IPoint[] = [
            { x: -10, y: 30 },
            { x: 10, y: 20 },
        ]

        expect(positivise(points, true)).toStrictEqual([
            { x: 0, y: 30 },
            { x: 20, y: 20 },
        ])
    })
})

describe("positivise all", () => {
    test('even if already positive', () => {
        const points: IPoint[] = [
            { x: 10, y: 30 },
            { x: 10, y: 20 },
        ]

        expect(positivise(points)).toStrictEqual([
            { x: 0, y: 10 },
            { x: 0, y: 0 },
        ])
    })

    test('change all axes', () => {
        const points: IPoint[] = [
            { x: -10, y: 30 },
            { x: 10, y: 20 },
        ]

        expect(positivise(points)).toStrictEqual([
            { x: 0, y: 10 },
            { x: 20, y: 0 },
        ])
    })
})
