import Phaser from 'phaser'
import _ from 'lodash'

export default class PlayScene extends Phaser.Scene {
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
    this.gameObjects = []
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  onClick(pointer) {
    this.text.input.enable = false
    
    const result = parseInt(this.text.text) === this.answer
    console.log(result)
    if (result) {
      // make everything go away
      this.self.gameObjects.forEach(go => {
        go.emit('byebye')
      })
      
      // give the player some positive feedback
      const emitter = this.self.add.particles('red')
        .createEmitter({
          speed: 100,
          scale: { start: 1, end: 0 },
          blendMode: 'ADD',
        })
      emitter.startFollow(this.text)

      var timer = this.self.time.delayedCall(500, function () {
        this.self.scene.restart()
      }, [], this)
      

    } else {
      this.self.scene.stop().run('end')
    }

  }

  byeBye() {
    console.log("removing text from scene", this.text)
    this.text.visible = false
  }

  addChallenge() {
    var self = this

    const x = this.randomIntFromInterval(1, 12).toString()
    const y = this.randomIntFromInterval(1, 12).toString()
    const items = [x , '*', y, '=', '?']
    const answer = eval(items.slice(0,3).join(' '))
    const isEven = answer % 2 === 0

    items.forEach((item, idx) => {
      const text = this.add.text(200 + (idx * 100), 100, item, {
        align: 'center',
        fill: 'white',
        fontFamily: 'sans-serif',
        fontSize: 48,
      })
        .setOrigin(0.5, 0)

      text.on('byebye', this.byeBye, { text })
      this.gameObjects.push(text)
    })

    let answers = []
    if (isEven) {
      answers = [answer - 2, answer, answer + 2]
    } else {
      answers = [answer - 1, answer, answer + 1]
    }
    answers = _.shuffle(answers)

    answers.forEach((item, idx) => {
      const text = this.add.text(300 + (idx * 100), 300, item, {
        align: 'center',
        fill: 'white',
        fontFamily: 'sans-serif',
        fontSize: 48,
      })
        .setOrigin(0.5, 0)

      text.setInteractive(new Phaser.Geom.Rectangle(0, 0, text.width, text.height), Phaser.Geom.Rectangle.Contains)
      text.on('pointerdown', this.onClick, { text, answer, self })
      this.gameObjects.push(text)
    })
    
  }

  create () {
    // background
    this.add.image(400, 300, 'space')

    this.addChallenge()
    
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
