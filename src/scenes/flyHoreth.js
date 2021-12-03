import Phaser from "phaser";
import WebFontFile from '../WebFontFile';



class PlayScene extends Phaser.Scene {

    constructor() {
        super({
        
            key: 'PlayScene',
            // dom: {
            //     createContainer: true
            // }
        });

        //test API
        let g = null;
    
        
        
        this.background = null;
        this.backgroundBuildings = null;
        this.foreground = null;
        this.sun = null;
        this.clouds = null;
        this.brightness = null;
        this.birdsRight = null;
        this.birdsLeft = null;
        this.music = null;
        this.endMusic = null;
        this.wind = null;
        this.player = null;
        this.playerVersion2 = null; //check on this to replace with original player
        this.foreground_2 = null;
        this.foreground_3 = null;
        this.fireBallCount = 0;



        //controls
        this.cursors = null;

        //damage group
        this.damageGroup = null;
        this.fireball = null;
        this.electricball = null;
        this.damageItemHeight = null;
        this.damageItemDistance = null;

        //Damage collider fireball and snakebolt
        this.deathCollider = null;
        this.healthCollider = null;

        //Damage collider electricball
        this.deathCollider2 = null;
        this.healthCollider2 = null;

        //collect group Coin
        this.collectGroup = null;
        this.collectItemHeight = null;
        this.collectItemDistance = null;
        this.coins = null;
        this.goldCollectSound = null;
        this.coinsAnimation = null;
        this.newCoins = null;

        //collect armor group
        this.armorGroup = null;
        this.collectArmorHeight = null;
        this.collectArmorDistance = null;
        this.armor = null;
        this.armorCollectSound = null;
        this.armorCollected = false;

        //playerDamage Group
        this.playerDamageGroup = null;
        this.horethBall = null;
        this.horethBallTimer = 0;
        this.orbSound = null;
        this.fireButton;
        this.maxHorethBall = 1;
        this.currentHorethBallNumber = 0;
        this.bluntImpactSound = null;
        
        //active/deactivate Horethball
        this.horethBallReady = true;

        //score
        this.score = 0;
        this.scoreText = null;
        this.hiScoreText = null;
        this.errorNameLength = null;

        //font
        this.fonts = null;

        //UI
        this.topUI = null;
        this.button = null;

        //enemies
        this.snake = null;
        this.snakeVersion2 = null;
        this.enemyGroup = null;
        this.snakeDistance = null;
        this.snakeTracker = 0;
        this.snakeBolt = null; 
        this.snakeBoltAnimation = null;
        this.snakeBoltObject = null;
        this.snakeBoltTracker = 0;
        this.snakeBoltSound = null;
        
        //enemy Diamond
        this.patrolDiamond = null;
        this.move1 = false;
        this.move2 = false;
        this.move3 = false;
        this.move4 = false;
        this.movePicker = null;
        this.patrolDiamondMoving = false;
        this.initialMoveCheckDiamond = false;
        this.patrolDiamondMoveCheck = 0;
        this.trueDelay = 400;

        //Graphic following line 
        this.line1 = null;
        this.line2 = null;
        this.follower = null;
        this.path = null;
        this.bounds = null;
        this.graphics = null;

        //fireball Animation
        this.newFireBall = null;
        this.fireAnimation = null;

        //electricball Animation
        this.newElectricBall = null;
        this.ElectricAnimation = null;

        //camera position
        this.screenCenterX = null;
        this.screenCenterY = null;

        this.junglePanelLost = null;

        //timer

        this.timeElapsed = null;
        this.timerVariable = null;
        this.printTime = null;
        this.stopTimerEnd = false;

    }

    

    //Phaser Functions
    preload() {
        
    }

