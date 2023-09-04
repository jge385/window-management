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
  WINDOW_THICKNESS_LABEL_MAP,
  WindowLabelMap,
} from "../Consts/WindowOptionLabelMap";
import {
  SHARED_WINDOW_STATUS_VARIABLES,
  SHARED_WINDOW_THICKNESS_VARIABLES,
} from "../Consts/SharedVariables";

const { Text } = Typography;

const windowStatusSelectOptions = SHARED_WINDOW_STATUS_VARIABLES.map(
  (variable) => {
    return {
      value: variable,
      label: WINDOW_STATUS_LABEL_MAP[variable as keyof WindowLabelMap],
    };
  }
);

const windowThicknessSelectOptions = SHARED_WINDOW_THICKNESS_VARIABLES.map(
  (variable) => {
    return {
      value: variable,
      label: WINDOW_THICKNESS_LABEL_MAP[variable as keyof WindowLabelMap],
    };
  }
);

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

  useEffect(() => {
    for (let i = 1; i <= selectedWindowTypeOption.HeightCount; i++) {
      setValue(
        `window.${index}.h${i}`,
        rowData.window[index].height / selectedWindowTypeOption.HeightCount
      );
    }
  }, [rowData.window[index].height]);

  useEffect(() => {
    for (let i = 1; i <= selectedWindowTypeOption.WidthCount; i++) {
      setValue(
        `window.${index}.w${i}`,
        rowData.window[index].width / selectedWindowTypeOption.WidthCount
      );
    }
  }, [rowData.window[index].width]);

  useEffect(() => {
    if (!rowData.window[index].lot) {
      const defaultLot = index > 0 ? rowData.window[index - 1].lot : 1;
      setValue(`window.${index}.lot`, defaultLot);
    }
    if (!rowData.window[index].floor) {
      const defaultFloor = index > 0 ? rowData.window[index - 1].floor : 1;
      setValue(`window.${index}.floor`, defaultFloor);
    }
  }, []);

  return (
    <div className="w-full grid grid-cols-8 items-center space-x-2">
      {/* lot, floor */}
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
      {/* window id */}
      <div>
        <div className="w-full">
          <Text> Window Id </Text>
        </div>
        <Controller
          name={`window.${index}.id`}
          control={control}
          render={({ field }) => {
            const windowId = `${rowData.projectName || "no project name"} - ${
              rowData.window[index].lot
            } - ${rowData.window[index].floor} - ${index + 1}`;
            if (windowId !== field.value) {
              field.onChange(windowId);
            }
            return <Input value={field.value} onChange={field.onChange} />;
          }}
        />
      </div>
      {/* window type */}
      <div>
        <div className="w-full">
          <Text> Window Type </Text>
        </div>
        <Controller
          name={`window.${index}.windowType`}
          control={control}
          render={({ field }) => {
            if (!field.value) {
              field.onChange(windowTypesExcel[0].TypeName);
            }
            const onChange = (value: string) => {
              handleOnChangeSelect(value);
              field.onChange(value);
            };
            return (
              <Select
                options={windowTypeOptions}
                value={field.value}
                onChange={onChange}
                className="w-full"
              />
            );
          }}
        />
      </div>
      {/* Window color */}
      <div>
        <div className="w-full">
          <Text> Window Color </Text>
        </div>
        <Controller
          name={`window.${index}.windowColor`}
          control={control}
          render={({ field }) => {
            if (!field.value && rowData.color) {
              field.onChange(rowData.color);
            }
            return <Input value={field.value} onChange={field.onChange} />;
          }}
        />
      </div>
      {/* height & width */}
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
      <div>
        <div className="w-full">
          <Text> Thickness </Text>
        </div>
        <Controller
          name={`window.${index}.thickness`}
          control={control}
          render={({ field }) => {
            if (!field.value) {
              field.onChange(windowThicknessSelectOptions[0].value);
            }
            return (
              <Select
                options={windowThicknessSelectOptions}
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              />
            );
          }}
        />
      </div>
      {/* h1, w1 */}
      {windowDetailFormValues.map((row: FormValueItem) => {
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
      {windowStatusFormValues.map((row: FormValueItem) => {
        return (
          <div key={row.name + index}>
            <div className="w-full">
              <Text> {row.label}</Text>
            </div>
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
                    className="w-full"
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
