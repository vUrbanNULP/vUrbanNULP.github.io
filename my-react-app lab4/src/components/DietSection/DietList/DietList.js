import React from 'react';
import './DietList.css';

function DietList({ currentDiet }) {

    let totalCalories = 0;
    if (currentDiet && currentDiet.length > 0) {
        totalCalories = currentDiet.reduce((sum, item) => {
            const calories = Number(item.calories);
            return sum + (isNaN(calories) ? 0 : calories);
        }, 0);
    }

    return (
        <ul id="diet-list" className="diet-list-ul">
            {currentDiet.length === 0 ? (
                <li>Ваш раціон на цю дату порожній.</li>
            ) : (
                currentDiet.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.calories} калорій
                    </li>
                ))
            )}
            {currentDiet.length > 0 && (
                <li className="total-calories">
                    Загальна кількість калорій: {totalCalories}
                </li>
            )}
        </ul>
    );
}

export default DietList;