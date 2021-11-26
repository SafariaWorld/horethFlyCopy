import Phaser from "phaser";
import WebFontFile from '../WebFontFile';



class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
    
        this.background = null;
        this.backgroundBuildings = null;
        this.foreground = null;
        this.sun = null;
        this.clouds = null;
        this.brightness = null;
        this.birdsRight = null;
        this.birdsLeft = null;
        this.music = null;
        this.player = null;
        this.playerVersion2 = null; //check on this to replace with original player
        this.foreground_2 = null;
        this.foreground_3 = null;

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

        //score
        this.score = null;
        this.scoreText = null;

        //font
        this.fonts = null;

        //UI
        this.topUI = null;

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
    }

    

    //Phaser Functions
    preload() {
        
    }

    create() {
        this.music = this.sound.add('theme', {volume: 0.2});
        this.music.play();
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

        this.orbSound = this.sound.add('orbSound', {volume: 0.8});
        this.goldCollectSound = this.sound.add('goldCollectSound');

        //UI
        this.topUI = this.add.image(0, 360, 'topUI').setOrigin(0, 0.5);

        //create screen positions
        this.screenCenterX = (this.cameras.main.worldView.x + this.cameras.main.width / 2) - 13;
        this.screenCenterY = this.cameras.main.worldView.y + 20;
        this.scoreText = this.add.text(this.screenCenterX, this.screenCenterY, '0', { fontSize: '40px', fill: 'white' }); 
        
        this.bluntImpactSound = this.sound.add('bluntImpactSound');
        this.input.keyboard.on('keydown-SPACE', this.createHorethBall, this);

        // this.createHorethBallCollider();       
        this.createPatrolDiamond();
    }

    update() {
        this.background.tilePositionX += 0.2;
        this.foreground.tilePositionX += 5.8;
        this.sun.tilePositionX += 0.05;
        this.clouds.tilePositionX += 1;
        this.foreground_2.tilePositionX += .7;
        this.foreground_3.tilePositionX += .35;
       
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
            this.snakeBolt = this.createSnakeBolt();
        }


  
        
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
        this.player.setScale(.45);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(120,45);
        this.player.body.x += 20;

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
            this.fireball.body.setSize(80,80);

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
                this.physics.pause();
                this.endScreen();
                    
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
            
            //console.log('add pause');
            this.physics.pause();
            this.endScreen();
                
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
            this.collectItemHeight = Math.random() * (600 - 50) + 50;
            this.collectItemDistance += 800;
            this.coins = this.collectGroup.create(this.collectItemDistance, this.collectItemHeight, 'coins');
            this.coins.setScale(.3);

            //set collision box
            this.coins.body.setSize(375,375);
        }

        this.collectGroup.setVelocityX(-350);
    }

    createCollectOverlap() {
        this.physics.add.overlap(this.player, this.collectGroup, this.collectCoin, null, this);
    }

    collectCoin(player, collectGroup) {
        collectGroup.disableBody(true, true);
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
            this.armor.setScale(.5);
            

            //set collision box
            this.armor.body.setSize(100,100);
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
        this.goldCollectSound.play();
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
    } 


    //---------------------------create only 1 horeth ball---------------------------//
    createHorethBall() {
        this.playerDamageGroup = this.physics.add.group();

        //console.log(this.currentHorethBallNumber, this.maxHorethBall);
        if (this.currentHorethBallNumber < this.maxHorethBall) {
            this.horethBall = this.playerDamageGroup.create(this.player.x, this.player.y, 'horethBall');
            this.horethBall.setScale(.3);
            this.playerDamageGroup.setVelocityX(900); 
            this.currentHorethBallNumber += 1;
            this.orbSound.play();
        
        if (this.snake) {
            console.log(this.playerDamageGroup, 'and', this.enemyGroup, "line");
            this.physics.add.overlap(this.playerDamageGroup, this.enemyGroup, this.destroySnake, null, this);
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
                frames: this.anims.generateFrameNumbers('snake', {start: 0, end: 5, first: 0}),
                frameRate: 3,
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
            console.log(this.armorCollected);
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
            console.log(this.armorCollected);
            if (this.armorCollected == false) {
                this.player.setFrame(2);
            }
            if (this.armorCollected == true) {
                this.player.setFrame(6);
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

    endScreen() {

        this.resetVariables();
        
        const { width, height } = this.sys.game.canvas;

        this.add.text(width / 2, height / 2 - 150, 'Your Score: ' + this.score, 
        { fill: '#000000', fontSize: '60px'})
            .setInteractive()
            .setOrigin(.5, 0);

        this.add.text(width / 2, height / 2, 'PLAY AGAIN BUTTON IMAGE', 
        { fill: '#000000', fontSize: '30px'})
            .setInteractive()
            .setOrigin(.5, 0)
            .on('pointerdown', () => this.restart(), this);
    }

    restart(event) {
        this.score = 0;
        this.snake = null;
        this.snakeBoltTracker = 0;
        this.currentHorethBallNumber = 0;
        this.move1 = false;
        this.move2 = false;
        this.move3 = false;
        this.move4 = false;
        this.music.stop();
        

        if (this.snakeTracker > 0) {
            this.snakeTracker = 0;
        }

        this.scene.restart();

    }

}




export default PlayScene;