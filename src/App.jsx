import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeeManagement from './pages/FeeManagement';
import OrderCalculator from './pages/OrderCalculator';
import OrderResult from './pages/OrderResult';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fee-management" element={<FeeManagement />} />
        <Route path="/order-calculator" element={<OrderCalculator />} />
        <Route path="/order-result" element={<OrderResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
