import {IPoint} from "../polys/model";

/**
 * Sorts points to ensure non self-intersecting polygon.
 *
 * See http://geomalgorithms.com/a10-_hull-1.html
 *
 * @param points
 */
export default function sortPoints(points) {
    points = points.splice(0)
    const p0: IPoint = {
        x: -1,
        y: -1
    }
    p0.y = Math.min(...points.map((p) => p.y))
    p0.x = Math.max(...points.filter((p) => p.y == p0.y).map((p) => p.x))
    points.sort((a,b) => compareAngle(p0, a, b))
    return points
};

function compareAngle(p0, a, b) {
    const left = isLeft(p0, a, b)
    if (left == 0) {
        return distance(p0, a) - distance(p0, b)
    } else {
        return left
    }
}

function isLeft(p0, a, b) {
    return (a.x - p0.x) * (b.y - p0.y) - (b.x - p0.x) * (a.y - p0.y)
}

function distance(a, b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
}
