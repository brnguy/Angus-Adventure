/* DOM SELECTORS -- EVENT LISTENERS */
const canvas = document.querySelector('#canvas')
const endButton = document.createElement('button')
endButton.id = "playAgain"
/* GAME STATE/CANVAS RENDERING STUFF */
let ctx = canvas.getContext('2d')

/* OBJECT FACTORY */

class Character {
    constructor (health, attack, defense, heal, x, y, width, height, color) {
        this.health = health,
        this.attack = attack,
        this.defense = defense,
        this.heal = heal,
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.color = color
    }

    render() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let player = new Character(100, 100, 0, 4, 40, 90, 40, 50, "green")

let enemy = new Character(100, 100, 0, 0, 220, 90, 40, 50, "red")

player.render()
enemy.render()
stageText()


/* FUNCTIONS */
function pBarSync() {
    playerHealth.value = player.health
    pHealthBar.innerText = playerHealth.value
}

function eBarSync() {
    enemyHealth.value = enemy.health
    eHealthBar.innerText = enemyHealth.value
}
function returnTo() {
    results.style.display = "none"
    moveBox.style.display = "block"
}

function switchTo() {
    moveBox.style.display = "none"
    results.style.display = "block"
}

function enemyMove() {
    enemyPlay = Math.floor(Math.random()*2)
}

function restart() {
    player.health = 100
    pBarSync()
    enemy.health = 100
    eBarSync()
    returnTo()
}

function playerAttack() {
    enemyMove()
    if (enemyPlay === 1) {
        enemy.health -= player.attack
        eBarSync()
        player.health -= enemy.attack
        pBarSync()
        switchTo()
        results.innerText = "Player Attacks. Enemy Attacks"
        result()
    } else {
        enemy.health -= (player.attack - enemy.defense)
        eBarSync()
        switchTo()
        results.innerText = "Player Attacks. Enemy Defends"
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
    } else {
        switchTo()
        results.innerText = "Player Defends. Enemy Defends"
        setTimeout(returnTo, 2000)
    }
}

function playerHeal() {
    enemyMove()
    if (enemyPlay === 1) {
        player.health -= (enemy.attack - player.heal)
        pBarSync()
        switchTo()
        results.innerText = "Player Heals " + player.heal + " HP. Enemy Attacks"
        result()
    } else {
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
    }
}

function result() {
    if (player.health <= 0) {
        moveBox.style.display = "none"
        results.innerText = "Player Died. Try again?"
        results.appendChild(endButton)
        endButton.innerText = "Restart"
        endButton.addEventListener('click', restart)
    } else if (enemy.health <= 0) {
        moveBox.style.display = "none"
        results.innerText = "Player Wins!"
        results.appendChild(endButton)
        endButton.innerText = "Next Stage"
        if (enemyHealth.max < 0)
        endButton.addEventListener('click', nextStage)
    } else {
        setTimeout(returnTo, 2000)
    }
}

function stageText() {
    if (enemyHealth.max < 110) {
        ctx.fillText("STAGE 1", 128, 30)
    } else if (enemyHealth.max > 110 && enemyHealth.max < 140) {
        ctx.clearRect(0, 0, 1000, 30)
        ctx.fillText("STAGE 2", 128, 30)
    } else if (enemyHealth.max > 140 && enemyHealth.max < 170) {
        ctx.clearRect(0, 0, 1000, 30)
        ctx.fillText("STAGE 3", 128, 30)
    } else if (enemyHealth.max > 170 && enemyHealth.max < 200) {
        ctx.clearRect(0, 0, 1000, 30)
        ctx.fillText("STAGE 4", 128, 30)
    } else {
        ctx.clearRect(0, 0, 1000, 30)
        ctx.fillText("BOSS STAGE", 128, 30)
    }
}

function nextStage() {
    enemyHealth.max = Math.floor(enemyHealth.max * 1.2)
    enemy.health = enemyHealth.max
    eTotalHealth.innerText = '/' + enemyHealth.max
    enemy.attack = Math.floor(enemy.attack * 1.5)
    enemy.defense = Math.floor(enemy.defense * 1.5)
    enemy.y -= 10
    enemy.width = 40
    enemy.height += 10
    enemy.render()
    stageText()
    eBarSync()
    returnTo()
}

// Start Button -- EXTRA (FADE OUT)
document.querySelector('button').addEventListener('click', () => {
    startScreen.style.display = "none"
    fightStage.style.display = "grid"
})

// Fight Sequence
attack.addEventListener('click', playerAttack)
defend.addEventListener('click', playerDefend)
heal.addEventListener('click', playerHeal)

