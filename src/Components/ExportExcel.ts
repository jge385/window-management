import ExcelJS from "exceljs";
import { countSpecificNumber } from "../Utilities/GenerateFormula";

export async function ExportExcel(formData: any) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const windows = formData.window;
  const exportWindowData: any[] = [];

  let countSum = 0;
  let areaSum = 0;
  let priceSum = 0;
  let flashing55Sum = 0;
  let flashing75Sum = 0;
  let flashing100Sum = 0;
  let flashing120Sum = 0;
  let supportingBarWidth30Sum = 0;
  let supportingBarWidth40Sum = 0;
  let supportingBarWidth60Sum = 0;

  worksheet.columns = [
    { key: "column1", width: 20 },
    { key: "column2", width: 20 },
    { key: "column3", width: 20 },
    { key: "column4", width: 20 },
  ];

  let revelWidthArray: number[] = [];

  windows.forEach((window: any, index: number) => {
    countSum += Number(window.count);
    areaSum += Number(window.area);
    priceSum += Number(window.rowCost);

    revelWidthArray.push(window.revelWidth);

    if (window.flashingWidth == 55) {
      flashing55Sum += window.flashingWidth;
    } else if (window.flashingWidth == 75) {
      flashing75Sum += window.flashingWidth;
    } else if (window.flashingWidth == 100) {
      flashing100Sum += window.flashingWidth;
    } else {
      flashing120Sum += window.flashingWidth;
    }

    if (window.supportingBarWidth == 30) {
      supportingBarWidth30Sum += window.supportingBarWidth;
    } else if (window.supportingBarWidth == 40) {
      supportingBarWidth40Sum += window.supportingBarWidth;
    } else {
      supportingBarWidth60Sum += window.supportingBarWidth;
    }
    exportWindowData.push({ column1: "Item no.", column2: index + 1 });
    exportWindowData.push({
      column1: "Window Id",
      column2: window.id,
      column3: "Window Type Name",
      column4: window.windowType,
    });
    exportWindowData.push({
      column3: "Color",
      column4: window.windowColor,
    });
    exportWindowData.push({
      column3: "Wind Zone",
      column4: formData.windZone,
    });
    exportWindowData.push({
      column3: "Revel Length",
      column4: Number(window.revelLength),
    });
    exportWindowData.push({
      column3: "Revel Width (mm)",
      column4: Number(window.revelWidth),
    });
    exportWindowData.push({
      column3: "Glass",
      column4: "5mm tempered",
    });
    exportWindowData.push({
      column3: "Cladding",
      column4: window.thickness,
    });
    exportWindowData.push({
      column3: "Wall Thickness",
      column4: Number(formData[window.thickness]),
    });
    exportWindowData.push({
      column3: "Flashing Length (mm)",
      column4: Number(window.flashingLength),
    });
    exportWindowData.push({
      column3: "Flashing Width (mm)",
      column4: Number(window.flashingWidth),
    });
    exportWindowData.push({
      column3: "Supporting bar length",
      column4: Number(window.supportingBarLength),
    });
    exportWindowData.push({
      column3: "Supporting bar width",
      column4: Number(window.supportingBarWidth),
    });
    exportWindowData.push({
      column3: "Area (m^2)",
      column4: Number(window.area),
    });
    exportWindowData.push({
      column3: "Trim Size",
      column4: `${window.height} X ${window.width}`,
    });
    exportWindowData.push({
      column3: "Water Box (mm)",
      column4: Number(window.width) + 20,
    });
    exportWindowData.push({});
  });

  exportWindowData.forEach((row) => {
    worksheet.addRow(row);
  });

  const revelWidthMap = countSpecificNumber(revelWidthArray);

  worksheet.addRow({
    column1: "Item Count",
    column2: countSum,
  });

  Object.keys(revelWidthMap).forEach((revelWidth) => {
    worksheet.addRow({
      column1: "Total length of revel width " + revelWidth,
      column2: revelWidthMap[Number(revelWidth)],
    });
  });

  worksheet.addRow({
    column1: "Total length of flashing width 55",
    column2: flashing55Sum,
  });
  worksheet.addRow({
    column1: "Total length of flashing width 75",
    column2: flashing75Sum,
  });
  worksheet.addRow({
    column1: "Total length of flashing width 100",
    column2: flashing100Sum,
  });
  worksheet.addRow({
    column1: "Total length of flashing width 120",
    column2: flashing120Sum,
  });

  worksheet.addRow({
    column1: "Total length of supporting bar width 30",
    column2: supportingBarWidth30Sum,
  });
  worksheet.addRow({
    column1: "Total length of supporting bar width 40",
    column2: supportingBarWidth40Sum,
  });
  worksheet.addRow({
    column1: "Total length of supporting bar width 60",
    column2: supportingBarWidth60Sum,
  });

  worksheet.addRow({
    column1: "Total Area",
    column2: areaSum,
  });
  worksheet.addRow({
    column1: "Total Price",
    column2: priceSum,
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
}

export async function ExportInternalExcel(formData: any) {
  console.log("formData ", formData);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const windows = formData.window;
  const exportWindowData: any[] = [];

  worksheet.columns = [
    { key: "id", width: 20, header: "Window Id" },
    { key: "windowType", width: 20, header: "Window Type" },
    { key: "height", width: 20, header: "Height" },
    { key: "width", width: 20, header: "Width" },
    { key: "h1", width: 20, header: "h1" },
    { key: "h2", width: 20, header: "h2" },
    { key: "h3", width: 20, header: "h3" },
    { key: "h4", width: 20, header: "h4" },
    { key: "h5", width: 20, header: "h5" },
    { key: "w1", width: 20, header: "w1" },
    { key: "w2", width: 20, header: "w2" },
    { key: "w3", width: 20, header: "w3" },
    { key: "w4", width: 20, header: "w4" },
    { key: "w5", width: 20, header: "w5" },
    { key: "revelLength", width: 20, header: "Revel Length" },
    { key: "revelWidth", width: 20, header: "Revel Width" },
    { key: "flashingLength", width: 20, header: "Flashing Length" },
    { key: "flashingWidth55", width: 20, header: "Flashing Width 55" },
    { key: "flashingWidth75", width: 20, header: "Flashing Width 75" },
    { key: "flashingWidth100", width: 20, header: "Flashing Width 100" },
    { key: "flashingWidth120", width: 20, header: "Flashing Width 120" },
    { key: "supportingBarLength", width: 20, header: "Supporting Bar Length" },
    {
      key: "supportingBarWidth30",
      width: 20,
      header: "Supporting Bar Width 30",
    },
    {
      key: "supportingBarWidth40",
      width: 20,
      header: "Supporting Bar Width 40",
    },
    {
      key: "supportingBarWidth60",
      width: 20,
      header: "Supporting Bar Width 60",
    },
    {
      key: "waterBoxLength",
      width: 20,
      header: "Water Box Length",
    },
  ];

  windows.forEach((window: any) => {
    exportWindowData.push({
      id: window.id,
      windowType: window.windowType,
      height: window.height,
      width: window.width,
      h1: window?.h1,
      h2: window?.h2,
      h3: window?.h3,
      h4: window?.h4,
      h5: window?.h5,
      w1: window?.w1,
      w2: window?.w2,
      w3: window?.w3,
      w4: window?.w4,
      w5: window?.w5,
      revelLength: window.revelLength,
      revelWidth: window.revelWidth,
      flashingLength: window.flashingLength,
      flashingWidth55: window.flashingWidth == 55 ? window.flashingLength : 0,
      flashingWidth75: window.flashingWidth == 75 ? window.flashingLength : 0,
      flashingWidth100: window.flashingWidth == 100 ? window.flashingLength : 0,
      flashingWidth120: window.flashingWidth == 120 ? window.flashingLength : 0,
      supportingBarLength: window.supportingBarLength,
      supportingBarWidth30:
        window.supportingBarWidth == 30 ? window.supportingBarLength : 0,
      supportingBarWidth40:
        window.supportingBarWidth == 40 ? window.supportingBarLength : 0,
      supportingBarWidth60:
        window.supportingBarWidth == 60 ? window.supportingBarLength : 0,
      waterBoxLength: window.waterBoxLength,
    });
  });

  exportWindowData.forEach((row) => {
    worksheet.addRow(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "internal data.xlsx";
  a.click();

  URL.revokeObjectURL(url);
}
