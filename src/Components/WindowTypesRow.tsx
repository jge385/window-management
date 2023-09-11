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
  convertPriceStringToFormula,
  convertCalculateStringToFormula,
  extractFunctionParams,
  containDigit,
  containWin,
  isWindowBasedField,
  findClosestSmallNumber,
} from "../Utilities/GenerateFormula";
import {
  WINDOW_STATUS_LABEL_MAP,
  WINDOW_THICKNESS_LABEL_MAP,
  WindowLabelMap,
} from "../Consts/WindowOptionLabelMap";
import {
  SHARED_WINDOW_STATUS_VARIABLES,
  SHARED_WINDOW_THICKNESS_VARIABLES,
  SHARED_WINDOW_STATUS_VARIABLES_AB_MAP,
} from "../Consts/SharedVariables";
import { ALUMINIUM_NUMBER_MAP } from "../Consts/ExportCalculateMap";

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
  validate?: (value: string) => boolean;
}

export interface CalculateFormValueItem extends FormValueItem {
  condition: boolean;
  conditionVariable?: string;
  conditionFormulaMap?: { [key: string]: string };
  formula?: string;
}

export interface compareFormValues extends FormValueItem {
  range: number[];
  variable: string;
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

const calculatedFormValues: CalculateFormValueItem[] = [
  {
    name: "revelWidth",
    label: "Revel Width",
    condition: true,
    conditionVariable: "thickness",
    conditionFormulaMap: {
      JHLinea: "JHLinea - Alu2",
      JHOblique: "JHOblique - Alu2",
      brick: "brick - 10 - Alu1",
    },
  },
  {
    name: "revelLength",
    label: "Revel Length",
    condition: false,
    formula: "(height + width) * 2 * 1.5",
  },
  {
    name: "flashingWidthRequired",
    label: "Flashing Width Required",
    condition: true,
    conditionVariable: "thickness",
    conditionFormulaMap: {
      JHLinea: "Alu1 + revelWidth - Alu4 - 100",
      JHOblique: "Alu1 + revelWidth - Alu4 - 100",
      brick: "brick - 10 - Alu4 - 100",
    },
  },
  {
    name: "flashingLength",
    label: "Flashing Length",
    condition: false,
    formula: "width + 150",
  },
  {
    name: "supportingBarWidthRequired",
    label: "Supporting Bar Width",
    condition: true,
    conditionVariable: "thickness",
    conditionFormulaMap: {
      JHLinea: "JHLinea - 100",
      JHOblique: "JHOblique - 100",
      brick: "brick - 10 - 100 - Alu3",
    },
  },
  {
    name: "supportingBarLength",
    label: "Supporting Bar Length",
    condition: false,
    formula: "width - 100",
  },
];

const compareFormValues: compareFormValues[] = [
  {
    name: "flashingWidth",
    label: "Flashing Width",
    range: [55, 75, 100, 120],
    variable: "flashingWidthRequired",
  },
  {
    name: "supportingBarWidth",
    label: "Supporting Bar Width",
    range: [30, 40, 60],
    variable: "supportingBarWidthRequired",
  },
];

const priceFormValues = [
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

const priceFormValueNames = priceFormValues.map((formValue) => formValue.name);

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

  const validateHeight = useCallback((value: string) => {
    if (rowData.window[index]?.height) {
      let heightSum = 0;
      for (let i = 1; i <= selectedWindowTypeOption.HeightCount; i++) {
        heightSum += rowData.window[index]["h" + i];
      }
      return (
        Math.round(Number(heightSum.toFixed(3))) ===
        Math.round(rowData.window[index].height)
      );
    }
    return true;
  }, []);

  const validateWidth = useCallback((value: string) => {
    if (rowData.window[index]?.width) {
      let widthSum = 0;
      for (let i = 1; i <= selectedWindowTypeOption.WidthCount; i++) {
        widthSum += rowData.window[index]["w" + i];
      }
      return (
        Math.round(Number(widthSum.toFixed(3))) ===
        Math.round(rowData.window[index].width)
      );
    }
    return true;
  }, []);

  const windowDetailFormValues = useMemo(() => {
    const rowProperties = [];
    for (let i = 1; i <= selectedWindowTypeOption.HeightCount; i++) {
      rowProperties.push({
        name: "h" + i,
        label: "h" + i,
        type: "number",
        validate: validateHeight,
      });
    }
    for (let i = 1; i <= selectedWindowTypeOption.WidthCount; i++) {
      rowProperties.push({
        name: "w" + i,
        label: "w" + i,
        type: "number",
        validate: validateWidth,
      });
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
        Number(
          (
            rowData.window[index].height / selectedWindowTypeOption.HeightCount
          ).toFixed(3)
        )
      );
    }
  }, [rowData.window[index].height]);

