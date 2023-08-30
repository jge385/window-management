import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWindowTypeExcel,
  WindowTypeExcel,
} from "../Context/WindowTypeExcelProvider";
import { Button, Select } from "antd";
import { Typography, Input } from "antd";
import {
  Controller,
  Control,
  useWatch,
  UseFormSetValue,
} from "react-hook-form";
import {
  convertStringToFormula,
  extractFunctionParams,
  containDigit,
} from "../Utilities/ConvertStringFormula";

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
  formula?: boolean;
}

const houseInfoFormValues = [
  {
    name: "lot",
    label: "Lot",
    type: "string",
  },
  {
    name: "floor",
    label: "Floor",
    type: "string",
  },
];

const calculatedFormValues = [
  {
    name: "AluminiumFormula",
    label: "Aluminium Price",
    type: "number",
    formula: true,
  },
  {
    name: "GlassFormula",
    label: "Glass Price",
    type: "number",
    formula: true,
  },
  {
    name: "AcessoriesFormula",
    label: "Acessories Price",
    type: "number",
    formula: true,
  },
];

const calculatedFormValueNames = calculatedFormValues.map(
  (formValue) => formValue.name
);

export default function WindowTypesRow({
  control,
  index,
  setValue,
}: {
  control: Control;
  index: number;
  setValue: UseFormSetValue<any>;
}) {
  const rowData = useWatch({ control });
  console.log("rowData", rowData);

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
    return [...rowProperties, ...calculatedFormValues];
  }, [selectedWindowTypeOption]);

  return (
    <div className="w-full flex items-center space-x-2">
      {houseInfoFormValues.map((row: FormValueItem) => {
        return (
          <div>
            <Text> {row.label} </Text>
            <Controller
              name={row.name + index}
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    type={row.type}
                  />
                );
              }}
            />
          </div>
        );
      })}

      <div>
        <div className="w-full">
          <Text> Window Type </Text>
        </div>
        <Select
          options={windowTypeOptions}
          value={selectedWindowTypeOption.TypeName}
          onChange={handleOnChangeSelect}
        />
      </div>
      {windowTypeRow.map((row: FormValueItem) => {
        let variables: string[] = [];
        let result: number;
        if (row.formula) {
          const realFormula = convertStringToFormula(
            selectedWindowTypeOption[
              row.name as keyof WindowTypeExcel
            ] as string,
            selectedWindowTypeOption.WidthCount,
            selectedWindowTypeOption.HeightCount
          );
          variables = extractFunctionParams(realFormula);
          const params = variables.map((variable) => {
            return Number(
              rowData[containDigit(variable) ? variable + index : variable]
            );
          });
          result = realFormula(...params);
        }
        return (
          <div>
            <Text> {row.label} </Text>
            <Controller
              name={row.name + index}
              control={control}
              render={({ field }) => {
                if (result && field.value !== result) {
                  field.onChange(result);
                }
                return (
                  <Input
                    value={result || field.value}
                    onChange={field.onChange}
                    type={row.type}
                    disabled={row.formula}
                    placeholder={
                      row.formula
                        ? (selectedWindowTypeOption[
                            row.name as keyof WindowTypeExcel
                          ] as string)
                        : ""
                    }
                  />
                );
              }}
            />
          </div>
        );
      })}
      <div>
        <Text> Count </Text>
        <Controller
          name={"count" + index}
          control={control}
          render={({ field }) => {
            return (
              <Input
                value={field.value}
                onChange={field.onChange}
                type="number"
              />
            );
          }}
        />
      </div>
      <div>
        <Text> Cost </Text>
        <Controller
          name={"rowCost" + index}
          control={control}
          render={({ field }) => {
            const rowPriceSum = calculatedFormValueNames.reduce(
              (accumulator, currentValue) => {
                return accumulator + rowData[currentValue + index];
              },
              0
            );
            return (
              <Input
                value={rowPriceSum}
                onChange={field.onChange}
                type="number"
                disabled={true}
                placeholder="cost for the role"
              />
            );
          }}
        />
      </div>
    </div>
  );
}
