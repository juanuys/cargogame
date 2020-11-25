import Phaser from 'phaser'
import {IGroupedPolyominoes, ITiles} from "../polys/model"
import makeTile from "../polys/tiling"
import eng from "../engine/geom"
import {polyominoToPolygon} from "../points"
import * as _ from "lodash"

const DEBUG = false

interface IPolyPoly {
    polyContainer: Phaser.GameObjects.Container
    origCoords: {
        x: number
        y: number
    }
    polyGroup: IGroupedPolyominoes
}

export default class PlayScene extends Phaser.Scene {
    tiles: ITiles
    polyominoes: IPolyPoly[]
    rectWidth: number
    halfRectWidth: number
    board: Phaser.GameObjects.Container
    dragDepth: number = 1
    background: Phaser.GameObjects.Sprite


    constructor() {
        super({
            key: 'play',
            physics: {
                arcade: {
                    gravity: {y: 300},
                    debug: false,
                },
            }
        })
    }

    getBoard() {

        const numRows = this.tiles.board.length
        const numCols = this.tiles.board[0].length

        const x = eng.x(0.5) - ((numCols / 2) * this.rectWidth - this.rectWidth / 2)
        const y = eng.y(0.5) - ((numRows / 2) * this.rectWidth - this.rectWidth / 2)

        const board = this.add.container(x, y)
        const hsv = Phaser.Display.Color.HSVColorWheel()
        let hsvIdx = 0


        this.tiles.board.forEach((row, colIndex) => {

            row.forEach((point, rowIndex) => {
                hsvIdx += 5
                // let fillColour = hsv[hsvIdx++].color

                let fillColour = 0xd3d3d3
                if ((colIndex + rowIndex) % 2 === 0) {
                    fillColour = 0xe5e5e5
                }
                let alpha = 1.0

                const rectX = rowIndex * this.rectWidth
                const rectY = colIndex * this.rectWidth

                // console.log("boardXY", rectX, rectY)
                const rect = this.add.rectangle(rectX, rectY, this.rectWidth, this.rectWidth, fillColour, alpha)
                board.add(rect)
            })
        })
        this.board = board
    }

    getPolyominoes() {
        var graphics: Phaser.GameObjects.Graphics = this.add.graphics()
        let usedPolys = this.tiles.polys.filter((p) => p.isUsed)
        const numberOfPolys = usedPolys.length

        const rotations = [Math.PI * 1/2, Math.PI * 2/2, Math.PI * 3/2, Math.PI * 4/2]

        usedPolys.forEach((polyGroup, polyIndex) => {
            // if (polyIndex !== 2) {
            //   return
            // }
            // console.log("polyGroup", polyGroup)
            const spriteIndex = polyIndex % 9 + 1
            // const polyPoints = normalise(polyGroup.orientations[polyGroup.usedOrientation])
            const polyPoints = polyGroup.orientations[polyGroup.usedOrientation]

            // A poly's Xs might be mostly positive or negative, so shift
            // it the other way when we draw them.
            const xShift = polyPoints.reduce((acc, val) => {
                return acc + val.x
            }, 0)

            // polyomino container positioning
            const xShiftWidth = eng.w() / (numberOfPolys / 2)
            let containerX
            let containerY = 0.08
            const spacingFactor = 0.8
            if (polyIndex < numberOfPolys / 2) {
                containerX = xShiftWidth * polyIndex * spacingFactor + (0.005 * -xShift) + xShiftWidth / 2
            } else {
                containerX = xShiftWidth * (polyIndex - numberOfPolys / 2) * spacingFactor + (0.005 * -xShift) + xShiftWidth / 2
                containerY = 0.78
            }

            let polyContainerX = containerX
            let polyContainerY = eng.y(containerY)

            const polyContainer = this.add.container(polyContainerX, polyContainerY)

            this.polyominoes.push({
                polyContainer: polyContainer,
                origCoords: {
                    x: polyContainerX,
                    y: polyContainerY,
                },
                polyGroup
            })

            // for each polyomino point, create a rectangle, and add it to the poly container
            polyPoints.forEach((point, idx) => {
                const spriteX = point.x * this.rectWidth
                const spriteY = point.y * this.rectWidth
                const sprite = this.add.sprite(spriteX, spriteY, 'spritesheet', `tiles/c${spriteIndex}.png`).setSize(this.rectWidth, this.rectWidth).setDisplaySize(this.rectWidth, this.rectWidth)
                polyContainer.add(sprite)
            })

            const hitAreaPolygons = polyominoToPolygon(polyPoints, this.rectWidth)
            const phaserHitAreaPolygons = hitAreaPolygons.map((point) => {
                const x = point[0]
                const y = point[1]
                return new Phaser.Geom.Point(x, y)
            })
            const actualPolygon = new Phaser.Geom.Polygon(phaserHitAreaPolygons)
            polyContainer.setInteractive(actualPolygon, Phaser.Geom.Polygon.Contains)

            polyContainer.depth = 0
            polyContainer.setInteractive()
            this.input.setDraggable(polyContainer)

            // random initial rotation
            polyContainer.setRotation(polyContainer.rotation + _.sample(rotations))

            polyContainer.on('pointerdown', function (pointer) {
                if (pointer.rightButtonDown()) {
                    polyContainer.setRotation(polyContainer.rotation + Math.PI / 2)
                } else if (pointer.middleButtonDown()) {
                    // const x = polyGroup.position.x * this.rectWidth + this.board.x - this.rectWidth
                    // const y = polyGroup.position.y * this.rectWidth + this.board.y - this.rectWidth
                    // polyContainer.setPosition(x, y)
                }
            }, this)

            if (DEBUG) {
                // Phaser.Input.Events.Gameobject_pointer
                polyContainer.on('pointerover', function () {
                    const newPoints = actualPolygon.points.map((point) => {
                        return {
                            x: point.x + polyContainerX,
                            y: point.y + polyContainerY,
                        }
                    })

                    graphics.clear()
                    graphics.fillStyle(0x00ff00)
                    graphics.fillPoints(newPoints, true)
                })
                polyContainer.on('pointerout', function () {
                    graphics.clear()
                })
            }

            // polyContainer.on('dragend', function () {
            //   var msg = polyContainer.list.reduce((acc, val) => {
            //     return acc + ", " + val.x + " " + val.y
            //   }, "")
            //   console.log("stop dragging me", polyContainer.x, polyContainer.y, msg)
            // }, this)

        }) // END forEach

    }

