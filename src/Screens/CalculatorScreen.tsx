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
import { ExportExcel } from "../Components/ExportExcel";

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
    name: "slidingDoorCost",
    label: "Sliding Door cost",
    type: "number",
  },
  {
    name: "slidingTwoFixedCost",
    label: "Sliding Two Fixed cost",
    type: "number",
  },
  {
    name: "slidingTwoAwningCost",
    label: "Sliding Two Awning cost",
    type: "number",
  },
  {
    name: "slidingTwoDoorCost",
    label: "Sliding Two Door cost",
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
  {
    name: "glassPrice",
    label: "Glass Price",
    type: "number",
  },
  {
    name: "acessoriesPrice",
    label: "Acessories Price",
    type: "number",
  },
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

  const onSubmit = useCallback((data: any) => {
    console.log("submit data ", data);

    ExportExcel(data);
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
          {/* <Button onClick={() => append({ count: 1 })}>Add a window</Button> */}
          <div className="flex space-x-3">
            <Button onClick={onCancel}>Cancel</Button>
            <Button htmlType="submit">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
