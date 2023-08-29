import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWindowTypeExcel,
  WindowTypeExcel,
} from "../Context/WindowTypeExcelProvider";
import { Select } from "antd";
import { Typography, Input } from "antd";
import { Controller, Control, UseFormSetValue } from "react-hook-form";

const { Text } = Typography;

// const selectFormValues = [
//   {
//     name: "h" + i,
//     label: "h" + i,
//     type: "number",
//   },
// ];

export interface FormValueItem {
  name: string;
  label: string;
  type: string;
}

const presetFormValues: FormValueItem[] = [
  {
    name: "Height",
    label: "Height",
    type: "number",
  },
  {
    name: "Width",
    label: "Width",
    type: "number",
  },
];

const presetFormValueNames = presetFormValues.map((formValue) => {
  return formValue.name;
});

const calculatedFormValues = [
  {
    name: "AluminiumPrice",
    label: "Aluminium Price",
    type: "number",
    formula: true,
  },
];

export default function WindowTypesRow({
  control,
  index,
  setValue,
}: {
  control: Control;
  index: number;
  setValue: UseFormSetValue<any>;
}) {
  const { windowTypesExcel } = useWindowTypeExcel();

  const windowTypeOptions = useMemo(() => {
    return windowTypesExcel.map((windowType) => {
      return {
        label: windowType.TypeName,
        value: windowType.TypeName,
      };
    });
  }, []);

  const [selectedWindowTypeOption, setSelectedWindowTypeOption] =
    useState<WindowTypeExcel>(windowTypesExcel[0]);

  const handleOnChangeSelect = useCallback((value: string) => {
    const option = windowTypesExcel.find((type) => type.TypeName === value);
    setSelectedWindowTypeOption(option!);
  }, []);

  console.log("selectedWindowTypeOption ", selectedWindowTypeOption);

  const windowTypeRow = useMemo(() => {
    const rowProperties = [];
    for (let i = 1; i <= selectedWindowTypeOption.HeightCount; i++) {
      rowProperties.push({
        name: "h" + i,
        label: "h" + i,
        type: "number",
      });
    }
    for (let i = 1; i <= selectedWindowTypeOption.WidthCount; i++) {
      rowProperties.push({ name: "w" + i, label: "w" + i, type: "number" });
    }
    return [...presetFormValues, ...rowProperties, ...calculatedFormValues];
  }, [selectedWindowTypeOption]);
  console.log("windowTypeRow ", windowTypeRow);
  console.log("selectedWindowTypeOption ", selectedWindowTypeOption);

  useEffect(() => {
    presetFormValueNames.forEach((name) => {
      setValue(
        name + index,
        selectedWindowTypeOption[name as keyof WindowTypeExcel]
      );
    });
  }, [selectedWindowTypeOption]);

  return (
    <div className="w-full flex items-center space-x-2">
      <div>
        <Text> Window Type </Text>
        <Select
          options={windowTypeOptions}
          value={selectedWindowTypeOption.TypeName}
          onChange={handleOnChangeSelect}
        />
      </div>

      {windowTypeRow.map((row) => {
        return (
          <div>
            <Text> {row.label} </Text>
            <Controller
              name={row.name + index}
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    // defaultValue={
                    //   presetFormValueNames.includes(row.name)
                    //     ? selectedWindowTypeOption[
                    //         row.name as keyof WindowTypeExcel
                    //       ]
                    //     : field.value
                    // }
                    value={field.value}
                    onChange={field.onChange}
                    type={row.type}
                    disabled={presetFormValueNames.includes(row.name)}
                  />
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
