// ========== INIT ==========
let history = JSON.parse(localStorage.getItem('decisionHistory') || '[]');
let customPeople = JSON.parse(localStorage.getItem('customPeople') || '["RAY", "STEVE", "MARCEL"]');
let customPays = JSON.parse(localStorage.getItem('customPays') || '["RAY", "STEVE", "MARCEL"]');

// Splash screen
setTimeout(() => document.getElementById('splash').classList.add('hidden'), 1500);

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

// Offline detection
window.addEventListener('online', () => document.getElementById('offline').classList.add('hidden'));
window.addEventListener('offline', () => document.getElementById('offline').classList.remove('hidden'));

// ========== THEME & LANGUAGE ==========
const themeBtn = document.getElementById('themeToggle');
const langBtn = document.getElementById('langToggle');
let isDark = localStorage.getItem('theme') !== 'light';
let curLang = localStorage.getItem('lang') || 'en';

const translations = {
    en: {
        wheelTitle: 'Custom Wheel',
        wheelPlaceholder: 'Add option + Enter',
        spin: 'SPIN!',
        share: 'Share 📤',
        coinTitle: 'Coin Flip',
        flip: 'FLIP!',
        diceTitle: 'Dice Roll',
        roll: 'ROLL!',
        numberTitle: 'Random Number',
        generate: 'GENERATE!',
        personTitle: 'Random Person',
        personPlaceholder: 'Add name + Enter',
        pick: 'PICK!',
        foodTitle: 'What to Eat?',
        decide: 'DECIDE!',
        movieTitle: 'Movie Genre',
        paysTitle: 'Who Pays?',
        musicTitle: 'Music Roulette',
        dareTitle: 'Dare Challenge',
        dareBtn: 'DARE!',
        travelTitle: 'Where to Travel?',
        go: 'GO!',
        gameTitle: 'What to Play?',
        magic8Title: 'Magic 8-Ball',
        ask: 'ASK!',
        historyTitle: 'History 📜',
        clear: 'Clear',
        close: 'Close',
        offline: "📴 You're offline",
        splash: 'Decision App',
        shareMsg: 'Copied to clipboard!',
        wheelResultBase: '🎡 The wheel says: ',
        coinResultBase: '🪙 Coin says: ',
        diceResultBase: '🎲 You rolled: ',
        numberResultBase: '🔢 Your number: ',
        personResultBase: '🎉 Winner: ',
        foodResultBase: '🍽️ Let\'s eat: ',
        movieResultBase: '🎬 Watch: ',
        paysResultBase: '💸 Pays: ',
        musicResultBase: '🎵 Listen to: ',
        dareResultBase: '💪 Dare: ',
        travelResultBase: '✈️ Go to: ',
        gameResultBase: '🎮 Let\'s play: ',
        magic8ResultBase: '🔮 Magic 8-Ball: ',
        head: 'Heads',
        tail: 'Tails'
    },
    de: {
        wheelTitle: 'Glücksrad',
        wheelPlaceholder: 'Option hinzufügen + Enter',
        spin: 'DREHEN!',
        share: 'Teilen 📤',
        coinTitle: 'Münzwurf',
        flip: 'WERFEN!',
        diceTitle: 'Würfeln',
        roll: 'WÜRFELN!',
        numberTitle: 'Zufallszahl',
        generate: 'GENERIEREN!',
        personTitle: 'Zufallsperson',
        personPlaceholder: 'Name hinzufügen + Enter',
        pick: 'WÄHLEN!',
        foodTitle: 'Was essen?',
        decide: 'ENTSCHEIDEN!',
        movieTitle: 'Film Genre',
        paysTitle: 'Wer zahlt?',
        musicTitle: 'Musik Roulette',
        dareTitle: 'Pflicht / Mutprobe',
        dareBtn: 'TRAU DICH!',
        travelTitle: 'Wohin reisen?',
        go: 'LOS!',
        gameTitle: 'Was zocken?',
        magic8Title: 'Magische Kugel',
        ask: 'FRAGEN!',
        historyTitle: 'Verlauf 📜',
        clear: 'Löschen',
        close: 'Schließen',
        offline: "📴 Du bist offline",
        splash: 'Entscheidungs-App',
        shareMsg: 'In Zwischenablage kopiert!',
        wheelResultBase: '🎡 Das Rad sagt: ',
        coinResultBase: '🪙 Die Münze sagt: ',
        diceResultBase: '🎲 Du hast gewürfelt: ',
        numberResultBase: '🔢 Deine Zahl: ',
        personResultBase: '🎉 Gewinner: ',
        foodResultBase: '🍽️ Wir essen: ',
        movieResultBase: '🎬 Schau dir an: ',
        paysResultBase: '💸 Es zahlt: ',
        musicResultBase: '🎵 Hör dir an: ',
        dareResultBase: '💪 Aufgabe: ',
        travelResultBase: '✈️ Reise nach: ',
        gameResultBase: '🎮 Wir spielen: ',
        magic8ResultBase: '🔮 Die Kugel sagt: ',
        head: 'Kopf',
        tail: 'Zahl'
    }
};

