import React, { useCallback, useState } from "react";
import { Button, Input, Select } from "antd";
import { Typography, Divider } from "antd";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  Controller,
} from "react-hook-form";
import WindowTypesRow from "../Components/WindowTypesRow";
import { useNavigate } from "react-router-dom";
import { ExportExcel, ExportInternalExcel } from "../Components/ExportExcel";
import { useStoredData } from "../Context/StoredDataProvider";
import { ExportJson } from "../Components/ExportJson";

const { Title, Text } = Typography;

const SharedFormValues = [
  {
    name: "projectName",
    label: "Project Name",
    type: "text",
  },
  {
    name: "color",
    label: "Color",
    type: "text",
  },
  {
    name: "windZone",
    label: "Wind Zone",
    type: "select",
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
    name: "slidingCost",
    label: "Sliding Cost",
    type: "number",
  },
  {
    name: "slidingTwoCost",
    label: "Sliding Two Cost",
    type: "number",
  },
  {
    name: "doorCost",
    label: "Door cost",
    type: "number",
  },
  {
    name: "JHLinea",
    label: "JH linea",
    type: "number",
  },
  {
    name: "JHOblique",
    label: "JH oblique",
    type: "number",
  },
  {
    name: "brick",
    label: "brick veneer",
    type: "number",
  },
  { name: "revelCost", label: "Revel Cost", type: "number" },
  { name: "flashingCost", label: "Flashing Cost", type: "number" },
  { name: "supportingBarCost", label: "Supporting Bar Cost", type: "number" },
  { name: "waterBoxCost", label: "Water Box Cost", type: "number" },
];

const windZoneSelectOptions = [
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
  {
    value: "Very High",
    label: "Very High",
  },
  {
    value: "Extra High",
    label: "Extra High",
  },
  {
    value: "Specific Engineering Design",
    label: "Specific Engineering Design",
  },
];

export default function CalculatorScreen() {
  const { storedData } = useStoredData();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>({
    defaultValues: storedData || {},
    mode: "onChange",
  });

  const formData = useWatch({ control });

  const navigate = useNavigate();

  const onCancel = useCallback(() => {
    navigate(-1);
  }, []);

  const onSubmit = useCallback((data: any) => {
    console.log("submit data ", data);

    ExportExcel(data);
  }, []);

  const { fields, append, remove } = useFieldArray({
    name: "window",
    control,
  });

  const onSaveDraft = useCallback(() => {
    ExportJson(formData);
  }, [formData]);

  const onExportInternalExcel = useCallback(() => {
    ExportInternalExcel(formData);
  }, [formData]);

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
                    if (!field.value && sharedFormValue.type === "select") {
                      field.onChange(windZoneSelectOptions[0].value);
                    }
                    return sharedFormValue.type === "select" ? (
                      <Select
                        options={windZoneSelectOptions}
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    ) : (
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
                <Divider />
              </div>
            );
          })}
        </div>
        <div className="w-full flex justify-between space-x-3 mt-3 px-5">
          <Button
            onClick={() =>
              append({
                count: 1,
              })
            }
          >
            Add a window
          </Button>
          <div className="flex space-x-3">
            <Button onClick={onCancel}>Cancel</Button>{" "}
            <Button htmlType="button" onClick={onSaveDraft}>
              Save draft
            </Button>
            <Button htmlType="button" onClick={onExportInternalExcel}>
              Export internal excel
            </Button>
            <Button htmlType="submit">Export final excel</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
