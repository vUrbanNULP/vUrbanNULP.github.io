import React, { useState } from 'react';
import './DietForm.css';

function DietForm({ onAddItem }) {
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (foodName === '' || calories === '') {
            alert('Будь ласка, заповніть всі поля.');
            return;
        }

        if (isNaN(calories) || parseFloat(calories) <= 0) {
            alert('Калорії повинні бути додатним числом.');
            return;
        }

        const dietItem = { name: foodName, calories: parseFloat(calories) };
        onAddItem(dietItem);
        setFoodName('');
        setCalories('');
    };

    return (
        <form id="diet-form" className="diet-form" onSubmit={handleSubmit}>
            <label htmlFor="food-name">Назва продукту:</label>
            <input
                type="text"
                id="food-name"
                name="food-name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
            /><br /><br />

            <label htmlFor="calories">Калорії:</label>
            <input
                type="number"
                id="calories"
                name="calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
            /><br /><br />

            <button className="button-primary" type="submit">Додати до раціону</button>
        </form>
    );
}

export default DietForm;