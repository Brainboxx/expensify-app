import React, { useState, useEffect, useContext } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2'
import { AuthContext } from '../context/AuthContext';
import useAxios from '../utils/useAxios';

ChartJS.register(...registerables);

const AnalyticsComponent = () => {
    const api = useAxios()
    const {authTokens} = useContext(AuthContext)
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
        try {
            const response = await api.get('/analytics/', {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                }
            });
            setAnalyticsData(response.data);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        }
        };

        fetchAnalyticsData();
    }, []);

    return (
        <div className='analytics-container'>
          {analyticsData && (
            <div>
              <h2>Expense Statistics</h2>
              <p>Total Expenses: ${analyticsData.expense_statistics.total_expenses}</p>
    
              <h2>Budget Statistics</h2>
              <p>Total Budget: {analyticsData.budget_statistics.total_budgets}</p>
              <p>Total Spent: ${analyticsData.budget_statistics.total_spent}</p>
              <p>Total Balance: ${analyticsData.budget_statistics.total_balance}</p>
    
              <h2>Graph</h2>
              <Bar
                data={{
                  labels: ['Total Spent', 'Total Balance'],
                  datasets: [
                    {
                      label: 'Budget Statistics',
                      data: [analyticsData.budget_statistics.total_spent, analyticsData.budget_statistics.total_balance],
                      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          )}
        </div>
      );;
};

export default AnalyticsComponent;
