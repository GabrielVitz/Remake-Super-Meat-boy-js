
class Player {
    constructor({ position, sprites }) { // Recebe a posição E os sprites
        this.position = position
        this.velocity = {
            x: 0,
            y: 1
        }
        this.width = 32
        this.height = 32
       
        this.sprites = sprites
        this.currentSprite = this.sprites.idStoped
        this.lastDirection = 'right'
        //vai permitir o personagem pular calo ele caia
        this.canJump = true
    }
    draw() {
        if (!this.currentSprite || !this.currentSprite.complete || this.currentSprite.naturalHeight === 0) {
            return;
        }

        c.drawImage(
            this.currentSprite,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    update(){
        this.draw() /*
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if(this.position.y + 32 + this.velocity.y < canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0  */
    }
}