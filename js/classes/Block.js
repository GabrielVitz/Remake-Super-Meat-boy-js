class Block {
    constructor({ position, tileId }) {
        this.position = position
        this.width = 32
        this.height = 32
        this.tileId = tileId
    }

    draw() {
        if (!tilesetImage.width) return
        
        const tilesetColumns = tilesetImage.width / this.width

        const index = this.tileId - 1

        const sx = (index % tilesetColumns) * this.width

        const sy = Math.floor(index / tilesetColumns) * this.height

        c.drawImage(
            tilesetImage, 
            sx,           
            sy,           
            this.width,   
            this.height, 
            this.position.x, 
            this.position.y, 
            this.width,
            this.height
        )
    }

    update() {
        this.draw()
    }
}