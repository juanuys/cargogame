import Phaser from 'phaser'
import eng from "../engine/geom"

export default class MenuScene extends Phaser.Scene {
    ship: Phaser.GameObjects.Sprite

    constructor() {
        super({key: 'menu'})
    }

    create() {
        const music = this.sound.add('menu')
        music.loop = true
        music.play()
        // background
        this.add.image(eng.x(), eng.y(), 'space').setScale(2)
        this.add.sprite(eng.x(), eng.y(), 'spritesheet', `backgrounds/splash-sans-ship.png`)
        this.ship = this.add.sprite(eng.x(0.75), eng.y(), 'spritesheet', `props/ship.png`)

        // this.add.text(eng.x(0.8), eng.y(0.8), 'Play', {
        //   align: 'center',
        //   fill: '#333',
        //   fontFamily: 'sans-serif',
        //   fontSize: 48,
        // }).setOrigin(0.5, 0)

        this.input.on('pointerdown', function () {
            music.stop()
            this.scene.switch('play')
        }, this)

        const callback = function () {
            const xRatio = Phaser.Math.Between(74, 76)
            const yRatio = Phaser.Math.Between(49, 51)
            const x = eng.x(xRatio / 100)
            const y = eng.y(yRatio / 100)
            this.ship.setPosition(x, y)

            const angle = Phaser.Math.Between(-5, 5)
            this.ship.setAngle(angle)
        }

        const timer = this.time.addEvent({
            delay: 500,
            callback: callback,
            callbackScope: this,
            loop: true
        })

        // // play ship's horn every now and then
        // const sfx = this.sound.add('shipshorn')
        // const playMusic = function () {
        //     music.setVolume(0.5)
        //     sfx.play()
        //     music.setVolume(1.0)
        //     // this.time.addEvent({delay: 10000, callback: () => music.setVolume(1.0), loop: false})
        //     addEvent(Phaser.Math.Between(10000, 60000))
        // }
        // const callbackScope = this
        // const addEvent = function (delay) {
        //     callbackScope.time.addEvent({ delay, callback: playMusic, callbackScope, loop: false })
        // }
        // addEvent(Phaser.Math.Between(10000, 20000))
    }
}
