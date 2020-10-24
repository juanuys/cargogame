

export default function howManyPointsInCommon(array1: number[][], array2: number[][]): number {

    const as1 = array1.map((a) => JSON.stringify(a))
    const as2 = array2.map((a) => JSON.stringify(a))

    const result = {}
    as1.forEach(function(item) {
        result[item] = as2.filter(t => t === item).length
    })

    return as1.reduce((acc, val) => {
        return acc + as2.filter(t => t === val).length
    }, 0)
}