    create() {
        const music = this.sound.add('level')
        music.loop = true
        music.play()

        // for some reason 5,8 doesn't come back with enough pieces...
        // this.tiles = makeTile(5, 8)
        this.tiles = makeTile(10, 6)
        // strip padding off board
        this.tiles.board = this.tiles.board.slice(1, this.tiles.board.length - 1).map((row) => row.slice(1, row.length - 1))
        this.polyominoes = []
        this.rectWidth = 40
        this.halfRectWidth = this.rectWidth / 2

        // background
        // this.add.image(eng.x(), eng.y(), 'space').setScale(2)
        this.background = this.add.sprite(eng.x(), eng.y(), 'spritesheet', `backgrounds/ship.png`)

        this.getBoard()
        this.getPolyominoes()

        // calculate board rectangles, for obscurity check when polys are moved
        const checkerBoardLookup = this.board.list.map((rect: Phaser.Geom.Rectangle) => {
            const x = this.board.x + rect.x
            const y = this.board.y + rect.y
            return `${x}-${y}`
        }).sort()

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            // round position to this.rectWidth / 2 pixels
            const x = Math.round(dragX / this.halfRectWidth) * this.halfRectWidth
            const y = Math.round(dragY / this.halfRectWidth) * this.halfRectWidth
            // const x = Math.round(dragX / this.rectWidth) * this.rectWidth
            // const y = Math.round(dragY / this.rectWidth) * this.rectWidth
            gameObject.depth = this.dragDepth++
            gameObject.setPosition(x, y)
        }, this)

        this.input.mouse.disableContextMenu()

        let tempMatrix = new Phaser.GameObjects.Components.TransformMatrix()
        let tempParentMatrix = new Phaser.GameObjects.Components.TransformMatrix()

        this.input.on('pointerup', function (pointer) {

            let cbl: string[] = _.clone(checkerBoardLookup)

            // get the polys' rects' coords and match it with the checkerBoardLookup
            // by reducing the cbl down
            this.polyominoes.reduce((acc: string[], poly) => {
                return poly.polyContainer.list.reduce((acc: string[], val) => {
                    val.getWorldTransformMatrix(tempMatrix, tempParentMatrix)
                    const d = tempMatrix.decomposeMatrix()
                    const x = d.translateX
                    const y = d.translateY

                    const point = `${x}-${y}`
                    const index = acc.indexOf(point)
                    if (index > -1) {
                        acc.splice(index, 1)
                    }
                    return acc
                }, acc)
            }, cbl)  // mutates cbl

            if (cbl.length === 0) {
                // winner!
                const transitionOut = function (progress) {
                    this.background.scale = 1 + 4 * progress
                    this.background.setAngle(90 * progress)
                    if (progress > 0.9) {
                        music.stop()
                    }
                }
                this.scene.transition({
                    target: 'win',
                    duration: 1000,
                    moveBelow: true,
                    onUpdate: transitionOut,
                    data: {x: eng.x(), y: eng.y()}
                })
            } else {
                // console.log(sum)
            }
        }, this)

        // // uncomment to test transition:
        // this.input.on('pointerdown', function(pointer) {
        //     const transitionOut = function (progress) {
        //         this.background.scale = 1 + 4 * progress
        //         this.background.setAngle(90 * progress)
        //         if (progress > 0.9) {
        //             music.stop()
        //         }
        //     }
        //     this.scene.transition({
        //         target: 'win',
        //         duration: 1000,
        //         moveBelow: true,
        //         onUpdate: transitionOut,
        //         data: { x: eng.x(), y: eng.y() }
        //     })
        //
        // }, this)

        // up up down down left right left right B A
        const konamiCode = this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65  ], { resetOnMatch: true })

        // this.input.keyboard
        //     .on('keydown', function (event) {
        //         console.log(event.key)
        //     }, this)

        this.input.keyboard.on('keycombomatch', function (event) {
            const transitionOut = function (progress) {
                this.background.scale = 1 + 4 * progress
                this.background.setAngle(90 * progress)
                if (progress > 0.9) {
                    music.stop()
                }
            }
            this.scene.transition({
                target: 'win',
                duration: 1000,
                moveBelow: true,
                onUpdate: transitionOut,
                data: {x: eng.x(), y: eng.y()}
            })
        }, this)

        this.input.keyboard
            .on('keydown-R', function () {
                this.scene.restart()
            }, this)
            .on('keydown-Q', function () {
                this.scene.stop().run('menu')
            }, this)
            .on('keydown-L', function () {
                this.scene.stop().run('end')
            }, this)
    }

    update() {
    }
}
