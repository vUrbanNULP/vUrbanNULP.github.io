import React, { useState } from 'react';
import WorkoutLog from './WorkoutLog/WorkoutLog';
import ProgressGraph from './ProgressGraph/ProgressGraph';
import './ProgressSection.css';

function ProgressSection({ workoutLog, clearProgress }) {
    const [isLogVisible, setIsLogVisible] = useState(false);

    const toggleLogVisibility = () => {
        setIsLogVisible(!isLogVisible);
    };

    const handleClearProgress = () => {
        clearProgress();
    };

    const prepareChartData = () => {
        const dailyDurationsByType = {};
        const today = new Date();
        const workoutTypes = ['початківці', 'кардіо', 'силове', 'йога'];

        workoutTypes.forEach(type => {
            dailyDurationsByType[type] = {};
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateString = date.toLocaleDateString();
                dailyDurationsByType[type][dateString] = 0;
            }
        });

        workoutLog.forEach(logEntry => {
            const startDate = new Date(`01/01/1970 ${logEntry.startTime}`);
            const endDate = new Date(`01/01/1970 ${logEntry.endTime}`);
            const durationSeconds = Math.round(endDate - startDate) / 1000;
            const workoutDateString = logEntry.workoutDate;
            const workoutType = logEntry.workoutType;

            if (dailyDurationsByType[workoutType] && dailyDurationsByType[workoutType][workoutDateString] !== undefined) {
                dailyDurationsByType[workoutType][workoutDateString] += durationSeconds;
            }
        });

        const labels = Object.keys(dailyDurationsByType['початківці']);
        const datasets = workoutTypes.map((type, index) => {
            const backgroundColor = [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
            ][index % 4];

            const borderColor = [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ][index % 4];

            return {
                label: type,
                data: Object.values(dailyDurationsByType[type]),
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
            };
        });


        return {
            labels: labels,
            datasets: datasets,
        };
    };

    const chartData = prepareChartData();


    return (
        <section id="progress" className="progress-section">
            <h2>Мій Прогрес</h2>
            <p>Тут відображається ваша статистика та досягнення.</p>
            <ProgressGraph chartData={chartData} />
            <div className="toggle-log-button-container">
                <button id="toggle-log-button" className="button-primary" onClick={toggleLogVisibility}>
                    {isLogVisible ? 'Приховати журнал' : 'Показати журнал'}
                </button>
            </div>
            <WorkoutLog isVisible={isLogVisible} workoutLog={workoutLog} />
            <div className="clear-progress-container">
                <button id="clear-progress-button" className="button-primary" onClick={handleClearProgress}>
                    Очистити прогрес
                </button>
            </div>
        </section>
    );
}

export default ProgressSection;