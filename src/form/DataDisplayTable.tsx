import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  Column,
  Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

export type CarbonData = {
  companyName: string;
  itemId: number;
  quantity: number;
  dateOfPurchase: string;
  emissionFactor: number;
};

interface DataDisplayProps {
  tableData?: any[];
}

const DataDisplayTable: React.FC<DataDisplayProps> = ({ tableData }) => {
  const rerender = useReducer(() => ({}), {})[1];

  const columns = useMemo<ColumnDef<CarbonData>[]>(
    () => [
      {
        accessorKey: "companyName",
        header: "Company Name",
      },
      {
        accessorKey: "itemId",
        header: () => "Item Id",
        enableColumnFilter: false,
      },
      {
        accessorKey: "quantity",
        header: () => "Quantity",
      },
      {
        accessorKey: "dateOfPurchase",
        header: "Date of Purchase",
        enableColumnFilter: false,
      },
      {
        accessorKey: "emissionFactor",
        header: "Emission Factor",
        enableColumnFilter: false,
      },
    ],
    [],
  );

  const [data, setData] = useState<any>([]);
  const refreshData = () => setData(() => {});

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return (
    <>
      <div className="flex m-4 p-4 border border-slate-400 rounded-xl bg-gray-100 shadow-lg">
        <Table
          {...{
            data,
            columns,
          }}
        />
      </div>
      <hr />
      <div>
        <button className="hidden" onClick={() => rerender()}>
          Force Rerender
        </button>
      </div>
      <div>
        <button className="hidden" onClick={() => refreshData()}>
          Refresh Data
        </button>
      </div>
    </>
  );
};

function Table({
  data,
  columns,
}: {
  data: CarbonData[];
  columns: ColumnDef<CarbonData>[];
}) {
  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    debugTable: true,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table className="table-auto border-collapse border border-gray-800 w-full bg-white rounded-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border bg-gray-400 border-gray-800 px-4 py-2"
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className="border border-gray-800 px-4 py-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex justify-center gap-2 mt-2">
        <button
          className="bg-gray-400 text-black border rounded-md p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="bg-gray-400 text-black border rounded-md p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="bg-gray-400 text-black border rounded-md p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="bg-gray-400 text-black border rounded-md p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min={1}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: ReactTable<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}

export default DataDisplayTable;
