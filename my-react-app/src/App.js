import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import WorkoutSection from './components/WorkoutSection/WorkoutSection';
import ProgressSection from './components/ProgressSection/ProgressSection';
import DietSection from './components/DietSection/DietSection';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
    const [workoutLog, setWorkoutLog] = useState(() => {
        const storedLog = localStorage.getItem('workoutLog');
        return storedLog ? JSON.parse(storedLog) : [];
    });

    const [currentDiet, setCurrentDiet] = useState(() => {
        const storedDiet = localStorage.getItem('currentDiet');
        return storedDiet ? JSON.parse(storedDiet) : [];
    });

    const addWorkoutLogEntry = useCallback((logEntry) => {
        setWorkoutLog(prevLog => [logEntry, ...prevLog]);
    }, []);

    const addDietItem = useCallback((dietItem) => {
        setCurrentDiet(prevDiet => [...prevDiet, dietItem]);
    }, []);

    useEffect(() => {
        localStorage.setItem('workoutLog', JSON.stringify(workoutLog));
    }, [workoutLog]);

    useEffect(() => {
        localStorage.setItem('currentDiet', JSON.stringify(currentDiet));
    }, [currentDiet]);

    const clearProgress = useCallback(() => {
        localStorage.removeItem('workoutLog');
        localStorage.removeItem('currentDiet');
        setWorkoutLog([]);
        setCurrentDiet([]);
    }, []);


    return (
        <Router>
            <div className="app">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<WorkoutSectionContainer addWorkoutLogEntry={addWorkoutLogEntry} />} />
                        <Route path="/progress" element={<ProgressSectionContainer workoutLog={workoutLog} clearProgress={clearProgress} />} />
                        <Route path="/diet" element={<DietSectionContainer currentDiet={currentDiet} addDietItem={addDietItem} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}


function WorkoutSectionContainer({ addWorkoutLogEntry }) {
    return (
        <>
            <WorkoutSection addWorkoutLogEntry={addWorkoutLogEntry} />
        </>
    );
}


function ProgressSectionContainer({ workoutLog, clearProgress }) {
    return (
        <>
            <ProgressSection workoutLog={workoutLog} clearProgress={clearProgress} />
        </>
    );
}


function DietSectionContainer({ currentDiet, addDietItem }) {
    return (
        <>
            <DietSection currentDiet={currentDiet} addDietItem={addDietItem} />
        </>
    );
}


export default App;