updateTheme();
updateLang();

themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateTheme();
});

langBtn.addEventListener('click', () => {
    curLang = curLang === 'en' ? 'de' : 'en';
    localStorage.setItem('lang', curLang);
    updateLang();
});

function updateTheme() {
    document.body.classList.toggle('light-mode', !isDark);
    themeBtn.textContent = isDark ? '🌙' : '☀️';
}

function updateLang() {
    langBtn.textContent = curLang === 'en' ? '🇩🇪' : '🇬🇧';
    const t = translations[curLang];

    // Update Text Content
    document.querySelector('#wheel-section h1').textContent = t.wheelTitle;
    document.getElementById('wheelInput').placeholder = t.wheelPlaceholder;
    document.getElementById('spinBtn').textContent = t.spin;

    document.querySelector('#coin-section h1').textContent = t.coinTitle;
    document.getElementById('flipBtn').textContent = t.flip;

    document.querySelector('#dice-section h1').textContent = t.diceTitle;
    document.getElementById('diceBtn').textContent = t.roll;

    document.querySelector('#number-section h1').textContent = t.numberTitle;
    document.getElementById('randomBtn').textContent = t.generate;

    document.querySelector('#person-section h1').textContent = t.personTitle;
    document.getElementById('personInput').placeholder = t.personPlaceholder;
    document.getElementById('personBtn').textContent = t.pick;

    document.querySelector('#food-section h1').textContent = t.foodTitle;
    document.getElementById('foodBtn').textContent = t.decide;

    document.querySelector('#movie-section h1').textContent = t.movieTitle;
    document.getElementById('movieBtn').textContent = t.pick;

    document.querySelector('#pays-section h1').textContent = t.paysTitle;
    document.getElementById('paysInput').placeholder = t.personPlaceholder;
    document.getElementById('paysBtn').textContent = t.decide;

    document.querySelector('#music-section h1').textContent = t.musicTitle;
    document.getElementById('musicBtn').textContent = t.spin;

    document.querySelector('#dare-section h1').textContent = t.dareTitle;
    document.getElementById('dareBtn').textContent = t.dareBtn;

    document.querySelector('#travel-section h1').textContent = t.travelTitle;
    document.getElementById('travelBtn').textContent = t.go;

    document.querySelector('#game-section h1').textContent = t.gameTitle;
    document.getElementById('gameBtn').textContent = t.pick;

    document.querySelector('#magic8-section h1').textContent = t.magic8Title;
    document.getElementById('magic8Btn').textContent = t.ask;

    document.querySelector('#historyModal h2').textContent = t.historyTitle;
    document.getElementById('clearHistory').textContent = t.clear;
    document.getElementById('closeHistory').textContent = t.close;

    document.getElementById('offline').textContent = t.offline;
    document.querySelector('.splash-text').textContent = t.splash;

    // Update Share Buttons
    document.querySelectorAll('.share-btn').forEach(b => {
        if (!b.classList.contains('hidden')) b.textContent = t.share;
    });
}


// ========== FULLSCREEN ==========
document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// ========== HISTORY ==========
const historyModal = document.getElementById('historyModal');
document.getElementById('historyBtn').addEventListener('click', () => {
    renderHistory();
    historyModal.classList.remove('hidden');
});
document.getElementById('closeHistory').addEventListener('click', () => historyModal.classList.add('hidden'));
document.getElementById('clearHistory').addEventListener('click', () => {
    history = [];
    localStorage.setItem('decisionHistory', '[]');
    renderHistory();
});

function renderHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = history.slice(-20).reverse().map(h =>
        `<div class="history-item">${h.type}: <strong>${h.result}</strong> <small>(${new Date(h.time).toLocaleTimeString()})</small></div>`
    ).join('') || '<p>No history yet</p>';
}

function addHistory(type, result) {
    history.push({ type, result, time: Date.now() });
    if (history.length > 50) history.shift();
    localStorage.setItem('decisionHistory', JSON.stringify(history));
}

// ========== HAPTIC & SOUND ==========
function vibrate(pattern = [50]) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(freq = 800, duration = 0.1) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playWinSound() {
    playSound(523, 0.1);
    setTimeout(() => playSound(659, 0.1), 100);
    setTimeout(() => playSound(784, 0.2), 200);
}

// ========== CONFETTI ==========
const confettiCanvas = document.getElementById('confetti');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

function launchConfetti() {
    confettiPieces = [];
    for (let i = 0; i < 100; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -20,
            size: Math.random() * 10 + 5,
            color: ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f'][Math.floor(Math.random() * 6)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 2 * Math.PI,
            spin: Math.random() * 0.2 - 0.1
        });
    }
    animateConfetti();
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height);
    confettiPieces.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(p.angle) * 2;
        p.angle += p.spin;
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(p.x, p.y, p.size, p.size);
    });
    if (confettiPieces.length > 0) requestAnimationFrame(animateConfetti);
}

// ========== SHARE ==========
function setupShare(btnId, getText) {
    document.getElementById(btnId).addEventListener('click', async () => {
        const text = getText();
        if (navigator.share) {
            await navigator.share({ title: 'Decision App', text });
        } else {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        }
    });
}

// ========== TABS ==========
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-section').classList.add('active');
        playSound(400, 0.05);
    });
});


// ========== HELPER ==========
function randomPicker(displayId, resultId, getItems, btnId, prefixKey, suffix = '', type = 'Pick', shareId = null) {
    const display = document.getElementById(displayId);
    const result = document.getElementById(resultId);
    const btn = document.getElementById(btnId);
    const shareBtn = shareId ? document.getElementById(shareId) : null;
    let isRunning = false;
    let lastResult = '';
    let lastWinner = '';

    btn.addEventListener('click', () => {
        if (isRunning) return;
        const items = getItems();
        if (items.length === 0) return;
        isRunning = true;
        btn.disabled = true;
        result.textContent = '';
        if (shareBtn) shareBtn.classList.add('hidden');
        display.classList.add('rolling');

        let count = 0;
        const interval = setInterval(() => {
            display.textContent = items[Math.floor(Math.random() * items.length)];
            playSound(300 + count * 10, 0.03);
            count++;
            if (count > 30) {
                clearInterval(interval);
                display.classList.remove('rolling');
                const winner = items[Math.floor(Math.random() * items.length)];
                lastWinner = winner;
                display.textContent = winner;

                const prefix = translations[curLang][prefixKey] || '';
                lastResult = prefix + winner + suffix;
                result.textContent = lastResult;
                addHistory(type, winner);
                vibrate([50, 30, 50]);
                playWinSound();
                launchConfetti();
                if (shareBtn) shareBtn.classList.remove('hidden');
                isRunning = false;
                btn.disabled = false;
            }
        }, 50);
    });

    if (shareBtn) setupShare(shareId, () => {
        const prefix = translations[curLang][prefixKey] || '';
        return prefix + lastWinner + suffix;
    });
}

// ========== WHEEL ==========
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const wheelInput = document.getElementById('wheelInput');
const wheelList = document.getElementById('wheelList');

let wheelSegments = JSON.parse(localStorage.getItem('wheelSegments') || '["YES", "NO", "MAYBE"]');
const wheelColors = ['#ff6b6b', '#feca57', '#1dd1a1', '#54a0ff', '#5f27cd', '#ff9ff3', '#48dbfb', '#ff9f43'];

function getWheelColor(index) {
    return wheelColors[index % wheelColors.length];
}

function renderWheelList() {
    wheelList.innerHTML = wheelSegments.map((s, i) =>
        `<span class="custom-tag" data-index="${i}" style="border-left: 5px solid ${getWheelColor(i)}">${s} ✕</span>`
    ).join('');
    drawWheel();
}

wheelInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && wheelInput.value.trim()) {
        wheelSegments.push(wheelInput.value.trim().toUpperCase());
        localStorage.setItem('wheelSegments', JSON.stringify(wheelSegments));
        wheelInput.value = '';
        renderWheelList();
    }
});

wheelList.addEventListener('click', e => {
    if (e.target.classList.contains('custom-tag')) {
        const index = parseInt(e.target.dataset.index);
        wheelSegments.splice(index, 1);
        localStorage.setItem('wheelSegments', JSON.stringify(wheelSegments));
        renderWheelList();
    }
});

let pointerRotation = 0, isSpinning = false;
const centerX = 150, centerY = 150, radius = 140;
let wheelResult = '';

function drawWheel() {
    ctx.clearRect(0, 0, 300, 300);
    const len = wheelSegments.length;

    if (len === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#2d3436';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '20px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Add Options!', centerX, centerY);
        return;
    }

    const segmentAngle = (2 * Math.PI) / len;

    for (let i = 0; i < len; i++) {
        const startAngle = i * segmentAngle - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
        ctx.fillStyle = getWheelColor(i);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Segoe UI';
        ctx.textAlign = 'right';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        const text = wheelSegments[i].length > 12 ? wheelSegments[i].substring(0, 10) + '..' : wheelSegments[i];
        ctx.fillText(text, radius - 20, 5);
        ctx.restore();
    }

    // Center and Pointer
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(pointerRotation);

    // Pointer Needle
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -(radius - 30));
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Pointer Arrow
    ctx.beginPath();
    ctx.moveTo(0, -(radius - 15));
    ctx.lineTo(-10, -(radius - 40));
    ctx.lineTo(10, -(radius - 40));
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Center Dot
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#667eea';
    ctx.fill();

    ctx.restore();
}

document.getElementById('spinBtn').addEventListener('click', () => {
    if (isSpinning || wheelSegments.length === 0) return;
    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('wheelResult').textContent = '';
    document.getElementById('wheelShare').classList.add('hidden');

    const spinAmount = (Math.random() * 3 + 3) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();
    const startRotation = pointerRotation;

    function animate(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        // Easing: easeOutCubic
        pointerRotation = startRotation + spinAmount * (1 - Math.pow(1 - progress, 3));
        drawWheel();

        if (progress < 1) {
            if (Math.random() > 0.8) playSound(200, 0.02);
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            document.getElementById('spinBtn').disabled = false;

            // Calculate Result
            let norm = pointerRotation % (2 * Math.PI);
            if (norm < 0) norm += 2 * Math.PI;

            const index = Math.floor(norm / segmentAngle) % wheelSegments.length;
            const result = wheelSegments[index];

            wheelResult = result;
            document.getElementById('wheelResult').textContent = result + '!';
            document.getElementById('wheelResult').className = 'result'; // Reset class
            addHistory('Wheel', result);
            vibrate([100, 50, 100]);
            playWinSound();
            launchConfetti();
            document.getElementById('wheelResult').classList.add('yes'); // Default color
            document.getElementById('wheelShare').classList.remove('hidden');
        }
    }
    requestAnimationFrame(animate);
});

renderWheelList();
setupShare('wheelShare', () => {
    return translations[curLang].wheelResultBase + wheelResult + '!';
});


// ========== COIN ==========
const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flipBtn');
let isFlipping = false;
let coinResultText = '';
let coinSide = '';

flipBtn.addEventListener('click', () => {
    if (isFlipping) return;
    isFlipping = true;
    flipBtn.disabled = true;
    document.getElementById('coinResult').textContent = '';
    document.getElementById('coinName').textContent = '';
    document.getElementById('coinShare').classList.add('hidden');
    coin.classList.remove('show-heads', 'show-tails');
    coin.classList.add('flipping');
    const isHeads = Math.random() < 0.5;
    setTimeout(() => {
        coin.classList.remove('flipping');
        coin.classList.add(isHeads ? 'show-heads' : 'show-tails');
        const side = isHeads ? 'HEADS' : 'TAILS';
        const name = isHeads ? translations[curLang].head : translations[curLang].tail;
        coinSide = name;

        document.getElementById('coinResult').textContent = side + '!';
        document.getElementById('coinName').textContent = '';
        coinResultText = `🪙 ${side}!`;
        addHistory('Coin', side);
        vibrate([50, 30, 50]);
        playWinSound();
        launchConfetti();
        document.getElementById('coinShare').classList.remove('hidden');
        isFlipping = false;
        flipBtn.disabled = false;
    }, 2000);
});
setupShare('coinShare', () => {
    return translations[curLang].coinResultBase + coinSide + '!';
});

