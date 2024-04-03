import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';

function AddBudget(){
    const api = useAxios()
    const {user, authTokens} = useContext(AuthContext);

    const currentDate = new Date().toISOString().split('T')[0];
    const navigate = useNavigate()

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const budgetData = {
            user: user.id,
            name,
            amount,
        };
        try{
            await api.post('budgets/', budgetData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                }
            })
            navigate('/dashboard');
        } catch(error){
            console.error(error);
            alert('An error occurred while adding expense, please try again');
        } finally{
            setLoading(false)
        };
    };

    return (
        <div className='budget-form-container'>
            <form onSubmit={handleSubmit}>
                <label htmlFor='name'>Budget Name:</label>
                <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
                <label htmlFor='amount'>Amount:</label>
                <input 
                type='number'
                name='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                />
                <button type='submit' disabled={loading}>
                    {loading ? 'Adding Budget...' : 'Add budget'}
                </button>
            </form>
        </div>
    )
}
export default AddBudget