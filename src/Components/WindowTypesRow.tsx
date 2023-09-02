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
  containWin,
} from "../Utilities/ConvertStringFormula";
import {
  WINDOW_STATUS_LABEL_MAP,
  WindowStatusLabelMap,
} from "../Consts/WindowStatusMap";
import { SHARED_VARIABLES } from "../Consts/SharedVariables";

const { Text } = Typography;

const windowStatusSelectOptions = SHARED_VARIABLES.map((variable) => {
  return {
    value: variable,
    label: WINDOW_STATUS_LABEL_MAP[variable as keyof WindowStatusLabelMap],
  };
});

export interface FormValueItem {
  name: string;
  label: string;
  type?: string;
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

const windowInfoFormValues = [
  {
    name: "height",
    label: "Height",
    type: "number",
  },
  {
    name: "width",
    label: "Width",
    type: "number",
  },
];

const calculatedFormValues = [
  {
    name: "AluminiumFormula",
    label: "Aluminium Price",
    type: "number",
  },
  {
    name: "GlassFormula",
    label: "Glass Price",
    type: "number",
  },
  {
    name: "AcessoriesFormula",
    label: "Acessories Price",
    type: "number",
  },
];

const calculatedFormValueNames = calculatedFormValues.map(
  (formValue) => formValue.name
);

export default function WindowTypesRow({
  control,
  index,
  setValue,
  removeRow,
}: {
  control: Control;
  index: number;
  setValue: UseFormSetValue<any>;
  removeRow: any;
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

  const windowDetailFormValues = useMemo(() => {
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
    return rowProperties;
  }, [selectedWindowTypeOption]);

  const windowStatusFormValues = useMemo(() => {
    const rowProperties = [];
    for (let i = 1; i <= selectedWindowTypeOption.WindowCount; i++) {
      rowProperties.push({
        name: "win" + i,
        label: "win" + i,
      });
    }
    return rowProperties;
  }, [selectedWindowTypeOption]);

  const onRemoveRow = useCallback(() => {
    removeRow(index);
  }, []);

  return (
    <div className="w-full flex items-center space-x-2">
      {houseInfoFormValues.map((row: FormValueItem) => {
        return (
          <div key={row.name + index}>
            <Text> {row.label} </Text>
            <Controller
              name={`window.${index}.${row.name}`}
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
      {windowInfoFormValues.map((row: FormValueItem) => {
        return (
          <div key={row.name + index}>
            <Text> {row.label} </Text>
            <Controller
              name={`window.${index}.${row.name}`}
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
      {windowDetailFormValues.map((row: FormValueItem) => {
        let presetValue: number | undefined;
        if (rowData.window[index].height && row.name.includes("h")) {
          presetValue =
            rowData.window[index].height / selectedWindowTypeOption.HeightCount;
        }
        if (rowData.window[index].width && row.name.includes("w")) {
          presetValue =
            rowData.window[index].width / selectedWindowTypeOption.WidthCount;
        }
        return (
          <div key={row.name + index}>
            <Text> {row.label} </Text>
            <Controller
              name={`window.${index}.${row.name}`}
              control={control}
              render={({ field }) => {
                if (presetValue && !field.value) {
                  field.onChange(presetValue);
                }
                console.log("presetValue ", presetValue);

                return (
                  <Input
                    value={presetValue || field.value}
                    onChange={field.onChange}
                    type={row.type}
                  />
                );
              }}
            />
          </div>
        );
      })}
      {windowStatusFormValues.map((row: FormValueItem) => {
        return (
          <div key={row.name + index}>
            <Text> {row.label} </Text>
            <Controller
              name={`window.${index}.${row.name}`}
              control={control}
              render={({ field }) => {
                if (!field.value) {
                  field.onChange(windowStatusSelectOptions[0].value);
                }
                return (
                  <Select
                    options={windowStatusSelectOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
        );
      })}
      {calculatedFormValues.map((row: FormValueItem) => {
        const realFormula = convertStringToFormula(
          selectedWindowTypeOption[row.name as keyof WindowTypeExcel] as string,
          selectedWindowTypeOption.WidthCount,
          selectedWindowTypeOption.HeightCount,
          selectedWindowTypeOption.WindowCount
        );
        const variables = extractFunctionParams(realFormula);
        const params = variables.map((variable: string) => {
          return Number(
            containDigit(variable) // use this to check if the variable is inside window object (eg h1,w1, win1) or total object (eg fixedCost)
              ? containWin(variable) // use this to separate the logic for h1,w1 and win1 because h1 is number while win1 points to shared variable
                ? rowData[rowData.window[index][variable]]
                : rowData.window[index][variable]
              : rowData[variable]
          );
        });
        const result = realFormula(...params);
        return (
          <div key={row.name + index}>
            <Text> {row.label} </Text>
            <Controller
              name={`window.${index}.${row.name}`}
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
                    disabled={true}
                    placeholder={
                      selectedWindowTypeOption[
                        row.name as keyof WindowTypeExcel
                      ] as string
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
          name={`window.${index}.count`}
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
          name={`window.${index}.rowCost`}
          control={control}
          render={({ field }) => {
            const rowPriceSum = calculatedFormValueNames.reduce(
              (accumulator, currentValue) => {
                return accumulator + rowData.window[index][currentValue];
              },
              0
            );
            const rowTotalCost = rowData.window[index].count * rowPriceSum;
            return (
              <Input
                value={rowTotalCost}
                onChange={field.onChange}
                type="number"
                disabled={true}
                placeholder="cost for the role"
              />
            );
          }}
        />
      </div>
      <Button onClick={onRemoveRow}> Remove </Button>
    </div>
  );
}
