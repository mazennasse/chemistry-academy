import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import StudentLecture from './pages/StudentLecture.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App(){return <BrowserRouter><AuthProvider><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route element={<ProtectedRoute role="student"/>}><Route path="/student" element={<StudentDashboard/>}/><Route path="/student/lectures/:id" element={<StudentLecture/>}/></Route><Route element={<ProtectedRoute role="admin"/>}><Route path="/admin" element={<AdminDashboard/>}/></Route><Route path="*" element={<Home/>}/></Routes></AuthProvider></BrowserRouter>}
