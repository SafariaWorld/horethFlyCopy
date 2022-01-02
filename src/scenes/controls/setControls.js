// import Phaser from "phaser";

// class SetControls extends Phaser.Input.Keyboard.key {

//     constructor(scene) {
//         super(scene);
//         scene.add.existing(this);

//         this.connectKeyboard();
//     }

//     connectKeyboard() {
//         this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
//         this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
//         this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
//         this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
//     }

//     setControls() {

//         if (this.keyUp.isDown) {
//             this.player.y -= 2;
//         } else if (this.keyDown.isDown) {
//             console.log('down');
//         } else if (this.keyLeft.isDown) {
//             console.log('left');
//         } else if (this.keyRight.isDown) {
//             console.log('right');
//         }
//     }

// }

// export default SetControls