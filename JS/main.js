/* DOM SELECTORS -- EVENT LISTENERS */
const canvas = document.querySelector('#canvas')
const resultBox = document.createElement('div')
resultBox.id = "results"
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

let player = new Character(100, 5, 3, 4, 40, 90, 40, 50, "green")

let enemy = new Character(100, 5, 3, 0, 220, 90, 40, 50, "red")

player.render()
enemy.render()


/* FUNCTIONS */

function enemyMove() {
    enemyPlay = Math.floor(Math.random()*2)
}
function playerAttack() {
    enemyMove()
    if (enemyPlay === 1) {
        enemy.health -= player.attack
        enemyHealth.value = enemy.health
        eHealthBar.innerText = enemy.health, '/100'
        player.health -= enemy.attack
        playerHealth.value = player.health
        pHealthBar.innerText = player.health, '/100'
        result()
    } else {
        enemy.health -= (player.attack - enemy.defense)
        enemyHealth.value = enemy.health
        eHealthBar.innerText = enemy.health, '/100'
        result()
    }
    console.log(enemyPlay)
    console.log(player.attack)
    console.log(enemy.defense)
    console.log(player.health)
    console.log(enemy.health)
}

function playerDefend() {
    enemyMove()
    if (enemyPlay === 1) {
        player.health -= (enemy.attack - player.defense)
        playerHealth.value = player.health
        pHealthBar.innerText = player.health, '/100'
    }
}

function playerHeal() {
    enemyMove()
    if (enemyPlay === 1) {
        player.health -= (enemy.attack - player.heal)
        playerHealth.value = player.health
        pHealthBar.innerText = player.health, '/100'
    } else {
        if ((player.health + player.heal) > 100) {
            player.health = 100
            playerHealth.value = player.health
            pHealthBar.innerText = player.health, '/100'
        } else {
            player.health += player.heal
            playerHealth.value = player.health
            pHealthBar.innerText = player.health, '/100'
        }
    }
}

function result() {
    if (player.health <= 0) {
        moveBox.style.display = "none"
        textBox.appendChild(resultBox)
        results.innerText = "Player Died. Try again?"
    } else if (enemy.health <= 0) {
        moveBox.style.display = "none"
        textBox.appendChild(resultBox)
        results.innerText = "Player Wins!"
    }
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
