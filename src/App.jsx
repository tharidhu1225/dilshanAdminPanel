import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminHomePage from "./Pages/adminHomePage";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./Pages/loginPage";
import RegisterPage from "./Pages/register";

export default function App() {
  return (
   <div className='bg-white'>
     <BrowserRouter>
      <Toaster position='top-right'/>
      <GoogleOAuthProvider clientId='189763067099-27hgu3rbnq2o0jkudi9o0d2nti6k0kr7.apps.googleusercontent.com'>
      <Routes path="/*">      
        <Route path="/*" element={<AdminHomePage/>}/>  
        <Route path="login" element={<LoginPage/>}/> 
        <Route path="/register" element={<RegisterPage/>}/>      
      </Routes>
      </GoogleOAuthProvider>
     </BrowserRouter>
    </div>
  )
}