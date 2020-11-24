import makeTile from "./tiling"
import {ITiles} from "./model"
import {describe, beforeEach, afterEach, expect, test, jest} from "@jest/globals"
import seedrandom from "seedrandom"
import * as _ from "lodash"
import util from "./util"
import {normalise, addRotations} from "./solution"


beforeEach(() => {
    const rng = seedrandom("hello.")

    // create a new seeded lodash
    const MathOverride = Object.create(Math)
    MathOverride.random = rng
    const lodash = _.runInContext({
        Math: MathOverride
    })

    // use the seeded lodash
    const spy = jest.spyOn(util, "shuffle")
    spy.mockImplementation(lodash.shuffle)

    jest.spyOn(global.Math, 'random').mockImplementation(rng)
});

afterEach(() => {
    jest.clearAllMocks()
})

describe('normalise', () => {
    test('1 point', () => {
        const actual = normalise([{x:0, y:0}])
        expect(actual).toStrictEqual([{x:0, y:0}])
        // idempotent
        expect(normalise(actual)).toStrictEqual([{x:0, y:0}])
    })

    test('2 points', () => {
        const actual = normalise([{x:0, y:0}, {x:1, y:0}])
        expect(actual).toStrictEqual([{x:0, y:0}, {x:1, y:0}])
        // idempotent
        expect(normalise(actual)).toStrictEqual([{x:0, y:0}, {x:1, y:0}])
    })

    test('2 points swapped', () => {
        const actual = normalise([{x:1, y:0}, {x:0, y:0}])
        expect(actual).toStrictEqual([{x:0, y:0}, {x:1, y:0}])
        // idempotent
        expect(normalise(actual)).toStrictEqual([{x:0, y:0}, {x:1, y:0}])
    })

    test('3 points', () => {
        const actual = normalise([{x:1, y:1}, {x:1, y:0}, {x:0, y:0}])
        expect(actual).toStrictEqual([{x:0, y:0}, {x:1, y:0}, {x:1, y:1}])
        // idempotent
        expect(normalise(actual)).toStrictEqual([{x:0, y:0}, {x:1, y:0}, {x:1, y:1}])
    })
})

describe('addRotations', () => {
    test('1 point', () => {
        let actual = []
        addRotations(actual, [{x:0, y:0}])
        expect(actual).toStrictEqual([[{x:0, y:0}]])
    })

    test('2 points I shape', () => {
        let actual = []
        addRotations(actual, [{x:0, y:0}, {x:0, y:1}])
        expect(actual).toStrictEqual([
            [{x:0, y:0}, {x:0, y:1}],
            [{x:0, y:0}, {x:1, y:0}]
        ])
    })

    test('3 points L shape', () => {
        let actual = []
        addRotations(actual, [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}])
        expect(actual.length).toBe(4)
        expect(actual[0]).toStrictEqual([{x:0, y:0}, {x:1, y:0}, {x:0, y:1}])
        expect(actual[1]).toStrictEqual([{x:0, y:0}, {x:1, y:0}, {x:1, y:1}])
        expect(actual[2]).toStrictEqual([{x:0, y:0}, {x:-1, y:1}, {x:0, y:1}])
        expect(actual[3]).toStrictEqual([{x:0, y:0}, {x:0, y:1}, {x:1, y:1}])
    })
})
