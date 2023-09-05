import { read, utils } from "xlsx";
import { useCallback } from "react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "antd";
import {
  WindowTypeExcel,
  useWindowTypeExcel,
} from "../Context/WindowTypeExcelProvider";
import { useStoredData } from "../Context/StoredDataProvider";

export function ReadJson() {
  const { setStoredData } = useStoredData();

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading failed");
    reader.onload = (e) => {
      const content = e?.target?.result as string;
      const parsedData = JSON.parse(content);
      setStoredData(parsedData);
    };
    reader.readAsText(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/json": [".json"],
    },
    onDrop,
  });

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <Button>
          <input {...getInputProps()} />
          Upload Json File
        </Button>
      </div>
    </div>
  );
}
