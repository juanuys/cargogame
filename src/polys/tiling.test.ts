import makeTile from "./tiling"
import {ITiles} from "./model"
import {beforeEach, afterEach, expect, test, jest} from "@jest/globals"
import seedrandom from "seedrandom"
import * as _ from "lodash"
import util from "./util"


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

test('tiles 10x6', () => {
    const tiles: ITiles = makeTile(10, 6)

    expect(tiles.polys.length).toBe(18)
    expect(tiles.polys.filter((p) => p.isUsed).length).toBe(12)

    expect(tiles.board.length).toBe(8)
    expect(tiles.board[0].length).toBe(12)

    // padded board
    // tiles.board.forEach((row, idx) => {
    //     console.log(idx, JSON.stringify(row))
    // })

    expect(tiles.board[0]).toStrictEqual([0,0,0,0,0,0,0,0,0,0,0,0])
    expect(tiles.board[1]).toStrictEqual([0,10,11,11,11,11,12,13,13,18,18,0])
    expect(tiles.board[2]).toStrictEqual([0,10,10,10,11,12,12,13,18,18,2,0])
    expect(tiles.board[3]).toStrictEqual([0,10,4,5,5,5,12,13,13,18,2,0])
    expect(tiles.board[4]).toStrictEqual([0,4,4,5,5,15,12,9,9,9,2,0])
    expect(tiles.board[5]).toStrictEqual([0,8,4,4,15,15,15,9,9,2,2,0])
    expect(tiles.board[6]).toStrictEqual([0,8,8,8,8,15,14,14,14,14,14,0])
    expect(tiles.board[7]).toStrictEqual([0,0,0,0,0,0,0,0,0,0,0,0])
})

// test('tiles at least 3x3', () => {
//     const tiles: ITiles = makeTile(1, 1)
//
//     expect(tiles.polys.length).toBe(18)
//     expect(tiles.polys.filter((p) => p.isUsed).length).toBe(12)
//
//     expect(tiles.board.length).toBe(8)
//     expect(tiles.board[0].length).toBe(12)
//
// })
