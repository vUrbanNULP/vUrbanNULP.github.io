import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ProgressGraph.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


function ProgressGraph({ chartData }) {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Тривалість тренувань за типами за останні 7 днів',
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Тривалість (сек)'
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 60,
                }
            },
        },
    };


    return (
        <div id="progress-graph" className="progress-graph">
            <h3>Графік прогресу</h3>
            <Bar options={options} data={chartData} />
        </div>
    );
}

export default ProgressGraph;