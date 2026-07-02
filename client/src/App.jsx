import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Protected route for users
const UserRoute= ({children})=>{
    const {user}= useAuth();
    if(!user){
        return <Navigate to="/user/login" />;
    }
    if(user.role !== "user"){
        return <Navigate to="/" />;
    }
    return children;
};

// Protected route for admins
const AdminRoute= ({children})=>{
    const {user}= useAuth();
    if(!user){
        return <Navigate to="/admin/login" />;
    }
    if(user.role !== "admin"){
        return <Navigate to="/" />;
    }
    return children;
};


function App(){
    return(
        <BrowserRouter>
        <Routes>
            {/* Public routes */}
            <Route path="/" element= {<LandingPage/>} />
            <Route path="/user/login" element={<UserLogin/>} />
            <Route path="/user/register" element={<UserRegister/>} />
            <Route path="/admin/login" element={<AdminLogin />} />

             {/* Protected user routes, Wrapped around UserRoute component */}
             <Route path="/user/dashboard" element={ <UserRoute> <UserDashboard/>  </UserRoute>} />
             <Route path="/admin/dashbaord" element={<AdminRoute> <AdminDashboard/> </AdminRoute>} />

             {/* Catch all - redirect to home */}
             <Route path="*" element={<Navigate to="/" />} />
            
        </Routes>
        </BrowserRouter>
    )
};


export default App;
