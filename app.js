// Workout data embedded directly
const workoutData = {
    A: `Warm-Up
Backward Sled or Treadmill - 200 yards or 5 mins
Diapharagmatic Breathing + Core Activation (DNS)
Hip Activation
Plank + Dead Bug + Bird Dog + Side Plank
Main Workout (sets x reps)
Seated Calf Raise - 1 x 10
Tibialis Raise - 1 x to failure
Poliquin Step-up - 1 x 8 per side
ATG Split Squat - 4 x 8 per side
Hamstring Curl - 4 x 6
Dip - 3 x to failure
Chin Ups - 3 x to failure
DB Z-Press - 2 x 8-12
Cooldown
Diapharagmatic Breathing
Couch Stretch - 1 x 45 secs per side
Piriformis Push-up - 1 x 20 per side
Standing Pancake Pulse - 1 x 20`,
    
    B: `Warm-Up
Backward Sled or Treadmill - 200 yards or 5 mins
Diapharagmatic Breathing + Core Activation (DNS)
Hip Activation
Plank + Dead Bug + Bird Dog + Side Plank
Main Workout (sets x reps)
Standing Calf Raise - 1 x 10
Tibialis Raise - 1 x 20 or to failure
Poliquin Step-up - 1 x 8 per side
Goblet Squat - 4 x 6-12 (to be replaced)
Glute Bridge - 3 x 8-15
Incline DB Press - 3 x 10
Incline DB Row - 3 x 10
DB External Rotation - 2 x 8
Cooldown
Diapharagmatic Breathing
Couch Stretch - 1 x 45 secs per side
Piriformis Push-up - 1 x 20 per side
Elephant Walk - 1 x 20 per side`,
    
    C: `Warm-Up
Backward Sled or Treadmill - 200 yards or 5 mins
Diapharagmatic Breathing + Core Activation (DNS)
Hip Activation
Scapula Pushup + Scapula Pullup + Dead Bug + Bird Dog
Main Workout (sets x reps)
Seated Calf Raise - 1 x 10
Tibialis Raise - 1 x to failure
Poliquin Step-up - 1 x 8 per side
Deficit Reverse Lunge - 3 x 8-12 per side
Single Leg DB Deadlift - 4 x 8-10 per side
Skullcrusher + Pullover - 3 x 8-12
Lat Pulldown - 3 x 8-12
Curl to Shoulder Press - 2 x 8-12
Cooldown
Diapharagmatic Breathing
Couch Stretch - 1 x 45 secs per side
Piriformis Push-up - 1 x 20 per side
Standing Pancake Pulse - 1 x 20`,
    
    D: `Warm-Up
Backward Sled or Treadmill - 200 yards or 5 mins
Diapharagmatic Breathing + Core Activation (DNS)
Hip Activation
Plank + Dead Bug + Bird Dog + Side Plank
Main Workout (sets x reps)
Standing Calf Raise - 1 x 10
Tibialis Raise - 1 x 20 or to failure
Poliquin Step-up - 1 x 8 per side
Goblet Squat Heel Elevated - 4 x 6-12 (to be replaced)
Step-ups - 3 x 6-10 per side
Machine Chest Press - 3 x 10
Cable Row - 3 x 10
Face Pull - 2 x 8
Cooldown
Diapharagmatic Breathing
Couch Stretch - 1 x 45 secs per side
Piriformis Push-up - 1 x 20 per side
Elephant Walk - 1 x 20 per side`
};

// Track manually selected period (null = use current month)
let selectedPeriod = null;

