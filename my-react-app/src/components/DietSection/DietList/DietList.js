import React from 'react';
import './DietList.css';

function DietList({ currentDiet }) {

    let totalCalories = 0;
    if (currentDiet && currentDiet.length > 0) {
        totalCalories = currentDiet.reduce((sum, item) => sum + item.calories, 0);
    }

    return (
        <div id="diet-plan" className="diet-plan">
            <ul id="diet-list" className="diet-list-ul">
                {currentDiet.length === 0 ? (
                    <li>Ваш раціон порожній.</li>
                ) : (
                    currentDiet.map((item, index) => (
                        <li key={index}>
                            {item.name} - {item.calories} калорій
                        </li>
                    ))
                )}
                {currentDiet.length > 0 && (
                    <li>
                        Загальна кількість калорій: {totalCalories}
                    </li>
                )}
            </ul>
        </div>
    );
}

export default DietList;