import React, { useCallback } from "react";
import { ReadExcel } from "../Components/ReadExcel";
import { Button, Typography } from "antd";
import { useWindowTypeExcel } from "../Context/WindowTypeExcelProvider";
import WindowTypesTable from "../Components/WindowTypesTable";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function HomeScreen() {
  const { windowTypesExcel } = useWindowTypeExcel();

  const navigate = useNavigate();

  const redirectToCalculator = useCallback(() => {
    navigate("/calculator");
  }, []);

  return (
    <div className="p-3 space-y-5">
      <div className="flex justify-center">
        <Title>Window Cost Calculator v0.1</Title>
      </div>
      <div className="flex justify-center space-x-2">
        <Button
          disabled={windowTypesExcel.length === 0}
          onClick={redirectToCalculator}
        >
          New Project
        </Button>
        <ReadExcel />
      </div>
      <WindowTypesTable />
    </div>
  );
}
