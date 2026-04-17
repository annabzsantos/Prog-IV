let score = 0;
let gameActive = false;
const areaJogo = document.getElementById('areaJogo');
const scoreDisplay = document.getElementById('score');


document.addEventListener('mousemove', function(e) {
    const trail = document.createElement('div');
    trail.className = 'trail';

    const spread = 20;
    const offsetX = (Math.random() - 0.5) * spread;
    const offsetY = (Math.random() - 0.5) * spread;

    trail.style.left = (e.pageX + offsetX) + 'px';
    trail.style.top = (e.pageY + offsetY) + 'px';

    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 800);
});

function startGame() {
    if (gameActive) return; 
    
    score = 0;
    gameActive = true;
    scoreDisplay.innerText = score;
    areaJogo.innerHTML = ''; 

    const gameInterval = setInterval(() => {
        if (gameActive) createEnemy();
    }, 800); 

    setTimeout(() => {
        gameActive = false;
        clearInterval(gameInterval);
        alert(`Fim de jogo! Sua pontuação final: ${score}`);
    }, 15000); 
}


function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';

    const maxX = Math.max(areaJogo.offsetWidth - 80, 0);
    const maxY = Math.max(areaJogo.offsetHeight - 80, 0);
    
    const randomX = Math.abs(Math.floor(Math.random() * maxX));
    const randomY = Math.abs(Math.floor(Math.random() * maxY));

    enemy.style.left = `${randomX}px`;
    enemy.style.top = `${randomY}px`;

    enemy.addEventListener('mousedown', function() {
        if (gameActive) {
            score++;
            scoreDisplay.innerText = score;
            this.classList.add('hit'); 
            this.style.pointerEvents = 'none';
            setTimeout(() => {
                if (this.parentElement) this.remove();
            }, 150); 
        }
    });

    areaJogo.appendChild(enemy);

    setTimeout(() => {
        if (enemy.parentElement) {
            enemy.remove();
        }
    }, 1200);
}