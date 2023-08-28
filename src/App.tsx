import React from "react";
import { ReadExcel } from "./Import/ReadExcel";
import { Button } from "antd";
import HomeScreen from "./Screens/HomeScreen";
import CalculatorScreen from "./Screens/CalculatorScreen";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/calculator" element={<CalculatorScreen />} />
    </Routes>
  );
}
