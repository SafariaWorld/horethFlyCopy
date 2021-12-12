import Phaser from "phaser"
import PlayScene from "../flyHoreth";


class Music extends Phaser.Scene {

    constructor() {
        super({ key: 'Music'});

        this.titleScreenMusic = null;
        this.playSceneMusic = null; 
        this.endSceneMusic = null;

        this.mute = false;
        this.muteButton = null;
        
    };

    preload() {
        this.load.audio('theme', '../assets/audio/mainMusic.wav');
    }
    
    create() {
        this.playSceneMusic = this.sound.add('theme', {volume: 0.7});
        this.scene.switch('PlayScene');
    }
    
    playMusic(muteValue) {

        this.mute = muteValue;

        if (this.mute == false) {
            this.playSceneMusic.play();
        }
        
    }

    setMute(muteValue) {

        if (this.mute == false) {
            this.mute = true;
            this.playSceneMusic.stop();
        } else {
            this.mute = false
            this.playSceneMusic.play();
        }



        return this.mute;
    }

  



}
export default Music;