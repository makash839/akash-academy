// ============================================
// PITMAN SHORTHAND PRACTICE APP
// ============================================

// Exercise Database (Stored in localStorage)
let exerciseDB = {};
let currentExercise = null;
let currentChapter = null;
let zoomLevel = 1;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadDatabase();
    updateStats();
    loadSavedProgress();
    
    // Word counter
    document.getElementById('userAnswer').addEventListener('input', function() {
        const words = this.value.trim().split(/\s+/).filter(w => w.length > 0);
        document.getElementById('wordCount').textContent = words.length;
    });
});

// Load Database from localStorage
function loadDatabase() {
    const saved = localStorage.getItem('pitmanExerciseDB');
    if (saved) {
        exerciseDB = JSON.parse(saved);
    } else {
        // Default exercises (Sample)
        exerciseDB = {
            "1": {
                name: "Chapter 1 - Basic Strokes",
                exercises: {
                    "1": {
                        answer: ["pay", "bay", "tea", "deep"],
                        hint: "P, B, T, D strokes",
                        image: "images/exercises/chapter1/ex1.png"
                    },
                    "2": {
                        answer: ["take", "date", "make", "bake"],
                        hint: "Practice more P, B, T, D",
                        image: "images/exercises/chapter1/ex2.png"
                    },
                    "3": {
                        answer: ["tape", "type", "top", "tip"],
                        hint: "T stroke variations",
                        image: "images/exercises/chapter1/ex3.png"
                    }
                }
            },
            "2": {
                name: "Chapter 2 - K, G, F, V",
                exercises: {
                    "1": {
                        answer: ["keep", "key", "cake", "kick"],
                        hint: "K stroke",
                        image: "images/exercises/chapter2/ex1.png"
                    },
                    "2": {
                        answer: ["gate", "gave", "game", "go"],
                        hint: "G stroke",
                        image: "images/exercises/chapter2/ex2.png"
                    }
                }
            },
            "3": {
                name: "Chapter 3 - M, N, L, R",
                exercises: {
                    "1": {
                        answer: ["may", "make", "made", "me"],
                        hint: "M stroke",
                        image: "images/exercises/chapter3/ex1.png"
                    }
                }
            }
        };
        saveDatabase();
    }
}

// Save Database
function saveDatabase() {
    localStorage.setItem('pitmanExerciseDB', JSON.stringify(exerciseDB));
}