    create() {

        const { width, height } = this.sys.game.canvas;
        this.music = this.sound.add('theme', {volume: 0.2});
        this.music.loop = true;
        this.music.play();

        
        this.endMusic = this.sound.add('endTheme');
        this.endMusic.loop = true;
        

        this.wind = this.sound.add('wind', {volume: 0.1});
        this.wind.loop = true;
        this.wind.play();

        this.snakeBoltSound = this.sound.add('snakeBoltSound', {volume: 0.3});
        
        
        this.createBackground();
        this.createPlayer();
        this.createCursorAndKeyUpKeyDown();
        
        this.createFireAndElectricBall();
        this.createDamageCollider();
        this.createElectricCollider();
        this.createCoins();
        this.createCollectOverlap();

        this.createArmor();
        this.createCollectArmorOverlap();

        this.orbSound = this.sound.add('orbSound', {volume: 1.2});
        this.goldCollectSound = this.sound.add('goldCollectSound', {volume: .4});
        this.armorCollectSound = this.sound.add('armorCollectSound', {volume: .6});

        //UI
        this.topUI = this.add.image(0, 360, 'topUI').setOrigin(0, 0.5);

        //create screen positions
        this.screenCenterX = (this.cameras.main.worldView.x + this.cameras.main.width / 2) - 13;
        this.screenCenterY = this.cameras.main.worldView.y + 20;
        this.scoreText = this.add.text(this.screenCenterX, this.screenCenterY, '0', { fontSize: '40px', fill: 'white' }); 
        
        this.bluntImpactSound = this.sound.add('bluntImpactSound');
        this.input.keyboard.on('keydown-SPACE', this.createHorethBall, this);

      
      this.gameTimer();  
        // this.createHorethBallCollider();       
     //   this.createPatrolDiamond();
        // let g = this.testFetch();
    }

    update() {
        this.background.tilePositionX += 0.2;
        this.foreground.tilePositionX += 6.8;
        this.sun.tilePositionX += 0.05;
        this.clouds.tilePositionX += 1;
        this.foreground_2.tilePositionX += .7;
        this.foreground_3.tilePositionX += .35;

        //console.log(this.damageGroup.getChildren(5));
    
        
       
        if (this.player.x > this.damageGroup.getChildren(this.fireBallCount).x) {
            
            this.time.addEvent({
                delay: 500,
                callback: ()=>{
                    this.endScreen();
                    this.endMusic.play();
                },
                loop: false
            })
        }


        this.setControls();
        
        if(this.horethBall) {
            //console.log('fasdf');
            this.removeHorethBall();
        }

        if (this.snake) {
            this.checkAndStopSnake();
        }

        //checking for initial move and then setting boundaries after first move
        if (this.patrolDiamond) {
            
            if (this.initialMoveCheckDiamond == false) {
                this.initialPatrolDiamondStop();
            }
            
            if (this.initialMoveCheckDiamond == true) {
                // this.secondDiamondMove();
                // this.thirdDiamondMove();
                this.afterPatrolDiamondMove();
           
            }
            
        }
        
        if (this.electricball) {
            //console.log('check position');
            this.checkElectricBallPositionAndMove();
        }
        
        let tracker = 0;

        if (!this.snake) {
                this.createSnake();
                this.moveSnake();   
        }

     
        if (this.snakeBoltObject) {
            
            if (this.snakeBoltObject.x < 0) {
                this.destroySnakeBolt();
            }
            
        }

        if (!this.snakeBoltObject) {
            this.snakeBoltTracker = 0;
        }

        //tracks for snakebolt and if a snake exists to shoot a snakebolt
        if (this.snakeBoltTracker < 1 && this.snakeTracker > 0) {
            this.snakeBoltSound.play();
            this.snakeBolt = this.createSnakeBolt();
        }
        
        if (this.stopTimerEnd == false) {
            this.getElapsedTime();
        }
        
    }

    //****************TIMER*******************//

    gameTimer() {
       this.timerVariable = this.time.addEvent({delay: 90000, callback: this.endGameUsingTimer, callbackScope: this, loop: false})   
    }

    getElapsedTime() {

            if (this.printTime) {
                this.printTime.destroy();
            }
        
        var elapsed = this.timerVariable.getElapsedSeconds()
        console.log(elapsed);

        let timePrint = null;

        if (elapsed < 10) {
            timePrint = elapsed.toString().substr(0, 1)
        } else {
            timePrint = elapsed.toString().substr(0, 2)
        }

        let totalTime = 90;
        timePrint = totalTime - timePrint;

        this.printTime = this.add.text(570, 95, 'time:' + timePrint, { fill: '#000000', fontSize: '35px'}).setOrigin(0,0);
        
    }

