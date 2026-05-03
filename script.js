let allQuestions = [];
let currentQuizQuestions = [];
let timerInterval;
let startTime;
let timeTaken = 0; // in seconds
let isPaused = false;
let pausedTime = 0;

// Simple PRNG
function pseudoRandom(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    let currentSeed = seed;

    return function() {
        currentSeed = (a * currentSeed + c) % m;
        return currentSeed / m;
    };
}

// Shuffle array with PRNG
function shuffle(array, randomFunc) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(randomFunc() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    setupEventListeners();
});

function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            allQuestions = data;
            checkURLParams();
        })
        .catch(error => console.error('Error loading questions:', error));
}

function setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('submit-btn').addEventListener('click', submitAnswers);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('copy-link-btn').addEventListener('click', copyPermalink);
    document.getElementById('pause-btn').addEventListener('click', togglePause);
}

function startQuiz() {
    const grade = document.getElementById('grade-select').value;
    if (!grade) {
        alert('Please select a grade.');
        return;
    }

    const seed = Math.floor(Math.random() * 1000000);
    generateQuiz(grade, seed);
}

function generateQuiz(grade, seed) {
    const filteredQuestions = allQuestions.filter(q => q.grade === grade);
    
    if (filteredQuestions.length === 0) {
        alert('No questions found for this grade.');
        return;
    }

    const randomFunc = pseudoRandom(seed);
    const shuffled = shuffle([...filteredQuestions], randomFunc);
    
    const selected = [];
    
    // Find hard questions
    const hardOnes = shuffled.filter(q => q.difficulty === 'hard');
    selected.push(...hardOnes.slice(0, Math.min(2, hardOnes.length)));
    
    // Find visual questions
    const visualOnes = shuffled.filter(q => q.type === 'grid' || q.type === 'grid-match');
    
    // Count how many visual ones are already in 'selected' (from hard ones)
    const currentVisualCount = selected.filter(q => q.type === 'grid' || q.type === 'grid-match').length;
    const neededVisual = Math.max(0, 2 - currentVisualCount);
    
    // Add visual questions not already selected
    const visualToAdd = visualOnes.filter(q => !selected.includes(q));
    selected.push(...visualToAdd.slice(0, Math.min(neededVisual, visualToAdd.length)));
    
    // Fill the rest
    const restPool = shuffled.filter(q => !selected.includes(q));
    const remainingNeeded = 20 - selected.length;
    
    selected.push(...restPool.slice(0, remainingNeeded));
    
    // Final shuffle to randomize order
    currentQuizQuestions = shuffle(selected, randomFunc);

    renderQuiz(currentQuizQuestions);
    updatePermalink(grade, seed);
    
    document.getElementById('quiz').classList.remove('d-none');
    document.getElementById('results').classList.add('d-none');
    document.getElementById('badges-container').classList.add('d-none');
    
    startTimer();
    updateScoreDisplay(0);
}

function renderQuiz(questions) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'card mb-4 shadow-sm';
        
        let visualHtml = '';
        if (q.type === 'grid') {
            visualHtml = renderGridOptions(q.data);
        } else if (q.type === 'grid-match') {
            visualHtml = renderGridMatch(q.data);
        } else if (q.type === 'image') {
            visualHtml = `<div class="text-center mb-3"><img src="${q.image}" alt="Question image" class="img-fluid rounded"></div>`;
        }

        const difficultyBadge = q.difficulty === 'hard' ? '<span class="badge bg-warning text-dark ms-2">🌟 Hard Question</span>' : '';

        qDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Q${index + 1}: ${q.question} ${difficultyBadge}</h5>
                ${visualHtml}
                <div class="options mt-3">
                    ${q.options.map(opt => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="q${q.id}" id="q${q.id}_${opt}" value="${opt}">
                            <label class="form-check-label" for="q${q.id}_${opt}">
                                ${opt}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(qDiv);
        
        // Add event listeners for live score
        qDiv.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', checkLiveScore);
        });
    });
}

function renderGridOptions(data) {
    let html = '<div class="grid-options-container">';
    for (const [key, grid] of Object.entries(data)) {
        html += `<div class="grid-option"><span>${key}:</span>${renderGrid(grid)}</div>`;
    }
    html += '</div>';
    return html;
}

function renderGridMatch(data) {
    let html = '<div class="grid-match-container">';
    html += `<div class="grid-target"><span>Given:</span>${renderGrid(data.target)}</div>`;
    html += '<div class="grid-options-container">';
    for (const [key, grid] of Object.entries(data)) {
        if (key === 'target') continue;
        html += `<div class="grid-option"><span>${key}:</span>${renderGrid(grid)}</div>`;
    }
    html += '</div></div>';
    return html;
}

