import React, { useCallback, useState } from "react";
import { ReadExcel } from "../Components/ReadExcel";
import { Button, Input } from "antd";
import { Typography } from "antd";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  Controller,
} from "react-hook-form";

const { Title, Text } = Typography;

interface CalculatorFormValues {
  projectName: string;
}

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
  } = useForm<any>({
    defaultValues: {},
    mode: "onBlur",
  });

  const onSubmit = useCallback((data: any) => {
    console.log(data);
  }, []);

  return (
    <div className="p-3">
      <div className="flex justify-center mb-5">
        <Title>New Project</Title>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-4 items-center">
          {SharedFormValues.map((sharedFormValue) => {
            return (
              <div>
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
        <Button htmlType="submit" className="mt-3">
          Submit
        </Button>
      </form>
    </div>
  );
}