    endGameUsingTimer() {
        this.physics.pause();
        this.endScreen();
    
    }


    //*********************after update**************************//

    //testing new methods for pathing


    //***********************************WORK IN PROGRESS***********************************//
    //Patrol Diamond Functions
    createPatrolDiamond() {
        this.patrolDiamond = this.damageGroup.create(1400,550, 'patrolDiamond');
        this.patrolDiamond.setScale(.7);     
        this.movePatrolDiamond(); 
    }

    movePatrolDiamond() {
        this.patrolDiamond.setVelocityX(-300);
        this.patrolDiamondMoving = true;
    } 

    initialPatrolDiamondStop() {
        if (this.patrolDiamond.x < 899 & this.move1 == false) {
            this.patrolDiamond.setVelocityX(0);
            this.patrolDiamond.setVelocityY(0);
            this.move1 = true;
            this.initialMoveCheckDiamond = true;
            
            this.time.addEvent({
                delay: 1800,
                callback: ()=>{
                    this.patrolDiamondMoving = false;
                },
                loop: false
            })
        }
    }

    afterPatrolDiamondMove() {

        //move diamond up 375 pixels
        if (this.patrolDiamondMoveCheck < 1) {

            for (let i = 0; i <= 750; i++) {
                this.time.addEvent({
                    delay: this.trueDelay += 2, //changes speed of change
                    callback: ()=>{
                        this.patrolDiamond.y -= .5; //distance per move

                        if (i == 750) {
                            this.move1 = true;
                            this.trueDelay = 500;
                        }
                    },
                    loop: false
                })
            }

            this.patrolDiamondMoveCheck += 1;
        }

        if (this.patrolDiamondMoveCheck == 1 && this.move1 == true && this.patrolDiamond.y == 174.5 && this.move2 == false) {
            

        
                this.time.addEvent({
                    delay: 400, //changes speed of change
                    callback: ()=>{
                        this.patrolDiamond.setVelocityX(100); //distance per move
                        this.move2 = true;
                    },
                    loop: false
                })
            
        }
        
        
    }

    // secondDiamondMove() {

    //     if (this.patrolDiamond.y < 200 && this.move2 == false) {
    //         this.patrolDiamond.y += 0;
    //         this.patrolDiamondMoving = true;
    //         this.move2 = true;
    //         this.time.addEvent({
    //             delay: 1800,
    //             callback: ()=>{
    //                 this.patrolDiamondMoving = false;
    //             },
    //             loop: false
    //         })
    //     }
    //     if (this.patrolDiamond.x > 889 && this.patrolDiamondMoving == false) {
    //         this.patrolDiamond.y -= 5;
    //         this.patrolDiamond.x += 1.5;
    //         console.log("secondDiamons");
    //     }
    // }

    // thirdDiamondMove() {
    //     if ( this.patrolDiamond.y < 200 && this.patrolDiamondMoving == false && this.patrolDiamond.x < 1150) {
    //         //this.patrolDiamond.x += 5;
    //         console.log('third move');
    //     }

    // }
    //***********************************WORK IN PROGRESS END***********************************//

    
    //Game Functions for Phaser function "create"
    createPlayer() {

        this.player = this.physics.add.sprite(100, 250, 'playerVersion2');
        this.player.setFrame(1);
        this.player.setScale(.60);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(180,65);
        this.player.body.x += 20;
        this.player.body.setOffset(60, 70);
    }

    playerDeath() {
        
    }

