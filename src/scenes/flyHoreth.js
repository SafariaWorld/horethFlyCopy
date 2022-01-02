import Phaser from "phaser";
import WebFontFile from '../WebFontFile';

//Imports of extended files
import Player from "./sprites/player";
import SetControls from "./controls/setControls";
import Background from "./backgrounds/backgroundOne";


class PlayScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'PlayScene',
        });
        
        //background
        this.background = null;
        this.layer1Background = null;
        this.layer2Background = null;
        this.layer3Background = null;
        this.foreground = null;

        //UI
        this.scoreBoard = null;


        //player
        this.player = null;

        //cursor and keyboard connection
        this.keyUp = null;
        this.keyDown = null;
        this.keyLeft = null;
        this.keyRight = null;
        
    }

    //located in preloader.js
    preload() {
        
    }

    create() {
       this.createBackground();
       this.createPlayer();

       //connect keys
    }

    //!!!!!!!                                  !!!!!!!!
    //!!!!!!!      UPDATE FUNCTION BELOW       !!!!!!!!
    //!!!!!!!                                  !!!!!!!!

    update() {
        this.player.setControls();
        this.moveBackground();


    } 
    
    //!!!!!!!                                  !!!!!!!!
    //!!!!!!!      UPDATE FUNCTION ABOVE       !!!!!!!!
    //!!!!!!!                                  !!!!!!!!

    createUI() {

    }

    moveBackground() {
        this.background.tilePositionX += 0.5;
        this.foreground.tilePositionX += 0.5;
    }

    createBackground() {

        this.background = new Background(this, 300, 340, 3040, 603, 'gameBackground').setScale(1.8); 
        this.layer1Background = new Background(this, 300, 530, 2540, 353, 'backgroundBuildings');
        this.foreground = new Background(this, 500, 470, 2540, 720,'foreground').setScale(0.7); 

    }

    createPlayer() {
        this.player = new Player(this, 300, 300).setFrame(1);
        this.player.connectKeyboard();
    }

    //********************* After Death  ********************/
    //Includes fetchs to backend to call MongoDB for score data

    async endScreen() {
        this.endScreenUp = true;

        //so horethball doesn't spawn when typing name
        this.horethBallReady = false;
        
        this.stopTimerEnd = true;
        if (this.printTime) {
            this.printTime.destroy();
        }

        if (this.mute == false) {
            this.endMusic.play();
        } else {
            this.endMusic.stop();
        }
        
        this.music.stop();        
        this.resetVariables();
        const { width, height } = this.sys.game.canvas;
    
        //HISCORE PANEL
        let hiScorePanel = this.add.sprite(width/2 - 610, 130, 'hiScorePanel').setOrigin(0,0);
        hiScorePanel.setScale(.8);

        let hiScoreArray = [];

        this.fetchData();

        let widthIncrement = 40;
        let heightIncrement = 15;

        //*************PLAYER SCORE PANEL************
        this.junglePanelLost = this.add.sprite(width/2 + 195 + widthIncrement, 100 + heightIncrement, 'losePanel').setOrigin(0,0);
        this.junglePanelLost.setScale(1.1);
    
        this.add.text(width / 2 + 390 + widthIncrement, height / 2 - 140 + heightIncrement, 'Your Score: ', 
        { fill: '#000000', fontSize: '40px'})
            .setInteractive()
            .setOrigin(.5, 0);

         this.add.text(width / 2 + 380 + widthIncrement, height / 2 - 50 + heightIncrement, '' + this.score, 
        { fill: '#000000', fontSize: '60px'})
            .setInteractive()
            .setOrigin(.5, 0);

        this.button = this.add.sprite(width/2 + 257 + widthIncrement,height/2 + 55 + heightIncrement, "button").setOrigin(0,0); 
        this.button.setScale(.8);  
        this.button.setInteractive().on('pointerdown', () => this.restart(), this);

        this.add.text(width / 2 + 370 + widthIncrement, height / 2 + 80 + heightIncrement, 'PLAY AGAIN', 
        { fill: '#000000', fontSize: '30px'})
            .setInteractive()
            .setOrigin(.5, 0)
            .on('pointerdown', () => this.restart(), this);

        //inputbox to submit score 
        let playerName = this.add.dom(618, 405).createFromCache("form")
        let submitScoreButton = this.add.sprite(width/2 - 110, height/2 + 75 + heightIncrement, "button").setOrigin(0,0);
        submitScoreButton.setScale(0.61); 
        let submitScoreText = this.add.text(width / 2 - 22, height / 2 + 90 + heightIncrement, 'Submit', 
        { fill: '#000000', fontSize: '35px'})
            .setInteractive()
            .setOrigin(.5, 0);

        submitScoreButton.setInteractive().on('pointerdown', () => this.postHiScore(document.getElementById('input-field').value, submitScoreText), this);
        submitScoreText.setInteractive().on('pointerdown', () => this.postHiScore(document.getElementById('input-field').value, submitScoreText), this);
    }

    buttonClick() {
        console.log('buttonclicked');
    }

    async postHiScore(playerName, button) {
        const { width, height } = this.sys.game.canvas;
         
        if (playerName.length < 14 && playerName.length > 3) {
                await fetch('https://horethfly.herokuapp.com/leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({ score : this.score, name: playerName })
                })
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        button.destroy();
                        if (this.errorNameLength) {
                            this.errorNameLength.destroy();
                        }
                        this.errorNameLength = this.add.text(width / 2 - 22, height / 2 + 45 - 110, 'SUCCESS', { fill: 'green', fontSize: '35px'})
                    .setInteractive()
                    .setOrigin(.5, 0)
                        
                        button = this.add.text(width / 2 - 22, height / 2 + 90 + 15, 'SUCCESS', { fill: '#000000', fontSize: '35px'})
                        .setInteractive()
                        .setOrigin(.5, 0)
                    }
                })
                .then(data => console.log(data, "POST RAN - playerName Value =", playerName))
                .catch(error => console.error('Error:', error))
        } else if (playerName.length <= 3) {
            if (this.errorNameLength) {
                this.errorNameLength.destroy();
            }
            console.log('TOO SHORT');
            
            this.errorNameLength = this.add.text(width / 2 - 22, height / 2 + 45 - 110, 'too short', { fill: 'red', fontSize: '35px'})
                .setInteractive()
                .setOrigin(.5, 0)
        }
        else {
            if (this.errorNameLength) {
                this.errorNameLength.destroy();
            }
            this.errorNameLength.destroy();
            this.errorNameLength = this.add.text(width / 2 - 22, height / 2 + 45 - 110, 'too long', { fill: 'red', fontSize: '35px'})
                .setInteractive()
                .setOrigin(.5, 0)
            
        }
        
    }


    //!!!!!!!                                  !!!!!!!!
    //!!!!!!!         HI SCORE  BOARD          !!!!!!!!
    //!!!!!!!                                  !!!!!!!!


    fetchData() {
        const { width, height } = this.sys.game.canvas;
        let scoreHeightIncrement = -95;
        let scoreWidthIncrement = 140;

        //get hiscore data and print to screen
        fetch('https://horethfly.herokuapp.com/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data, "data in testFetch");    
            
            for (let i = 0; i <= data.length; i++) {
                this.hiScoreText = this.add.text(225, height / 2 + scoreHeightIncrement, (i + 1) + "." + data[i].name, 
                    { fill: '#000000', fontSize: '30px', align: 'left'})
                    .setInteractive()
                    .setOrigin(.5, 0);
        
                this.hiScoreText = this.add.text(width / 5 + scoreWidthIncrement, height / 2 + scoreHeightIncrement, data[i].score, 
                    { fill: '#000000', fontSize: '30px'})
                    .setInteractive()
                    .setOrigin(.5, 0);

                    scoreHeightIncrement += 25;
            }
            

        })
        .catch(error => console.error('Error:', error))
    }

    restart(event) {
        this.horethBallReady = true;
        this.score = 0;
        this.snake = null;
        this.snakeBoltTracker = 0;
        this.currentHorethBallNumber = 0;
        //this.music.stop();
        this.endMusic.stop();
        this.wind.stop();
        this.gameTimer();
        this.stopTimerEnd = false;

        if (this.mute == false) {
            this.mute = true;
        } else {
            this.mute = false;
        }

        if (this.snakeTracker > 0) {
            this.snakeTracker = 0;
        }

        this.scene.restart();
    }

}

export default PlayScene;