// Load Exercise List for Chapter
function loadExerciseList() {
    const chapter = document.getElementById('chapterSelect').value;
    const listContainer = document.getElementById('exerciseList');
    
    if (!chapter) {
        listContainer.innerHTML = '<p class="text-muted text-center">Pehle chapter select karein</p>';
        return;
    }
    
    currentChapter = chapter;
    const progress = JSON.parse(localStorage.getItem('pitmanProgress')) || {};
    const chapterData = exerciseDB[chapter];
    
    if (!chapterData || !chapterData.exercises) {
        listContainer.innerHTML = `
            <div class="text-center p-3">
                <i class="fas fa-folder-open fa-3x text-muted mb-2"></i>
                <p class="text-muted">Is chapter mein abhi exercises nahi hain</p>
                <button class="btn btn-sm btn-primary" onclick="scrollToAdmin()">
                    <i class="fas fa-plus"></i> Add Exercise
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    const exercises = chapterData.exercises;
    let completedCount = 0;
    
    for (let exNum in exercises) {
        const exProgress = progress[`${chapter}_${exNum}`];
        const isCompleted = exProgress && exProgress.score >= 70;
        if (isCompleted) completedCount++;
        
        html += `
            <div class="exercise-item ${isCompleted ? 'completed' : ''}" 
                 onclick="loadExercise('${chapter}', '${exNum}')">
                <div>
                    <i class="fas fa-pen-nib me-2"></i>
                    Exercise ${exNum}
                </div>
                <div>
                    ${isCompleted ? 
                        `<span class="badge bg-success score-badge">${exProgress.score}%</span>` : 
                        '<i class="fas fa-circle text-muted status-icon" style="font-size:0.6rem"></i>'
                    }
                </div>
            </div>
        `;
    }
    
    listContainer.innerHTML = html;
    
    // Update chapter progress
    const totalEx = Object.keys(exercises).length;
    const progressPercent = Math.round((completedCount / totalEx) * 100);
    document.getElementById('chapterProgress').style.width = progressPercent + '%';
    document.getElementById('chapterProgress').textContent = progressPercent + '%';
}

// Load Specific Exercise
function loadExercise(chapter, exNum) {
    const exercise = exerciseDB[chapter]?.exercises?.[exNum];
    
    if (!exercise) {
        showToast('Error', 'Exercise not found!', 'danger');
        return;
    }
    
    currentChapter = chapter;
    currentExercise = exNum;
    
    // Update UI
    document.getElementById('noExercise').style.display = 'none';
    document.getElementById('exerciseImage').style.display = 'block';
    document.getElementById('answerCard').style.display = 'block';
    document.getElementById('resultsCard').style.display = 'none';
    
    // Set image
    const img = document.getElementById('shorthandImg');
    img.src = exercise.image;
    img.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKcjSBJbWFnZSBub3QgZm91bmQ8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI3MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VXBsb2FkIHNob3J0aGFuZCBpbWFnZTwvdGV4dD48L3N2Zz4=';
    };
    
    // Load saved answer if exists
    const savedAnswer = localStorage.getItem(`draft_${chapter}_${exNum}`);
    document.getElementById('userAnswer').value = savedAnswer || '';
    
    // Update word count
    const words = (savedAnswer || '').trim().split(/\s+/).filter(w => w.length > 0);
    document.getElementById('wordCount').textContent = words.length;
    
    // Highlight active exercise
    document.querySelectorAll('.exercise-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.exercise-item')?.classList.add('active');
    
    // Scroll to image on mobile
    if (window.innerWidth < 768) {
        document.getElementById('shorthandCard').scrollIntoView({ behavior: 'smooth' });
    }
}

// Check Answer
function checkAnswer() {
    if (!currentExercise || !currentChapter) {
        showToast('Error', 'Pehle exercise select karein!', 'warning');
        return;
    }
    
    const exercise = exerciseDB[currentChapter].exercises[currentExercise];
    const userInput = document.getElementById('userAnswer').value.trim().toLowerCase();
    const userWords = userInput.split(/[\s,]+/).filter(w => w.length > 0);
    const correctWords = exercise.answer.map(w => w.toLowerCase());
    
    let correctCount = 0;
    let results = [];
    
    // Compare words
    const maxLen = Math.max(userWords.length, correctWords.length);
    
    for (let i = 0; i < maxLen; i++) {
        const correct = correctWords[i] || '';
        const user = userWords[i] || '';
        const isCorrect = correct === user;
        
        if (isCorrect && correct) correctCount++;
        
        results.push({
            index: i + 1,
            correct: correct,
            user: user,
            isCorrect: isCorrect
        });
    }
    
    // Calculate score
    const score = correctWords.length > 0 ? Math.round((correctCount / correctWords.length) * 100) : 0;
    
    // Display results
    displayResults(score, results, correctCount, correctWords.length);
    
    // Save progress
    saveProgress(currentChapter, currentExercise, score);
    
    // Update stats
    updateStats();
    loadExerciseList();
}

// Display Results
function displayResults(score, results, correct, total) {
    document.getElementById('resultsCard').style.display = 'block';
    
    // Score circle
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.className = 'score-circle';
    
    if (score >= 80) {
        scoreCircle.classList.add('excellent');
        document.getElementById('scoreMessage').innerHTML = '🎉 Excellent! Bahut badhiya!';
    } else if (score >= 60) {
        scoreCircle.classList.add('good');
        document.getElementById('scoreMessage').innerHTML = '👍 Good! Thoda aur practice karein!';
    } else {
        scoreCircle.classList.add('poor');
        document.getElementById('scoreMessage').innerHTML = '💪 Keep trying! Practice makes perfect!';
    }
    
    document.getElementById('scorePercent').textContent = score + '%';
    
    // Comparison table
    let tableHtml = '';
    results.forEach(r => {
        tableHtml += `
            <tr class="${r.isCorrect ? 'correct' : 'incorrect'}">
                <td>${r.index}</td>
                <td class="correct-word">${r.correct || '-'}</td>
                <td class="${r.isCorrect ? 'correct-word' : 'wrong-word'}">
                    ${r.user || '(empty)'}
                </td>
                <td>
                    ${r.isCorrect ? 
                        '<i class="fas fa-check-circle text-success"></i>' : 
                        '<i class="fas fa-times-circle text-danger"></i>'
                    }
                </td>
            </tr>
        `;
    });
    
    document.getElementById('comparisonTable').innerHTML = tableHtml;
    
    // Scroll to results
    document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
    
    // Clear draft after checking
    localStorage.removeItem(`draft_${currentChapter}_${currentExercise}`);
}

// Save Progress
function saveProgress(chapter, exercise, score) {
    let progress = JSON.parse(localStorage.getItem('pitmanProgress')) || {};
    const key = `${chapter}_${exercise}`;
    
    // Keep highest score
    if (!progress[key] || progress[key].score < score) {
        progress[key] = {
            score: score,
            date: new Date().toISOString(),
            attempts: (progress[key]?.attempts || 0) + 1
        };
    } else {
        progress[key].attempts = (progress[key]?.attempts || 0) + 1;
    }
    
    localStorage.setItem('pitmanProgress', JSON.stringify(progress));
}

// Auto Save Draft
let autoSaveTimeout;
function autoSave() {
    clearTimeout(autoSaveTimeout);
    
    document.getElementById('autoSaveStatus').innerHTML = 
        '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    autoSaveTimeout = setTimeout(() => {
        if (currentChapter && currentExercise) {
            const answer = document.getElementById('userAnswer').value;
            localStorage.setItem(`draft_${currentChapter}_${currentExercise}`, answer);
            
            document.getElementById('autoSaveStatus').innerHTML = 
                '<i class="fas fa-check text-success"></i> Saved';
        }
    }, 1000);
}

// Update Stats
function updateStats() {
    const progress = JSON.parse(localStorage.getItem('pitmanProgress')) || {};
    
    // Total exercises
    let totalEx = 0;
    for (let ch in exerciseDB) {
        totalEx += Object.keys(exerciseDB[ch].exercises || {}).length;
    }
    document.getElementById('totalExercises').textContent = totalEx;
    
    // Completed (score >= 70%)
    let completed = 0;
    let totalScore = 0;
    
    for (let key in progress) {
        if (progress[key].score >= 70) completed++;
        totalScore += progress[key].score;
    }
    
    document.getElementById('completedCount').textContent = completed;
    
    // Average accuracy
    const attempts = Object.keys(progress).length;
    const avgScore = attempts > 0 ? Math.round(totalScore / attempts) : 0;
    document.getElementById('avgAccuracy').textContent = avgScore + '%';
    
    // Streak (simplified - days with activity)
    const streak = calculateStreak();
    document.getElementById('streak').textContent = streak;
}

// Calculate Streak
function calculateStreak() {
    const progress = JSON.parse(localStorage.getItem('pitmanProgress')) || {};
    const dates = new Set();
    
    for (let key in progress) {
        if (progress[key].date) {
            dates.add(progress[key].date.split('T')[0]);
        }
    }
    
    // Simple streak calculation
    let streak = 0;
    let checkDate = new Date();
    
    for (let i = 0; i < 30; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (dates.has(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (i > 0) {
            break;
        } else {
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }
    
    return streak;
}

// Show Hint
function showHint() {
    if (!currentExercise || !currentChapter) {
        showToast('Info', 'Pehle exercise select karein!', 'warning');
        return;
    }
    
    const exercise = exerciseDB[currentChapter].exercises[currentExercise];
    const hint = exercise.hint || 'Dhyan se shorthand dekhen aur har stroke pehchanen.';
    
    showToast('💡 Hint', hint, 'info');
}

// Clear Answer
function clearAnswer() {
    document.getElementById('userAnswer').value = '';
    document.getElementById('wordCount').textContent = '0';
    
    if (currentChapter && currentExercise) {
        localStorage.removeItem(`draft_${currentChapter}_${currentExercise}`);
    }
}

// Next Exercise
function nextExercise() {
    if (!currentChapter) return;
    
    const exercises = exerciseDB[currentChapter].exercises;
    const exNums = Object.keys(exercises).sort((a, b) => parseInt(a) - parseInt(b));
    const currentIndex = exNums.indexOf(currentExercise);
    
    if (currentIndex < exNums.length - 1) {
        const nextEx = exNums[currentIndex + 1];
        
        // Simulate click on next exercise
        document.querySelectorAll('.exercise-item')[currentIndex + 1]?.click();
    } else {
        showToast('🎉 Complete!', 'Is chapter ki saari exercises complete ho gayi!', 'success');
    }
}

// Retry Exercise
function retryExercise() {
    document.getElementById('userAnswer').value = '';
    document.getElementById('wordCount').textContent = '0';
    document.getElementById('resultsCard').style.display = 'none';
    document.getElementById('userAnswer').focus();
}

// Back to List
function backToList() {
    document.getElementById('noExercise').style.display = 'block';
    document.getElementById('exerciseImage').style.display = 'none';
    document.getElementById('answerCard').style.display = 'none';
    document.getElementById('resultsCard').style.display = 'none';
    currentExercise = null;
}

// Zoom Functions
function zoomIn() {
    if (zoomLevel < 4) {
        zoomLevel++;
        updateZoom();
    }
}

function zoomOut() {
    if (zoomLevel > 1) {
        zoomLevel--;
        updateZoom();
    }
}

function updateZoom() {
    const img = document.getElementById('shorthandImg');
    img.className = 'img-fluid shorthand-img zoom-level-' + zoomLevel;
}

// Fullscreen
function toggleFullscreen() {
    const img = document.getElementById('shorthandImg');
    
    if (!document.fullscreenElement) {
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <span class="close-fullscreen" onclick="closeFullscreen()">&times;</span>
            <img src="${img.src}" alt="Shorthand">
        `;
        overlay.onclick = function(e) {
            if (e.target === overlay) closeFullscreen();
        };
        document.body.appendChild(overlay);
    }
}

