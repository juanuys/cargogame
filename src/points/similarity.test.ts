import {describe, expect, test} from "@jest/globals"
import howManyPointsInCommon from "./similarity"


describe('similarity of array of points', () => {
    test('variety1', () => {
        const points1 = [
            [ 20, 20 ],
            [ 10, 20 ],
            [ 5, 5 ]
        ]

        const points2 = [
            [ 20, 20 ],
            [ 10, 20 ],
            [ 9, 9 ]
        ]

        expect(howManyPointsInCommon(points1, points2)).toBe(2)
    })

    test('variety1', () => {
        const points1 = [
            [ 20, 0 ],
            [ 10, 20 ],
            [ 5, 5 ]
        ]

        const points2 = [
            [ 20, 20 ],
            [ 10, 20 ],
            [ 9, 9 ]
        ]

        expect(howManyPointsInCommon(points1, points2)).toBe(1)
    })
})

