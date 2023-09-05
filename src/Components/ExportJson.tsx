export function ExportJson(formData: any) {
  console.log("formData ", formData);

  const jsonData = JSON.stringify(formData);

  const blob = new Blob([jsonData], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(url);
}
