import Phaser from 'phaser'
// @ts-ignore
import images from '../assets/*.png'
import eng from "../engine/geom"
import spritesheetJson from "../assets/spritesheet.json"

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'boot'})
    }

    preload() {
        const bg = this.add.rectangle(eng.x(), eng.y(), eng.w(0.5), eng.h(0.05), 0x666666)
        const bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1)

        this.load.image('space', images.space)
        this.load.image('red', images.red)
        spritesheetJson.textures[0].image = images['spritesheet-0'].substring(1)
        spritesheetJson.textures[1].image = images['spritesheet-1'].substring(1)
        this.load.multiatlas('spritesheet', spritesheetJson)

        this.load.on('progress', function (progress) {
            bar.setScale(progress, 1)
        })
    }

    update() {
        this.scene.start('menu')
    }
}