    createBackground() {
        this.background = this.add.tileSprite(1250, 340, 3000, 422, 'gameBackground');
        this.background.setScale(2);

        

        this.sun = this.add.tileSprite(1422, 388, 3000, 422, 'gameBackground');
        this.sun.setScale(1.7);
    

        this.background = this.add.tileSprite(250, 550, 2540, 352, 'backgroundBuildings');
        this.background.setScale(1);
        this.background.setAlpha(1);

        this.brightness = this.add.tileSprite(1250, 360, 2540, 720, 'brightness');
        this.brightness.setAlpha(0.6);
        
        this.foreground_3 = this.add.tileSprite(950, 545, 2540, 352, 'foreground_3');
        this.foreground_3.setScale(1);

        this.foreground_2 = this.add.tileSprite(1250, 545, 2540, 352, 'foreground_2');
        this.foreground_2.setScale(1);
        
    
        
        this.foreground = this.add.tileSprite(750, 488, 2500, 720, 'foreground');
        this.foreground.setScale(.65);
        this.clouds = this.add.tileSprite(1250, 360, 2540, 720, 'clouds');
    }

    //------------------------------Fire and Electric Ball and Damage Group ---------------------------//
    createFireAndElectricBall() {
        this.damageGroup = this.physics.add.group();
        this.electricGroup = this.physics.add.group();

        this.damageItemDistance = 1000;

        for (let i = 0; i < 50; i++) {

            this.damageItemDistance += 400;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;
            
            this.newFireBall = {
                key: 'fireBallAnimation',
                frames: this.anims.generateFrameNumbers('newFireBall', {start: 0, end: 5, first: 0}),
                frameRate: 5,
                repeat: -1
            }
    
            this.anims.create(this.newFireBall);
           

            this.fireball = this.damageGroup.create(this.damageItemDistance, this.damageItemHeight, 'newFireBall').play('fireBallAnimation');
            this.fireball.setScale(.9);

            //set collision box
            this.fireball.body.setSize(60,60);
            this.fireball.body.setOffset(25, 50);
            this.fireBallCount += 1;

            this.damageItemDistance += 200;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;

            this.newElectricBall = {
                key: 'electricBallAnimation',
                frames: this.anims.generateFrameNumbers('newElectricBall', {start:0, end:8, first:0}),
                frameRate: 6,
                repeat: -1
            }

            this.anims.create(this.newElectricBall);

            this.electricball = this.electricGroup.create(this.damageItemDistance, this.damageItemHeight, 'newElectricBall').play('electricBallAnimation');
            this.electricball.setScale(.6);
            this.createElectricballMovement(this.electricball.y);



            //set collision box
            this.electricball.body.setSize(100,100);

            this.damageItemDistance += 200;
            this.damageItemHeight = Math.random() * (600 - 50) + 50;
            this.electricball = this.electricGroup.create(this.damageItemDistance, this.damageItemHeight, 'newElectricBall').play('electricBallAnimation');
            this.electricball.setScale(.6);
            this.createElectricballMovement(this.electricball.y);

            //set collision box
            this.electricball.body.setSize(100,100);
        }

        this.damageGroup.setVelocityX(-350);
        this.electricGroup.setVelocityX(-350);
        
    }

    createElectricballMovement() {

        if (this.electricball.y > 600) {
            this.electricball.setVelocityY(200);
        } else {
            this.electricball.setVelocityY(-200);
        }
        
    }

    checkElectricBallPositionAndMove() {

        for (let i = 0; i < this.electricGroup.getChildren().length; i++) {
           
                if (this.electricGroup.getChildren()[i].y < 55) {
                    this.electricGroup.getChildren()[i].setVelocityY(200);
                } 
        
                if (this.electricGroup.getChildren()[i].y > 680) {
                    this.electricGroup.getChildren()[i].setVelocityY(-200);
                }
        }
    }

    createDamageCollider() {
        
        this.damageCollider = this.physics.add.collider(this.player, this.damageGroup, () => {
            
                // console.log('add pause');
                this.player.setGravityY(300);

                this.physics.pause();
                this.time.addEvent({
                    delay: 500,
                    callback: ()=>{
                        this.endScreen();
                        this.endMusic.play();
                    },
                    loop: false
                })
                    
        });
        
        this.healthCollider = this.physics.add.overlap(this.player, this.damageGroup, this.changeArmorFalse, null, this);

        this.damageCollider.active = true;
        this.healthCollider.active = false; 
    }

