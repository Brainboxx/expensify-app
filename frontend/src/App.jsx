import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import AddBudget from './components/AddBudget';
import SignUp from './components/SignUp';
import AnalyticsComponent from './components/Analytics';
import HomePage from './components/HomePage';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
              <Route path='/' element={<HomePage />} exact/>
              <Route path="/login" element={<Login />}/>
              <Route path='/register' element={<SignUp />}/>
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={< Dashboard />}/>
                <Route path="/add-expense" element={<AddExpense />}/>
                <Route path='/add-budget' element={<AddBudget />}/>
                <Route path='/analytics' element={<AnalyticsComponent />}/>
              </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
