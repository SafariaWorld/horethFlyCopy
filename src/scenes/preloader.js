import WebFontFile from '../WebFontFile';
import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {

	constructor() {
		super({
      key : 'preloadScene',
      // dom: {
      //   createContainer: true
      // }
    });
	}

  preload() {

    const { width, height} = this.sys.game.canvas;
		this.graphics = this.add.graphics();
		this.newGraphics = this.add.graphics();
		var progressBar = new Phaser.Geom.Rectangle(width / 4, height / 2, width / 2, 50);
		var progressBarFill = new Phaser.Geom.Rectangle(width / 4 + 5, height / 2 + 5, width / 2 - 10, 40);

		this.graphics.fillStyle(0xffffff, 1);
		this.graphics.fillRectShape(progressBar);

		this.newGraphics.fillStyle(0x3587e2, 1);
		this.newGraphics.fillRectShape(progressBarFill);

		var loadingText = this.add.text(width / 2 , height / 2 + 80,"Loading: ", { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);

    //ALL LOADS BETWEEN COMMENTS
    this.load.audio('theme', 'assets/audio/mainMusic.wav');
    this.load.audio('endTheme', 'assets/audio/endMusic.wav');
    this.load.audio('wind', 'assets/audio/wind.wav');
    this.load.audio('snakeBoltSound', 'assets/audio/enemySnakeBoltSound.mp3');
    this.load.audio('startMusic', 'assets/audio/startMusic.wav');

        this.load.image('topUI', 'assets/topUI.png');

      //start UI
      this.load.image('junglePanelMain', 'assets/junglePanelMain.png');
      this.load.image('losePanel', 'assets/losePanel.png');

      //end UI
      this.load.image('button', 'assets/button.png');
      this.load.image('hiScorePanel', 'assets/hiScorePanel.png');
      this.load.html("form", "assets/form.html");

       // this.load.image('background', 'assets/newBackground.jpg');
        this.load.image('gameBackground', 'assets/farBackground_5.jpg');
        this.load.image('backgroundBuildings', 'assets/backgroundBuilding_4.png');
        this.load.image('foreground', 'assets/foreGround_1.png');
        this.load.image('clouds', 'assets/clouds.png');
        this.load.image('foreground_2', 'assets/foreground_2.png');
        this.load.image('foreground_3', 'assets/foreground_3.png');
        this.load.image('brightness', 'assets/brightness.png');
        this.load.image('birdsLeft','assets/birdsLeft.png');
        this.load.image('birdsRight','assets/birdsRight.png');
        this.load.image('sun', 'assets/sun.png');
        this.load.image('player', 'assets/horus.png');
        this.load.spritesheet('playerVersion2', 'assets/horusFullSpriteSheet.png', { frameWidth: 277.5, frameHeight: 225 });
        this.load.spritesheet('playerArmorOne', 'assets/horethArmorOneSpriteSheet.png', { frameWidth: 222, frameHeight: 300 });
        

        this.load.image('fireball', 'assets/fireball.png');
        this.load.image('electricball', 'assets/electricball.png');

        this.load.image('coins', 'assets/coinFinal.png');
        this.load.image('horethBall','assets/horethBall.png');
        this.load.audio('bluntImpactSound', 'assets/audio/bluntImpactSound.mp3');

        //armor
        this.load.image('armor','assets/shield.png');

        //coin 
        this.load.spritesheet('coinAnimated', 'assets/coinGoldSpriteSheet.png',{ frameWidth: 84, frameHeight: 84 });
        

        //this.load.image('snake','assets/snake.png');
    
        this.load.spritesheet('snake', 'assets/snakeSpriteSheet.png', { frameWidth: 330, frameHeight: 84 });
        this.load.image('patrolDiamond', 'assets/patrolDiamond.png');

        this.load.spritesheet("newFireBall", "assets/fireBallSpriteSheet.png", { frameWidth: 225, frameHeight: 150 });
        this.load.spritesheet("newElectricBall", "assets/electricBallSpriteSheet.png", { frameWidth: 169, frameHeight: 169 });
        this.load.spritesheet("snakeBolt","assets/snakeBolt.png", { frameWidth: 200, frameHeight: 60});



        this.load.audio('orbSound', 'assets/audio/spell.mp3');
        this.load.audio('goldCollectSound', 'assets/audio/coinNew.mp3');
        this.load.audio('armorCollectSound', 'assets/audio/armorNew.wav');

        

        const fonts = new WebFontFile(this.load, 'Abel')
		  this.load.addFile(fonts);
    //ALL LOADS BETWEEN COMMENTS


    this.load.on('progress', this.updateBar, {newGraphics:this.newGraphics,loadingText:loadingText, width: width, height: height});
    this.load.on('complete', this.complete, {scene:this.scene});
	}

  updateBar(percentage) {
    this.newGraphics.clear();
    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(this.width / 4 + 5, this.height / 2 + 5, percentage* (this.width / 2 - 10), 40));
        
    percentage = percentage * 100;
    this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
  }

	complete() {
    //Change to first scene
    this.scene.start("titleScene");
	}

}

export default PreloadScene;