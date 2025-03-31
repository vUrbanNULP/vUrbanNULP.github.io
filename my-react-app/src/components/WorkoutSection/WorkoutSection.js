import React, { useState } from 'react';
import WorkoutCard from './WorkoutCard/WorkoutCard';
import CurrentWorkoutStatus from '../ProgressSection/CurrentWorkoutStatus/CurrentWorkoutStatus';
import './WorkoutSection.css';

const workoutsData = [
    { img: '1.jpg', title: 'Для початківців', description: 'Тренування для початку. Кожен повинен мати хороший старт.', type: 'початківці' },
    { img: '2.jpg', title: 'Інтенсивне кардіо', description: 'Тренування вашої витривалості! Справжнє випробування.', type: 'кардіо' },
    { img: '3.jpg', title: 'Силове тренування', description: 'Кожен хоче бути потужним! Наше силове тренування допоможе вам.', type: 'силове' },
    { img: '4.jpg', title: 'Йога для розслаблення', description: 'Всім потрібна хвилинка спокою. Медитація забезпечить вам її', type: 'йога' },
];

function WorkoutSection({ addWorkoutLogEntry }) {
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [workoutStartTime, setWorkoutStartTime] = useState(null);
    const [filterType, setFilterType] = useState('всі');

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
    };

    const filteredWorkouts = filterType === 'всі'
        ? workoutsData
        : workoutsData.filter(workout => workout.type === filterType);

    return (
        <section id="workouts" className="workout-section">
            <h2>Тренування</h2>
            <p>Перегляньте величезний список тренувань,
                які підійдуть для людей різного рівня навичок. Ви точно зможете знайти ідеальне тренування для себе!</p>

            <div className="workout-filter">
                <label htmlFor="workout-type-filter">Фільтрувати за типом:</label>
                <select id="workout-type-filter" value={filterType} onChange={handleFilterChange}>
                    <option value="всі">Всі типи</option>
                    <option value="початківці">Для початківців</option>
                    <option value="кардіо">Кардіо</option>
                    <option value="силове">Силове</option>
                    <option value="йога">Йога</option>
                </select>
            </div>

            <div className="workout-grid">
                {filteredWorkouts.map((workout, index) => (
                    <WorkoutCard
                        key={index}
                        workout={workout}
                        setCurrentWorkout={setCurrentWorkout}
                        setWorkoutStartTime={setWorkoutStartTime}
                        currentWorkout={currentWorkout}
                        addWorkoutLogEntry={addWorkoutLogEntry}
                    />
                ))}
            </div>
            <CurrentWorkoutStatus currentWorkout={currentWorkout} workoutStartTime={workoutStartTime} />
        </section>
    );
}

export default WorkoutSection;