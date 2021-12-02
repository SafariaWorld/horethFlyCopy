import Phaser from "phaser";

class TitleScene extends Phaser.Scene {

	constructor() {
		super({key:'titleScene',});

        this.sun = null;
        this.foregroundTitle = null;
        this.cloudsTitle = null;
        this.domElement = null;
        this.startMusic = null;

        
	}

	preload() {
		this.load.image('background', 'assets/newBackground.jpg');
        this.load.image('startButtonMenu', 'assets/startButtonMenu.png');
        this.load.image('sun', 'assets/sun.png');
        this.load.image('foregroundTitle', 'assets/foreground_3.png');
        this.load.html('form', 'assets/form.html');

	}

	create() {
        this.startMusic = this.sound.add('startMusic', {volume: 0.3});
        this.startMusic.play();
        const { width, height } = this.sys.game.canvas;
        const bg = this.add.sprite(0,0,'background');
        bg.setOrigin(0,0);

        console.log('nameInputDOWN');

        this.sun = this.add.tileSprite(650, 450, 1250, 500, 'sun');
        this.sun.setScale(2)

        //console.log('test 1');

        this.cloudsTitle = this.add.tileSprite(850, 50, 1280, 720, 'clouds');
        this.cloudsTitle.setScale(1);

        this.foregroundTitle = this.add.tileSprite(200, 550, 2500, 352, 'foregroundTitle');
        this.foregroundTitle.setScale(1);

        let junglePanel = this.add.sprite(15, 5, 'junglePanelMain').setOrigin(0,0);
        junglePanel.setScale(.8);

        let junglePanelButton = this.add.sprite(width / 2 + 200, height / 2 - 140, 'startButtonMenu').setOrigin(0,0);
        junglePanelButton.setScale(.8);
        junglePanelButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.loadGame(), this);

        
      
        
        // newContainer.add(element1);
        const text = this.add.text(width / 2 * 1.65, height / 2 + 60, 'START',
         { fill: '#000000', fontSize: '25px'})
            .setInteractive({ useHandCursor: true })
            .setOrigin(.5, 0);

        text.on('pointerdown', this.loadGame, this);

	};

    loadGame() {
        this.scene.switch('PlayScene');
        this.startMusic.stop();
      
    }

    update() {
        this.sun.tilePositionX += 0.3;
        this.foregroundTitle.tilePositionX += 3;
        this.cloudsTitle.tilePositionX += 1
    }


}

export default TitleScene;