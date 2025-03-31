import React, { useState, useMemo } from 'react';
import WorkoutLog from './WorkoutLog/WorkoutLog';
import ProgressGraph from './ProgressGraph/ProgressGraph';
import './ProgressSection.css';
function ProgressSection({ workoutLog }) {
    const [isLogVisible, setIsLogVisible] = useState(false);
    const toggleLogVisibility = () => {
        setIsLogVisible(!isLogVisible);
    };
    const chartData = useMemo(() => {
            console.log("Preparing chart data with log:", workoutLog);
            const dailyDurationsByType = {};
            const workoutTypes = ['початківці', 'кардіо', 'силове', 'йога'];
            const labels = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                 const dateString = date.toLocaleDateString('uk-UA');
                labels.push(dateString);
            }
            workoutTypes.forEach(type => {
                dailyDurationsByType[type] = {};
                labels.forEach(label => {
                    dailyDurationsByType[type][label] = 0;
                });
            });
            workoutLog.forEach(logEntry => {
                const durationSeconds = logEntry.durationSeconds || 0;
                 const workoutDateString = logEntry.workoutDate;
                 const workoutType = logEntry.workoutType?.toLowerCase();
                if (workoutType && dailyDurationsByType[workoutType] && dailyDurationsByType[workoutType][workoutDateString] !== undefined) {
                    dailyDurationsByType[workoutType][workoutDateString] += durationSeconds;
                } else if (workoutType) {
                     console.warn(`Workout type "${workoutType}" or date "${workoutDateString}" not found in initial structure for log:`, logEntry);
                }
            });
            console.log("Daily Durations:", dailyDurationsByType);
             const datasets = workoutTypes.map((type, index) => {
                 const backgroundColor = [
                     'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
                     'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
                     'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'
                 ][index % 6];
                 const borderColor = backgroundColor.replace('0.6', '1');
                return {
                    label: type.charAt(0).toUpperCase() + type.slice(1),
                     data: labels.map(label => dailyDurationsByType[type][label] || 0),
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                };
            });
            return {
                labels: labels,
                datasets: datasets.filter(ds => ds.data.some(d => d > 0)),
            };
        }, [workoutLog]);
    return (
        <section id="progress" className="progress-section">
            <h2>Мій Прогрес</h2>
            <p>Тут відображається ваша статистика тренувань за останні 7 днів.</p>
                 {chartData.datasets.length > 0 ? (
                     <ProgressGraph chartData={chartData} />
                 ) : (
                     <p style={{ textAlign: 'center', marginTop: '20px' }}>Немає даних для відображення графіку.</p>
                 )}
            <div className="toggle-log-button-container">
                <button id="toggle-log-button" className="button-primary" onClick={toggleLogVisibility}>
                    {isLogVisible ? 'Приховати журнал' : 'Показати журнал'}
                </button>
            </div>
            <WorkoutLog isVisible={isLogVisible} workoutLog={workoutLog} />
            {}
        </section>
    );
}
export default ProgressSection;