import Phaser from 'phaser'
import eng from "../engine/geom"

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'menu' })
  }

  create () {
    // background
    this.add.image(eng.x(), eng.y(), 'space').setScale(2)

    this.add.text(eng.x(), eng.y(0.3), 'Cargo and go!\n\n< play >', {
      align: 'center',
      fill: 'white',
      fontFamily: 'sans-serif',
      fontSize: 48,
    }).setOrigin(0.5, 0)

    this.input.on('pointerdown', function () {
      this.scene.switch('play')
    }, this)
  }
}
