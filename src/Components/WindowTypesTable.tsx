import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { WindowTypeExcel } from "../Context/WindowTypeExcelProvider";
import { useWindowTypeExcel } from "../Context/WindowTypeExcelProvider";

const columns: ColumnsType<WindowTypeExcel> = [
  {
    title: "Type",
    dataIndex: "TypeName",
    key: "TypeName",
  },
  {
    title: "Height in mm",
    dataIndex: "Height",
    key: "Height",
  },
  {
    title: "Width in mm",
    dataIndex: "Width",
    key: "Width",
  },
  {
    title: "Height Count ",
    dataIndex: "HeightCount",
    key: "HeightCount",
  },
  {
    title: "Width Count",
    dataIndex: "WidthCount",
    key: "WidthCount",
  },
  {
    title: "Window Count",
    dataIndex: "WindowCount",
    key: "WindowCount",
  },
  {
    title: "Aluminium Price Formula",
    dataIndex: "AluminiumPriceFormula",
    key: "AluminiumPriceFormula",
  },
  {
    title: "Glass Formula",
    dataIndex: "GlassFormula",
    key: "GlassFormula",
  },
  {
    title: "Acessories Formula",
    dataIndex: "AcessoriesFormula",
    key: "AcessoriesFormula",
  },
];

export default function WindowTypesTable() {
  const { windowTypesExcel } = useWindowTypeExcel();
  return <Table columns={columns} dataSource={windowTypesExcel} />;
}
