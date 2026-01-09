// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-section').classList.add('active');
    });
});

// Helper function for random picker
function randomPicker(displayId, resultId, items, btnId, prefix = '', suffix = '') {
    const display = document.getElementById(displayId);
    const result = document.getElementById(resultId);
    const btn = document.getElementById(btnId);
    let isRunning = false;

    btn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        btn.disabled = true;
        result.textContent = '';
        display.classList.add('rolling');

        let count = 0;
        const interval = setInterval(() => {
            display.textContent = items[Math.floor(Math.random() * items.length)];
            count++;
            if (count > 30) {
                clearInterval(interval);
                display.classList.remove('rolling');
                const winner = items[Math.floor(Math.random() * items.length)];
                display.textContent = winner;
                result.textContent = prefix + winner + suffix;
                isRunning = false;
                btn.disabled = false;
            }
        }, 50);
    });
}

// ========== WHEEL ==========
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const segments = ['YES', 'NO', 'YES', 'NO', 'YES', 'NO'];
const colors = ['#4ade80', '#f87171', '#4ade80', '#f87171', '#4ade80', '#f87171'];
const segmentAngle = (2 * Math.PI) / 6;
let pointerRotation = 0, isSpinning = false;
const centerX = 150, centerY = 150, radius = 140;

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
    // Pointer
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
    const spinAmount = (Math.random() * 3 + 3) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();
    const startRotation = pointerRotation;

    function animate(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        pointerRotation = startRotation + spinAmount * (1 - Math.pow(1 - progress, 3));
        drawWheel();
        if (progress < 1) requestAnimationFrame(animate);
        else {
            isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            let norm = pointerRotation % (2 * Math.PI);
            if (norm < 0) norm += 2 * Math.PI;
            const result = segments[Math.floor(norm / segmentAngle) % 6];
            document.getElementById('wheelResult').textContent = result + '!';
            document.getElementById('wheelResult').className = 'result ' + result.toLowerCase();
        }
    }
    requestAnimationFrame(animate);
});
drawWheel();


// ========== COIN ==========
const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flipBtn');
let isFlipping = false;
flipBtn.addEventListener('click', () => {
    if (isFlipping) return;
    isFlipping = true;
    flipBtn.disabled = true;
    document.getElementById('coinResult').textContent = '';
    document.getElementById('coinName').textContent = '';
    coin.classList.remove('show-heads', 'show-tails');
    coin.classList.add('flipping');
    const isHeads = Math.random() < 0.5;
    setTimeout(() => {
        coin.classList.remove('flipping');
        coin.classList.add(isHeads ? 'show-heads' : 'show-tails');
        document.getElementById('coinResult').textContent = isHeads ? 'HEADS!' : 'TAILS!';
        document.getElementById('coinName').textContent = isHeads ? '🇷🇺 Vladimir Putin' : '🇺🇸 Donald Trump';
        isFlipping = false;
        flipBtn.disabled = false;
    }, 2000);
});

// ========== DICE ==========
const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
randomPicker('diceDisplay', 'diceResult', diceEmojis, 'diceBtn', 'You rolled: ');

// ========== NUMBER ==========
randomPicker('numberDisplay', 'numberResult', Array.from({length: 100}, (_, i) => i + 1), 'randomBtn', 'Your number: ');

// ========== PERSON ==========
randomPicker('personDisplay', 'personResult', ['RAY', 'STEVE', 'MARCEL'], 'personBtn', '🎉 ', ' wins!');

// ========== FOOD ==========
randomPicker('foodDisplay', 'foodResult', ['🍕 Pizza', '🍔 Burger', '🍣 Sushi', '🌮 Tacos', '🥙 Döner', '🍜 Ramen', '🥗 Salad', '🍝 Pasta', '🍛 Curry', '🥡 Chinese'], 'foodBtn', "Let's eat: ");

// ========== MOVIE ==========
randomPicker('movieDisplay', 'movieResult', ['🎬 Action', '😂 Comedy', '👻 Horror', '💕 Romance', '🚀 Sci-Fi', '🎭 Drama', '🔍 Thriller', '✨ Fantasy', '📖 Documentary', '🎨 Animation'], 'movieBtn', 'Watch: ');

// ========== WHO PAYS ==========
randomPicker('paysDisplay', 'paysResult', ['RAY', 'STEVE', 'MARCEL'], 'paysBtn', '💸 ', ' pays!');

// ========== MUSIC ==========
randomPicker('musicDisplay', 'musicResult', ['🎸 Rock', '🎹 Pop', '🎺 Jazz', '🎻 Classical', '🎤 Hip-Hop', '💃 Disco', '🤘 Metal', '🎧 Electronic', '🪕 Country', '🎷 R&B'], 'musicBtn', 'Listen to: ');

// ========== DARE ==========
const dares = [
    'Do 10 pushups!', 'Sing a song!', 'Dance for 30 sec!', 'Tell a joke!', 
    'Do an impression!', 'Speak in accent!', 'Hold a plank 30s!', 'Tell embarrassing story!',
    'Do 20 jumping jacks!', 'Make animal sounds!'
];
randomPicker('dareDisplay', 'dareResult', dares, 'dareBtn', '💪 ');

// ========== TRAVEL ==========
randomPicker('travelDisplay', 'travelResult', ['🗼 Paris', '🗽 New York', '🏯 Tokyo', '🎡 London', '🏝️ Bali', '🦘 Sydney', '🏔️ Swiss Alps', '🌴 Hawaii', '🏰 Barcelona', '🎰 Las Vegas'], 'travelBtn', '✈️ Go to: ');

// ========== GAME ==========
randomPicker('gameDisplay', 'gameResult', ['♟️ Chess', '🎯 Darts', '🎱 Pool', '🃏 Poker', '🎳 Bowling', '🏓 Ping Pong', '🎮 Video Games', '🎲 Board Game', '⚽ Football', '🏀 Basketball'], 'gameBtn', "Let's play: ");

// ========== MAGIC 8-BALL ==========
const magic8Answers = [
    'Yes!', 'No!', 'Maybe...', 'Definitely!', 'Ask again later', 'Absolutely not!',
    'Signs point to yes', 'Very doubtful', 'Without a doubt', 'Cannot predict now',
    'Most likely', 'Don\'t count on it', 'Yes, in due time', 'Outlook not so good'
];
randomPicker('magic8Display', 'magic8Result', magic8Answers, 'magic8Btn', '🔮 ');