// ========== DICE ==========
const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
randomPicker('diceDisplay', 'diceResult', () => diceEmojis, 'diceBtn', 'diceResultBase', '', 'Dice', 'diceShare');

// ========== NUMBER ==========
randomPicker('numberDisplay', 'numberResult', () => Array.from({ length: 100 }, (_, i) => i + 1), 'randomBtn', 'numberResultBase', '', 'Number', 'numberShare');

// ========== PERSON (Custom) ==========
const personInput = document.getElementById('personInput');
const personList = document.getElementById('personList');

function renderPeopleList() {
    personList.innerHTML = customPeople.map(p => `<span class="custom-tag" data-name="${p}">${p} ✕</span>`).join('');
}
renderPeopleList();

personInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && personInput.value.trim()) {
        customPeople.push(personInput.value.trim().toUpperCase());
        localStorage.setItem('customPeople', JSON.stringify(customPeople));
        personInput.value = '';
        renderPeopleList();
    }
});

personList.addEventListener('click', e => {
    if (e.target.classList.contains('custom-tag')) {
        customPeople = customPeople.filter(p => p !== e.target.dataset.name);
        localStorage.setItem('customPeople', JSON.stringify(customPeople));
        renderPeopleList();
    }
});

randomPicker('personDisplay', 'personResult', () => customPeople, 'personBtn', 'personResultBase', ' !', 'Person', 'personShare');

// ========== FOOD ==========
const foods = ['🍕 Pizza', '🍔 Burger', '🍣 Sushi', '🌮 Tacos', '🥙 Döner', '🍜 Ramen', '🥗 Salad', '🍝 Pasta', '🍛 Curry', '🥡 Chinese'];
randomPicker('foodDisplay', 'foodResult', () => foods, 'foodBtn', 'foodResultBase', '', 'Food', 'foodShare');

// ========== MOVIE ==========
const movies = ['🎬 Action', '😂 Comedy', '👻 Horror', '💕 Romance', '🚀 Sci-Fi', '🎭 Drama', '🔍 Thriller', '✨ Fantasy', '📖 Documentary', '🎨 Animation'];
randomPicker('movieDisplay', 'movieResult', () => movies, 'movieBtn', 'movieResultBase', '', 'Movie', 'movieShare');

// ========== WHO PAYS (Custom) ==========
const paysInput = document.getElementById('paysInput');
const paysList = document.getElementById('paysList');

function renderPaysList() {
    paysList.innerHTML = customPays.map(p => `<span class="custom-tag" data-name="${p}">${p} ✕</span>`).join('');
}
renderPaysList();

paysInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && paysInput.value.trim()) {
        customPays.push(paysInput.value.trim().toUpperCase());
        localStorage.setItem('customPays', JSON.stringify(customPays));
        paysInput.value = '';
        renderPaysList();
    }
});

paysList.addEventListener('click', e => {
    if (e.target.classList.contains('custom-tag')) {
        customPays = customPays.filter(p => p !== e.target.dataset.name);
        localStorage.setItem('customPays', JSON.stringify(customPays));
        renderPaysList();
    }
});

randomPicker('paysDisplay', 'paysResult', () => customPays, 'paysBtn', 'paysResultBase', '', 'Pays', 'paysShare');

// ========== MUSIC ==========
const music = ['🎸 Rock', '🎹 Pop', '🎺 Jazz', '🎻 Classical', '🎤 Hip-Hop', '💃 Disco', '🤘 Metal', '🎧 Electronic', '🪕 Country', '🎷 R&B'];
randomPicker('musicDisplay', 'musicResult', () => music, 'musicBtn', 'musicResultBase', '', 'Music', 'musicShare');

// ========== DARE ==========
const dares = ['Do 10 pushups!', 'Sing a song!', 'Dance for 30 sec!', 'Tell a joke!', 'Do an impression!', 'Speak in accent!', 'Hold a plank 30s!', 'Tell embarrassing story!', 'Do 20 jumping jacks!', 'Make animal sounds!'];
randomPicker('dareDisplay', 'dareResult', () => dares, 'dareBtn', 'dareResultBase', '', 'Dare', 'dareShare');