function closeFullscreen() {
    const overlay = document.querySelector('.fullscreen-overlay');
    if (overlay) overlay.remove();
}

// Add Exercise (Admin)
function addExercise() {
    const chapter = document.getElementById('adminChapter').value;
    const exNum = document.getElementById('adminExNum').value;
    const answerText = document.getElementById('adminAnswer').value;
    const imageInput = document.getElementById('adminImage');
    
    if (!answerText.trim()) {
        showToast('Error', 'Answer words daalein!', 'danger');
        return;
    }
    
    const answers = answerText.split(',').map(w => w.trim().toLowerCase()).filter(w => w);
    
    if (!exerciseDB[chapter]) {
        exerciseDB[chapter] = {
            name: `Chapter ${chapter}`,
            exercises: {}
        };
    }
    
    // Handle image
    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            exerciseDB[chapter].exercises[exNum] = {
                answer: answers,
                hint: `Chapter ${chapter} Exercise ${exNum}`,
                image: e.target.result // Base64 image
            };
            saveDatabase();
            showToast('✅ Success', 'Exercise saved with image!', 'success');
            loadExerciseList();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        exerciseDB[chapter].exercises[exNum] = {
            answer: answers,
            hint: `Chapter ${chapter} Exercise ${exNum}`,
            image: `images/exercises/chapter${chapter}/ex${exNum}.png`
        };
        saveDatabase();
        showToast('✅ Success', 'Exercise saved! Image path set.', 'success');
        loadExerciseList();
    }
    
    // Clear form
    document.getElementById('adminAnswer').value = '';
    document.getElementById('adminImage').value = '';
}

// Scroll to Admin Section
function scrollToAdmin() {
    document.getElementById('adminSection').classList.add('show');
    document.getElementById('adminSection').scrollIntoView({ behavior: 'smooth' });
}

// Show Toast
function showToast(title, message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    toast.className = `toast bg-${type === 'danger' ? 'danger' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} text-white`;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Load Saved Progress
function loadSavedProgress() {
    const lastChapter = localStorage.getItem('lastChapter');
    if (lastChapter) {
        document.getElementById('chapterSelect').value = lastChapter;
        loadExerciseList();
    }
}

// Save last chapter
document.getElementById('chapterSelect').addEventListener('change', function() {
    localStorage.setItem('lastChapter', this.value);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter = Check Answer
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
    }
    
    // Escape = Close fullscreen
    if (e.key === 'Escape') {
        closeFullscreen();
    }
});
