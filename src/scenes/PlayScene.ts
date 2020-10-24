import Phaser from 'phaser'
import {IGroupedPolyominoes, IPoint, ITiles} from "../polys/model"
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
  polyGroup: IGroupedPolyominoes
}

export default class PlayScene extends Phaser.Scene {
  tiles: ITiles
  polyominoes: IPolyPoly[]
  rectWidth: number
  halfRectWidth: number
  board: Phaser.GameObjects.Container
  cheatPolyIdx: number = 0
  dragDepth: number = 1

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

    // for some reason 5,8 doesn't come back with enough pieces...
    // this.tiles = makeTile(5, 8)
    this.tiles = makeTile(10, 6)
    // strip padding off board
    this.tiles.board = this.tiles.board.slice(1, this.tiles.board.length - 1).map((row) => row.slice(1, row.length - 1))
    this.polyominoes = []
    this.rectWidth = 40
    this.halfRectWidth = this.rectWidth / 2
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

        let fillColour = 0x5f33ff
        if ((colIndex + rowIndex) % 2 === 0) {
          fillColour = 0x5f44ff
        }
        let alpha = 1.0

        const rectX = rowIndex * this.rectWidth
        const rectY = colIndex * this.rectWidth

        console.log("boardXY", rectX, rectY)
        const rect = this.add.rectangle(rectX, rectY, this.rectWidth, this.rectWidth, fillColour, alpha)
        board.add(rect)
      })
    })
    this.board = board
  }

  getPolyominoes() {
    let usedPolys = this.tiles.polys.filter((p) => p.isUsed)
    const numberOfPolys = usedPolys.length

    usedPolys.forEach((polyGroup, polyIndex) => {
      // if (polyIndex !== 2) {
      //   return
      // }
      console.log("polyGroup", polyGroup)
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
      const phaserHitAreaPolygons = hitAreaPolygons.map((point) => new Phaser.Geom.Point(point[0], point[1]))
      polyContainer.setInteractive(new Phaser.Geom.Polygon(phaserHitAreaPolygons), Phaser.Geom.Polygon.Contains)

      // var debugRect = this.add.polygon(0, 0, hitAreaPolygons,  0xffff00, 0.5)
      // polyContainer.add(debugRect)

      polyContainer.depth = 0
      polyContainer.setInteractive()
      this.input.setDraggable(polyContainer)

      polyContainer.on('pointerdown', function (pointer) {
        if (pointer.rightButtonDown()) {
          polyContainer.setRotation(polyContainer.rotation + Math.PI / 2)
          // TODO don't just rotate the container. Actually use the next orientation from the polyGroup data...
        } else if (pointer.middleButtonDown()) {
          const x = polyGroup.position.x * this.rectWidth + this.board.x - this.rectWidth
          const y = polyGroup.position.y * this.rectWidth + this.board.y - this.rectWidth
          polyContainer.setPosition(x, y)
        }
      }, this)

      // polyContainer.on('dragend', function () {
      //   var msg = polyContainer.list.reduce((acc, val) => {
      //     return acc + ", " + val.x + " " + val.y
      //   }, "")
      //   console.log("stop dragging me", polyContainer.x, polyContainer.y, msg)
      // }, this)

    }) // END forEach

  }

  create () {
    // background
    this.add.image(eng.x(), eng.y(), 'space').setScale(2)

    this.getBoard()
    console.log("board container", this.board)
    this.getPolyominoes()

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      // round position to this.rectWidth / 2 pixels
      const x = Math.round(dragX / this.halfRectWidth) * this.halfRectWidth
      const y = Math.round(dragY / this.halfRectWidth) * this.halfRectWidth
      gameObject.depth = this.dragDepth++
      gameObject.setPosition(x, y)
    }, this)

    this.input.mouse.disableContextMenu()

    this.input.on('pointerup', function(pointer) {

      // TODO rotated pieces breaks this, as we're rotating the container
      const sum = this.polyominoes.reduce((acc, poly) => {
        return poly.polyContainer.list.reduce((acc, val) => {
          return {
            x: acc.x + (poly.polyContainer.x + val.x) / this.rectWidth,
            y: acc.y + (poly.polyContainer.y + val.y) / this.rectWidth,
          }
        }, acc)
      }, {x:0,y:0})
      if (sum.x % this.rectWidth == 0 && sum.y % this.rectWidth == 0) {
        console.log("WINNNER!!!!!!", sum)
        // TODO scene transition...
      } else {
        console.log(sum)
      }

      // const sum = this.polyominoes.reduce((acc, poly) => {
      //   return poly.polyContainer.list.reduce((acc, val) => {
      //     return {
      //       x: acc.x.concat((poly.polyContainer.x + val.x) / this.rectWidth),
      //       y: acc.y.concat((poly.polyContainer.y + val.y) / this.rectWidth),
      //     }
      //   }, acc)
      // }, {x:[],y:[]})

      // const sum: [] = this.polyominoes.reduce((acc, poly) => {
      //   return poly.polyContainer.list.reduce((acc, val) => {
      //     return acc.concat({
      //       x: Math.floor((poly.polyContainer.x + val.x) / this.rectWidth),
      //       y: Math.floor((poly.polyContainer.y + val.y) / this.rectWidth),
      //     })
      //   }, acc)
      // }, [])
      // const sortedSum = sum.sort((a, b) => { return a.x==b.x ? a.y - b.y : a.x-b.x; })
      // console.log(sortedSum)
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
      .on('keydown-C', function () {
        // cheat
        const idxToMove = this.cheatPolyIdx++
        console.log(idxToMove)
        const pp = this.polyominoPolygons.filter((pp) => pp.polyGroup.ordering === idxToMove)
        if (pp.length > 0) {
          const piece = pp[0].polyContainer
          // this.board
          console.log("piece to move", pp[0])

          const position = pp[0].polyGroup.position;
          const idxIntoBoard = position.x + (this.tiles.board[0].length * position.y)

          const listElement = this.board.list[idxIntoBoard]

          console.log(listElement)
          listElement.fillColor = 0xffffff
        }

      }, this)
  }

  update () {}
}
