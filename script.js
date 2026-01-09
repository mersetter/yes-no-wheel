const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');

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

    // Draw wheel segments (static)
    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * segmentAngle - Math.PI / 2; // Start from top
        const endAngle = startAngle + segmentAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 28px Segoe UI';
        ctx.fillText(segments[i], radius - 30, 10);
        ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw pointer (like clock hand)
    drawPointer();
}

function drawPointer() {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(pointerRotation);
    
    // Pointer line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -(radius - 40));
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Pointer arrow head
    ctx.beginPath();
    ctx.moveTo(0, -(radius - 20));
    ctx.lineTo(-12, -(radius - 50));
    ctx.lineTo(12, -(radius - 50));
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    // Center dot
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
    resultDiv.textContent = '';
    resultDiv.className = 'result';

    // Random spin: 3-6 full rotations + random extra
    const spinAmount = (Math.random() * 3 + 3) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();
    const startRotation = pointerRotation;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for natural slowdown
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        pointerRotation = startRotation + spinAmount * easeOut;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            showResult();
        }
    }

    requestAnimationFrame(animate);
}

function showResult() {
    // Normalize rotation to 0-2π
    let normalizedRotation = pointerRotation % (2 * Math.PI);
    if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;

    // Calculate which segment the pointer is pointing at
    const segmentIndex = Math.floor(normalizedRotation / segmentAngle) % numSegments;
    
    const result = segments[segmentIndex];
    resultDiv.textContent = result + '!';
    resultDiv.className = 'result ' + result.toLowerCase();
}

// Initial draw
drawWheel();

// Event listener
spinBtn.addEventListener('click', spin);
