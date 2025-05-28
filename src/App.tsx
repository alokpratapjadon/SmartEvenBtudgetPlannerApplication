import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import NewEvent from './pages/NewEvent';
import AddExpense from './pages/AddExpense';
import Payments from './pages/Payments';
import LoadingScreen from './components/common/LoadingScreen';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/dashboard\" element={<Dashboard />} />
            <Route path="/events/new" element={<NewEvent />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/events/:eventId/expenses/new" element={<AddExpense />} />
            <Route path="/events/:eventId/payments" element={<Payments />} />
            <Route path="*" element={<Navigate to="/dashboard\" replace />} />
          </>
        ) : (
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/signin\" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;