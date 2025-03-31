
import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, db } from './firebase/config';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy, deleteDoc, writeBatch } from "firebase/firestore";

import Header from './components/Header/Header';
import WorkoutSection from './components/WorkoutSection/WorkoutSection';
import ProgressSection from './components/ProgressSection/ProgressSection';
import DietSection from './components/DietSection/DietSection';
import Footer from './components/Footer/Footer';
import Auth from './components/Auth/Auth';
import './App.css';

const formatDateForInput = (date) => {
    if (!date || isNaN(date.getTime())) {
        const today = new Date();
        const month = `${today.getMonth() + 1}`.padStart(2, '0');
        const day = `${today.getDate()}`.padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
      }
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};


function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [workoutLog, setWorkoutLog] = useState([]);
    const [currentDiet, setCurrentDiet] = useState([]);
    const [workoutPrograms, setWorkoutPrograms] = useState([]);
    const [selectedDietDate, setSelectedDietDate] = useState(new Date());
    const [errorLoadingData, setErrorLoadingData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (!currentUser) {
                setWorkoutLog([]);
                setCurrentDiet([]);
                setSelectedDietDate(new Date());
                setErrorLoadingData(null);
            }
        });
        return () => unsubscribe();
    }, []);

     useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const programsCol = collection(db, 'workoutPrograms');
                const programSnapshot = await getDocs(programsCol);
                const programList = programSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWorkoutPrograms(programList);
            } catch (error) {
                console.error("Error fetching workout programs:", error);
            }
        };
        fetchPrograms();
     }, []);
    useEffect(() => {
        if (user && user.uid) {
            console.log(`Fetching data for user: ${user.uid} and date: ${selectedDietDate.toLocaleDateString()}`);
            setErrorLoadingData(null);
            const fetchUserData = async () => {
                let logs = [];
                let dietItems = [];
                let fetchError = null;
                try {
                    const logQuery = query(
                        collection(db, "userWorkoutLogs"),
                        where("userId", "==", user.uid),
                        orderBy("timestamp", "desc")
                    );
                    const logSnapshot = await getDocs(logQuery);
                    logs = logSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log(`Fetched ${logs.length} workout logs`);
                    setWorkoutLog(logs);
                } catch (error) {
                    console.error("!!! Error fetching workout logs:", error);
                    fetchError = "Не вдалося завантажити журнал тренувань.";
                    setWorkoutLog([]);
                }
                try {
                    const validSelectedDate = selectedDietDate instanceof Date && !isNaN(selectedDietDate)
                                                ? selectedDietDate
                                                : new Date();

                    const startOfDay = new Date(validSelectedDate);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(validSelectedDate);
                    endOfDay.setHours(23, 59, 59, 999);

                    const dietQuery = query(
                        collection(db, "userDietItems"),
                        where("userId", "==", user.uid),
                        where("timestamp", ">=", Timestamp.fromDate(startOfDay)),
                        where("timestamp", "<=", Timestamp.fromDate(endOfDay)),
                         orderBy("timestamp", "asc")
                    );
                    const dietSnapshot = await getDocs(dietQuery);
                    dietItems = dietSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log(`Fetched ${dietItems.length} diet items for ${validSelectedDate.toLocaleDateString()}`);
                    setCurrentDiet(dietItems);
                } catch (error) {
                    console.error("!!! Error fetching diet items:", error);
                    fetchError = fetchError
                      ? `${fetchError} Також не вдалося завантажити раціон.`
                      : "Не вдалося завантажити раціон.";
                    setCurrentDiet([]);
                }
                 if (fetchError) {
                    setErrorLoadingData(fetchError);
                 }
            };
            fetchUserData();
        } else if (!loading && !user) {
             setWorkoutLog([]);
             setCurrentDiet([]);
             setErrorLoadingData(null);
        }
    }, [user, selectedDietDate, loading]);


    const addWorkoutLogEntry = useCallback(async (logEntry) => {
        if (!user || !user.uid) {
             console.error("User or user.uid is missing before saving workout log!");
             alert("Помилка: Не вдалося визначити користувача для збереження.");
             return;
        }
        console.log(`Saving workout log for user: ${user.uid}`);
        console.log("Attempting to add workout log:", logEntry);
        if (!db) {
              console.error("Firestore DB object is not initialized!");
              alert("Помилка: База даних не ініціалізована.");
              return;
            }
        try {
            const logWithUser = {
                ...logEntry,
                userId: user.uid,
                timestamp: Timestamp.now()
            };
            const docRef = await addDoc(collection(db, "userWorkoutLogs"), logWithUser);
            setWorkoutLog(prevLog => [{ id: docRef.id, ...logWithUser }, ...prevLog]);
            console.log("Workout log successfully added with ID: ", docRef.id);
        } catch (e) {
            console.error("!!! Error adding workout log to Firestore: ", e);
            alert(`Помилка збереження тренування: ${e.message}`);
        }
    }, [user]);

    const addDietItem = useCallback(async (dietItem) => {
        if (!user || !user.uid) {
             console.error("User or user.uid is missing before saving diet item!");
             alert("Помилка: Не вдалося визначити користувача для збереження.");
             return;
        }
         console.log(`Saving diet item for user: ${user.uid}`);
         const itemTimestamp = Timestamp.now();
         const itemWithUser = {
             ...dietItem,
             userId: user.uid,
             timestamp: itemTimestamp
         };
         console.log("Attempting to add diet item:", itemWithUser);
          if (!db) {
              console.error("Firestore DB object is not initialized!");
              alert("Помилка: База даних не ініціалізована.");
              return;
            }
         try {
            const docRef = await addDoc(collection(db, "userDietItems"), itemWithUser);
             const addedDate = itemTimestamp.toDate();
             const selectedDateStart = new Date(selectedDietDate);
             selectedDateStart.setHours(0, 0, 0, 0);
             const selectedDateEnd = new Date(selectedDietDate);
             selectedDateEnd.setHours(23, 59, 59, 999);

             if (addedDate >= selectedDateStart && addedDate <= selectedDateEnd) {
                setCurrentDiet(prevDiet => [...prevDiet, { id: docRef.id, ...itemWithUser }]);
             }
             console.log("Diet item added with ID: ", docRef.id);
         } catch (e) {
             console.error("!!! Error adding diet item to Firestore: ", e);
             alert(`Помилка збереження продукту: ${e.message}`);
         }
    }, [user, selectedDietDate]);

    const clearProgress = useCallback(async () => {
        if (!user) return;
        console.log(`Attempting to clear progress for user: ${user.uid}`);
         if (!db) {
              console.error("Firestore DB object is not initialized!");
              alert("Помилка: База даних не ініціалізована.");
              return;
            }
        try {
            const logQuery = query(collection(db, "userWorkoutLogs"), where("userId", "==", user.uid));
            const logSnapshot = await getDocs(logQuery);

            if (logSnapshot.empty) {
                 console.log("No workout logs found to clear.");
                 alert("Журнал тренувань вже порожній.");
                 return;
            }

            const batch = writeBatch(db);
            logSnapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            setWorkoutLog([]);
            console.log("User workout progress cleared from Firestore and state.");
            alert("Прогрес тренувань успішно очищено.");

        } catch (error) {
            console.error("Error clearing progress:", error);
            alert(`Не вдалося очистити прогрес: ${error.message}`);
        }
    }, [user]);

    const handleLogout = () => {
        signOut(auth).catch((error) => console.error("Logout Failed:", error));
    };

     const handleDietDateChange = (newDateString) => {
         const newDate = new Date(newDateString);
         if (!isNaN(newDate.getTime())) {
            setSelectedDietDate(newDate);
         } else {
             console.error("Invalid date string received:", newDateString);
             setSelectedDietDate(new Date());
         }
     };


    if (loading) {
        return <div>Завантаження автентифікації...</div>;
    }

    return (
        <Router>
            <div className="app">
                <Header user={user} handleLogout={handleLogout} clearProgress={clearProgress} />
                <main className="main-content">
                    {errorLoadingData && <div className="error-message data-loading-error">{errorLoadingData}</div>}

                    <Routes>
                         <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
                        <Route
                            path="/"
                            element={user ? <WorkoutSectionContainer addWorkoutLogEntry={addWorkoutLogEntry} workoutPrograms={workoutPrograms} /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/progress"
                            element={user ? <ProgressSectionContainer workoutLog={workoutLog} /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/diet"
                            element={user ? <DietSectionContainer
                                                currentDiet={currentDiet}
                                                addDietItem={addDietItem}
                                                selectedDate={selectedDietDate}
                                                onDateChange={handleDietDateChange}
                                            /> : <Navigate to="/login" />}
                        />
                        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}
function WorkoutSectionContainer({ addWorkoutLogEntry, workoutPrograms }) {
    return ( <WorkoutSection addWorkoutLogEntry={addWorkoutLogEntry} workoutsData={workoutPrograms} /> );
}

function ProgressSectionContainer({ workoutLog }) {
    return ( <ProgressSection workoutLog={workoutLog} /> );
}

function DietSectionContainer({ currentDiet, addDietItem, selectedDate, onDateChange }) {
    return ( <DietSection
                currentDiet={currentDiet}
                addDietItem={addDietItem}
                selectedDate={selectedDate}
                onDateChange={onDateChange}
              /> );
}

export default App;