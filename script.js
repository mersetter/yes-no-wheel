const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');

const segments = ['YES', 'NO', 'YES', 'NO', 'YES', 'NO'];
const colors = ['#4ade80', '#f87171', '#4ade80', '#f87171', '#4ade80', '#f87171'];
const numSegments = segments.length;
const segmentAngle = (2 * Math.PI) / numSegments;

let currentRotation = 0;
let isSpinning = false;

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
        const startAngle = currentRotation + i * segmentAngle;
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
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
}


function spin() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.textContent = '';
    resultDiv.className = 'result';

    // Random spin: 3-6 full rotations + random extra
    const spinAmount = (Math.random() * 3 + 3) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000 + Math.random() * 2000; // 4-6 seconds
    const startTime = performance.now();
    const startRotation = currentRotation;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for natural slowdown
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + spinAmount * easeOut;
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
    let normalizedRotation = currentRotation % (2 * Math.PI);
    if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;

    // The pointer is at the top (270 degrees or -π/2)
    // Calculate which segment is at the top
    const pointerAngle = (3 * Math.PI / 2 - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
    const segmentIndex = Math.floor(pointerAngle / segmentAngle) % numSegments;
    
    const result = segments[segmentIndex];
    resultDiv.textContent = result + '!';
    resultDiv.className = 'result ' + result.toLowerCase();
}

// Initial draw
drawWheel();

// Event listener
spinBtn.addEventListener('click', spin);
