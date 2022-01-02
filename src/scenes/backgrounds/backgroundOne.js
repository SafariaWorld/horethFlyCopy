
class Background extends Phaser.GameObjects.TileSprite {

    constructor(scene, x, y, width, height, image) {
        super(scene, x, y, width, height, image);

        scene.add.existing(this);
    }

    

}

export default Background