    changeArmorFalse() {
        //console.log('take away armor');
        this.armorCollected = false;
        //console.log(this.armorCollected);
        this.player.setAlpha(0.5);

        this.time.addEvent({
            delay: 300,
            callback: ()=>{
                this.player.setAlpha(1);
            },
            loop: false
        })

        this.time.addEvent({
            delay: 600,
            callback: ()=>{
                this.player.setAlpha(.5);
            },
            loop: false
        })

        this.time.addEvent({
            delay: 900,
            callback: ()=>{
                this.player.setAlpha(1);
            },
            loop: false
        })

        this.time.addEvent({
            delay: 1200,
            callback: ()=>{
                this.player.setAlpha(.5);
            },
            loop: false
        })

        this.time.addEvent({
            delay: 1500,
            callback: ()=>{
                this.damageCollider.active = true;
                this.healthCollider.active = false;
                this.damageCollider2.active = true;
                this.healthCollider2.active = false;
                this.player.setAlpha(1);
            },
            loop: false
        })
    }

    createElectricCollider() {
        this.damageCollider2 = this.physics.add.collider(this.player, this.electricGroup, () => {
            this.player.setGravityY(300);
            //console.log('add pause');
            this.physics.pause();
            this.time.addEvent({
                delay: 500,
                callback: ()=>{
                    
                    this.endScreen();
                    this.endMusic.play();
                },
                loop: false
            })
                
        });
    
    this.healthCollider2 = this.physics.add.overlap(this.player, this.electricGroup, this.changeArmorFalse, null, this);

    this.damageCollider2.active = true;
    this.healthCollider2.active = false; 
    }


    //-----------------------------Coins and collecting-------------------------//
    createCoins() {
        this.collectGroup = this.physics.add.group();

        this.collectItemDistance = 800;

        for (let i = 0; i < 50; i++) {

            this.newCoins = {
                key: 'coinAnimation',
                frames: this.anims.generateFrameNumbers('coinAnimated', {start: 0, end: 4, first: 0}),
                frameRate: 4,
                repeat: -1
            }
    
            this.anims.create(this.newCoins);
           

            

            this.collectItemHeight = Math.random() * (600 - 50) + 50;
            this.collectItemDistance += 800;
            this.coins = this.collectGroup.create(this.collectItemDistance, this.collectItemHeight, 'newCoins').play('coinAnimation');
            this.coins.setScale(.5);
            // this.coins = this.collectGroup.create(this.collectItemDistance, this.collectItemHeight, 'coins');
            // this.coins.setScale(.3);

            // //set collision box
            this.coins.body.setSize(75,75);
        }

        this.collectGroup.setVelocityX(-350);
    }

    createCollectOverlap() {
        this.physics.add.overlap(this.player, this.collectGroup, this.collectCoin, null, this);
    }

    collectCoin(player, collectGroup) {
        collectGroup.disableBody(true, true);
        collectGroup.destroy();
        this.score += 1;
        this.scoreText.setText(this.score);

        if (this.score >= 10) {
            this.scoreText.x = this.screenCenterX - 8;
        }

        this.goldCollectSound.play();
    }

    //-------------------------------Create armor and collect--------------------------------//

    createArmor() {
        this.collectArmorGroup = this.physics.add.group();

        this.collectArmorDistance = 1500;

        for (let i = 0; i < 2; i++) {
            this.collectArmorHeight = Math.random() * (600 - 50) + 50;
            this.armor = this.collectArmorGroup.create(this.collectArmorDistance, this.collectArmorHeight, 'armor');
            this.collectArmorDistance += 15000;
            this.armor.setScale(.3);
        
            //set collision box
            this.armor.body.setSize(200,200);
        }
        this.collectArmorGroup.setVelocityX(-350);
    }

    createCollectArmorOverlap() {
        this.physics.add.overlap(this.player, this.collectArmorGroup, this.collectArmor, null, this);
    }

