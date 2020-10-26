import Phaser from 'phaser'
import eng from "../engine/geom";

export default class WinScene extends Phaser.Scene {
    constructor() {
        super({key: 'win'})
    }

    create() {
        this.events.on('transitioncomplete', function () {
            this.add.sprite(eng.x(), eng.y(), 'spritesheet', `backgrounds/win.png`)
        }, this)


        this.input.on('pointerdown', function () {
            this.scene.start('play')
        }, this)
    }
}
