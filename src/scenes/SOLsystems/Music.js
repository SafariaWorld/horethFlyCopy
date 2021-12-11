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
        this.load.image('mute', '../assets/mute.png');
        this.load.image('unmute', '../assets/unmute.png');
        this.load.image('land', '../assets/sun.png');

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
        
        console.log('music file activated');
    }

    displayMuteButton(muteValue) {
        this.muteButton = this.add.image( PlayScene ,300,300, 'mute');
        console.log('mutebutton');
    }



}
export default Music;