import Phaser from 'phaser'
// @ts-ignore
import images from '../assets/*.png'

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'boot' })
  }

  preload () {
    const bg = this.add.rectangle(400, 300, 400, 30, 0x666666)
    const bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1)

    console.table(images)

    this.load.image('space', images.space)
    this.load.image('red', images.red)

    this.load.on('progress', function (progress) {
      bar.setScale(progress, 1)
    })
  }

  update () {
    this.scene.start('menu')
  }
}
