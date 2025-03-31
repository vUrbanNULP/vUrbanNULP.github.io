import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Будь ласка, введіть email та пароль.');
            return;
        }

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                console.log("Logged in successfully");
                navigate('/');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                console.log("User created successfully");
                navigate('/');
            }
        } catch (err) {
            console.error("Authentication error:", err.code, err.message);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                 setError('Неправильний email або пароль.');
            } else if (err.code === 'auth/email-already-in-use') {
                 setError('Цей email вже використовується.');
            } else if (err.code === 'auth/weak-password') {
                 setError('Пароль повинен містити щонайменше 6 символів.');
            }
             else {
                setError('Помилка автентифікації. Спробуйте ще раз.');
             }
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="button-primary">
                    {isLogin ? 'Увійти' : 'Зареєструватися'}
                </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
                {isLogin ? 'Немає акаунту? Зареєструватися' : 'Вже є акаунт? Увійти'}
            </button>
        </div>
    );
}

export default Auth;