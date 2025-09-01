/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { formatDate } from "../../commonUtils/FormateDate";
import { StatusColor } from "../../commonUtils/StatusColors";
import Stepper from "../../commonUtils/Stepper";
import "./Table.css";


type Props = {
  headerColumns: Array<any>;
  value: any;
  authStore: Array<any>;
  parentCallback: (data: any) => void;
  dailogType: any;
  modelCallBack: (prevState: any, e: any) => void;
  statusPopover: boolean;
  updateWallet: (e: any) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  renderPaginationNumbers: () => ReactNode;
  handlePageChange: (newpage: number) => void;
  getDetails: (page: any) => void;

};

const Table = ({
  headerColumns,
  authStore,
  parentCallback,
  handlePageChange,
  renderPaginationNumbers,
  dailogType,
  modelCallBack,
  getDetails,
  pagination,
}: Props) => {
  const action = "action";


  const [urlFlag, seturlFlag] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Number of items per page

  const contentRef: any = useRef(null);

  useEffect(() => {
    // Check if the current path includes "serviceOrders"
    seturlFlag(location.pathname.includes("serviceOrders"));
  }, [location.pathname]);


  const filteredList = authStore;

  // Calculate paginated data
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = filteredList
    ? Math.ceil(filteredList.length / itemsPerPage)
    : 0;
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
    indexOfLastItem = itemsPerPage;
    indexOfFirstItem = 0;
  }

  const currentItems = filteredList
    ? filteredList.slice(indexOfFirstItem, indexOfLastItem)
    : [];


  // const priceSymbolFor = [
  //   "unitPrice",
  //   "cgst",
  //   "sgst",
  //   "totalPrice",
  //   "lcoShare",
  //   "msoShare",
  //   "msoRevenueShareAmt",
  //   "lcoRevenueShareAmt",
  //   "totalShare",
  //   "onlinePayments",
  //   "cashPayments",
  //   "revenue",
  //   "price",
  //   "paidPayments",
  //   "pendingPayments",
  //   "amount",
  // ];

  const priceSymbolFor = [
    "unitPrice",
    "cgst",
    "sgst",
    "totalPrice",
    "lcoShare",
    "msoShare",
    "msoRevenueShareAmt",
    "lcoRevenueShareAmt",
    "totalShare",
    "onlinePayments",
    "cashPayments",
    "revenue",
    "price",
    "paidPayments",
    "pendingPayments",
    "amount",
    "onlinePayments",
    "revenue",
  ];

  const roundTo = (num: number, places: any, columnName: any) => {
    const factor = Math.pow(10, places);
    if (priceSymbolFor.filter((x) => x === columnName).length > 0) {
      return Math.round(num * factor) / factor;
    } else {
      return Math.round(num * factor) / factor;
    }
  };

  const isList = (val: any, column: any) => {
    if (column === "roleIds") {
      let str = "";
      val.map((x: any) => {
        if (str != "") str = str + "," + x;
        else str = x;
      });
      return str;
    } else {
      return val;
    }
  };


  console.log('paginationkdjkhal', pagination)

  const getRowData = (row: any) => {
    row.page = dailogType;
    modelCallBack((prevState: any) => !prevState, row);
    parentCallback(row);
  };

  return (
    <>
      <table className="w-full table-data">
        <thead className="block w-full">
          <tr className=" bg-[#F6F6F6] block rounded-t-lg px-2">
            {headerColumns.map((e, index) => (
              <th
                key={index}
                className="text-sm py-2 font-lexendDecaLight text-center float-left flex justify-center items-center "
                style={{ width: `${e.width}` }}
              >
                {e.column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`scroll block ${urlFlag ? "max-h-[80%]" : "max-h-[80%]"
            } overflow-y-auto`}
          ref={contentRef}
          style={{ width: "100%" }}
        >
          {currentItems?.map((e: any, rowIndex: number) => {
            const serialNumber =
              (currentPage - 1) * itemsPerPage + (rowIndex + 1);
            return (
              <tr key={rowIndex} className="border-b block px-2">
                {headerColumns.map((h: any, columnIndex) => (
                  <React.Fragment key={columnIndex}>
                    {h.columnValue === action ? (
                      <td
                        className={`text-sm font-lexendDecaLight py-2 text-center float-left flex justify-center items-center ${h.columnValue === "action" ||
                          h.columnValue === "actions"
                          ? "cursor-pointer"
                          : ""
                          }`}
                        style={{ width: `${h.width}` }}
                        onClick={() =>
                          (h.columnValue === "action" ||
                            h.columnValue === "actions") &&
                          getRowData(e)
                        }
                      >
                        <div className="flex justify-center item-center">
                          <div className="group relative w-max">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 25 25"
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                            <span className="z-10 text-xs pointer-events-none absolute -right-[40px] top-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-[#000] text-white py-[3px] px-2 rounded">
                              View
                            </span>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td
                        className="text-sm font-lexendDecaLight py-2 text-center float-left flex justify-center items-center"
                        style={{ width: `${h.width}` }}
                      >
                        <div className="flex justify-center items-center">
                          {h.columnValue === "status" ? (
                            e[h.columnValue] === "FAILED" ? (
                              // <span className="bg-green-400 text-black px-2 text-sm py-1 rounded-full">
                              <span className="text-red-600 px-2 text-sm py-1">
                                {e[h.columnValue]}
                              </span>
                            ) :
                              e[h.columnValue] === "COMPLETED" ? (
                                // <span className="bg-green-400 text-black px-2 text-sm py-1 rounded-full">
                                <span className="text-green-600 px-2 text-sm py-1">
                                  {e[h.columnValue]}
                                </span>
                              ) : e[h.columnValue] === "PENDING" ? (
                                // <span className="bg-green-400 text-black px-2 text-sm py-1 rounded-full">
                                <span className="text-purple-600 px-2 text-sm py-1">
                                  {e[h.columnValue]}
                                </span>
                              ) : e[h.columnValue] === "CANCELLED" ? (
                                // <span className="bg-green-400 text-black px-2 text-sm py-1 rounded-full">
                                <span className="text-red-600 px-2 text-sm py-1">
                                  {e[h.columnValue]}
                                </span>
                              ) : (
                                <span className="text-black">
                                  Out of Stock
                                </span>
                              )
                          ) : h.columnValue === "customerId" ? (
                            (
                              // <span className="bg-green-400 text-black px-2 text-sm py-1 rounded-full">
                              <span className="text-blue-600 cursor-pointer px-2 text-sm py-1" onClick={() => getDetails(e[h.columnValue])} >
                                {e[h.columnValue]}
                              </span>
                            )
                          ) : h.columnValue === "direction" ? (
                            e[h.columnValue] === "CREDIT" ? (
                              // <span className="bg-green-400 text-black px-2 text-sm py-1 rounded-full">
                              <span className="text-green-600 px-2 text-sm py-1">
                                {e[h.columnValue]}
                              </span>
                            ) :
                              e[h.columnValue] === "DEBIT" ? (
                                // <span className="bg-green-400 text-black px-2 text-sm py-1 rounded-full">
                                <span className="text-red-600 px-2 text-sm py-1">
                                  {e[h.columnValue]}
                                </span>
                              ) : (
                                <span className="text-black">
                                  Out of Stock
                                </span>
                              )
                          ) : h.columnValue === "installationStatus" ? (
                            e[h.columnValue] === "COMPLETED" ? (
                              <span className="bg-green-400 text-black px-2 text-sm py-1 rounded-full">
                                {e[h.columnValue]}
                              </span>
                            ) : e[h.columnValue] === "" ||
                              e[h.columnValue] === null ? (
                              <span className="bg-red-400 text-black px-2 text-sm py-1 rounded-full">
                                {e[h.columnValue]
                                  ? e[h.columnValue]
                                  : "Created"}
                              </span>
                            ) : (
                              <span className="bg-yellow-400 text-black px-2 text-sm py-1 rounded-full">
                                {e[h.columnValue]}
                              </span>
                            )
                          ) : (
                            <>
                              {h.columnValue === "sno" ? (
                                serialNumber
                              ) : (
                                <>
                                  {h.columnValue === "createdOn" ||
                                    h.columnValue === "createdDt" ||
                                    h.columnValue === "entryDate" ||
                                    h.columnValue === "createdDate" ||
                                    h.columnValue === "effStartDt" ||
                                    h.columnValue === "effEndDt" ||
                                    h.columnValue === "installationDate" ||
                                    h.columnValue === "loginDurationTime" ||
                                    h.columnValue === "logoutDurationTime" ||
                                    h.columnValue === "createdAt" ? (
                                    e[h.columnValue] !== null &&
                                    formatDate(e[h.columnValue])
                                  ) : (
                                    <>
                                      {h.columnValue === "statusValue" ? (
                                        <Stepper status={e[h.columnValue]} />
                                      ) : (
                                        <>
                                          {h.columnValue === "kycStatus" ? (
                                            <span
                                              className={`${StatusColor(
                                                e[h.columnValue]
                                              )} px-2 py-[4px] rounded-full`}
                                            >
                                              {e[h.columnValue]}
                                            </span>
                                          ) : (
                                            <>

                                              <>

                                                <span
                                                  className={`font-lexendDecaLight ${StatusColor(
                                                    e[h.columnValue]
                                                  ) != ""
                                                    ? `${StatusColor(
                                                      e[h.columnValue]
                                                    )} rounded-full px-2 py-[4px]`
                                                    : ""
                                                    }`}
                                                >
                                                  {typeof e[
                                                    h.columnValue
                                                  ] === "number"
                                                    ? roundTo(
                                                      e[h.columnValue],
                                                      2,
                                                      h.columnValue
                                                    )
                                                    : isList(
                                                      e[h.columnValue],
                                                      h.columnValue
                                                    )}
                                                </span>

                                              </>

                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            );
          })}
          {currentItems?.length === 0 && (
            <tr className="border block">
              <td
                className="text-sm font-lexendDecaLight p-2 text-center w-full float-left"
                colSpan={headerColumns.length}
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {pagination.currentPage * pagination.pageSize + 1} to {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of {pagination.totalElements} rules
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handlePageChange(0)}
              disabled={pagination.currentPage === 0}
              className={`px-2 py-1 mx-1 rounded ${pagination.currentPage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0}
              className={`px-2 py-1 mx-1 rounded ${pagination.currentPage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {renderPaginationNumbers()}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages - 1}
              className={`px-2 py-1 mx-1 rounded ${pagination.currentPage === pagination.totalPages - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages - 1)}
              disabled={pagination.currentPage === pagination.totalPages - 1}
              className={`px-2 py-1 mx-1 rounded ${pagination.currentPage === pagination.totalPages - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}


      {/* <div className="mobile-card">
        <CustomerMobile
          headerColumns={mobileHeaders}
          authStore={authStore}
          parentCallback={parentCallback}
        />
      </div> */}


    </>
  );
};
export default Table;
