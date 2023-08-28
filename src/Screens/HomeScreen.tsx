import React from "react";
import { ReadExcel } from "../Import/ReadExcel";
import { Button } from "antd";

export default function HomeScreen() {
  return (
    <div className="p-3">
      <div className="flex justify-center mb-5">
        <header className="text-3xl font-bold">
          Window Cost Calculator v0.1
        </header>
      </div>
      <div className="flex justify-between">
        <Button type="primary"> New Project </Button>
        <ReadExcel />
      </div>
    </div>
  );
}
