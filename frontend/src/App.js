import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Quiz from './pages/Quiz';
import Welcome from './pages/Welcome';
import StudentDashboard from './pages/StudentDashboard'; // (ANALYSIS)
import Roadmap from './pages/Roadmap';        // New Page
import Benchmarks from './pages/Benchmarks';    // New Page
import History from './pages/History';          // New Page
import SimulatorQuiz from './pages/SimulatorQuiz';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
                <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
                
                {/* Independent Feature Pages */}
                <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                <Route path="/benchmarks" element={<ProtectedRoute><Benchmarks /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/simulator-quiz" element={<ProtectedRoute><SimulatorQuiz /></ProtectedRoute>} />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}
export default App;