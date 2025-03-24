import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
    return (
        <nav className="navigation">
            <ul>
                <li><Link to="/">Тренування</Link></li>
                <li><Link to="/progress">Мій Прогрес</Link></li>
                <li><Link to="/diet">Раціон</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;