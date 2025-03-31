import React, { useState, useEffect } from 'react';
import './WorkoutCard.css';

function WorkoutCard({ workout, setCurrentWorkout, setWorkoutStartTime, currentWorkout, addWorkoutLogEntry }) {
    const [isWorkoutActive, setIsWorkoutActive] = useState(false);
    const [buttonText, setButtonText] = useState('Почати тренування');
    const [descriptionText, setDescriptionText] = useState(workout.description);
    const originalDescription = workout.description;
    const [startTime, setStartTime] = useState(null);
    const [startDate, setStartDate] = useState(null);

    useEffect(() => {
        if (currentWorkout && currentWorkout.title === workout.title) {
            setIsWorkoutActive(true);
            setButtonText('Зупинити тренування');
        } else {
            setIsWorkoutActive(false);
            setButtonText('Почати тренування');
        }
    }, [currentWorkout, workout.title]);


    const calculateWorkoutDuration = (start, end) => {
        const startTimeDate = new Date(`01/01/1970 ${start}`);
        const endTimeDate = new Date(`01/01/1970 ${end}`);
        const durationMs = endTimeDate - startTimeDate;
        const durationSec = Math.round(durationMs / 1000);
        const minutes = Math.floor(durationSec / 60);
        const seconds = durationSec % 60;
        return `${minutes} хв ${seconds} сек`;
    };


    const handleStartStopWorkout = () => {
        if (!isWorkoutActive) {
            setCurrentWorkout({ title: workout.title });
            const startWorkoutTime = new Date();
            setWorkoutStartTime(startWorkoutTime.toLocaleTimeString());
            setStartTime(startWorkoutTime.toLocaleTimeString());
            setStartDate(startWorkoutTime.toLocaleDateString());
        } else {
            setCurrentWorkout(null);
            const endTime = new Date().toLocaleTimeString();
            const duration = calculateWorkoutDuration(startTime, endTime);
            addWorkoutLogEntry({
                type: workout.title,
                workoutType: workout.type,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                workoutDate: startDate
            });
            setStartTime(null);
            setStartDate(null);
        }
    };

    const handleMouseOver = () => {
        setDescriptionText('Натисніть "Почати тренування", щоб розпочати це тренування!');
    };

    const handleMouseOut = () => {
        setDescriptionText(originalDescription);
    };

    return (
        <div className="workout-card" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <img src={`/${workout.img}`} alt={workout.title} />
            <h3>{workout.title}</h3>
            <p>{descriptionText}</p>
            <a href="#">Переглянути</a>
            <button
                className={`workout-card-button ${isWorkoutActive ? 'active' : ''}`}
                onClick={handleStartStopWorkout}
                disabled={currentWorkout && currentWorkout.title !== workout.title && currentWorkout.title !== null}
            >
                {buttonText}
            </button>
        </div>
    );
}

export default WorkoutCard;