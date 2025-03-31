import React from 'react';
import './WorkoutLog.css';

function WorkoutLog({ isVisible, workoutLog }) {
    return (
        <div id="workout-log" style={{ display: isVisible ? 'block' : 'none' }} className="workout-log">
            <h3>Журнал тренувань</h3>
            <ul id="log-list" className="log-list">
                {workoutLog.length === 0 ? (
                    <li>Журнал тренувань порожній.</li>
                ) : (
                    workoutLog.map((logEntry, index) => (
                        <li key={index}>
                            {logEntry.type} - Розпочато: {logEntry.startTime}, Завершено: {logEntry.endTime}, Тривалість: {logEntry.duration}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default WorkoutLog;