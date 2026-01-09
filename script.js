// Tab switching
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-section').classList.add('active');
    });
});

// ========== WHEEL ==========
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const wheelResult = document.getElementById('wheelResult');

const segments = ['YES', 'NO', 'YES', 'NO', 'YES', 'NO'];
const colors = ['#4ade80', '#f87171', '#4ade80', '#f87171', '#4ade80', '#f87171'];
const numSegments = segments.length;
const segmentAngle = (2 * Math.PI) / numSegments;

let pointerRotation = 0;
let isSpinning = false;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY) - 10;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * segmentAngle - Math.PI / 2;
        const endAngle = startAngle + segmentAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 28px Segoe UI';
        ctx.fillText(segments[i], radius - 30, 10);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    drawPointer();
}

function drawPointer() {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(pointerRotation);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -(radius - 40));
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, -(radius - 20));
    ctx.lineTo(-12, -(radius - 50));
    ctx.lineTo(12, -(radius - 50));
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#667eea';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    wheelResult.textContent = '';
    wheelResult.className = 'result';

    const spinAmount = (Math.random() * 3 + 3) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();
    const startRotation = pointerRotation;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        pointerRotation = startRotation + spinAmount * easeOut;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            showWheelResult();
        }
    }
    requestAnimationFrame(animate);
}

function showWheelResult() {
    let normalizedRotation = pointerRotation % (2 * Math.PI);
    if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;
    const segmentIndex = Math.floor(normalizedRotation / segmentAngle) % numSegments;
    const result = segments[segmentIndex];
    wheelResult.textContent = result + '!';
    wheelResult.className = 'result ' + result.toLowerCase();
}

drawWheel();
spinBtn.addEventListener('click', spin);

// ========== COIN ==========
const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flipBtn');
const coinResult = document.getElementById('coinResult');
const coinName = document.getElementById('coinName');
let isFlipping = false;

function flip() {
    if (isFlipping) return;
    isFlipping = true;
    flipBtn.disabled = true;
    coinResult.textContent = '';
    coinName.textContent = '';
    
    coin.classList.remove('show-heads', 'show-tails');
    coin.classList.add('flipping');
    
    const isHeads = Math.random() < 0.5;
    
    setTimeout(() => {
        coin.classList.remove('flipping');
        coin.classList.add(isHeads ? 'show-heads' : 'show-tails');
        
        if (isHeads) {
            coinResult.textContent = 'HEADS!';
            coinName.textContent = '🇷🇺 Vladimir Putin';
        } else {
            coinResult.textContent = 'TAILS!';
            coinName.textContent = '🇺🇸 Donald Trump';
        }
        
        isFlipping = false;
        flipBtn.disabled = false;
    }, 2000);
}

flipBtn.addEventListener('click', flip);

// ========== NUMBER ==========
const numberDisplay = document.getElementById('numberDisplay');
const randomBtn = document.getElementById('randomBtn');
const numberResult = document.getElementById('numberResult');
let isRolling = false;

function generateNumber() {
    if (isRolling) return;
    isRolling = true;
    randomBtn.disabled = true;
    numberResult.textContent = '';
    numberDisplay.classList.add('rolling');
    
    let count = 0;
    const interval = setInterval(() => {
        numberDisplay.textContent = Math.floor(Math.random() * 100) + 1;
        count++;
        if (count > 30) {
            clearInterval(interval);
            numberDisplay.classList.remove('rolling');
            const finalNumber = Math.floor(Math.random() * 100) + 1;
            numberDisplay.textContent = finalNumber;
            numberResult.textContent = 'Your number: ' + finalNumber;
            isRolling = false;
            randomBtn.disabled = false;
        }
    }, 50);
}

randomBtn.addEventListener('click', generateNumber);

// ========== PERSON ==========
const people = ['RAY', 'STEVE', 'MARCEL'];
const personDisplay = document.getElementById('personDisplay');
const personBtn = document.getElementById('personBtn');
const personResult = document.getElementById('personResult');
let isPickingPerson = false;

function pickPerson() {
    if (isPickingPerson) return;
    isPickingPerson = true;
    personBtn.disabled = true;
    personResult.textContent = '';
    personDisplay.classList.add('rolling');
    
    let count = 0;
    const interval = setInterval(() => {
        personDisplay.textContent = people[Math.floor(Math.random() * people.length)];
        count++;
        if (count > 30) {
            clearInterval(interval);
            personDisplay.classList.remove('rolling');
            const winner = people[Math.floor(Math.random() * people.length)];
            personDisplay.textContent = winner;
            personResult.textContent = '🎉 ' + winner + ' wins!';
            isPickingPerson = false;
            personBtn.disabled = false;
        }
    }, 50);
}

personBtn.addEventListener('click', pickPerson);
