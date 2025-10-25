const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
//botões de jogo normal
const dialogoInicio = document.getElementById('dialogo-inicio')
const dialogoVitoria = document.getElementById('dialogo-vitoria')
const btnIniciarJogo = document.getElementById('btn-iniciar-jogo')
const btnReiniciar = document.getElementById('btn-reiniciar')

//botões de ranking
const tempoFinalEl = document.getElementById('tempo-final');
const listaRankingEl = document.getElementById('lista-ranking');
const dialogoRanking = document.getElementById('dialogo-ranking')
const btnMostrarRanking = document.getElementById('btn-ranking');
const btnJogarNovamente = document.getElementById('btn-jogar-novamente')

let tempoInicial;
let tempoFinal = 0;

let rankingAtual = [
    {nome: 'Gabriel', tempo:40000 }
];

function formatarTempo(ms) {
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    const milissegundos = Math.floor(ms % 1000);
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}.${milissegundos.toString().padStart(3, '0')}`;
}

canvas.width = 1335
canvas.height = 576
const gravity = 0.5

//objeto para receber as imagens do personagem
const playerSprites = {
    idJump: new Image(),
    idStoped: new Image(),
    idRight: new Image(),
    idLeft: new Image(),
    idJumpRight: new Image(),
    idJumpLeft: new Image(),
}

playerSprites.idStoped.src = './imagens/idStoped.png';
playerSprites.idRight.src = './imagens/idRight.png';
playerSprites.idLeft.src = './imagens/idLeft.png';
playerSprites.idJumpLeft.src = './imagens/idJumpLeft.png';
playerSprites.idJumpRight.src = './imagens/idJumpRight.png';


const blocks = []
const spikeBlocks = []

console.log('Objeto TileMaps:', TileMaps)

const tileMap = TileMaps['Fase3']

console.log('Mapa encontrado (tileMap):', tileMap)

if (tileMap) {
    const blocosLayer = tileMap.layers.find(layer => layer.name === 'Blocos')
    if (blocosLayer) {
        const blocosData = blocosLayer.data;
        blocosData.forEach((symbol, i) => {
            if (symbol !== 0) {
                const x = (i % tileMap.width) * tileMap.tilewidth
                const y = Math.floor(i / tileMap.width) * tileMap.tileheight
                // id do espinho = 41
                if (symbol >= 41) {
                    spikeBlocks.push(new Block({
                        position: { x, y },
                        tileId: symbol,
                    }))
                } 
                else {
                    blocks.push(new Block({
                        position: { x, y },
                        tileId: symbol,
                    }))
                }
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
    position: {
        x: 100,
        y: 1500,
    },
    sprites: playerSprites, 
})

function respawn() {
    console.log("Respawn!");
    player.position.x = 100;
    player.position.y = 1500;
    player.velocity.x = 0;
    player.velocity.y = 0;
    //toda vez que morrer, reseta o cronometro
    tempoInicial = performance.now();
}

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    }
}

//responsavel por carregar o fundo
const background = new Sprite({
    position: {
        x: 0, 
        y: 0,
    },
    imageSrc: './imagens/image 2.png',
    width: 3424,
    height: 1920,
})

const objetivo = new Sprite({
    position: {
        x: 350,
        y: 673,
    },
    imageSrc: './imagens/NamoradaDoPersonagem.png', 
    width: 32,
    height: 32,
})

const blocosTilesetImage = new Image()
blocosTilesetImage.src = './imagens/tilesetgrass.png'

const espinhosTilesetImage = new Image()
espinhosTilesetImage.src = './imagens/EspinhosMaiores.png'

let animationId;

function animate() {
    animationId = window.requestAnimationFrame(animate)
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
    spikeBlocks.forEach(spike => {
        spike.update()
    })

    objetivo.update()

    player.update()
    
    c.restore()

    const tempoAtual = performance.now() - tempoInicial;
    c.font = '30px Arial';
    c.fillStyle = 'white';
    c.textAlign = 'center';
    c.fillText(formatarTempo(tempoAtual), canvas.width / 2, 40);

    player.velocity.x = 0
    if (keys.d.pressed) player.velocity.x = 6
    else if (keys.a.pressed) player.velocity.x = -6
    

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

                player.canJump = true; 
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
//toda a logica de carregamento dos sprites vinculados a direção que o personagem esta indo
if (player.velocity.x > 0) {
        player.lastDirection = 'right';
    } else if (player.velocity.x < 0) {
        player.lastDirection = 'left';
    }

    if (player.velocity.y !== 0) {
        if (player.velocity.x === 0) {
            player.currentSprite = player.sprites.idStoped;
        }
        else {
            if (player.lastDirection === 'right') {
                player.currentSprite = player.sprites.idJumpRight;
            } else {
                player.currentSprite = player.sprites.idJumpLeft;
            }
        }
    }     
    else if (player.velocity.x !== 0) {
        if (player.lastDirection === 'right') {
            player.currentSprite = player.sprites.idRight;
        } else {
            player.currentSprite = player.sprites.idLeft;
        }
    }     
    else {
        player.currentSprite = player.sprites.idStoped;
    }

    for (const spike of spikeBlocks) {
        if (
            player.position.y + player.height >= spike.position.y &&
            player.position.y <= spike.position.y + spike.height &&
            player.position.x <= spike.position.x + spike.width &&
            player.position.x + player.width >= spike.position.x
        ) {
            respawn();
            break;
        }
    }
    //checa se o personagem chegou no objetivo
    if (
        player.position.y + player.height >= objetivo.position.y &&
        player.position.y <= objetivo.position.y + objetivo.height &&
        player.position.x <= objetivo.position.x + objetivo.width &&
        player.position.x + player.width >= objetivo.position.x
    ) {
    tempoFinal = performance.now() - tempoInicial;
    tempoFinalEl.innerText = `Seu tempo: ${formatarTempo(tempoFinal)}`;

    const recordeJogador = rankingAtual.find(item => item.nome === 'Jogador');

    if (!recordeJogador || tempoFinal < recordeJogador.tempo) {

        rankingAtual = rankingAtual.filter(item => item.nome !== 'Jogador');        
        rankingAtual.push({ nome: 'Jogador', tempo: tempoFinal });
    }

    rankingAtual.sort((a, b) => a.tempo - b.tempo);
    rankingAtual = rankingAtual.slice(0, 2);

    cancelAnimationFrame(animationId);
    dialogoVitoria.showModal();


    }

    
    // checa se o personagem caiu no void
    const mapHeightInPixels = tileMap.height * tileMap.tileheight;
    if (player.position.y > mapHeightInPixels) {
        respawn();
    }
    }


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
        if (player.canJump) {
            player.canJump = false;
            if (keys.a.pressed || keys.d.pressed) {
                player.velocity.y = -20;
            } else {
                player.velocity.y = -15;
            }
        }
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
dialogoInicio.showModal();

btnIniciarJogo.addEventListener('click', () => {
    tempoInicial = performance.now();
    dialogoInicio.close();
    animate();
});


btnReiniciar.addEventListener('click', () => {
    dialogoVitoria.close(); 
    respawn();              
    animate();              
});

function mostrarRanking() {
    //limpa a lista antiga
    listaRankingEl.innerHTML = '';

    rankingAtual.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome}: ${formatarTempo(item.tempo)}`;
        listaRankingEl.appendChild(li);
    });
}

btnMostrarRanking.addEventListener('click', () => {
    dialogoVitoria.close();  // Fecha o diálogo de vitória
    mostrarRanking();        // Chama a função para preparar o ranking
    dialogoRanking.showModal();
}); 
btnJogarNovamente.addEventListener('click', () => {
    dialogoRanking.close(); 
    respawn();              
    animate();              
});