import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CountriesPage from "./pages/CountriesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CountriesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
