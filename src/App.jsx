import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PatternDetail from "./pages/PatternDetail";

function App() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<Layout />}>
<Route index element={<Home />} />
<Route path="pattern/:id" element={<PatternDetail />} /> </Route> </Routes> </BrowserRouter>
);
}

export default App;
