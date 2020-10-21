import Phaser from 'phaser'
import {IPoint, ITiles} from "../polys/model"
import makeTile from "../polys/tiling"
import eng from "../engine/geom"
import ColorObject = Phaser.Types.Display.ColorObject
import {clean} from "../points"

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
  }

  getBoard() {
    const board = this.add.container(eng.x(0.2), eng.y(0.2))
    const rw = 50
    this.tiles.board.forEach((row, colIndex) => {
      row.forEach((point, rowIndex) => {
        let fillColour = 0x5f33ff
        if ((colIndex + rowIndex) % 2 === 0) {
          fillColour = 0x5f44ff
        }
        const rect = this.add.rectangle(rowIndex * rw, colIndex * rw, rw, rw, fillColour)
        board.add(rect)
      })
    })
  }

  getPolyominoes() {
    // const pieces = this.add.container(eng.x(0.2), eng.y(0.6))
    const rw = 25
    const hsv = Phaser.Display.Color.HSVColorWheel()

    this.tiles.polys.filter((p) => p.isUsed).forEach((polyGroup, polyIndex) => {
      const polyPoints = polyGroup.orientations[0]

      // A poly's Xs might be mostly positive or negative, so shift
      // it the other way when we draw them.
      const xShift = polyPoints.reduce((acc, val) => {
        return acc + val.x
      }, 0)

      let containerX = 0.10 * (polyIndex + 1) + (0.005 * -xShift)
      let containerY = 0.72
      if (containerX > 0.8) {
        containerX -= 0.8
        containerY = 0.85
      }

      let polyContainerX = eng.x(containerX)
      let polyContainerY = eng.y(containerY)

      const polyContainer = this.add.container(polyContainerX, polyContainerY)

      // from the basic points, get all polygon points in a really inefficient way
      // as we'll clean it afterwards.
      const hitAreaPoints = polyPoints.reduce((acc, point: IPoint) => {
        const shiftedX = point.x * rw
        const shiftedY = point.y * rw
        const shift = rw / 2

        return acc.concat([
          { x: shiftedX + shift, y: shiftedY + shift, },
          { x: shiftedX + shift, y: shiftedY - shift, },
          { x: shiftedX - shift, y: shiftedY + shift, },
          { x: shiftedX - shift, y: shiftedY - shift, },
        ])
      }, [])

      const cleanHitAreaPoints = clean(hitAreaPoints)

      const phaserHitAreaPoints = cleanHitAreaPoints.map((point) => new Phaser.Geom.Point(point.x, point.y))
      console.log(phaserHitAreaPoints)
      // const hitArea = new Phaser.Geom.Polygon(phaserHitAreaPoints)
      // const hitAreaPolygon = this.add.polygon(hitArea.points[0].x, hitArea.points[0].y, phaserHitAreaPoints, 0x3f775f)
      // polyContainer.add(hitAreaPolygon)
      // polyContainer.setInteractive({ draggable: true, hitArea })
      // this.input.setDraggable(polyContainer)

      this.polyominoPolygons.push({
        polyContainer: polyContainer,
        origCoords: {
          x: polyContainerX,
          y: polyContainerY,
        }
      })

      // for each polyomino point, create a rectangle, and add it to the poly container
      let fillColour = hsv[polyIndex * 10].color
      polyPoints.forEach((point) => {
        const rect = this.add.rectangle(point.x * rw, point.y * rw, rw, rw, fillColour)
        polyContainer.add(rect)
      })
    })

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
      gameObject.x = dragX
      gameObject.y = dragY
    })

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
