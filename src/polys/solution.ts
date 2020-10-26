import util from "./util"
import {IGroupedPolyominoes} from "./model";

/**
 * Normalise the polyomino by
 * - sorting the points by y then x
 * - ensure the first point is 0,0
 *
 * @param polyomino
 */
export function normalise(polyomino) {
    // sort by y, then x
    const polyominoCopy = polyomino.sort((a, b) => {
        return a.y == b.y ? a.x - b.x : a.y - b.y
    })
    const polyominoLength = polyominoCopy.length

    // Set first cell as (0,0)
    const shiftX = -polyominoCopy[0].x
    const shiftY = -polyominoCopy[0].y
    for (let i = 0; i < polyominoLength; i++) {
        polyominoCopy[i].x += shiftX
        polyominoCopy[i].y += shiftY
    }
    return polyominoCopy
}

/**
 * Rotate the polyomino 90 degrees clockwise 3 times,
 * each time adding to orientations list.
 *
 * @param orientations
 * @param polyomino
 */
function addRotations(orientations, polyomino) {
    for (let i = 0; i < 3; i++) {
        // rotate 90 degree clockwise, (X, Y) ==> (-Y, X)
        for (let j = 0; j < polyomino.length; j++) {
            [polyomino[j].y, polyomino[j].x] = [polyomino[j].x, -polyomino[j].y]
        }
        if (!addPolyominoOrientation(orientations, normalise(polyomino))) break
    }
}

/**
 * Adds polyomino to orientations, if it doesn't exist.
 *
 * @param orientations
 * @param polyomino
 */
function addPolyominoOrientation(orientations, polyomino) {
    var numberOfOrientations = orientations.length

    outer:
        for (let i = 0; i < numberOfOrientations; i++) {
            for (let j = 0; j < orientations[i].length; j++) {
                if (orientations[i][j].x != polyomino[j].x ||
                    orientations[i][j].y != polyomino[j].y) {
                    // different polyomino cell; check next
                    continue outer
                }
            }
            // same orientation; don't add
            return false
        }

    orientations[numberOfOrientations] = JSON.parse(JSON.stringify(polyomino))

    return true
}

/**
 * Given a grouped polyomino, ensure it has all its varieties.
 *
 * TODO optimise - doing unnecessary work?
 *
 * @param groupedPolyominoes
 */
export function createPolyominoOrientations(groupedPolyominoes) {

    for (let g = 0; g < groupedPolyominoes.length; g++) {
        const polyomino = groupedPolyominoes[g].orientations[0]

        // add rotations
        const polyCopy = JSON.parse(JSON.stringify(polyomino))
        addRotations(groupedPolyominoes[g].orientations, polyCopy)

        // add flipped
        const polyFlipped = JSON.parse(JSON.stringify(polyomino))
        polyFlipped.forEach((point) => point.x = -point.x)
        const normalisedPolyFlipped = normalise(polyFlipped)
        if (addPolyominoOrientation(groupedPolyominoes[g].orientations, normalisedPolyFlipped)) {
            groupedPolyominoes[g].isFlipped = true
            addRotations(groupedPolyominoes[g].orientations, normalisedPolyFlipped)
        }
    }
}

function insertPolyominoIntoBoard(board, boardWidth, boardHeight, polyomino, currentPosition, value): boolean {
    const polyominoLength = polyomino.length

    // try to insert the polyomino
    let i, cx, cy
    for (i = 0; i < polyominoLength; i++) {
        cx = polyomino[i].x + currentPosition.x
        cy = polyomino[i].y + currentPosition.y
        // polyomino point needs to fit into x:[1..boardWidth], y:[1..boardHeight]
        if (cx > boardWidth || cx < 1) break
        if (cy > boardHeight || cy < 1) break
        if (board[cy][cx] != 0) break
    }

    // can't be inserted
    if (i < polyominoLength) return false

    // insert polyomino  (set value != 0)
    for (i = 0; i < polyominoLength; i++) {
        cx = polyomino[i].x + currentPosition.x
        cy = polyomino[i].y + currentPosition.y
        board[cy][cx] = value
    }

    return true
}

function removePolyominoFromBoard(board, polyomino, insertionPosition) {
    for (let i = 0; i < polyomino.length; i++) {
        const x = polyomino[i].x + insertionPosition.x;
        const y = polyomino[i].y + insertionPosition.y;
        board[y][x] = 0
    }
}

