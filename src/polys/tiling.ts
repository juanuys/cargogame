// import "../seed" // import before everything else

import {Polyomino, OneSidedPolyomino} from "polyomino"
import {Set} from "immutable"
import {ITiles, IGroupedPolyominoes, IPoint} from "./model"
import * as _ from "lodash"
import {PolySolution, createPolyominoOrientations, normalise} from "./solution"

/**
 * Given a width and height, return a tile-able rectangle, and an array of
 * polyominoes that can tile the rectangle.
 *
 * The rectangle may have dark spots, i.e. untile-able squares.
 *
 * Tile-able squares will contain 0.
 * Dark spots (if any) will contain 1.
 *
 * A polyomino will look like this:
 *
 * {"points": Immutable.Set [
 *  {"x": 1, "y": 1},
 *  {"x": 2, "y": 1},
 *  {"x": 0, "y": 1},
 *  {"x": 0, "y": 0}]
 *  }
 *
 *  x --> 0 1 2
 * y
 * |
 * v
 *
 * 0       ██
 * 1       ██████
 *
 *
 * @param width - width of the tile-able rectangle
 * @param height - height of the tile-able rectangle
 * @param seed - the random number seed
 */
export default function makeTile(width: number, height: number): ITiles {

    // ensure integers
    width = Math.floor(width)
    height = Math.floor(height)

    // ensure minimum (larger than a "mono")
    if (width < 3) width = 3
    if (height < 3) height = 3

    // console.log("board x", board.length, "y", board[0].length)
    // console.log("board", board)


    // establish which polyominos will work best with this board size
    const order = Math.max(width, height)
    // start at 2, as 1 is just a "mono"
    // const allPolys =_.range(2, order + 1).reduce((acc, val) => {
    //     return acc.concat(OneSidedPolyomino.get(val).toJS())
    // }, [])

    const allPolys = OneSidedPolyomino.get(5).toJS()

    // convert to groupedPolyominoes format
    const groupedPolyominoes: IGroupedPolyominoes[] = asGroupedPolyominoes(allPolys)
    createPolyominoOrientations(groupedPolyominoes)  // mutate

    const answer = new PolySolution(width, height, groupedPolyominoes, true)
    const board = answer.find()

    return {
        board,
        polys: groupedPolyominoes,
    }
}

function asGroupedPolyominoes(polys: Set<Polyomino>): IGroupedPolyominoes[] {
    return polys.reduce((acc: IGroupedPolyominoes[], val: Polyomino) => {

        const poly = val.points.toJS().reduce((acc, val) => {
            return acc.concat({
                x: val.x,
                y: val.y,
            })
        }, [])

        return acc.concat({
            orientations: [ poly ],
            isUsed: false,
            isFlipped: false,
            ordering: -1,
            usedOrientation: -1,
            position: {x: -1, y: -1}
        })
    }, [])

}