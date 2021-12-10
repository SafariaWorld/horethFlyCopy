import Phaser from "phaser"


class Music extends Phaser.Scene {

    constructor() {
        super({ key: 'Music'});

        //this.titleScreenMusic = null;
        //this.playSceneMusic = null; 
        //this.endSceneMusic = null;
    };

    preload() {
        this.load.audio('theme', '../assets/audio/mainMusic.wav');
    }
    
    create() {
        this.playSceneMusic = this.sound.add('theme', {volume: 0.7});
        this.scene.switch('PlayScene');
    }
    
    logMusic() {
        this.playSceneMusic.play();
        console.log('music file activated');
    }

}
export default Music;