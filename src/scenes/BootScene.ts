import Phaser from 'phaser'
// @ts-ignore
import images from '../assets/*.png'
import eng from "../engine/geom"
import spritesheetJson from "../assets/spritesheet.json"
import audio from "../assets/audio/*.mp3"
import winaudio from "../assets/audio/win/*.mp3"

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

        // audio
        this.load.audio('level', audio.level)
        this.load.audio('menu', audio.menu)
        this.load.audio('shipshorn', audio.shipshorn)
        this.load.audio('win', audio.win)

        this.load.audio('win1', winaudio.one)
        this.load.audio('win2', winaudio.two)
        this.load.audio('win3', winaudio.three)
        this.load.audio('win4', winaudio.four)


        this.load.on('progress', function (progress) {
            bar.setScale(progress, 1)
        })
    }

    update() {
        this.scene.start('menu')
    }
}
