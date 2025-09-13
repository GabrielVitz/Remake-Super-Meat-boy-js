class Block {
    constructor({ position, tileId }) {
        this.position = position
        this.width = 32
        this.height = 32
        this.tileId = tileId
    }

   draw() {
        let imageToUse;
        let firstgid;

        if (this.tileId >= 42) {
            imageToUse = espinhosTilesetImage;
            firstgid = 42;
        } 
        else {
            imageToUse = blocosTilesetImage;
            firstgid = 1;
        }

        if (!imageToUse || !imageToUse.complete || imageToUse.naturalHeight === 0) {
            return;
        }

        const tilesetColumns = imageToUse.width / this.width;
        
        const index = this.tileId - firstgid;

        const sx = (index % tilesetColumns) * this.width;
        const sy = Math.floor(index / tilesetColumns) * this.height;

        c.drawImage(
            imageToUse,
            sx, sy,
            this.width, this.height,
            this.position.x, this.position.y,
            this.width, this.height
        )
    }

    update() {
        this.draw()
    }
}