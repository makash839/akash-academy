// Pitman Shorthand Practice App - JavaScript

// Exercise Database
const exercisesDatabase = {
    1: { // Chapter 1 - Simple Consonants
        1: {
            text: "pay bay tea deep chay jay",
            shorthand: "p b t d ch j",
            words: ["pay", "bay", "tea", "deep", "chay", "jay"],
            hint: "Simple consonant strokes - P, B, T, D, CH, J"
        },
        2: {
            text: "kay gay eff vee ess zee",
            shorthand: "k g f v s z",
            words: ["kay", "gay", "eff", "vee", "ess", "zee"],
            hint: "More consonant strokes - K, G, F, V, S, Z"
        },
        3: {
            text: "em en el ar",
            shorthand: "m n l r",
            words: ["em", "en", "el", "ar"],
            hint: "Nasal and liquid consonants - M, N, L, R"
        }
    },
    2: { // Chapter 2 - Vowels
        1: {
            text: "tea tie too toe ta taw",
            shorthand: "t t t t t t",
            words: ["tea", "tie", "too", "toe", "ta", "taw"],
            hint: "Light vowels with T - ee, i, oo, o, a, aw"
        },
        2: {
            text: "deep dye dupe dope dark dawn",
            shorthand: "d d d d d d",
            words: ["deep", "dye", "dupe", "dope", "dark", "dawn"],
            hint: "Heavy vowels with D"
        }
    },
    3: { // Chapter 3 - Diphthongs
        1: {
            text: "pay bay day gay",
            shorthand: "p b d g",
            words: ["pay", "bay", "day", "gay"],
            hint: "Diphthong 'ay' sound"
        },
        2: {
            text: "pie buy die guy",
            shorthand: "p b d g",
            words: ["pie", "buy", "die", "guy"],
            hint: "Diphthong 'ie/y' sound"
        }
    },
    4: { // Chapter 4 - Consonant Blends
        1: {
            text: "play pray stay spray",
            shorthand: "pl pr st spr",
            words: ["play", "pray", "stay", "spray"],
            hint: "Common consonant blends"
        },
        2: {
            text: "street spring strong script",
            shorthand: "str spr str scr",
            words: ["street", "spring", "strong", "script"],
            hint: "Triple consonant blends"
        }
    },
    5: { // Chapter 5 - Halving Principle
        1: {
            text: "put but cut get",
            shorthand: "pt bt ct gt",
            words: ["put", "but", "cut", "get"],
            hint: "Halving for T"
        },
        2: {
            text: "paid bade cade gait",
            shorthand: "pd bd cd gd",
            words: ["paid", "bade", "cade", "gait"],
            hint: "Halving for D"
        }
    },
    6: { // Chapter 6 - Doubling Principle
        1: {
            text: "better letter setter getter",
            shorthand: "btr ltr str gtr",
            words: ["better", "letter", "setter", "getter"],
            hint: "Doubling for -ter"
        }
    },
    7: { // Chapter 7 - Prefixes & Suffixes
        1: {
            text: "unlikely unfair unable uncertain",
            shorthand: "un-likely un-fair un-able un-certain",
            words: ["unlikely", "unfair", "unable", "uncertain"],
            hint: "Prefix: un-"
        }
    },
    8: { // Chapter 8 - Phrases
        1: {
            text: "I am I have I will he is",
            shorthand: "I-am I-hv I-wl he-is",
            words: ["I", "am", "I", "have", "I", "will", "he", "is"],
            hint: "Common phrases"
        }
    }
};

// Current exercise tracking
let currentChapter = 0;
let currentExercise = 0;
let currentExerciseData = null;

// Load exercises for selected chapter
function loadChapterExercises() {
    const chapterSelect = document.getElementById('chapterSelect');
    const exerciseSelect = document.getElementById('exerciseSelect');
    const selectedChapter = parseInt(chapterSelect.value);
    
    currentChapter = selectedChapter;
    
    // Clear previous exercises
    exerciseSelect.innerHTML = '<option value="0">-- Select Exercise --</option>';
    
    if (selectedChapter > 0 && exercisesDatabase[selectedChapter]) {
        const exercises = exercisesDatabase[selectedChapter];
        let exerciseNum = 1;
        
        for (let key in exercises) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `Exercise ${exerciseNum}`;
            exerciseSelect.appendChild(option);
            exerciseNum++;
        }
    }
}

