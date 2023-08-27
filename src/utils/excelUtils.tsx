import { read, utils } from "xlsx";

export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData: any = utils.sheet_to_json(worksheet, { header: 1 });
      const headers = parsedData[0];
      const parsedRows = parsedData.slice(1).map((row: any[]) => {
        const parsedRow: any = {};
        headers.forEach((header: string | number, index: any) => {
          parsedRow[header] = row[index];
        });
        return parsedRow;
      });
      resolve(parsedRows);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};
