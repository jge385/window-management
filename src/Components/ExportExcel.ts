import ExcelJS from "exceljs";

export async function ExportExcel(formData: any) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const windows = formData.window;
  const exportWindowData: any[] = [];

  let countSum = 0;
  let areaSum = 0;
  let priceSum = 0;

  worksheet.columns = [
    { key: "column1", width: 20 },
    { key: "column2", width: 20 },
    { key: "column3", width: 20 },
    { key: "column4", width: 20 },
  ];

  windows.forEach((window: any, index: number) => {
    countSum += Number(window.count);
    areaSum += Number(window.area);
    priceSum += Number(window.rowCost);
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

  worksheet.addRow({
    column1: "Item Count",
    column2: countSum,
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
