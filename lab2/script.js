document.addEventListener('DOMContentLoaded', () => {
    const workoutGrid = document.querySelector('.workout-grid');
    const logList = document.querySelector('#log-list');
    const currentWorkoutStatus = document.querySelector('#current-workout-status');

    const workoutsData = [
        { img: '1.jpg', title: 'Для початківців', description: 'Ідеальне тренування для початку. Кожен повинен мати хороший старт.' },
        { img: '2.jpg', title: 'Інтенсивне кардіо', description: 'Тренування вашої витривалості! Справжнє випробування.' },
        { img: '3.jpg', title: 'Силове тренування', description: 'Кожен хоче бути потужним! Наше силове тренування допоможе вам.' },
        { img: '4.jpg', title: 'Йога для розслаблення', description: 'Всім потрібна хвилинка спокою. Медитація забезпечить вам її' }
    ];


    const toggleLogButton = document.querySelector('#toggle-log-button');
    const workoutLogSection = document.querySelector('#workout-log');

    toggleLogButton.addEventListener('click', () => {
        if (workoutLogSection.style.display === 'none') {
            workoutLogSection.style.display = 'block';
            toggleLogButton.textContent = 'Приховати журнал';
        } else {
            workoutLogSection.style.display = 'none';
            toggleLogButton.textContent = 'Показати журнал';
        }
    });

    let workoutLog = [];
    let currentWorkout = null;
    let workoutStartTime = null;
    let workoutStartDate = null;
    let workoutStartButtons = [];


    function calculateWorkoutDuration(start, end) {
        const startTime = new Date(`01/01/1970 ${start}`);
        const endTime = new Date(`01/01/1970 ${end}`);
        const durationMs = endTime - startTime;
        const durationSec = Math.round(durationMs / 1000);
        const minutes = Math.floor(durationSec / 60);
        const seconds = durationSec % 60;
        return `${minutes} хв ${seconds} сек`;
    }


    function displayWorkoutLog() {
        logList.innerHTML = '';
        if (workoutLog.length === 0) {
            const noLogsMessage = document.createElement('li');
            noLogsMessage.textContent = 'Журнал тренувань порожній.';
            logList.appendChild(noLogsMessage);
        } else {
            for (let i = 0; i < workoutLog.length; i++) {
                const logEntry = workoutLog[i];
                const logItem = document.createElement('li');
                logItem.textContent = `${logEntry.type} - Розпочато: ${logEntry.startTime}, Завершено: ${logEntry.endTime}, Тривалість: ${logEntry.duration}`;
                logList.appendChild(logItem);
            }
        }
    }

    function displayCurrentWorkoutStatus() {
        if (currentWorkout) {
            currentWorkoutStatus.textContent = `Поточне тренування: ${currentWorkout.title}. Розпочато: ${workoutStartTime}`;
        } else {
            currentWorkoutStatus.textContent = 'Тренування не розпочато.';
        }
    }

    function disableOtherWorkoutButtons(currentButton) {
        workoutStartButtons.forEach(button => {
            if (button !== currentButton) {
                button.disabled = true;
            }
        });
    }

    function enableAllWorkoutButtons() {
        workoutStartButtons.forEach(button => {
            button.disabled = false;
        });
    }


    for (let i = 0; i < workoutsData.length; i++) {
        const workout = workoutsData[i];
        const workoutCard = document.createElement('div');
        workoutCard.classList.add('workout-card');

        const img = document.createElement('img');
        img.src = workout.img;
        img.alt = workout.title;

        const title = document.createElement('h3');
        title.textContent = workout.title;

        const description = document.createElement('p');
        description.textContent = workout.description;

        const viewLink = document.createElement('a');
        viewLink.href = '#';
        viewLink.textContent = 'Переглянути';

        const startButton = document.createElement('button');
        startButton.textContent = 'Почати тренування';
        workoutStartButtons.push(startButton);


        startButton.addEventListener('click', () => {
            if (!currentWorkout) {
                currentWorkout = {
                    title: workout.title
                };
                workoutStartTime = new Date().toLocaleTimeString();
                workoutStartDate = new Date();
                startButton.textContent = 'Зупинити тренування';
                startButton.classList.add('active');
                disableOtherWorkoutButtons(startButton);
                displayCurrentWorkoutStatus();
            } else {
                const workoutEndTime = new Date().toLocaleTimeString();
                const workoutEndDate = new Date();
                const duration = calculateWorkoutDuration(workoutStartTime, workoutEndTime);
                workoutLog.push({
                    type: currentWorkout.title,
                    startTime: workoutStartTime,
                    endTime: workoutEndTime,
                    duration: duration
                });
                currentWorkout = null;
                workoutStartTime = null;
                workoutStartDate = null;
                startButton.textContent = 'Почати тренування';
                startButton.classList.remove('active');
                enableAllWorkoutButtons();
                displayWorkoutLog();
                displayCurrentWorkoutStatus();
            }
        });


        workoutCard.appendChild(img);
        workoutCard.appendChild(title);
        workoutCard.appendChild(description);
        workoutCard.appendChild(viewLink);
        workoutCard.appendChild(startButton);

        workoutGrid.appendChild(workoutCard);
    }

    displayWorkoutLog();
    displayCurrentWorkoutStatus();


    const workoutCards = document.querySelectorAll('.workout-card');

    workoutCards.forEach(card => {
        const originalDescription = card.querySelector('p').textContent;
        const originalColor = card.style.backgroundColor;


        card.addEventListener('mouseover', () => {
            card.querySelector('p').textContent = 'Натисніть "Почати тренування", щоб розпочати це тренування!';
            card.style.backgroundColor = '#f0f0f0';
        });

        card.addEventListener('mouseout', () => {
            card.querySelector('p').textContent = originalDescription;
            card.style.backgroundColor = originalColor;
        });
    });

    const dietForm = document.querySelector('#diet-form');
    const dietList = document.querySelector('#diet-list');
    let currentDiet = [];

    dietForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const foodNameInput = document.querySelector('#food-name');
        const caloriesInput = document.querySelector('#calories');

        const foodName = foodNameInput.value.trim();
        const calories = caloriesInput.value.trim();

        if (foodName === '' || calories === '') {
            alert('Будь ласка, заповніть всі поля.');
            return;
        }

        if (isNaN(calories) || parseFloat(calories) <= 0) {
            alert('Калорії повинні бути додатним числом.');
            return;
        }

        const dietItem = { name: foodName, calories: parseFloat(calories) };
        currentDiet.push(dietItem);
        displayDiet();

        foodNameInput.value = '';
        caloriesInput.value = '';
    });


    function displayDiet() {
        dietList.innerHTML = '';
        if (currentDiet.length === 0) {
            const noDietMessage = document.createElement('li');
            noDietMessage.textContent = 'Ваш раціон порожній.';
            dietList.appendChild(noDietMessage);
        } else {
            let totalCalories = 0;
            for (let i = 0; i < currentDiet.length; i++) {
                const item = currentDiet[i];
                const dietListItem = document.createElement('li');
                dietListItem.textContent = `${item.name} - ${item.calories} калорій`;
                dietList.appendChild(dietListItem);
                totalCalories += item.calories;
            }
            const totalCaloriesItem = document.createElement('li');
            totalCaloriesItem.textContent = `Загальна кількість калорій: ${totalCalories}`;
            dietList.appendChild(totalCaloriesItem);
        }
    }

    displayDiet();
});