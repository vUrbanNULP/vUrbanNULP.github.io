import React from 'react';
import DietForm from './DietForm/DietForm';
import DietList from './DietList/DietList';
import './DietSection.css';

function DietSection({ currentDiet, addDietItem }) {

    return (
        <section id="diet" className="diet-section">
            <h2>Раціон</h2>
            <p>Плануйте свій щоденний раціон та відслідковуйте калорії.</p>

            <div id="diet-form-container" className="diet-form-container">
                <h3>Додати продукт до раціону</h3>
                <DietForm onAddItem={addDietItem} />
            </div>

            <div id="diet-plan" className="diet-plan">
                <h3>Сьогоднішній раціон</h3>
                <DietList currentDiet={currentDiet} />
            </div>
        </section>
    );
}

export default DietSection;