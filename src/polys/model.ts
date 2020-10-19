import {Polyomino} from "polyomino"
import {Set} from "immutable"

export interface ITiles {
    board: number[][]
    polys: IGroupedPolyominoes[]
}

export interface IPoint {
    x: number
    y: number
}

export interface IGroupedPolyominoes {
    orientations: IPoint[][]
    isUsed: boolean
    isFlipped: boolean
    ordering: number
    usedOrientation: number
    position: IPoint
}
