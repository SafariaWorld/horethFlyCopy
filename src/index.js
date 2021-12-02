import Phaser, { Game } from "phaser";
import TitleScene from "./scenes/titleScene";
import flyHoreth from './scenes/flyHoreth';
import PreloadScene from "./scenes/preloader";

const titleScene = new TitleScene();
const playScene = new flyHoreth();
const preloadScene = new PreloadScene();

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    dom: {
        createContainer: true
    },
    parent: 'input-form',
    physics: {
        default: 'arcade',
        arcade: {
            debug:true
            // gravity: { y: 200 }
        }
    },
};

const game = new Phaser.Game(config);

game.scene.add('titleScene', titleScene);
game.scene.add('PlayScene', playScene);
game.scene.add('PreloadScene', preloadScene);

game.scene.start('preloadScene');
