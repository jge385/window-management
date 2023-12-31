import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { WindowTypeExcel } from "../Context/WindowTypeExcelProvider";
import { useWindowTypeExcel } from "../Context/WindowTypeExcelProvider";

const columns: ColumnsType<WindowTypeExcel> = [
  {
    title: "Type",
    dataIndex: "TypeName",
  },
  {
    title: "Height Count ",
    dataIndex: "HeightCount",
  },
  {
    title: "Width Count",
    dataIndex: "WidthCount",
  },
  {
    title: "Window Count",
    dataIndex: "WindowCount",
  },
  {
    title: "Aluminium Formula",
    dataIndex: "AluminiumFormula",
  },
];

export default function WindowTypesTable() {
  const { windowTypesExcel } = useWindowTypeExcel();
  return (
    <Table
      columns={columns}
      dataSource={windowTypesExcel}
      rowKey={(item) => item.TypeName}
    />
  );
}