// Determine which workouts to display based on current month or selected period
function getWorkoutsForMonth() {
    const now = new Date();
    const month = selectedPeriod !== null ? selectedPeriod * 2 : now.getMonth(); // 0-11 (Jan = 0, Dec = 11)
    
    // Jan(0)-Feb(1): A & B
    // Mar(2)-Apr(3): C & D
    // May(4)-Jun(5): A & B
    // Jul(6)-Aug(7): C & D
    // Sep(8)-Oct(9): A & B
    // Nov(10)-Dec(11): C & D
    
    if (month >= 0 && month <= 1) {
        return { workout1: 'A', workout2: 'B', name1: 'A', name2: 'B', period: 'January - February' };
    } else if (month >= 2 && month <= 3) {
        return { workout1: 'C', workout2: 'D', name1: 'C', name2: 'D', period: 'March - April' };
    } else if (month >= 4 && month <= 5) {
        return { workout1: 'A', workout2: 'B', name1: 'A', name2: 'B', period: 'May - June' };
    } else if (month >= 6 && month <= 7) {
        return { workout1: 'C', workout2: 'D', name1: 'C', name2: 'D', period: 'July - August' };
    } else if (month >= 8 && month <= 9) {
        return { workout1: 'A', workout2: 'B', name1: 'A', name2: 'B', period: 'September - October' };
    } else {
        return { workout1: 'C', workout2: 'D', name1: 'C', name2: 'D', period: 'November - December' };
    }
}

// Parse workout text file into structured HTML
function parseWorkout(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    let html = '';
    let currentSection = '';
    let exercises = [];
    
    lines.forEach(line => {
        // Check if it's a section header
        if (line === 'Warm-Up' || line === 'Main Workout (sets x reps)' || line === 'Cooldown') {
            // Save previous section if it exists
            if (currentSection && exercises.length > 0) {
                html += createSection(currentSection, exercises);
                exercises = [];
            }
            currentSection = line;
        } else {
            // It's an exercise line
            exercises.push(line);
        }
    });
    
    // Add the last section
    if (currentSection && exercises.length > 0) {
        html += createSection(currentSection, exercises);
    }
    
    return html;
}

function createSection(title, exercises) {
    let sectionTitle = title;
    if (title === 'Main Workout (sets x reps)') {
        sectionTitle = 'Main Workout (sets x reps)';
    }
    
    let html = `<div class="workout-section">
        <h3>${sectionTitle}</h3>
        <ul class="exercise-list">`;
    
    exercises.forEach(exercise => {
        // Split on the dash to separate exercise name from details
        const parts = exercise.split('–');
        if (parts.length > 1) {
            const name = parts[0].trim();
            const details = parts.slice(1).join('–').trim();
            html += `<li><span class="exercise-name">${name}</span><span class="exercise-details">– ${details}</span></li>`;
        } else {
            html += `<li><span class="exercise-name">${exercise}</span></li>`;
        }
    });
    
    html += `</ul></div>`;
    return html;
}

// Load and display workouts
function loadWorkouts() {
    const { workout1, workout2, name1, name2, period } = getWorkoutsForMonth();
    
    // Update period display
    const prefix = selectedPeriod !== null ? 'Selected Period: ' : 'Current Period: ';
    document.getElementById('currentPeriod').textContent = prefix + period;
    
    // Update active button
    updateActiveButton();
    
    // Update titles
    document.getElementById('workout1Title').textContent = `Workout ${name1}`;
    document.getElementById('workout2Title').textContent = `Workout ${name2}`;
    
    // Get workout data and parse
    const text1 = workoutData[workout1];
    const text2 = workoutData[workout2];
    
    // Parse and display
    document.getElementById('workout1Content').innerHTML = parseWorkout(text1);
    document.getElementById('workout2Content').innerHTML = parseWorkout(text2);
}

// Update active button styling
function updateActiveButton() {
    const buttons = document.querySelectorAll('.period-btn');
    const currentPeriodIndex = selectedPeriod !== null ? selectedPeriod : Math.floor(new Date().getMonth() / 2);
    
    buttons.forEach((btn, index) => {
        if (index === currentPeriodIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Load workouts when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadWorkouts();
    
    // Add click handlers to period buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPeriod = parseInt(btn.dataset.period);
            loadWorkouts();
        });
    });
});
