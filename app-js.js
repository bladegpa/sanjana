// Variabili di gioco
let currentLevel = 1;
let attempts = 3;
let currentCocktail = "";
const maxLevel = 10;
let currentBlurLevel = 2; // Valore iniziale della sfocatura
let deferredPrompt;

// Lista di cocktail classici e inventati
const cocktails = [
    "Spritz", 
    "Mojito", 
    "Negroni", 
    "Margarita", 
    "Manhattan", 
    "Daiquiri", 
    "Cosmopolitan", 
    "Sanjana Sunrise", 
    "Sanjana Breeze", 
    "Sanjana Blue Lagoon", 
    "Sanjana Passion", 
    "Sanjana Tropical Twist", 
    "Sanjana Paradise", 
    "Sanjana Fizz", 
    "Sanjana Delight", 
    "Sanjana Dream",
    "Gabriele Mule",
    "Gabriele Fizz",
    "Gabriele Sour",
    "Giampiero Martini",
    "Giampiero Punch",
    "Giampiero Royale",
    "Simona Colada",
    "Simona Sling",
    "Simona Spritzer"
];

// Registrazione del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Listener per "Add to Home Screen"
window.addEventListener('beforeinstallprompt', (e) => {
    // Previene il prompt automatico
    e.preventDefault();
    // Memorizza l'evento per mostrarlo in seguito
    deferredPrompt = e;
    // Mostra il pulsante di installazione
    document.getElementById('installButton').style.display = 'block';
});

// Aggiungi event listener al pulsante di installazione
document.getElementById('installButton').addEventListener('click', async () => {
    if (deferredPrompt) {
        // Mostra il prompt di installazione
        deferredPrompt.prompt();
        // Attende la scelta dell'utente
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // Resetta la variabile differita
        deferredPrompt = null;
        // Nascondi il pulsante
        document.getElementById('installButton').style.display = 'none';
    }
});

// Funzione per ottenere un cocktail casuale
function getRandomCocktail() {
    const randomIndex = Math.floor(Math.random() * cocktails.length);
    return cocktails[randomIndex];
}

// Aggiorna l'immagine del livello
function updateLevelImage() {
    const levelImage = document.getElementById("levelImage");
    
    if (currentLevel >= 10) {
        levelImage.src = "images/barista-level10.jpg";
    } else if (currentLevel >= 8) {
        levelImage.src = "images/barista-level8.jpg";
    } else if (currentLevel >= 6) {
        levelImage.src = "images/barista-level6.jpg";
    } else if (currentLevel >= 4) {
        levelImage.src = "images/barista-level4.jpg";
    } else if (currentLevel >= 2) {
        levelImage.src = "images/barista-level2.jpg";
    } else {
        levelImage.src = "images/barista.jpg";
    }
}

// Aggiorna le vite visualizzate
function updateLives() {
    for (let i = 1; i <= 3; i++) {
        const lifeElement = document.getElementById("life" + i);
        if (i <= attempts) {
            lifeElement.classList.remove("lost");
        } else {
            lifeElement.classList.add("lost");
        }
    }
    
    // Aggiorna il testo dei tentativi rimanenti
    document.getElementById("attemptsText").textContent = `Hai ancora ${attempts} ${attempts === 1 ? 'tentativo' : 'tentativi'}`;
}

// Inizia il gioco
function startGame() {
    // Nascondi la schermata iniziale e mostra il gioco
    document.getElementById("homeScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("victoryScreen").style.display = "none";
    
    resetGame();
}

// Reimposta il gioco
function resetGame() {
    currentLevel = 1;
    attempts = 3;
    currentBlurLevel = 2; // Resetta la sfocatura iniziale
    
    // Nascondi lo schermo di vittoria e mostra la sfida
    document.getElementById("victoryScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    
    updateLevel();
    updateProgressBar();
    updateLives();
    updateLevelImage();
    
    document.getElementById("result").innerText = "";
    document.getElementById("result").className = "";
    document.getElementById("menuInput").value = "";
}

// Aggiorna il livello
function updateLevel() {
    // Seleziona un cocktail casuale
    currentCocktail = getRandomCocktail();
    document.getElementById("cocktailName").textContent = currentCocktail;
    
    // Aggiorna l'indicatore del livello
    document.getElementById("currentLevel").textContent = currentLevel;
    
    // Applica la sfocatura attuale
    document.getElementById("menuBlurred").style.filter = `blur(${currentBlurLevel}px)`;
}

// Aggiorna la barra di progresso
function updateProgressBar() {
    // Aggiorna la barra di progresso
    const progressPercentage = ((currentLevel - 1) / maxLevel) * 100;
    document.getElementById("progressBar").style.width = progressPercentage + "%";
}

// Verifica la risposta
function checkAnswer() {
    let answer = document.getElementById("menuInput").value.toLowerCase();
    
    if (answer === currentCocktail.toLowerCase()) {
        // Risposta corretta
        document.getElementById("result").innerText = "HAI INDOVINATO! PUOI ORDINARE ANCORA";
        document.getElementById("result").className = "win";
        document.body.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
        
        if (currentLevel === maxLevel) {
            // Il giocatore ha raggiunto il livello massimo
            setTimeout(() => {
                document.getElementById("gameScreen").style.display = "none";
                document.getElementById("victoryScreen").style.display = "block";
                document.body.style.background = "linear-gradient(135deg, #8e44ad, #9b59b6)";
            }, 1500);
        } else {
            // Passa al livello successivo
            currentLevel++;
            
            // Aumenta leggermente la sfocatura ad ogni livello
            currentBlurLevel += 0.5;
            
            // Aggiorna il livello
            setTimeout(() => {
                updateLevel();
                updateProgressBar();
                updateLevelImage();
                document.getElementById("result").innerText = "";
                document.getElementById("result").className = "";
                document.getElementById("menuInput").value = "";
                document.body.style.background = "linear-gradient(135deg, #f8bbd0, #f48fb1)";
            }, 1500);
        }
    } else {
        // Risposta errata
        attempts--;
        updateLives();
        
        if (attempts === 0) {
            // Game over
            document.getElementById("result").innerText = "GAME OVER! HAI SBAGLIATO TROPPO";
            document.getElementById("result").className = "lose";
            document.body.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)";
            
            setTimeout(() => {
                document.getElementById("gameScreen").style.display = "none";
                document.getElementById("gameOverScreen").style.display = "block";
            }, 1500);
        } else {
            // Tentativo fallito ma ancora tentativi disponibili
            document.getElementById("result").innerText = "SBAGLIATO! RIPROVA";
            document.getElementById("result").className = "lose";
            document.body.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)";
            
            setTimeout(() => {
                document.body.style.background = "linear-gradient(135deg, #f8bbd0, #f48fb1)";
                document.getElementById("result").innerText = "";
                document.getElementById("menuInput").value = "";
            }, 1500);
        }
    }
}

// Aggiungi evento keypress all'input per consentire invio
document.getElementById("menuInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        checkAnswer();
    }
});

// Inizializza il gioco quando la pagina è caricata
window.addEventListener("load", function() {
    // Prepara tutti gli elementi
    updateLives();
    updateLevelImage();
    
    // Se siamo sulla schermata di gioco, inizializza il primo livello
    if (document.getElementById("gameScreen").style.display === "block") {
        updateLevel();
        updateProgressBar();
    }
});
