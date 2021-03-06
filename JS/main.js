/* DOM SELECTORS -- EVENT LISTENERS */
const canvas = document.querySelector('#canvas')
const endButton = document.createElement('button')
endButton.id = "playAgain"
/* GAME STATE/CANVAS RENDERING STUFF */
let ctx = canvas.getContext('2d')

/* OBJECT FACTORY */

class Character {
    constructor (health, attack, defense, heal) {
        this.health = health,
        this.attack = attack,
        this.defense = defense,
        this.heal = heal
    }
}

let player = new Character(100, 15, 5, 4)
let enemy = new Character(100, 5, 3, 3)


/* FUNCTIONS */

// Making sure health numbers above the health bar match what's shown on the health bar
function pBarSync() {
    playerHealth.value = player.health
    pHealthBar.innerText = playerHealth.value
}

function eBarSync() {
    enemyHealth.value = enemy.health
    eHealthBar.innerText = enemyHealth.value
}

// function that switches outcome back to move choices. When player chooses to restart
function returnTo() {
    results.style.display = "none"
    moveBox.style.display = "block"
}

// function that switches the display from move choices to outcome
function switchTo() {
    moveBox.style.display = "none"
    results.style.display = "block"
}

function playerRender() {
    playerImage = new Image()
    playerImage.src = 'https://i.imgur.com/UlU20eK.png'
    playerImage.onload = function() {
        ctx.drawImage(playerImage, 20, 40, 100, 100)
    }
}

function enemyRender(image, x, y, width, height) {
    enemyImage = new Image()
    enemyImage.src = image
    enemyImage.onload = function() {
        ctx.drawImage(enemyImage, x, y, width, height)
    }
}

// If easy, enemy randomly chooses move. If hard, some logic towards moves
function enemyMove() {
    if (easy.checked) {
        enemyPlay = Math.floor(Math.random()*2)
    } else {
        if (player.attack > enemy.defense && enemy.health/enemyHealth.max < 0.2) {
            enemyPlay = Math.floor(Math.random()*2)
        } else if (player.attack <= enemy.defense && enemy.health/enemyHealth.max < 0.2) {
            if (Math.floor(Math.random()*2) === 0) {
                return enemyPlay = 1
            } else {
                return enemyPlay = 2
            }
        } else {
            enemyPlay = Math.floor(Math.random()*3)
        }
    }
}

// When player health reaches 0 and clicks restart stage
function restart() {
    player.health = playerHealth.max
    pBarSync()
    enemy.health = enemyHealth.max
    eBarSync()
    returnTo()
}

// Full Reset at End of Game
function fullreset() {
    playerHealth.max = 100
    enemyHealth.max = 100
    eTotalHealth.innerText = '/' + enemyHealth.max
    player.health = playerHealth.max
    pBarSync()
    enemy.health = enemyHealth.max
    eBarSync()
    startScreen.style.display = "grid"
    fightStage.style.display = "none"
    endButton.removeEventListener('click', fullreset)
}

// When the player chooses to attack, defend or heal, the different possible outcomes
function playerAttack() {
        enemyMove()
    if (enemyPlay === 0) {
        enemy.health -= player.attack
        eBarSync()
        player.health -= enemy.attack
        pBarSync()
        switchTo()
        results.innerText = "Player Attacks. Enemy Attacks"
        result()
    } else if (enemyPlay === 1) {
        enemy.health -= (player.attack - enemy.defense)
        eBarSync()
        switchTo()
        results.innerText = "Player Attacks. Enemy Defends"
        result()
    } else {
        enemy.health -= (player.attack - enemy.heal)
        eBarSync
        switchTo()
        results.innerText = "Player Attacks. Enemy Heals"
        result()
    }
}

function playerDefend() {
    enemyMove()
    if (enemyPlay === 1) {
        player.health -= (enemy.attack - player.defense)
        pBarSync()
        switchTo()
        results.innerText = "Player Defends. Enemy Attacks"
        result()
    } else if (enemyPlay === 0) {
        switchTo()
        results.innerText = "Player Defends. Enemy Defends"
        setTimeout(returnTo, 2000)
    } else {
        enemy.health += enemy.heal
        eBarSync
        switchTo()
        results.innerText = "Player Defends. Enemy Heals"
        setTimeout(returnTo, 2000)
    }
}

function playerHeal() {
    enemyMove()
    if (enemyPlay === 1) {
        player.health -= (enemy.attack - player.heal)
        pBarSync()
        switchTo()
        results.innerText = "Player Heals. Enemy Attacks"
        result()
    } else if (enemyPlay === 0) {
        if ((player.health + player.heal) > 100) {
            player.health = 100
            pBarSync()
            switchTo()
            results.innerText = "Player Is Fully Healed. Enemy Defends"
            setTimeout(returnTo, 2000)
        } else {
            player.health += player.heal
            pBarSync()
            switchTo()
            results.innerText = "Player Heals " + player.heal + " HP. Enemy Defends"
            setTimeout(returnTo, 2000)
        }
    } else {
        player.health += player.heal
        enemy.health += enemy.heal
        pBarSync()
        eBarSync()
        switchTo()
        results.innerText = "Player Heals. Enemy Heals"
        setTimeout(returnTo, 2000)
    }
}

