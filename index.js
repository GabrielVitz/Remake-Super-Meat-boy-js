const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1335
canvas.height = 576
const gravity = 0.5

const blocks = []

console.log('Objeto TileMaps:', TileMaps)

const tileMap = TileMaps['PrimeiraFase1-0']

console.log('Mapa encontrado (tileMap):', tileMap)

if (tileMap) {
    const blocosLayer = tileMap.layers.find(layer => layer.name === 'Blocos')
    if (blocosLayer) {
        const blocosData = blocosLayer.data;
        blocosData.forEach((symbol, i) => {
            if (symbol !== 0) {
                const x = (i % tileMap.width) * tileMap.tilewidth
                const y = Math.floor(i / tileMap.width) * tileMap.tileheight                
                blocks.push(new Block({ 
                position: { x, y },
                tileId: symbol,
            }))
            }
        })
    }
}

const mapWidthInPixels = tileMap.width * tileMap.tilewidth
const scale = 0.5

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

const player = new Player({
    x:100,
    y:1500,
})

function respawn() {
    console.log("Respawn!");
    player.position.x = 100;
    player.position.y = 1500;
    player.velocity.x = 0;
    player.velocity.y = 0;
}

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    }
}

const background = new Sprite({
    position: {
        x: 0, 
        y: 0,
    },
    imageSrc: './imagens/FundoSuperMeatBoyAmpliado.png'
})

const tilesetImage = new Image()
tilesetImage.src = './imagens/tilesetgrass.png'

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.scale(scale, scale)

    let cameraX = -player.position.x + (canvas.width / 2 / scale)
    let cameraY = -player.position.y + (canvas.height / 1.4 / scale)

    if (cameraX > 0) {
        cameraX = 0
    }    
    if (cameraX < -(mapWidthInPixels - canvas.width / scale)) {
        cameraX = -(mapWidthInPixels - canvas.width / scale)
    }
    c.translate(cameraX, cameraY)

    // Desenha os elementos do jogo
    background.update()
    blocks.forEach(block => {
        block.update()
    })

    player.update()
    
    c.restore()

    player.velocity.x = 0
    if (keys.d.pressed) player.velocity.x = 5
    else if (keys.a.pressed) player.velocity.x = -5

player.position.x += player.velocity.x

for (const block of blocks) {

    if (player.position.y + player.height >= block.position.y && player.position.y <= block.position.y + block.height && player.position.x <= block.position.x + block.width && player.position.x + player.width >= block.position.x) {

        if (player.velocity.x > 0) {
            player.position.x = block.position.x - player.width - 0.01
            player.velocity.x = 0
        }
        
        if (player.velocity.x < 0) {
            player.position.x = block.position.x + block.width + 0.01
            player.velocity.x = 0
        }

        break 
    }
}

player.velocity.y += gravity
player.position.y += player.velocity.y

for (const block of blocks  ) {

    if (player.position.y + player.height >= block.position.y && player.position.y <= block.position.y + block.height && player.position.x <= block.position.x + block.width && player.position.x + player.width >= block.position.x) {

        if (player.velocity.y > 0) {

            if ((player.position.y - player.velocity.y) + player.height <= block.position.y) {
                player.position.y = block.position.y - player.height - 0.01
                player.velocity.y = 0
                break
            }
        }

        if (player.velocity.y < 0) {
            player.position.y = block.position.y + block.height + 0.01
            player.velocity.y = 0
            break
        }
    }
}

    // checa se o personagem caiu no void
    const mapHeightInPixels = tileMap.height * tileMap.tileheight;
    if (player.position.y > mapHeightInPixels) {
        respawn();
    }
    }

animate()
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
        keys.d.pressed = true
        break
        case 'a':
        keys.a.pressed = true
        break
        //tecla space
        case ' ':
        player.velocity.y = -20
        break
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
        keys.d.pressed = false
        break
        case 'a':
        keys.a.pressed = false
        break
    }
})