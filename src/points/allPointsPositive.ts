import {IPoint} from "../polys/model";


export default function positivise(points: IPoint[], skipAlreadyPositive = false): IPoint[] {

    const smallestXY = points.reduce((acc, point) => {
        return {
            x: point.x < acc.x ? point.x : acc.x,
            y: point.y < acc.y ? point.y : acc.y,
        }
    }, { x: 99999, y: 99999})

    const shiftXY = {
        x: smallestXY.x,
        y: smallestXY.y,
        skipX: smallestXY.x >= 0,
        skipY: smallestXY.y >= 0,
    }

    return points.map((point) => {
        if (skipAlreadyPositive) {
            return {
                x: shiftXY.skipX ? point.x : point.x - shiftXY.x,
                y: shiftXY.skipY ? point.y : point.y - shiftXY.y,
            }
        } else {
            return {
                x: point.x - shiftXY.x,
                y: point.y - shiftXY.y,
            }
        }

    })
}
