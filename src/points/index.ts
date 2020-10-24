import {IPoint} from "../polys/model";

// export {default as positive} from "./allPointsPositive"
// export {default as unique} from "./uniquePoints"
// export {default as sort} from "./pointsToPolygon"

import {default as positive} from "./allPointsPositive"
import {default as unique} from "./uniquePoints"
import {default as sort} from "./pointsToPolygon"


export function clean(points: IPoint[]): IPoint[] {
    return sort(positive(unique(points)))
}

export {default as polyominoToPolygon} from "./polyominoToPolygon"
