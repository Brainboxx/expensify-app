import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { loginUser, error } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        setLoading(true); 

        try {
            await loginUser(email, password);
        } catch (error) {
            console.error('Error during login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-container'>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <span>Don't have an account? <Link to="/register">Register</Link></span>
            </form>
        </div>
    );
};

export default Login;