// Outcome for when enemy or player health reaches zero
function result() {
    if (player.health <= 0) {
        moveBox.style.display = "none"
        results.innerText = "Player Died. Try again?"
        results.appendChild(endButton)
        endButton.innerText = "Restart Stage?"
        endButton.addEventListener('click', restart)
    } else if (enemy.health <= 0) {
        moveBox.style.display = "none"
        if (easy.checked) {
            if (enemyHealth.max > 200) {
                results.innerText = "Congratulations! Angus defeated all the baddies!"
                results.appendChild(endButton)
                endButton.innerText = "Restart"
                endButton.addEventListener('click', fullreset)
            } else {
                results.innerText = "Player Wins!"
                results.appendChild(endButton)
                endButton.innerText = "Next Stage"
                endButton.addEventListener('click', nextStage)
            }
        } else {
            if (enemyHealth.max > 500) {
            results.innerText = "Congratulations! Angus defeated all the baddies!"
            results.appendChild(endButton)
            endButton.innerText = "Restart"
            endButton.addEventListener('click', fullreset)
            } else {
            results.innerText = "Player Wins!"
            results.appendChild(endButton)
            endButton.innerText = "Next Stage"
            endButton.addEventListener('click', nextStage)
            }
        }
    } else {
        setTimeout(returnTo, 2000)
    }
}

// Function to show stage number and render new enemies for each stage
function stageText() {
    if (easy.checked) {
        if (enemyHealth.max < 110) {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("STAGE 1", 128, 30)
            enemyRender("./IMG/bunny.png", 180, 75, 100, 100)
        } else if (enemyHealth.max > 110 && enemyHealth.max < 140) {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("STAGE 2", 128, 30)
            enemyRender("./IMG/duck.png", 200, 90, 50, 50)
        } else if (enemyHealth.max > 140 && enemyHealth.max < 170) {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("STAGE 3", 128, 30)
            enemyRender("./IMG/cat.png", 200, 90, 50, 50)
        } else if (enemyHealth.max > 170 && enemyHealth.max < 200) {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("STAGE 4", 128, 30)
            enemyRender("./IMG/mole.png", 190, 65, 60, 75)
        } else {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("BOSS STAGE", 128, 30)
            enemyRender("./IMG/dragon.png", 180, 65, 90, 75)
        }
    } else {
        if (enemyHealth.max < 140) {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("STAGE 1", 128, 30)
            enemyRender("./IMG/bunny.png", 180, 75, 100, 100)
        } else if (enemyHealth.max >= 150 && enemyHealth.max < 2225) {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("STAGE 2", 128, 30)
            enemyRender("./IMG/duck.png", 200, 90, 50, 50)
        } else if (enemyHealth.max >= 225 && enemyHealth.max < 350) {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("STAGE 3", 128, 30)
            enemyRender("./IMG/cat.png", 200, 90, 50, 50)
        } else if (enemyHealth.max > 350 && enemyHealth.max < 450) {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("STAGE 4", 128, 30)
            enemyRender("./IMG/mole.png", 190, 65, 60, 75)
        } else {
            ctx.clearRect(120, 0, 500, 500)
            ctx.fillText("BOSS STAGE", 128, 30)
            enemyRender("./IMG/dragon.png", 180, 65, 90, 75)
        }
    }
}

// Function to increase enemy stats for the next stage and to reset the text box and update the enemy health bar
function nextStage() {
    if (easy.checked) {
        enemyHealth.max = Math.floor(enemyHealth.max * 1.2)
        enemy.health = enemyHealth.max
        eTotalHealth.innerText = '/' + enemyHealth.max
        enemy.attack = Math.floor(enemy.attack * 1.2)
        enemy.defense = Math.floor(enemy.defense * 1.2)
        enemy.heal = Math.floor(enemy.heal * 1.2)
    } else {
        enemyHealth.max = Math.floor(enemyHealth.max * 1.5)
        enemy.health = enemyHealth.max
        eTotalHealth.innerText = '/' + enemyHealth.max
        enemy.attack = Math.floor(enemy.attack * 1.5)
        enemy.defense = Math.floor(enemy.defense * 1.5)
        enemy.heal = Math.floor(enemy.heal * 1.5)
    }
    eBarSync()
    stageText()
    returnTo()
}

// The game
function play() {
    if(easy.checked) {
        playerRender()
        enemyRender("./IMG/bunny.png", 180, 75, 100, 100)
        stageText()
        attack.addEventListener('click', playerAttack)
        defend.addEventListener('click', playerDefend)
        heal.addEventListener('click', playerHeal)
    } else {
        playerRender()
        enemyRender("./IMG/bunny.png", 180, 75, 100, 100)
        stageText()
        eTotalHealth.innerText = '/' + enemyHealth.max
        attack.addEventListener('click', playerAttack)
        defend.addEventListener('click', playerDefend)
        heal.addEventListener('click', playerHeal)
    }
}

// Start Button
document.querySelector('button').addEventListener('click', () => {
    startScreen.style.display = "none"
    fightStage.style.display = "grid"
    play()
})

// The game
