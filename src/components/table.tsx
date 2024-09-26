import { Pagination, ScrollArea, Skeleton } from "@mantine/core";
import React from "react";

type TableProps = {
  columns: string[];
  children: React.ReactNode;
  from: number;
  to: number;
  total: number;
  totalPages: number;
  currentPage: number;
  isShowPagination?: boolean;
  onPageChanged: (page: number) => void;
};

export function TableSkeleton({ columns }: any) {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="min-w-full">
      <ScrollArea>
        <table className="border-collapse w-full text-left border border-sky-100">
          <thead className="">
            <tr className="text-xs font-bold">
              {columns.map((column: any, index: number) => (
                <th
                  key={index}
                  className="border border-sky-100 whitespace-nowrap bg-sky-50 px-4 py-1.5 uppercase text-slate-800 text-xs+ lg:px-5"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr
                key={i}
                className="border-y border-transparent border-b-slate-100"
              >
                {columns.map((index: number) => (
                  <td
                    key={index}
                    className="border border-slate-100 whitespace-nowrap px-4 py-1.5 lg:px-5"
                  >
                    <div className="py-1.5">
                      <Skeleton width={"50%"} height={8} radius="xl" />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex  pt-4  justify-between items-center">
          <div className="text-gray-700 text-sm+">
            <Skeleton height={8} width={200} radius="xl" />
          </div>
          <div className="">
            <Skeleton height={8} width={200} radius="xl" />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default function Table({
  columns,
  from,
  to,
  total,
  totalPages,
  currentPage,
  onPageChanged,
  isShowPagination,
  children,
}: TableProps) {
  return (
    <div className="min-w-full">
      <ScrollArea>
        <table className="w-full text-left border border-sky-100">
          <thead className="">
            <tr className="text-xs font-bold">
              {columns.map((column) => (
                <th
                  className={`border border-sky-100 whitespace-nowrap bg-sky-50 px-4 py-1.5 uppercase text-slate-800 text-xs+ lg:px-5`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {totalPages === 0 && (
              <tr key={""}>
                <td className="text-center py-4" colSpan={columns.length}>
                  No results found
                </td>
              </tr>
            )}
            {children}
          </tbody>
        </table>
      </ScrollArea>
      {totalPages > 0 && (isShowPagination ?? true) && (
        <div className="flex pt-4 justify-between items-center">
          <div className="text-gray-700 text-[15px]">
            Showing From {from} To {to} of {total} results
          </div>
          <div className="">
            <Pagination
              radius="lg"
              total={totalPages}
              value={currentPage}
              onChange={onPageChanged}
            />
          </div>
        </div>
      )}
    </div>
  );
}
