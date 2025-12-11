// Configuration
const CACHE_SIZE = 8;
const MEMORY_SIZE = 32;
const ACCESS_SEQUENCE = [5, 10, 5, 15, 20, 5, 25, 10, 30, 5, 15, 35, 5, 40, 10];

// State
let cache = Array(CACHE_SIZE).fill(null);
let currentStep = 0;
let hits = 0;
let misses = 0;

// Initialize the simulation
function initialize() {
    createMemoryBlocks();
    createCacheBlocks();
    updateStats();
}

function createMemoryBlocks() {
    const memoryDiv = document.getElementById('memory-blocks');
    memoryDiv.innerHTML = '';
    
    for (let i = 0; i < MEMORY_SIZE; i++) {
        const block = document.createElement('div');
        block.className = 'memory-block';
        block.textContent = `Address ${i}`;
        block.id = `mem-${i}`;
        memoryDiv.appendChild(block);
    }
}

function createCacheBlocks() {
    const cacheDiv = document.getElementById('cache-blocks');
    cacheDiv.innerHTML = '';
    
    for (let i = 0; i < CACHE_SIZE; i++) {
        const block = document.createElement('div');
        block.className = 'cache-block empty';
        block.id = `cache-block-${i}`;
        block.textContent = `Block ${i}: Empty`;
        cacheDiv.appendChild(block);
    }
}

function nextStep() {
    if (currentStep >= ACCESS_SEQUENCE.length) {
        alert('✅ Simulation Complete!\nAll 15 memory accesses have been processed.');
        return;
    }
    
    const address = ACCESS_SEQUENCE[currentStep];
    const cacheBlock = address % CACHE_SIZE; // Direct mapping
    
    const accessLog = document.getElementById('access-log');
    const cacheBlockElement = document.getElementById(`cache-block-${cacheBlock}`);
    
    // Highlight current memory address
    highlightMemoryAddress(address);
    
    // Check for hit or miss
    if (cache[cacheBlock] === address) {
        // HIT
        hits++;
        cacheBlockElement.className = 'cache-block hit';
        cacheBlockElement.textContent = `Block ${cacheBlock}: Address ${address} (HIT)`;
        accessLog.innerHTML = `<div class="hit">Step ${currentStep + 1}: Access <strong>Address ${address}</strong> → <strong>HIT</strong> (Block ${cacheBlock})</div>` + accessLog.innerHTML;
    } else {
        // MISS
        misses++;
        cache[cacheBlock] = address;
        cacheBlockElement.className = 'cache-block miss';
        cacheBlockElement.textContent = `Block ${cacheBlock}: Address ${address} (MISS)`;
        accessLog.innerHTML = `<div class="miss">Step ${currentStep + 1}: Access <strong>Address ${address}</strong> → <strong>MISS</strong> (Block ${cacheBlock})</div>` + accessLog.innerHTML;
    }
    
    currentStep++;
    updateStats();
}

function highlightMemoryAddress(address) {
    // Remove highlight from all memory blocks
    const memoryBlocks = document.querySelectorAll('.memory-block');
    memoryBlocks.forEach(block => {
        block.style.background = '#e3f2fd';
        block.style.fontWeight = 'normal';
    });
    
    // Highlight the accessed address
    const accessedBlock = document.getElementById(`mem-${address}`);
    if (accessedBlock) {
        accessedBlock.style.background = '#bbdefb';
        accessedBlock.style.fontWeight = 'bold';
        accessedBlock.style.transform = 'scale(1.05)';
        
        // Remove highlight after 1 second
        setTimeout(() => {
            accessedBlock.style.transform = 'scale(1)';
        }, 1000);
    }
}

function updateStats() {
    document.getElementById('hit-count').textContent = hits;
    document.getElementById('miss-count').textContent = misses;
    
    // Calculate hit rate
    const totalAccesses = hits + misses;
    const hitRate = totalAccesses > 0 ? ((hits / totalAccesses) * 100).toFixed(1) : 0;
    document.getElementById('hit-rate').textContent = `${hitRate}%`;
}

function resetSimulation() {
    cache = Array(CACHE_SIZE).fill(null);
    currentStep = 0;
    hits = 0;
    misses = 0;
    createCacheBlocks();
    document.getElementById('access-log').innerHTML = 
        '<div style="text-align: center; color: #888; padding: 20px;">Simulation not started. Click "Next Access" to begin.</div>';
    updateStats();
    
    // Reset memory highlights
    const memoryBlocks = document.querySelectorAll('.memory-block');
    memoryBlocks.forEach(block => {
        block.style.background = '#e3f2fd';
        block.style.fontWeight = 'normal';
        block.style.transform = 'scale(1)';
    });
}

function runFullSimulation() {
    resetSimulation();
    const interval = setInterval(() => {
        if (currentStep < ACCESS_SEQUENCE.length) {
            nextStep();
        } else {
            clearInterval(interval);
        }
    }, 800); // 0.8 seconds between steps
}

// Start the simulation when page loads
window.onload = initialize;