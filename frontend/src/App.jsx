import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import { Toaster } from 'react-hot-toast'
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import Dashboard from './admin/Dashboard'
import OurCourses from './admin/OurCourses'
import CourseCreate from './admin/CourseCreate'
import UpdateCourses from './admin/UpdateCourses'
import AdminLogin from './admin/AdminLogin'
import AdminSignup from './admin/AdminSignup'
import Module from './components/Module'

function App() {
  //user private route
  const UserPrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
  
    useEffect(() => {
      const token = JSON.parse(localStorage.getItem("user"));
      setIsAuthenticated(!!token);
    }, []);
  
    if (isAuthenticated === null) {
      return <div className="text-white text-center">Checking access...</div>;
    }
  
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  //admin private route
  const AdminPrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
  
    useEffect(() => {
      const token = JSON.parse(localStorage.getItem("admin"));
      setIsAuthenticated(!!token);
    }, []);
  
    if (isAuthenticated === null) {
      return <div className="text-white text-center">Checking access...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  return (
    <div>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Add the new routes here */}
          <Route path="/all" element={<Courses/>} />
          <Route path="/buy/:courseId" element={<Buy />} />
          {/* <Route path="/purchases" element={user?<Purchases /> : <Navigate to="/login" />} /> */}
          <Route path="/purchases" element={ <UserPrivateRoute> <Purchases /> </UserPrivateRoute>} />


          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} /> 
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={ <AdminPrivateRoute> <Dashboard /> </AdminPrivateRoute>} />
          <Route path="/admin/our-courses" element={<OurCourses />} />
          <Route path="/admin/create-course" element={<CourseCreate />} />
          <Route path="/admin/update-course/:id" element={<UpdateCourses />} />

          {/* Add more routes as needed */}
          <Route path="/module/:courseId" element={<Module />} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App