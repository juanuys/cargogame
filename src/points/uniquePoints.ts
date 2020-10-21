import {IPoint} from "../polys/model";

export default function find(points: IPoint[]): IPoint[] {
    const pointsJsonStr = points.map((point) => JSON.stringify(point))
    const uniqPointsJsonStr = Array.from(new Set(pointsJsonStr))
    return uniqPointsJsonStr.map((pointJson) => JSON.parse(pointJson))
}