  useEffect(() => {
    for (let i = 1; i <= selectedWindowTypeOption.WidthCount; i++) {
      setValue(
        `window.${index}.w${i}`,
        Number(
          (
            rowData.window[index].width / selectedWindowTypeOption.WidthCount
          ).toFixed(3)
        )
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
            return (
              <Input
                value={field.value}
                onChange={field.onChange}
                disabled={true}
              />
            );
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
                    onChange={(e: any) => {
                      field.onChange(Number(e.target.value));
                    }}
                    type={row.type}
                  />
                );
              }}
            />
          </div>
        );
      })}
      {/* thickness */}
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
              rules={{ validate: (value: string) => row.validate!(value) }}
              render={({ field, fieldState }) => {
                return (
                  <Input
                    value={field.value}
                    onChange={(e: any) => {
                      field.onChange(Number(e.target.value));
                    }}
                    type={row.type}
                    status={
                      fieldState.error !== undefined ? "error" : undefined
                    }
                  />
                );
              }}
            />
          </div>
        );
      })}
      {/* win1, win2 */}
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
      {/* revel width required etc*/}
      {calculatedFormValues.map((row: CalculateFormValueItem) => {
        const realFormula = convertCalculateStringToFormula(
          row.condition
            ? row.conditionFormulaMap![
                rowData.window[index][row.conditionVariable!]
              ]
            : row.formula!
        );
        const variables = extractFunctionParams(realFormula);
        const params = variables.map((variable: string) => {
          return Number(
            containDigit(variable) // use this to check if the variable is inside window object (eg h1,w1, win1) or total object (eg fixedCost)
              ? ALUMINIUM_NUMBER_MAP[variable][rowData.window[index].win1]
              : isWindowBasedField(variable)
              ? rowData.window[index][variable]
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
                if (!Number.isNaN(result) && field.value !== result) {
                  field.onChange(result);
                }
                return (
                  <Input
                    value={result || field.value}
                    onChange={(e: any) => {
                      field.onChange(Number(e.target.value));
                    }}
                    type="number"
                    disabled={true}
                    placeholder={
                      row.condition
                        ? row.conditionFormulaMap![
                            rowData.window[index][row.conditionVariable!]
                          ]
                        : row.formula!
                    }
                  />
                );
              }}
            />
          </div>
        );
      })}
      {/* revel width, supporting bar width */}
      {compareFormValues.map((row: compareFormValues) => {
        let result: null | number;
        if (rowData.window[index][row.variable]) {
          result = findClosestSmallNumber(
            row.range,
            rowData.window[index][row.variable]
          );
        }
        return (
          <div key={row.name + index}>
            <Text> {row.label} </Text>
            <Controller
              name={`window.${index}.${row.name}`}
              control={control}
              render={({ field }) => {
                if (!Number.isNaN(result) && field.value !== result) {
                  field.onChange(result);
                }
                return (
                  <Input
                    value={result || field.value}
                    onChange={(e: any) => {
                      field.onChange(Number(e.target.value));
                    }}
                    type="number"
                    disabled={true}
                  />
                );
              }}
            />
          </div>
        );
      })}
      {/* area */}
      <div>
        <Text> Area in m^2 </Text>
        <Controller
          name={`window.${index}.area`}
          control={control}
          render={({ field }) => {
            const area = Number(
              (
                (rowData.window[index].height * rowData.window[index].width) /
                1000000
              ).toFixed(2)
            );
            if (!Number.isNaN(area) && field.value !== area) {
              field.onChange(area);
            }
            return (
              <Input
                value={field.value}
                onChange={field.onChange}
                type="number"
                disabled={true}
              />
            );
          }}
        />
      </div>
      {/* Al Prices etc */}
      {priceFormValues.map((row: FormValueItem) => {
        const realFormula = convertPriceStringToFormula(
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
              : rowData[SHARED_WINDOW_STATUS_VARIABLES_AB_MAP[variable]]
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
                if (!Number.isNaN(result) && field.value !== result) {
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
      {/* count */}
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
      {/* cost */}
      <div>
        <Text> Cost </Text>
        <Controller
          name={`window.${index}.rowCost`}
          control={control}
          render={({ field }) => {
            const rowPriceSum = priceFormValueNames.reduce(
              (accumulator, currentValue) => {
                return accumulator + rowData.window[index][currentValue];
              },
              0
            );
            const rowTotalCost = Number(
              (rowData.window[index].count * rowPriceSum).toFixed(2)
            );
            if (!Number.isNaN(rowTotalCost) && field.value !== rowTotalCost) {
              field.onChange(rowTotalCost);
            }
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
      <div className="mt-3">
        <Button onClick={onRemoveRow}> Remove </Button>
      </div>
    </div>
  );
}