    collectArmor(player, collectArmorGroup) {
        collectArmorGroup.disableBody(true,true);
        this.armorCollected = true;
        //console.log(this.armorCollected, "- armor collected status");
        this.armorCollectSound.play();
        this.damageCollider.active = false;
        this.healthCollider.active = true;
        this.damageCollider2.active = false;
        this.healthCollider2.active = true;
    }

    //Cursors
    createCursorAndKeyUpKeyDown() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    } 

    

    //---------------------------create only 1 horeth ball---------------------------//
    createHorethBall() {

        if (this.horethBallReady == true) {
            this.playerDamageGroup = this.physics.add.group();

            //console.log(this.currentHorethBallNumber, this.maxHorethBall);
            if (this.currentHorethBallNumber < this.maxHorethBall) {
            this.player.setFrame(2);
            this.horethBall = this.playerDamageGroup.create(this.player.x + 20, this.player.y, 'horethBall');
            this.horethBall.setScale(.3);
            this.playerDamageGroup.setVelocityX(900); 
            this.currentHorethBallNumber += 1;
            this.orbSound.play();
        
            if (this.snake) {
            console.log(this.playerDamageGroup, 'and', this.enemyGroup, "line");
            this.physics.add.overlap(this.playerDamageGroup, this.enemyGroup, this.destroySnake, null, this);
            }
        }
        
    } 

        

    //  this.physics.add.collider(this.enemyGroup, this.playerDamageGroup, function() {
    //      console.log(this.playerDamageGroup);
    //      console.log(this.enemyGroup);
    // });
    
    }

    removeHorethBall() {
    //console.log('removeHorethBall');
    //console.log(this.maxHorethBall);

        if (this.horethBall.x > 1300 && this.horethBall.active) {
            this.horethBall.destroy();
            this.currentHorethBallNumber -= 1;
            //console.log('hey');
        } 
    }


    //---------------------Snake functionality------------------------//
    //1 


    createSnake() {
        this.enemyGroup = this.physics.add.group();

        //if (this.snakeDistance == null) {
            this.snakeDistance = 1380;
       // } 
        

        //for (let i = 0; i <= 5; i++) {
            
            
            this.snake = {
                key: 'snakeVersion2',
                frames: this.anims.generateFrameNumbers('snake', {start: 0, end: 3, first: 0}),
                frameRate: 2,
                repeat: -1
            }
            
            this.anims.create(this.snake);
            
            this.snake = this.enemyGroup.create(this.snakeDistance, 300, 'snake').play('snakeVersion2');;
            
            this.snake.setScale(.8);
            this.snake.setSize(280,75);
            
           // this.snake.body.setSize(150,70);
            this.snakeDistance += 100;
            this.snakeTracker += 1;
            
            
        //}
        
        this.enemyGroup.setVelocityY(20);
    }

    destroySnake(playerDamage, enemy) {
        enemy.disableBody(true, true);
        playerDamage.disableBody(true, true);
        
        this.bluntImpactSound.play();
        //this.goldCollectSound.play();

        //Horethball also destroyed
        playerDamage.disableBody(true, true);
        this.currentHorethBallNumber -= 1;
        this.snakeTracker -= 1;

        this.score += 1;
        
        this.scoreText.setText(this.score);
        if (this.score >= 10) {
            this.scoreText.x = this.screenCenterX - 8;
        }

        
        this.time.addEvent({
            delay: 15500,
            callback: ()=>{
                this.snake = false;
            },
            loop: false
        })
        
        
    }

    createSnakeBolt() {
        this.snakeBoltTracker += 1;
        
        this.snakeBolt = {
            key: 'snakeBoltAnimation',
            frames: this.anims.generateFrameNumbers('snakeBolt', {start:0, end:2, first:0}),
            frameRate: 2,
            repeat: -1
        }

       
        this.anims.create(this.snakeBolt);
       
        this.snakeBoltObject = this.damageGroup.create(this.snake.x - 180, this.snake.y, 'snakeBolt').play('snakeBoltAnimation');
        this.snakeBoltObject.setScale(.5);
        this.snakeBoltObject.setSize(140,30);
        this.snakeBoltObject.setVelocityX(-400);
        
        
        
        
    }

    destroySnakeBolt() {
        this.snakeBoltObject.destroy();
        this.snakeBoltTracker = 0;
    }

    bluntImpactTrigger() {
    
        this.bluntImpactSound.play();
    }


    moveSnake() {
        this.enemyGroup.setVelocityX(-300);
    } 

    checkAndStopSnake() {
        //console.log(this.snake.y);
        
        if (this.snake.x < 1100) {
            this.snake.setVelocityX(0);
        }

        if (this.snake.x == 1100) {
            this.snake.setVelocityY(100);
        }

        if (this.snake.y > 550) {
            this.snake.setVelocityY(-100);
        }

        if (this.snake.y < 100) {
            this.snake.setVelocityY(100);
        }
        
    }


    //Game Function for Phaser function "update"
    setControls() {
        const {left, right} = this.cursors;

        let velocityStopper = false;

        if (left.isDown) {
            this.player.setVelocityX(-295);
            velocityStopper = true;

        if (this.armorCollected == false) {
            this.player.setFrame(3);   
        }

        if (this.armorCollected == true) {
            this.player.setFrame(7);      
        } }
        else if (right.isDown) {
            this.player.setVelocityX(625);            
        } 
        else if (this.keyUP.isDown) {
            //console.log(this.armorCollected);
            this.player.setVelocityY(-325);
            if (this.armorCollected == false) {
                this.player.setFrame(0);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(4);
            }

        }
        else if (this.keyDOWN.isDown) {
            this.player.setVelocityY(325);
            //console.log(this.armorCollected);
            if (this.armorCollected == false) {
                this.player.setFrame(2);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(6);
            }
        }
        else if (this.spaceBar.isDown) {
            if (this.armorCollected == false) {
                this.player.setFrame(9);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(8);
            }

        }
        else {
            this.player.setVelocityY(0);
            this.player.setDrag(1000);
            if (velocityStopper == true) {
                this.player.setVelocityX(0);
                velocityStopper == false;
            }
            if (this.armorCollected == false) {
                this.player.setFrame(1);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(5);
            }
            
        }

        if (this.keyUP.isDown && right.isDown) {
            this.player.setVelocityY(-425);
            this.player.setVelocityX(425);
        }
     
        if (this.keyDOWN.isDown && right.isDown) {
            this.player.setVelocityY(425);
            this.player.setVelocityX(425);
        }
    }

    resetVariables() {
        this.snakeTracker = 0;
        this.move1 = false;
        this.move2 = false;
    }

    async endScreen() {
        //so horethball doesn't spawn when typing name
        this.horethBallReady = false;
        
        this.stopTimerEnd = true;
        if (this.printTime) {
            this.printTime.destroy();
        }
        this.music.stop();        

        //API call to save score, create config in future
        console.log('fetch in endscreen line 969');
        

        this.resetVariables();
            
        const { width, height } = this.sys.game.canvas;
        


        //*************HISCORE PANEL***************

        let hiScorePanel = this.add.sprite(width/2 - 610, 130, 'hiScorePanel').setOrigin(0,0);
        hiScorePanel.setScale(.8);

        let hiScoreArray = [];

        
        this.fetchData();
        
        // console.log(g, "g test 2");
        // console.log('test3')

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
                await fetch('http://localhost:8080/leaderboard', {
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

    fetchData() {
        const { width, height } = this.sys.game.canvas;
        let scoreHeightIncrement = -95;
        let scoreWidthIncrement = 140;

        //get hiscore data and print to screen
        fetch('http://localhost:8080/leaderboard', {
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
        this.move1 = false;
        this.move2 = false;
        this.move3 = false;
        this.move4 = false;
        this.music.stop();
        this.endMusic.stop();
        this.wind.stop();
        this.gameTimer();
        this.stopTimerEnd = false;

        if (this.snakeTracker > 0) {
            this.snakeTracker = 0;
        }

        this.scene.restart();

    }

}




export default PlayScene;