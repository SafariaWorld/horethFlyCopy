import Phaser, { Game } from "phaser";
import TitleScene from "./scenes/titleScene";
import PreloadScene from "./scenes/preloader";
import PlayScene from "./scenes/flyHoreth";


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
            //debug:true
            // gravity: { y: 200 }
        }
        
    },
    scene: [PreloadScene, TitleScene, PlayScene]
};

const game = new Phaser.Game(config);

