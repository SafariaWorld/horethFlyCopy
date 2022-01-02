import Phaser from "phaser";

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'playerVersion2'); 
        scene.physics.add.existing(this);
        scene.add.existing(this);
    }

    killPlayer() {
        console.log('player dead');
    }

    connectKeyboard() {
        console.log('testtest');
        this.scene.keyUp = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.scene.keyDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.scene.keyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.scene.keyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    setControls() {

        if (this.scene.keyUp.isDown) {
            this.scene.player.y -= 2
            this.scene.player.setFrame(2);
        } else if (this.scene.keyDown.isDown) {
            console.log('down');
            this.scene.player.setFrame(0);
        } else if (this.scene.keyLeft.isDown) {
            console.log('left');
            this.scene.player.setFrame(3);
        } else if (this.scene.keyRight.isDown) {
            console.log('right');
        } else {
            this.scene.player.setFrame(1);
        }
 

    }

}

export default Player