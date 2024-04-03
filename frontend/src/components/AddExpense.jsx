import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useAxios from '../utils/useAxios';
import { AuthContext } from '../context/AuthContext';

function AddExpense() {
    const api = useAxios();
    const { authTokens } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    if (authTokens) {
        const decode = jwtDecode(authTokens.access);
        var user_id = decode.user_id;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();

    const [date, setDate] = useState(currentDate);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedBudgetId, setSelectedBudgetId] = useState('');
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await api.get('budgets/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`
                    }
                });
                setBudgets(response.data);
            } catch (error) {
                console.error(error);
                alert('An error occurred while fetching budgets, please try again');
            }
        };

        fetchBudgets();
    }, [authTokens.access]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); 

        const expense = {
            user: user_id,
            date,
            description,
            amount,
            category: selectedBudgetId,
        };
        try {
            await api.post('expenses/', expense, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                }
            })
            navigate('/dashboard')
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding expense, please try again');
        } finally {
            setLoading(false);
        };
    };

    return (
        <div className='expense-form-container'>
            <form onSubmit={handleSubmit}>
                <label htmlFor='category'>Select a category:</label>
                <select value={selectedBudgetId} onChange={(e) => setSelectedBudgetId(e.target.value)} required>
                    <option value="">Select Budget</option>
                    {budgets.map(budget => (
                        <option key={budget.id} value={budget.id}>{budget.name}</option>
                    ))}
                </select>
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <label htmlFor='description'>Description:</label>
                <textarea
                    type='text'
                    name='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    {loading ? 'Adding Expense...' : 'Add expense'}
                </button>
            </form>
        </div>
    )
}
export default AddExpense;
