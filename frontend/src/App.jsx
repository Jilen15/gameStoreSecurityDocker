import React from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from './components/Header';

function App() {
  return (
    <>
      <Header></Header>
      <main>
        <Routes>
          <Route path="/" element={ <Home/>} />
        </Routes>
      </main>        
    </>
  );
}

export default App
