import Phaser from 'phaser'
// @ts-ignore
import images from '../assets/*.png'
import eng from "../engine/geom"
import spritesheetJson from "../assets/spritesheet.json"
import audio from "../assets/audio/*.mp3"
import winaudio from "../assets/audio/win/*.mp3"
import package from "../../package.json"

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'boot'})
    }

    preload() {
        const bg = this.add.rectangle(eng.x(), eng.y(), eng.w(0.5), eng.h(0.05), 0x666666)
        const bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1)

        console.table(images)
        const x = [0, 1]
        x.forEach((i) => {
            let image = images[`spritesheet-${i}`]
            if (image.indexOf('/') !== -1) {
                image = image.substring(1)
            }
            spritesheetJson.textures[i].image = image
        })
        console.log(spritesheetJson)
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

    create() {
        this.add.text(eng.x(), eng.y(0.77), '< click to start >', {
            align: 'center',
            fill: 'white',
            fontFamily: 'sans-serif',
            fontSize: 48,
        })
            .setOrigin(0.5, 0)

        this.add.text(eng.x(), eng.y(0.66), `v${package.version}`, {
            align: 'center',
            fill: 'white',
            fontFamily: 'sans-serif',
            fontSize: 20,
        })
            .setOrigin(0.5, 0)

        this.input.on('pointerdown', function () {
            this.scene.start('menu')
        }, this)
    }
}
