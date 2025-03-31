import React, { useState, useEffect } from 'react';
import WorkoutCard from './WorkoutCard/WorkoutCard';
import CurrentWorkoutStatus from '../ProgressSection/CurrentWorkoutStatus/CurrentWorkoutStatus';
import './WorkoutSection.css';
function WorkoutSection({ addWorkoutLogEntry, workoutsData }) {
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [workoutStartTime, setWorkoutStartTime] = useState(null);
    const [filterType, setFilterType] = useState('всі');
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    useEffect(() => {
        const filtered = filterType === 'всі'
            ? workoutsData
            : workoutsData.filter(workout => workout.type === filterType);
        setFilteredWorkouts(filtered);
    }, [filterType, workoutsData]);

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
    };


    return (
        <section id="workouts" className="workout-section">
            <h2>Тренування</h2>
            <p>Перегляньте список тренувань, доступних для вашого рівня.</p>

            <div className="workout-filter">
                <label htmlFor="workout-type-filter">Фільтрувати за типом:</label>
                <select id="workout-type-filter" value={filterType} onChange={handleFilterChange}>
                    <option value="всі">Всі типи</option>
                    {}
                    <option value="початківці">Для початківців</option>
                    <option value="кардіо">Кардіо</option>
                    <option value="силове">Силове</option>
                    <option value="йога">Йога</option>
                </select>
            </div>

            {}
             {workoutsData.length === 0 && <p>Завантаження тренувань...</p>}

            <div className="workout-grid">
                {}
                {filteredWorkouts.map((workout) => (
                    <WorkoutCard
                        key={workout.id || workout.title}
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