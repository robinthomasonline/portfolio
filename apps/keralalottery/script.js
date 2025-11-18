// Digital clock and date
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('en-GB').replace(/\//g, '.');
  document.getElementById('digital-clock').innerHTML = `${time}<br>${date}`;
}
setInterval(updateClock, 1000);
updateClock();

// Generate slots
const slotsContainer = document.getElementById('slots');
for (let i = 1; i <= 18; i++) {
  const slotRow = document.createElement('div');
  slotRow.className = 'slot-row';
  // Number label
  const labelDiv = document.createElement('div');
  labelDiv.className = 'slot-label';
  labelDiv.textContent = i;
  // Rolling number field
  const slotDiv = document.createElement('div');
  slotDiv.className = 'slot';
  slotDiv.innerHTML = `<div class="slot-number" id="slot-num-${i}">----</div>`;
  slotRow.appendChild(labelDiv);
  slotRow.appendChild(slotDiv);
  slotsContainer.appendChild(slotRow);
}

// Rolling animation
function randomNumber4() {
  // 4 digit number, leading zeros allowed
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}
// Column sequences for 6-digit number generation
const columnSequences = {
  1: [3, 1, 2, 4, 7, 6, 8, 5, 9],  // Column 1: 9 numbers
  2: [6, 7, 4, 2, 1, 3, 0, 9, 5, 8],  // Column 2: 0-9 in specific order
  3: [6, 5, 4, 3, 2, 1, 0, 9, 8, 7],  // Column 3: 0-9 in specific order
  4: [9, 5, 7, 2, 0, 4, 8, 6, 3, 1],  // Column 4: 0-9 in specific order
  5: [3, 8, 2, 4, 6, 9, 1, 5, 7, 0],  // Column 5: 0-9 in specific order
  6: [5, 2, 9, 7, 4, 0, 8, 3, 6, 1]   // Column 6: 0-9 in specific order
};

function randomNumber6() {
  // Generate 6-digit number using column sequences
  let number = '';
  for (let col = 1; col <= 6; col++) {
    const sequence = columnSequences[col];
    const randomIndex = Math.floor(Math.random() * sequence.length);
    number += sequence[randomIndex];
  }
  return number;
}

function animateSlot(slotId, finalNumber, duration = 1800) {
  const el = document.getElementById(slotId);
  let start = null;
  let lastFrame = 0;
  function roll(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    if (elapsed < duration) {
      // Change number every 50ms
      if (ts - lastFrame > 50) {
        el.textContent = randomNumber4();
        lastFrame = ts;
      }
      requestAnimationFrame(roll);
    } else {
      el.textContent = finalNumber;
    }
  }
  requestAnimationFrame(roll);
}

function animateFirstPrize(finalNumber, duration = 2200) {
  const el = document.getElementById('first-prize-number');
  let start = null;
  let lastFrame = 0;
  function roll(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    if (elapsed < duration) {
      if (ts - lastFrame > 50) {
        el.textContent = randomNumber6();
        lastFrame = ts;
      }
      requestAnimationFrame(roll);
    } else {
      el.textContent = finalNumber;
    }
  }
  requestAnimationFrame(roll);
}

// Initialize First Prize
function initializeFirstPrize() {
  const el = document.getElementById('first-prize-number');
  el.textContent = '------';
}

// Initialize First Prize on load
initializeFirstPrize();

document.getElementById('draw-btn').addEventListener('click', () => {
  // Generate 18 random 4-digit numbers
  const results = Array.from({length: 18}, () => randomNumber4());
  // Animate each slot
  for (let i = 1; i <= 18; i++) {
    animateSlot(`slot-num-${i}`, results[i-1], 1800 + Math.random()*600);
  }
  // Generate and animate first prize (6 digits)
  animateFirstPrize(randomNumber6(), 2200 + Math.random()*600);
}); 