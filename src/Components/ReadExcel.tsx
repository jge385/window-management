import { read, utils } from "xlsx";
import { useCallback } from "react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "antd";
import {
  WindowTypeExcel,
  useWindowTypeExcel,
} from "../Context/WindowTypeExcelProvider";

export function ReadExcel() {
  const { windowTypesExcel, setWindowTypesExcel } = useWindowTypeExcel();

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading failed");
    reader.onload = (e) => {
      const bstr = e?.target?.result;
      const workbook = read(bstr, { type: "binary" });
      const firstWorksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstWorksheetName];
      const jsonData = utils.sheet_to_json(worksheet) as WindowTypeExcel[];
      setWindowTypesExcel(jsonData);
    };
    reader.readAsBinaryString(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
        ".xls",
      ],
    },
    onDrop,
  });

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <Button>
          <input {...getInputProps()} />
          Upload Excel File
        </Button>
      </div>
    </div>
  );
}
