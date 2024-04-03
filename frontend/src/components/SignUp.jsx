import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function SignUp() {
    const { registerUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const password2 = e.target.password2.value;

        setLoading(true);

        try {
            await registerUser(firstName, lastName, email, password, password2);
        } catch (error) {
            console.error('Error during registration:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='register-container'>         
            <form className='register-form' onSubmit={handleSubmit}>
                <label htmlFor='firstName'>First Name:</label>
                <input name='firstName' type='text' placeholder='John'/>
                <label htmlFor='lastName'>Last Name:</label>
                <input name='lastName' type='text' placeholder='Doe'/>
                <label htmlFor='email'>Email:</label>
                <input name='email' type='email' placeholder='abc@example.com'/>
                <label htmlFor='password'>Password:</label>
                <input name='password' type='password' placeholder='Enter your password...' />
                <label htmlFor='password2'>Confirm Password</label>
                <input name='password2' type='password' placeholder='Re-Enter password' />
                <button type='submit' disabled={loading}> 
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <span>Already have an account? <Link to="/login">Login</Link></span>
            </form>
        </div>
    );
}

export default SignUp;
