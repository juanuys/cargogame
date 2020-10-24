import Phaser from 'phaser'
import {IPoint, ITiles} from "../polys/model"
import makeTile from "../polys/tiling"
import {normalise} from "../polys/solution"
import eng from "../engine/geom"
import ColorObject = Phaser.Types.Display.ColorObject
import {polyominoToPolygon} from "../points"
import {polygon} from 'polygon-tools'

interface IPolyPoly {
  polyContainer: Phaser.GameObjects.Container
  origCoords: {
    x: number
    y: number
  }
}

export default class PlayScene extends Phaser.Scene {
  tiles: ITiles
  polyominoPolygons: IPolyPoly[]
  rectWidth: number
  halfRectWidth: number

  constructor () {
    super({
      key: 'play',
      physics: {
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      }
    })

    this.tiles = makeTile(6, 10)
    this.polyominoPolygons = []
    this.rectWidth = 40
    this.halfRectWidth = this.rectWidth / 2
  }

  getBoard() {
    const board = this.add.container(eng.x(0.5), eng.y(0.5))
    const numRows = this.tiles.board.length
    this.tiles.board.forEach((row, colIndex) => {
      const numCols = row.length
      row.forEach((point, rowIndex) => {
        let fillColour = 0x5f33ff
        if ((colIndex + rowIndex) % 2 === 0) {
          fillColour = 0x5f44ff
        }
        // console.log((numRows / 2), ((numRows / 2) - rowIndex) * this.rectWidth)
        const rect = this.add.rectangle(((numCols / 2) - rowIndex) * this.rectWidth - this.rectWidth / 2, ((numRows / 2) - colIndex) * this.rectWidth - this.rectWidth / 2, this.rectWidth, this.rectWidth, fillColour)
        board.add(rect)
      })
    })
  }

  getPolyominoes() {
    // const pieces = this.add.container(eng.x(0.2), eng.y(0.6))

    let usedPolys = this.tiles.polys.filter((p) => p.isUsed);
    const numberOfPolys = usedPolys.length

    usedPolys.forEach((polyGroup, polyIndex) => {
      // if (polyIndex !== 2) {
      //   return
      // }
      const spriteIndex = polyIndex >= 9 ? 1 : polyIndex + 1
      const polyPoints = normalise(polyGroup.orientations[0])

      // A poly's Xs might be mostly positive or negative, so shift
      // it the other way when we draw them.
      const xShift = polyPoints.reduce((acc, val) => {
        return acc + val.x
      }, 0)

      // polymino container positioning
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

      this.polyominoPolygons.push({
        polyContainer: polyContainer,
        origCoords: {
          x: polyContainerX,
          y: polyContainerY,
        }
      })

      // for each polyomino point, create a rectangle, and add it to the poly container
      polyPoints.forEach((point, idx) => {
        const spriteX = point.x * this.rectWidth;
        const spriteY = point.y * this.rectWidth;
        const sprite = this.add.sprite(spriteX, spriteY, 'spritesheet', `tiles/c${spriteIndex}.png`).setSize(this.rectWidth, this.rectWidth).setDisplaySize(this.rectWidth, this.rectWidth)
        polyContainer.add(sprite)
      })

      const hitAreaPolygons = polyominoToPolygon(polyPoints, this.rectWidth)
      const phaserHitAreaPolygons = hitAreaPolygons.map((point) => new Phaser.Geom.Point(point[0], point[1]))
      polyContainer.setInteractive(new Phaser.Geom.Polygon(phaserHitAreaPolygons), Phaser.Geom.Polygon.Contains)

      // var debugRect = this.add.polygon(0, 0, hitAreaPolygons,  0xffff00, 0.5)
      // polyContainer.add(debugRect)

      polyContainer.setInteractive()
      this.input.setDraggable(polyContainer)

    }) // END forEach

  }

  create () {

    // background
    this.add.image(eng.x(), eng.y(), 'space').setScale(2)

    // this.add.text(eng.x(), 200, Math.random(), {
    //   align: 'center',
    //   fill: 'white',
    //   fontFamily: 'sans-serif',
    //   fontSize: 48,
    // }).setOrigin(0.5, 0)

    // var rect = eng.rect(eng.x(), eng.y(), eng.w(0.3), eng.h(0.3))
    // var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } })
    // graphics.fillRectShape(rect)

    this.getBoard()
    this.getPolyominoes()

    // var self = this
    // this.polyominoPolygons.forEach((polyPoly) => {
    //   self.input.setDraggable(polyPoly.polyContainer)
    // })

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      // round position to this.rectWidth / 2 pixels
      const x = Math.round(dragX / this.halfRectWidth) * this.halfRectWidth
      const y = Math.round(dragY / this.halfRectWidth) * this.halfRectWidth

      gameObject.setPosition(x, y)
    }, this)

    this.input.keyboard
      .on('keydown-R', function () {
        this.scene.restart()
      }, this)
      .on('keydown-Q', function () {
        this.scene.stop().run('menu')
      }, this)
      .on('keydown-K', function () {
        this.scene.stop().run('end')
      }, this)
  }

  update () {}
}