// Start selected exercise
function startExercise() {
    const exerciseSelect = document.getElementById('exerciseSelect');
    const selectedExercise = parseInt(exerciseSelect.value);
    
    if (currentChapter === 0 || selectedExercise === 0) {
        alert('Pehle Chapter aur Exercise select karein!');
        return;
    }
    
    currentExercise = selectedExercise;
    currentExerciseData = exercisesDatabase[currentChapter][currentExercise];
    
    // Display exercise
    document.getElementById('exerciseText').textContent = currentExerciseData.text;
    document.getElementById('userInput').value = '';
    
    // Show practice area
    document.getElementById('practiceArea').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Scroll to practice area
    document.getElementById('practiceArea').scrollIntoView({ behavior: 'smooth' });
}

// Check user's answer
function checkAnswer() {
    if (!currentExerciseData) {
        alert('Pehle exercise start karein!');
        return;
    }
    
    const userInput = document.getElementById('userInput').value.trim().toLowerCase();
    const correctWords = currentExerciseData.words;
    const userWords = userInput.split(/\s+/);
    
    let correctCount = 0;
    let mistakes = [];
    
    // Compare each word
    correctWords.forEach((correctWord, index) => {
        const userWord = userWords[index] || '';
        
        if (userWord === correctWord.toLowerCase()) {
            correctCount++;
        } else {
            mistakes.push({
                position: index + 1,
                correct: correctWord,
                user: userWord || '(missing)',
                hint: `"${correctWord}" ki jagah aapne "${userWord || 'kuch nahi'}" likha`
            });
        }
    });
    
    // Calculate score
    const totalWords = correctWords.length;
    const score = Math.round((correctCount / totalWords) * 100);
    
    // Display results
    displayResults(score, correctCount, totalWords, mistakes);
    
    // Save progress
    saveProgress(currentChapter, currentExercise, score);
    
    // Update overall progress
    updateOverallProgress();
}

// Display results
function displayResults(score, correct, total, mistakes) {
    const resultsSection = document.getElementById('resultsSection');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const scoreMessage = document.getElementById('scoreMessage');
    const correctCount = document.getElementById('correctCount');
    const mistakeCount = document.getElementById('mistakeCount');
    const mistakesDetails = document.getElementById('mistakesDetails');
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Display score
    scoreDisplay.textContent = `${score}%`;
    
    // Score message
    if (score === 100) {
        scoreMessage.innerHTML = '<i class="fas fa-trophy text-warning"></i> Perfect! Bahut badhiya! 🎉';
        scoreDisplay.className = 'display-3 fw-bold text-success';
    } else if (score >= 80) {
        scoreMessage.innerHTML = '<i class="fas fa-thumbs-up"></i> Bahut achha! Keep it up! 👍';
        scoreDisplay.className = 'display-3 fw-bold text-success';
    } else if (score >= 60) {
        scoreMessage.innerHTML = '<i class="fas fa-smile"></i> Achha hai! Thoda aur practice karein.';
        scoreDisplay.className = 'display-3 fw-bold text-warning';
    } else {
        scoreMessage.innerHTML = '<i class="fas fa-redo"></i> Koi baat nahi! Phir se try karein.';
        scoreDisplay.className = 'display-3 fw-bold text-danger';
    }
    
    // Display counts
    correctCount.textContent = correct;
    mistakeCount.textContent = mistakes.length;
    
    // Display mistakes
    if (mistakes.length > 0) {
        let mistakesHTML = '<h5 class="text-danger mb-3"><i class="fas fa-exclamation-triangle"></i> Galtiyan:</h5>';
        
        mistakes.forEach((mistake, index) => {
            mistakesHTML += `
                <div class="mistake-item">
                    <strong>Word ${mistake.position}:</strong><br>
                    <span class="wrong-word">${mistake.user}</span> 
                    <i class="fas fa-arrow-right"></i> 
                    <span class="correct-word">${mistake.correct}</span><br>
                    <small class="text-muted"><i class="fas fa-lightbulb"></i> ${mistake.hint}</small>
                </div>
            `;
        });
        
        mistakesDetails.innerHTML = mistakesHTML;
    } else {
        mistakesDetails.innerHTML = `
            <div class="alert alert-success text-center">
                <i class="fas fa-check-circle fa-3x mb-3"></i>
                <h4>Koi galti nahi! Sab sahi hai! 🎉</h4>
            </div>
        `;
    }
}

