import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import EndScene from './scenes/EndScene';

export default {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  title: 'Cargo and go!',
  url: 'https://github.com/opyate/cargogame',
  banner: { text: 'white', background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'] },
  scene: [BootScene, MenuScene, PlayScene, EndScene]
};
