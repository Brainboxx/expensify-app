import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const api = useAxios()
  const { logoutUser, authTokens } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  if (authTokens){
    const decode = jwtDecode(authTokens.access)
    var first_name = decode.first_name
  }

  useEffect(() => {
    let fetchExpenses = async () => {
      try {
        const response = await api.get('/expenses', {
          headers:{
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });
        setExpenses(response.data);
        setLoading(false);
      } catch(error) {
        console.error(error);
        setError('Error fetching expenses. Please try again later.');
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [authTokens.access])

  useEffect(() => {
    let fetchBudgets = async () => {
      try {
        const response = await api.get('/budgets', {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          }
        });
        setBudgets(response.data);
        setLoading(false);
      }
      catch(error){
        console.error(error)
        setError('Error fetching budgets. Please try again');
        setLoading(false);
      }
    };
    fetchBudgets()
  }, [authTokens.access])

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch(error){
      console.error(error);
    }
  }


  return (
    <div className='dashboard-container'>
      <h2>Hello {first_name} Welcome to your Dashboard</h2>
      {loading ? (
        <p>loading...</p>
      ): (
        <div>
          <button onClick={handleLogout} className='logout-button'>Logout</button>
          <Link to="/add-expense">Add Expense</Link>
          <Link to="/add-budget">Add Budget</Link>
          <Link to="/analytics">View Analytics</Link>
          <div>
          <h3>Expense List</h3>
          {expenses.length === 0 ? 
          <p>Your expenses will appear here</p> : 
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Initial Budget</th>
                <th>spent</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice().reverse().map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category_name}</td>
                  <td>${expense.amount}</td>
                  <th>${expense.budget_amount}</th>
                  <th>${expense.budget_spent}</th>
                </tr>
              ))}
            </tbody>
          </table>}
          
          </div>
          <div>
            <h3>Budget List</h3>
            {budgets.length === 0 ?
             <p>Your budgets will appear here</p> : 
              <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Initial Budget</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {budgets.slice().reverse().map((budget) => (
                  <tr key={budget.id}>
                    <td>{budget.name}</td>
                    <td>${budget.amount}</td>
                    <td>${budget.current_balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            }
            
          </div>
        </div>
        
      )}
    </div>
  )
}

export default Dashboard