// Show hint
function showHint() {
    if (!currentExerciseData) {
        alert('Pehle exercise start karein!');
        return;
    }
    
    alert(`💡 Hint: ${currentExerciseData.hint}`);
}

// Reset exercise
function resetExercise() {
    document.getElementById('userInput').value = '';
    document.getElementById('resultsSection').style.display = 'none';
}

// Retry exercise
function retryExercise() {
    resetExercise();
    document.getElementById('practiceArea').scrollIntoView({ behavior: 'smooth' });
}

// Next exercise
function nextExercise() {
    const exerciseSelect = document.getElementById('exerciseSelect');
    const currentValue = parseInt(exerciseSelect.value);
    const nextValue = currentValue + 1;
    
    // Check if next exercise exists
    const nextOption = exerciseSelect.querySelector(`option[value="${nextValue}"]`);
    
    if (nextOption) {
        exerciseSelect.value = nextValue;
        startExercise();
    } else {
        alert('Yeh chapter ki saari exercises complete ho gayi hain! Next chapter choose karein.');
    }
}

// Back to selection
function backToSelection() {
    document.getElementById('practiceArea').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Save progress in localStorage
function saveProgress(chapter, exercise, score) {
    let progress = JSON.parse(localStorage.getItem('pitmanProgress')) || {};
    
    if (!progress[chapter]) {
        progress[chapter] = {};
    }
    
    // Save score (keep highest score)
    if (!progress[chapter][exercise] || progress[chapter][exercise] < score) {
        progress[chapter][exercise] = score;
    }
    
    localStorage.setItem('pitmanProgress', JSON.stringify(progress));
}

// Update overall progress
function updateOverallProgress() {
    const progress = JSON.parse(localStorage.getItem('pitmanProgress')) || {};
    
    let totalExercises = 0;
    let completedExercises = 0;
    let totalScore = 0;
    
    // Count total exercises
    for (let chapter in exercisesDatabase) {
        totalExercises += Object.keys(exercisesDatabase[chapter]).length;
    }
    
    // Count completed exercises
    for (let chapter in progress) {
        for (let exercise in progress[chapter]) {
            completedExercises++;
            totalScore += progress[chapter][exercise];
        }
    }
    
    // Calculate percentages
    const progressPercent = Math.round((completedExercises / totalExercises) * 100);
    const averageScore = completedExercises > 0 ? Math.round(totalScore / completedExercises) : 0;
    
    // Update UI
    document.getElementById('totalExercises').textContent = totalExercises;
    document.getElementById('completedExercises').textContent = completedExercises;
    document.getElementById('averageScore').textContent = `${averageScore}%`;
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressMessage = document.getElementById('progressMessage');
    
    progressBar.style.width = `${progressPercent}%`;
    progressBar.setAttribute('aria-valuenow', progressPercent);
    progressText.textContent = `${progressPercent}%`;
    
    if (progressPercent === 100) {
        progressMessage.textContent = '🎉 Badhai ho! Saari exercises complete ho gayi hain!';
    } else if (progressPercent >= 50) {
        progressMessage.textContent = `${completedExercises}/${totalExercises} exercises complete. Aadhe se zyada ho gaya!`;
    } else {
        progressMessage.textContent = `${completedExercises}/${totalExercises} exercises complete. Aur practice karein!`;
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    updateOverallProgress();
    
    // Add keyboard shortcut for checking answer (Ctrl+Enter)
    document.getElementById('userInput').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            checkAnswer();
        }
    });
});

// Auto-save draft
let autoSaveInterval;
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        const userInput = document.getElementById('userInput').value;
        if (userInput && currentChapter && currentExercise) {
            localStorage.setItem(`draft_${currentChapter}_${currentExercise}`, userInput);
        }
    }, 10000); // Every 10 seconds
}

// Load draft if exists
function loadDraft() {
    if (currentChapter && currentExercise) {
        const draft = localStorage.getItem(`draft_${currentChapter}_${currentExercise}`);
        if (draft) {
            const loadDraftConfirm = confirm('Aapka pichla draft saved hai. Use load karein?');
            if (loadDraftConfirm) {
                document.getElementById('userInput').value = draft;
            }
        }
    }
}
