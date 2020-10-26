import Phaser from 'phaser'
import eng from "../engine/geom";

export default class WinScene extends Phaser.Scene {
    constructor() {
        super({key: 'win'})
    }

    create() {
        const sfxIdx = Phaser.Math.Between(1, 4)
        const sfx = this.sound.add(`win${sfxIdx}`)
        sfx.play()

        const music = this.sound.add(`win`)
        music.loop = true

        this.events.on('transitioncomplete', function () {
            // music.play()
            this.add.sprite(eng.x(), eng.y(), 'spritesheet', `backgrounds/win.png`)
        }, this)

        const playMusic = function () {
            music.play()
        }
        this.time.addEvent({ delay: 1200, callback: playMusic, callbackScope: this, loop: false })

        this.input.on('pointerdown', function () {
            music.stop()
            this.scene.start('play')
        }, this)
    }
}
