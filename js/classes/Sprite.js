class Sprite {
  constructor({ position, imageSrc, width = 32, height = 32 }) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        
        this.width = width
        this.height = height        
    }
    draw() {
         if (!this.image || !this.image.complete || this.image.naturalHeight === 0) {
            return;
        }
                
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
    }
}