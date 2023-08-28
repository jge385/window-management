import React from "react";
import { ReadExcel } from "../Import/ReadExcel";
import { Button } from "antd";

export default function CalculatorScreen() {
  return (
    <div className="p-3">
      <div className="flex justify-center mb-5">
        <header className="text-3xl font-bold">
          New Project
        </header>
      </div>
      <div className="grid grid-cols-12"> </div>
    </div>
  );
}
