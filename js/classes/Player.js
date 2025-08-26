
class Player {
    constructor(position) {
        this.position = position
        this.velocity = {
            x:0,
            y:1
        }
        this.width = 32
        this.height = 32

    }
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
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