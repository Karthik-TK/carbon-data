import React, { useState } from "react";
import NavBar from "../dashboard/navbar";
import * as XLSX from "xlsx";

interface DataTextPoints {
  fossilGHG: string | null;
  biogenicEmissions: string | null;
  biogenicGHGRemoval: string | null;
  aircraftEmissions: string | null;
  dLUCEmissions: string | null;
}

const DataTextKeywords = {
  fossilGHG: "Fossil",
  biogenicEmissions: "Biogenic",
  biogenicGHGRemoval: "Biogenic GHG removal",
  aircraftEmissions: "Air craft emissions",
  dLUCEmissions: "Emissions from land use change (dLUC)",
};

const FileParser = () => {
  const [fileData, setFileData] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const extractedData: any = {};

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          extractedData[sheetName] = {
            fossilGHG: extractCellValue(sheetData, DataTextKeywords.fossilGHG),
            biogenicEmissions: extractCellValue(
              sheetData,
              DataTextKeywords.biogenicEmissions,
            ),
            biogenicGHGRemoval: extractCellValue(
              sheetData,
              DataTextKeywords.biogenicGHGRemoval,
            ),
            aircraftEmissions: extractCellValue(
              sheetData,
              DataTextKeywords.aircraftEmissions,
            ),
            dLUCEmissions: extractCellValue(
              sheetData,
              DataTextKeywords.dLUCEmissions,
            ),
          };
        });

        setFileData(extractedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const extractCellValue = (sheetData: any, target: string) => {
    const targetIndex = sheetData.findIndex((row: any) => {
      return (
        row.findIndex((cell: any) => {
          if (
            typeof cell === "string" &&
            cell.toLowerCase().includes(target.toLowerCase())
          ) {
            return true;
          }
          return false;
        }) !== -1
      );
    });

    if (targetIndex !== -1) {
      const targetRow = sheetData[targetIndex];
      const targetColumnIndex = targetRow.findIndex((cell: any) => {
        return (
          typeof cell === "string" &&
          cell.toLowerCase().includes(target.toLowerCase())
        );
      });

      if (targetColumnIndex !== -1) {
        // Next cell to the matched string cell
        const nextCell = targetRow[targetColumnIndex + 1];
        if (typeof nextCell === "number") {
          return nextCell;
        } else if (
          typeof nextCell === "string" &&
          !isNaN(parseFloat(nextCell))
        ) {
          return parseFloat(nextCell);
        }

        // Exactly below row cell of the matched string cell
        const belowRow = sheetData[targetIndex + 1];
        if (belowRow) {
          const belowCell = belowRow[targetColumnIndex];
          if (typeof belowCell === "number") {
            return belowCell;
          } else if (
            typeof belowCell === "string" &&
            !isNaN(parseFloat(belowCell))
          ) {
            return parseFloat(belowCell);
          }
        }

        // Exactly above row cell of the matched string cell
        const aboveRow = sheetData[targetIndex - 1];
        if (aboveRow) {
          const aboveCell = aboveRow[targetColumnIndex];
          if (typeof aboveCell === "number") {
            return aboveCell;
          } else if (
            typeof aboveCell === "string" &&
            !isNaN(parseFloat(aboveCell))
          ) {
            return parseFloat(aboveCell);
          }
        }
      }
    }

    return null;
  };

  const extractData = (data: DataTextPoints) => {
    const {
      fossilGHG,
      biogenicEmissions,
      biogenicGHGRemoval,
      aircraftEmissions,
      dLUCEmissions,
    }: DataTextPoints = data;

    if (Object.values(data).some((value) => value !== null)) {
      return (
        <ul className="indent-2">
          <li>Fossil GHG emissions: {fossilGHG}</li>
          <li>Biogenic emissions: {biogenicEmissions}</li>
          <li>Biogenic GHG removal: {biogenicGHGRemoval}</li>
          <li>Aircraft emissions: {aircraftEmissions}</li>
          <li>dLUC emissions: {dLUCEmissions}</li>
        </ul>
      );
    } else {
      return (
        <span className="text-purple-400 text-base pl-2">
          No data found in this sheet!
        </span>
      );
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          File Parser - Data Extraction from XLSX Files
        </h1>
        <input type="file" onChange={handleFileUpload} className="mb-4" />

        {fileData && (
          <div>
            {Object.entries(fileData).map(([sheetName, data]: any) => (
              <div key={sheetName} className="mb-4">
                <h2 className="text-lg font-bold">Sheet Name - {sheetName}:</h2>
                {extractData(data)}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FileParser;