// ========== TRAVEL ==========
const travel = ['🗼 Paris', '🗽 New York', '🏯 Tokyo', '🎡 London', '🏝️ Bali', '🦘 Sydney', '🏔️ Swiss Alps', '🌴 Hawaii', '🏰 Barcelona', '🎰 Las Vegas'];
randomPicker('travelDisplay', 'travelResult', () => travel, 'travelBtn', 'travelResultBase', '', 'Travel', 'travelShare');

// ========== GAME ==========
const games = ['♟️ Chess', '🎯 Darts', '🎱 Pool', '🃏 Poker', '🎳 Bowling', '🏓 Ping Pong', '🎮 Video Games', '🎲 Board Game', '⚽ Football', '🏀 Basketball'];
randomPicker('gameDisplay', 'gameResult', () => games, 'gameBtn', 'gameResultBase', '', 'Game', 'gameShare');

// ========== MAGIC 8-BALL ==========
const magic8 = ['Yes!', 'No!', 'Maybe...', 'Definitely!', 'Ask again later', 'Absolutely not!', 'Signs point to yes', 'Very doubtful', 'Without a doubt', 'Cannot predict now', 'Most likely', "Don't count on it", 'Yes, in due time', 'Outlook not so good'];
randomPicker('magic8Display', 'magic8Result', () => magic8, 'magic8Btn', 'magic8ResultBase', '', 'Magic8', 'magic8Share');


// ========== SLOTS ==========
const slotSymbols = ['🍒', '🍋', '🍇', '🍊', '🍉', '⭐', '7️⃣', '💎'];
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const slotsBtn = document.getElementById('slotsBtn');
const slotsResult = document.getElementById('slotsResult');
const slotsShare = document.getElementById('slotsShare');
let isSlotSpinning = false;
let slotsResultText = '';

slotsBtn.addEventListener('click', () => {
    if (isSlotSpinning) return;
    isSlotSpinning = true;
    slotsBtn.disabled = true;
    slotsResult.textContent = '';
    slotsResult.classList.remove('slots-jackpot');
    slotsShare.classList.add('hidden');
    
    reel1.classList.add('spinning');
    reel2.classList.add('spinning');
    reel3.classList.add('spinning');
    
    // Spin animation
    let count = 0;
    const spinInterval = setInterval(() => {
        reel1.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        reel2.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        reel3.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        playSound(200 + count * 5, 0.02);
        count++;
    }, 50);
    
    // Stop reel 1
    setTimeout(() => {
        reel1.classList.remove('spinning');
        reel1.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        playSound(400, 0.1);
    }, 1000);
    
    // Stop reel 2
    setTimeout(() => {
        reel2.classList.remove('spinning');
        reel2.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        playSound(500, 0.1);
    }, 1500);
    
    // Stop reel 3 and check result
    setTimeout(() => {
        clearInterval(spinInterval);
        reel3.classList.remove('spinning');
        reel3.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        playSound(600, 0.1);
        
        const r1 = reel1.textContent;
        const r2 = reel2.textContent;
        const r3 = reel3.textContent;
        
        let resultMsg = '';
        if (r1 === r2 && r2 === r3) {
            if (r1 === '7️⃣') {
                resultMsg = '🎰 MEGA JACKPOT!!! 🎰';
            } else if (r1 === '💎') {
                resultMsg = '💎 DIAMOND JACKPOT! 💎';
            } else {
                resultMsg = '🎉 JACKPOT! 🎉';
            }
            slotsResult.classList.add('slots-jackpot');
            launchConfetti();
            vibrate([100, 50, 100, 50, 100]);
            playWinSound();
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            resultMsg = '👍 Two of a kind!';
            vibrate([50]);
            playSound(700, 0.15);
        } else {
            resultMsg = '😢 Try again!';
            playSound(200, 0.1);
        }
        
        slotsResult.textContent = resultMsg;
        slotsResultText = `🎰 ${r1} ${r2} ${r3} - ${resultMsg}`;
        addHistory('Slots', `${r1}${r2}${r3}`);
        slotsShare.classList.remove('hidden');
        isSlotSpinning = false;
        slotsBtn.disabled = false;
    }, 2000);
});

setupShare('slotsShare', () => slotsResultText);
