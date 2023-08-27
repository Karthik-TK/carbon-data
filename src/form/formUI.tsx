import React, { useState } from "react";
import { read, Sheet, utils, WorkBook, write } from "xlsx";
import NavBar from "../dashboard/navbar";
import {
  CheckIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataDisplayTable from "./DataDisplayTable";

interface DataRow {
  companyName: string;
  itemId: string;
  quantity: number;
  dateOfPurchase: string;
  emissionFactor: number;
}

const FormUI: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [data, setData] = useState<DataRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryString = e.target?.result as string;
        const workbook: WorkBook = read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet: Sheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(sheet, { header: 1 });

        const rows: any = jsonData.slice(1);

        const processedData: DataRow[] = rows.map((row: any[]) => {
          return {
            companyName: row[6],
            itemId: row[2],
            quantity: row[3],
            dateOfPurchase: row[1],
            emissionFactor: row[7],
          };
        });

        setData(processedData);
        setProgress(100);
      };

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setProgress(progress);
        }
      };

      reader.onerror = () => {
        setError("Error occurred while processing the file.");
        toast.error("Please upload valid file");
      };

      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleEditValue = (
    rowIndex: number,
    fieldName: keyof DataRow,
    value: string | number,
  ) => {
    const updatedData = [...data];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [fieldName]: value,
    };
    setData(updatedData);
  };

  const handleSaveChanges = () => {
    const headers = [
      "Company Name",
      "Item Id",
      "Quantity",
      "Date of Purchase",
      "Emission Factor",
    ];
    const rows = [headers, ...data.map((row) => Object.values(row))];
    const sheet = utils.aoa_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, sheet, "Sheet1");
    const excelData = write(workbook, { type: "binary", bookType: "xlsx" });

    // You can now save the updated excelData or send it to a server for further processing
    console.log({ excelData });
    toast.success("Successfully updated the values");
  };

  const removeFile = () => {
    setFile(null);
    setData([]);
    toast.success("Upload a new Excel File to view data");
  };

  const processFile = () => {
    toast.success("Success");
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">Upload an Excel File</h1>
        <div className="col-span-full">
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            {!!file ? (
              <div className="flex flex-col gap-4">
                <label className="block text-md font-bold leading-6 text-gray-500">
                  File Uploaded:
                </label>
                <p className="text-sm">
                  <strong>{file.name}</strong> -{" "}
                  {Math.round((file.size * 1000) / Math.pow(1024, 2)) / 1000}{" "}
                  {"MB"}
                </p>
                <div className="grid grid-cols-2 grid-flow-col gap-4 my-4">
                  <div>
                    <button
                      className="inline-flex bg-red-500 text-white rounded-md w-fit p-1 pr-2 hover:bg-red-600"
                      onClick={removeFile}
                    >
                      <XMarkIcon className="w-5 h-5 pt-1" /> Remove file
                    </button>
                  </div>
                  <div>
                    <button
                      className="inline-flex bg-purple-500 text-white rounded-md w-fit p-1 pr-2 hover:bg-purple-600"
                      onClick={processFile}
                    >
                      <CheckIcon className="w-5 h-5 pt-1" /> Save file
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <DocumentTextIcon
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  .xlsx, .xls up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>
        {progress > 0 && progress < 100 && (
          <div>Processing file... {progress}%</div>
        )}
        {error && <div>{error}</div>}

        {/* Display uploaded file as a table */}
        {data.length > 0 && (
          <div className="overflow-y-auto h-96 mt-4 p-4 border border-gray-200 rounded-xl bg-gray-100 shadow-lg">
            <>
              <button
                className="text-white bg-gray-700 text-sm font-bold rounded-md px-4 py-2 flex justify-center items-center mb-4"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <table className="table-auto border-collapse border border-gray-800 w-full bg-white">
                <thead>
                  <tr>
                    <th className="border bg-gray-300 border-gray-800 px-4 py-2">
                      Company Name
                    </th>
                    <th className="border bg-gray-300 border-gray-800 px-4 py-2">
                      Item Id
                    </th>
                    <th className="border bg-gray-300 border-gray-800 px-4 py-2">
                      Quantity
                    </th>
                    <th className="border bg-gray-300 border-gray-800 px-4 py-2">
                      Date of Purchase
                    </th>
                    <th className="border bg-gray-300 border-gray-800 px-4 py-2">
                      Emission Factor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-800 px-4 py-2">
                        <input
                          type="text"
                          value={row.companyName}
                          onChange={(e) =>
                            handleEditValue(
                              index,
                              "companyName",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-800 px-4 py-2">
                        <input
                          type="text"
                          value={row.itemId}
                          onChange={(e) =>
                            handleEditValue(index, "itemId", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-800 px-4 py-2">
                        <input
                          type="number"
                          value={row.quantity}
                          onChange={(e) =>
                            handleEditValue(
                              index,
                              "quantity",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-800 px-4 py-2">
                        <input
                          type="text"
                          value={row.dateOfPurchase}
                          onChange={(e) =>
                            handleEditValue(
                              index,
                              "dateOfPurchase",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-800 px-4 py-2">
                        <input
                          type="number"
                          value={row.emissionFactor}
                          onChange={(e) =>
                            handleEditValue(
                              index,
                              "emissionFactor",
                              parseFloat(e.target.value),
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          </div>
        )}
      </div>
      <DataDisplayTable tableData={data} />
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={false}
      />
    </>
  );
};

export default FormUI;