function renderGrid(grid) {
    let html = '<div class="grid-visual">';
    grid.forEach(row => {
        html += '<div class="grid-row">';
        row.forEach(cell => {
            html += `<div class="grid-cell ${cell ? 'filled' : 'empty'}"></div>`;
        });
        html += '</div>';
    });
    html += '</div>';
    return html;
}

function checkLiveScore() {
    let score = 0;
    currentQuizQuestions.forEach(q => {
        const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (selected && selected.value === q.answer) {
            score++;
        }
    });
    updateScoreDisplay(score);
}

function updateScoreDisplay(score) {
    document.getElementById('current-score').innerText = `Score: ${score}`;
}

function startTimer() {
    clearInterval(timerInterval);
    startTime = Date.now();
    timeTaken = 0;
    isPaused = false;
    pausedTime = 0;
    document.getElementById('pause-btn').innerText = 'Pause';
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (isPaused) return;
    timeTaken = Math.floor((Date.now() - startTime) / 1000) + pausedTime;
    const minutes = Math.floor(timeTaken / 60).toString().padStart(2, '0');
    const seconds = (timeTaken % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `Time: ${minutes}:${seconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function togglePause() {
    const pauseBtn = document.getElementById('pause-btn');
    const container = document.getElementById('questions-container');
    const submitBtn = document.getElementById('submit-btn');
    if (isPaused) {
        // Resume
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        pauseBtn.innerText = 'Pause';
        container.classList.remove('d-none');
        submitBtn.classList.remove('d-none');
        isPaused = false;
    } else {
        // Pause
        clearInterval(timerInterval);
        pausedTime = timeTaken;
        pauseBtn.innerText = 'Resume';
        container.classList.add('d-none');
        submitBtn.classList.add('d-none');
        isPaused = true;
    }
}

function submitAnswers() {
    stopTimer();
    
    let score = 0;
    let hardCorrect = 0;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    currentQuizQuestions.forEach(q => {
        const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (selected && selected.value === q.answer) {
            score++;
            if (q.difficulty === 'hard') {
                hardCorrect++;
            }
        }
    });

    resultsDiv.innerHTML = `<h3>You scored ${score} out of ${currentQuizQuestions.length} in ${timeTaken} seconds!</h3>`;
    resultsDiv.classList.remove('d-none');
    
    awardBadges(score, timeTaken, hardCorrect);
}

function awardBadges(score, time, hardCorrect) {
    const badgesList = document.getElementById('badges-list');
    badgesList.innerHTML = '';
    let earned = false;

    const badgeMap = {
        'gold': 'warning',
        'silver': 'secondary',
        'bronze': 'dark'
    };

    if (score === currentQuizQuestions.length) {
        addBadge(badgesList, 'Perfect Score', badgeMap['gold']);
        earned = true;
    } else if (score >= 8) {
        addBadge(badgesList, 'Sharpshooter', badgeMap['silver']);
        earned = true;
    }

    if (time < 120 && score >= 5) { // 2 minutes and at least half correct
        addBadge(badgesList, 'Speed Demon', badgeMap['bronze']);
        earned = true;
    }

    if (hardCorrect > 0) {
        addBadge(badgesList, `Brainiac (${hardCorrect} Hard)`, 'success');
        earned = true;
    }

    if (earned) {
        document.getElementById('badges-container').classList.remove('d-none');
    }
}

function addBadge(container, name, type) {
    const badge = document.createElement('span');
    badge.className = `badge bg-${type}`;
    if (type !== 'warning') badge.className += ' text-white';
    badge.innerText = name;
    container.appendChild(badge);
}

function updatePermalink(grade, seed) {
    const url = new URL(window.location.href);
    url.searchParams.set('grade', grade);
    url.searchParams.set('seed', seed);
    document.getElementById('permalink-input').value = url.toString();
}

function copyPermalink() {
    const input = document.getElementById('permalink-input');
    input.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const grade = urlParams.get('grade');
    const seed = urlParams.get('seed');

    if (grade && seed && allQuestions.length > 0) {
        document.getElementById('grade-select').value = grade;
        generateQuiz(grade, parseInt(seed, 10));
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-bs-theme', newTheme);
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (newTheme === 'dark') {
        document.body.classList.remove('bg-light');
        document.body.classList.add('bg-dark');
        themeToggleBtn.innerText = '☀️';
    } else {
        document.body.classList.remove('bg-dark');
        document.body.classList.add('bg-light');
        themeToggleBtn.innerText = '🌙';
    }
}
