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

// ========== THEME ==========
const themeBtn = document.getElementById('themeToggle');
let isDark = localStorage.getItem('theme') !== 'light';
updateTheme();

themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateTheme();
});

function updateTheme() {
    document.body.classList.toggle('light-mode', !isDark);
    themeBtn.textContent = isDark ? '🌙' : '☀️';
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
function randomPicker(displayId, resultId, getItems, btnId, prefix = '', suffix = '', type = 'Pick', shareId = null) {
    const display = document.getElementById(displayId);
    const result = document.getElementById(resultId);
    const btn = document.getElementById(btnId);
    const shareBtn = shareId ? document.getElementById(shareId) : null;
    let isRunning = false;
    let lastResult = '';

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
                display.textContent = winner;
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

    if (shareBtn) setupShare(shareId, () => lastResult);
}

// ========== WHEEL ==========
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const segments = ['YES', 'NO', 'YES', 'NO', 'YES', 'NO'];
const colors = ['#4ade80', '#f87171', '#4ade80', '#f87171', '#4ade80', '#f87171'];
const segmentAngle = (2 * Math.PI) / 6;
let pointerRotation = 0, isSpinning = false;
const centerX = 150, centerY = 150, radius = 140;
let wheelResult = '';

function drawWheel() {
    ctx.clearRect(0, 0, 300, 300);
    for (let i = 0; i < 6; i++) {
        const startAngle = i * segmentAngle - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 20px Segoe UI';
        ctx.textAlign = 'right';
        ctx.fillText(segments[i], radius - 20, 7);
        ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(pointerRotation);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -(radius - 30));
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -(radius - 15));
    ctx.lineTo(-10, -(radius - 40));
    ctx.lineTo(10, -(radius - 40));
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#667eea';
    ctx.fill();
    ctx.restore();
}

document.getElementById('spinBtn').addEventListener('click', () => {
    if (isSpinning) return;
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
        pointerRotation = startRotation + spinAmount * (1 - Math.pow(1 - progress, 3));
        drawWheel();
        if (progress < 1) {
            if (Math.random() > 0.7) playSound(200, 0.02);
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            let norm = pointerRotation % (2 * Math.PI);
            if (norm < 0) norm += 2 * Math.PI;
            const result = segments[Math.floor(norm / segmentAngle) % 6];
            wheelResult = result;
            document.getElementById('wheelResult').textContent = result + '!';
            document.getElementById('wheelResult').className = 'result ' + result.toLowerCase();
            addHistory('Wheel', result);
            vibrate([100, 50, 100]);
            playWinSound();
            launchConfetti();
            document.getElementById('wheelShare').classList.remove('hidden');
        }
    }
    requestAnimationFrame(animate);
});
drawWheel();
setupShare('wheelShare', () => `🎡 The wheel says: ${wheelResult}!`);


// ========== COIN ==========
const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flipBtn');
let isFlipping = false;
let coinResultText = '';

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
        const name = isHeads ? '🇷🇺 Vladimir Putin' : '🇺🇸 Donald Trump';
        document.getElementById('coinResult').textContent = side + '!';
        document.getElementById('coinName').textContent = name;
        coinResultText = `🪙 ${side}! ${name}`;
        addHistory('Coin', side);
        vibrate([50, 30, 50]);
        playWinSound();
        launchConfetti();
        document.getElementById('coinShare').classList.remove('hidden');
        isFlipping = false;
        flipBtn.disabled = false;
    }, 2000);
});
setupShare('coinShare', () => coinResultText);

// ========== DICE ==========
const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
randomPicker('diceDisplay', 'diceResult', () => diceEmojis, 'diceBtn', 'You rolled: ', '', 'Dice', 'diceShare');

// ========== NUMBER ==========
randomPicker('numberDisplay', 'numberResult', () => Array.from({length: 100}, (_, i) => i + 1), 'randomBtn', 'Your number: ', '', 'Number', 'numberShare');

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

randomPicker('personDisplay', 'personResult', () => customPeople, 'personBtn', '🎉 ', ' wins!', 'Person', 'personShare');

// ========== FOOD ==========
const foods = ['🍕 Pizza', '🍔 Burger', '🍣 Sushi', '🌮 Tacos', '🥙 Döner', '🍜 Ramen', '🥗 Salad', '🍝 Pasta', '🍛 Curry', '🥡 Chinese'];
randomPicker('foodDisplay', 'foodResult', () => foods, 'foodBtn', "Let's eat: ", '', 'Food', 'foodShare');

// ========== MOVIE ==========
const movies = ['🎬 Action', '😂 Comedy', '👻 Horror', '💕 Romance', '🚀 Sci-Fi', '🎭 Drama', '🔍 Thriller', '✨ Fantasy', '📖 Documentary', '🎨 Animation'];
randomPicker('movieDisplay', 'movieResult', () => movies, 'movieBtn', 'Watch: ', '', 'Movie', 'movieShare');

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

randomPicker('paysDisplay', 'paysResult', () => customPays, 'paysBtn', '💸 ', ' pays!', 'Pays', 'paysShare');

// ========== MUSIC ==========
const music = ['🎸 Rock', '🎹 Pop', '🎺 Jazz', '🎻 Classical', '🎤 Hip-Hop', '💃 Disco', '🤘 Metal', '🎧 Electronic', '🪕 Country', '🎷 R&B'];
randomPicker('musicDisplay', 'musicResult', () => music, 'musicBtn', 'Listen to: ', '', 'Music', 'musicShare');

// ========== DARE ==========
const dares = ['Do 10 pushups!', 'Sing a song!', 'Dance for 30 sec!', 'Tell a joke!', 'Do an impression!', 'Speak in accent!', 'Hold a plank 30s!', 'Tell embarrassing story!', 'Do 20 jumping jacks!', 'Make animal sounds!'];
randomPicker('dareDisplay', 'dareResult', () => dares, 'dareBtn', '💪 ', '', 'Dare', 'dareShare');

// ========== TRAVEL ==========
const travel = ['🗼 Paris', '🗽 New York', '🏯 Tokyo', '🎡 London', '🏝️ Bali', '🦘 Sydney', '🏔️ Swiss Alps', '🌴 Hawaii', '🏰 Barcelona', '🎰 Las Vegas'];
randomPicker('travelDisplay', 'travelResult', () => travel, 'travelBtn', '✈️ Go to: ', '', 'Travel', 'travelShare');

// ========== GAME ==========
const games = ['♟️ Chess', '🎯 Darts', '🎱 Pool', '🃏 Poker', '🎳 Bowling', '🏓 Ping Pong', '🎮 Video Games', '🎲 Board Game', '⚽ Football', '🏀 Basketball'];
randomPicker('gameDisplay', 'gameResult', () => games, 'gameBtn', "Let's play: ", '', 'Game', 'gameShare');

// ========== MAGIC 8-BALL ==========
const magic8 = ['Yes!', 'No!', 'Maybe...', 'Definitely!', 'Ask again later', 'Absolutely not!', 'Signs point to yes', 'Very doubtful', 'Without a doubt', 'Cannot predict now', 'Most likely', "Don't count on it", 'Yes, in due time', 'Outlook not so good'];
randomPicker('magic8Display', 'magic8Result', () => magic8, 'magic8Btn', '🔮 ', '', 'Magic8', 'magic8Share');
