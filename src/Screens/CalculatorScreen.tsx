import React, { useCallback, useState } from "react";
import { Button, Input } from "antd";
import { Typography } from "antd";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  Controller,
} from "react-hook-form";
import WindowTypesRow from "../Components/WindowTypesRow";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";

const { Title, Text } = Typography;

const SharedFormValues = [
  {
    name: "projectName",
    label: "Project Name",
    type: "text",
  },
  {
    name: "fixedCost",
    label: "Fixed Cost",
    type: "number",
  },
  {
    name: "awningCost",
    label: "Awning Cost",
    type: "number",
  },
  {
    name: "slidingFixedCost",
    label: "Sliding Fixed Cost",
    type: "number",
  },
  {
    name: "slidingAwningCost",
    label: "Sliding Awning Cost",
    type: "number",
  },
  {
    name: "glassPrice",
    label: "Glass Price",
    type: "number",
  },
  {
    name: "revel",
    label: "Revel",
    type: "number",
  },
];

export default function CalculatorScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>({
    defaultValues: {},
    mode: "onBlur",
  });

  const navigate = useNavigate();

  const onCancel = useCallback(() => {
    navigate(-1);
  }, []);

  const onSubmit = useCallback(async (data1: any) => {
    console.log("submit data ", data1);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.columns = [
      { header: "Name", key: "name", width: 15 },
      { header: "Age", key: "age", width: 10 },
      // Add more columns as needed
    ];

    const data = [
      { name: "John", age: 30 },
      { name: "Jane", age: 25 },
      // Add more rows as needed
    ];

    data.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    a.click();

    URL.revokeObjectURL(url);
  }, []);

  const { fields, append, remove } = useFieldArray({
    name: "window",
    control,
  });

  console.log("fields ", fields);

  return (
    <div className="p-3">
      <div className="flex justify-center mb-5">
        <Title>New Project</Title>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-4 items-center">
          {SharedFormValues.map((sharedFormValue) => {
            return (
              <div key={sharedFormValue.name}>
                <Text> {sharedFormValue.label} </Text>
                <Controller
                  name={sharedFormValue.name}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        type={sharedFormValue.type}
                      />
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-8 gap-2 items-center mt-3">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="col-span-8">
                <WindowTypesRow
                  control={control}
                  index={index}
                  setValue={setValue}
                  removeRow={remove}
                />
              </div>
            );
          })}
        </div>
        <div className="w-full flex justify-between space-x-3 mt-3 px-5">
          <Button onClick={() => append({ count: 1 })}>Add a window</Button>
          <div className="flex space-x-3">
            <Button onClick={onCancel}>Cancel</Button>
            <Button htmlType="submit">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
