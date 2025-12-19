import React from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profiles from "./pages/Profiles";
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header';

function App() {
  return (
    <>
      <Header></Header>
      <main>
        <Routes>
          <Route path="/" element={ <Home/>} />
          <Route path="/login" element={ <Login/>} />
          <Route path="/register" element={ <Register/>} />
          <Route path="/profile" element={ <ProtectedRoute><Profiles/></ProtectedRoute>} />
        </Routes>
      </main>        
    </>
  );
}

export default App