function shuffleGroupedPolyominoes(polyominoes) {
    polyominoes.forEach((polyomino) => {
        if (!polyomino.isUsed) {
            polyomino.orientations = util.shuffle(polyomino.orientations)
        }
    })
}

export class PolySolution {

    board: number[][]
    boardWidth: number
    boardHeight: number
    foundSolution: boolean
    groupedPolyominoes: IGroupedPolyominoes[]
    usedPolyominoCount: number

    constructor(width: number, height: number, groupedPolyominoes: IGroupedPolyominoes[], randomise: boolean) {
        this.board = this.initialiseBoard(width, height)
        this.boardWidth = width
        this.boardHeight = height
        this.foundSolution = false
        this.groupedPolyominoes = groupedPolyominoes
        this.usedPolyominoCount = 0
        this.getUsedPolyominoCount()
        if (randomise) {
            shuffleGroupedPolyominoes(this.groupedPolyominoes)
        }
    }

    initialiseBoard(width: number, height: number): number[][] {
        // initialise the board
        const board = []
        // board.length is always the height
        for (let i: number = 0; i < height + 2; i++) {
            // board[0].length is always the width
            board[i] = []
            for (let j: number = 0; j < width + 2; j++) {
                board[i][j] = 0
            }
        }
        return board
    }

    find() {
        const emptyPos = this.findEmptyPosition({x: 1, y: 1})
        const randomStartingPoint = Math.floor(Math.random() * (this.groupedPolyominoes.length)) - 1
        const polyominoIndex = this.findNextAvailablePolyomino(randomStartingPoint)

        if (emptyPos.x < 0 || polyominoIndex < 0) {
            // all polyominos are used, or the board is full
            return null
        }

        this.findSolution(polyominoIndex, emptyPos, 0)

        return this.board
    }

    getUsedPolyominoCount() {
        for (let g = 0; g < this.groupedPolyominoes.length; g++) {
            if (this.groupedPolyominoes[g].isUsed) this.usedPolyominoCount++

            // clear polyomino ordering
            this.groupedPolyominoes[g].ordering = -1
        }
    }

    findEmptyPosition(startPosition) {
        let x = startPosition.x

        for (let y = startPosition.y; y <= this.boardHeight; y++) {
            for (; x <= this.boardWidth; x++) {
                if (this.board[y][x] == 0) {
                    return {x, y}
                }
            }
            x = 1
        }
        return {
            x: -1,
            y: -1
        }
    }

    findNextAvailablePolyomino(curIndex) {
        for (let i = 0; i < this.groupedPolyominoes.length; i++) {
            if (++curIndex >= this.groupedPolyominoes.length) curIndex = 0
            if (!this.groupedPolyominoes[curIndex].isUsed) return (curIndex)
        }
        return -1
    }

    findSolution(headIndex, currentPosition, depth) {
        let nextPosition = {x: -1, y: -1}
        let currentIndex = headIndex

        do {
            let numberOfOrientations = this.groupedPolyominoes[currentIndex].orientations.length
            for (let i = 0; i < numberOfOrientations && !this.foundSolution; i++) {
                if (insertPolyominoIntoBoard(this.board, this.boardWidth, this.boardHeight, this.groupedPolyominoes[currentIndex].orientations[i], currentPosition, currentIndex + 1)) {
                    this.groupedPolyominoes[currentIndex].isUsed = true

                    // gameplay hints
                    this.groupedPolyominoes[currentIndex].usedOrientation = i
                    this.groupedPolyominoes[currentIndex].position = currentPosition
                    this.groupedPolyominoes[currentIndex].ordering = depth

                    nextPosition = this.findEmptyPosition(currentPosition)
                    // if all the polyominoes have been used, or if the board is full
                    if ((++this.usedPolyominoCount >= this.groupedPolyominoes.length) || (nextPosition.x == -1 && nextPosition.y == -1)) {
                        this.foundSolution = true
                    } else {
                        this.findSolution(this.findNextAvailablePolyomino(currentIndex), nextPosition, depth + 1)
                    }
                    if (!this.foundSolution) { //keep last solution in board for UI demo
                        removePolyominoFromBoard(this.board, this.groupedPolyominoes[currentIndex].orientations[i], currentPosition)
                        this.groupedPolyominoes[currentIndex].isUsed = false
                        this.groupedPolyominoes[currentIndex].ordering = -1
                        this.usedPolyominoCount--
                    }
                }
            }
            currentIndex = this.findNextAvailablePolyomino(currentIndex)
        } while (currentIndex != headIndex && !this.foundSolution)
    }
}
