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

test('tiles', () => {
    const tiles: ITiles = makeTile(6, 10)

    expect(tiles.polys.length).toBe(18)
    expect(tiles.polys.filter((p) => p.isUsed).length).toBe(12)

    expect(tiles.board.length).toBe(8)
    expect(tiles.board[0].length).toBe(12)

    // padded board
    expect(tiles.board[0]).toStrictEqual([0,0,0,0,0,0,0,0,0,0,0,0])
    expect(tiles.board[1]).toStrictEqual([0,6,9,9,9,5,5,5,13,13,13,0])
    expect(tiles.board[2]).toStrictEqual([0,6,6,9,9,12,5,5,13,18,13,0])
    expect(tiles.board[3]).toStrictEqual([0,8,6,10,12,12,12,12,18,18,18,0])
    expect(tiles.board[4]).toStrictEqual([0,8,6,10,14,14,14,14,14,4,18,0])
    expect(tiles.board[5]).toStrictEqual([0,8,10,10,10,11,7,7,4,4,4,0])
    expect(tiles.board[6]).toStrictEqual([0,8,8,11,11,11,11,7,7,7,4,0])
    expect(tiles.board[7]).toStrictEqual([0,0,0,0,0,0,0,0,0,0,0,0])

})
