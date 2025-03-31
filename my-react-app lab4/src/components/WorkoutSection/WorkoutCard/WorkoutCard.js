import React, { useState, useEffect } from 'react';
import './WorkoutCard.css';

function WorkoutCard({ workout, setCurrentWorkout, setWorkoutStartTime, currentWorkout, addWorkoutLogEntry }) {
    const [isWorkoutActive, setIsWorkoutActive] = useState(false);
    const [buttonText, setButtonText] = useState('Почати тренування');
    const [descriptionText, setDescriptionText] = useState(workout.description);
    const originalDescription = workout.description;
    const [startTime, setStartTime] = useState(null);

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
         try {
            const startTimeDate = new Date(`1970-01-01T${start}Z`);
            const endTimeDate = new Date(`1970-01-01T${end}Z`);
            if (isNaN(startTimeDate) || isNaN(endTimeDate)) return { durationString: "Помилка часу", durationSeconds: 0 };

            let durationMs = endTimeDate - startTimeDate;
             if (durationMs < 0) {
                 durationMs += 24 * 60 * 60 * 1000;
             }

            const durationSec = Math.round(durationMs / 1000);
            const minutes = Math.floor(durationSec / 60);
            const seconds = durationSec % 60;
            return {
                durationString: `${minutes} хв ${seconds} сек`,
                durationSeconds: durationSec
            };
         } catch (e) {
            console.error("Error calculating duration:", e);
            return { durationString: "Помилка", durationSeconds: 0 };
         }
    };

    const handleStartStopWorkout = () => {
        const currentTime = new Date();
         const timeString = currentTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
         const dateString = currentTime.toLocaleDateString('uk-UA');

        if (!isWorkoutActive) {
            setCurrentWorkout({ title: workout.title, type: workout.type });
            setWorkoutStartTime(timeString);
            setStartTime(timeString);
        } else {
            const endTime = timeString;
            const { durationString, durationSeconds } = calculateWorkoutDuration(startTime, endTime);
            addWorkoutLogEntry({
                type: workout.title,
                workoutType: workout.type,
                startTime: startTime,
                endTime: endTime,
                duration: durationString,
                durationSeconds: durationSeconds,
                workoutDate: dateString
            });
            setCurrentWorkout(null);
            setStartTime(null);
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
             {}
            <img src={`/${workout.img}`} alt={workout.title} />
            <h3>{workout.title}</h3>
            <p>{descriptionText}</p>
            {}
            {}
            <button
                className={`workout-card-button ${isWorkoutActive ? 'active' : ''}`}
                onClick={handleStartStopWorkout}
                disabled={!!currentWorkout && currentWorkout.title !== workout.title}
            >
                {buttonText}
            </button>
        </div>
    );
}

export default WorkoutCard;