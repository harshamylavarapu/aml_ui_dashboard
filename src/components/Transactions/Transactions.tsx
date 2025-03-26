import React, { useEffect, useState } from 'react';
import AlertDetails from './TransactionDetails';
import TrasactionsService from '../../Services/TrasactionsService';
import AlertSummary from './TransactionSummary';
import trans from '../../assets/images/Trans.svg'
import Table from './Table';
import { PaginationState } from '../../commonUtils/Interface';
const COUNTRY_REGION_CITY_MAP: Record<string, { region: string; cities: string[] }> = {
  'United States': { region: "North America", cities: ["New York", "Los Angeles", "Chicago"] },
  India: { region: "Asia", cities: ["Mumbai", "Delhi", "Bangalore"] },
  Germany: { region: "Europe", cities: ["Berlin", "Munich", "Hamburg"] },
};

const Transactions: React.FC = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const fieldConfig: { label: string; type: "text" | "select"; options?: string[] }[] = [
    { label: "Currency", type: "select", options: ["USD", "EUR", "GBP", "JPY", "INR"] },
    { label: "Amount", type: "text" },
    { label: "Description", type: "text" },
    { label: "Customer ID", type: "text" },
    { label: "Merchant ID", type: "text" },
    { label: "Merchant Type", type: "select", options: ["Grocery", "Electronics", "Clothing", "Restaurants", "Travel"] },
    {
      label: "Transaction Type", type: "select", options: ["DEPOSIT", "WITHDRAWAL", "TRANSFER", "PAYMENT", "WIRE_TRANSFER",
        "CARD_PAYMENT", "CASH_WITHDRAWAL", "INTERNATIONAL_TRANSFER", "CRYPTO_EXCHANGE"]
    },
    { label: "Country", type: "select", options: Object.keys(COUNTRY_REGION_CITY_MAP) },
    { label: "City", type: "select", options: [] }, // City will be dynamic
    { label: "Region", type: "text" }, // Region will be updated based on Country

  ];
  const headerColumns = [
    // { column: "S.No", columnValue: "action", width: "14.2%" },
    { column: "Transaction Id", columnValue: "transactionId", width: "25%" },
    {
      column: "Customer Id",
      columnValue: "customerId",
      width: "13%",
    },
    { column: "Direction", columnValue: "direction", width: "10%" },
    // { column: "Created On", columnValue: "CreatedDate" },
    { column: "Merchant Id", columnValue: "merchantId", width: "13%" },
    { column: "Merchant Category", columnValue: "merchantCategory", width: "15%" },
    { column: "Status", columnValue: "status", width: "10%" },
    { column: "Date", columnValue: "createdAt", width: "10%" },

  ];
  const [showDetailView, setShowDetailView] = useState(false);
  const [isTraction, setIsTraction] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [viewList, setViewList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  });

  const getAllTransactions = (page: number, size: number) => {
    TrasactionsService.getAllTrasactions(page, size).then((res) => {
      if (res && res.data?.content) {
        setList(res.data?.content)
        console.log(res)
        // setPagination(res.data?.page)
        setPagination({
          ...pagination,
          totalPages: res.data?.page.totalPages,
          totalElements: res.data?.page.totalElements
        });
      }
    })
  }

  const handlePageChange = (newPage: number) => {
    // Ensure page is within valid range
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination({
        ...pagination,
        currentPage: newPage
      });
    }
  };

  // Generate pagination numbers
  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of visible page links

    let startPage = Math.max(0, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start page if end page is maxed out
    if (endPage === pagination.totalPages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 mx-1 rounded ${pagination.currentPage === i
            ? 'bg-blue-500 text-white text-sm'
            : 'bg-white  text-sm text-blackhover:bg-blue-500'
            }`}
        >
          {i + 1}
        </button>
      );
    }

    return pageNumbers;
  };


  const goToPage = (page: number) => {
    handlePageChange(page);
  };

  useEffect(() => {
    if (pagination.pageSize > 0) {
      getAllTransactions(pagination.currentPage, pagination.pageSize);
    }
  }, [pagination.currentPage, pagination.pageSize, showDetailView, isTraction])
  useEffect(() => {
    if (filterValue.length === 0) {
      getAllTransactions(0, 10);
    }
  }, [filterValue])

  const handleSearch = () => {
    serachTranscation(filterValue);
  }
  const serachTranscation = (value: any) => {
    TrasactionsService.getTrasactionById(value).then((res) => {
      console.log(res)
      if (res && res.data) {

        setList([res.data])
        // setPagination(res.data?.page)
        setPagination({
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          pageSize: 0
        });
      }
    })

  }

  const getDetails = (value: any) => {
    serachTranscationShow(value)

  }
  const serachTranscationShow = (value: any) => {
    TrasactionsService.getTrasactionById(value).then((res) => {
      console.log(res)
      if (res && res.data) {
        setViewList([res.data])
        setShowDetailView(true);
        // setPagination(res.data?.page)
        // setPagination({
        //   currentPage: 0,
        //   totalPages: 0,
        //   totalElements: 0,
        //   pageSize: 0
        // });
      }
    })

  }

  const getBackTable = () => {
    setShowDetailView(false);
    console.log(pagination.currentPage, pagination.pageSize, 'pagination.currentPage, pagination.pageSize')

  }

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };

    if (field === "Country") {
      const countryData = COUNTRY_REGION_CITY_MAP[value] || { region: "", cities: [] };
      newFormData["Region"] = countryData.region;
      newFormData["City"] = "";
      setCityOptions(countryData.cities);
    }

    setFormData(newFormData);
  };

  console.log(formData, 'formData')


  const rozarPay = () => {
    const currency = formData?.Currency || "INR";
    let amountInSmallestUnit = parseFloat(formData?.Amount);

    // Convert to the smallest unit based on the currency
    if (["INR", "USD", "EUR", "GBP"].includes(currency)) {
      amountInSmallestUnit *= 100; // Convert to paise or cents
    } // JPY remains the same
    // const amountInPaise = Math.round(parseFloat(formData?.Amount) * 100);
    const options = {
      // process.env.RAZORPAY_KEY_ID
      key: "rzp_test_z8jVsg0bBgLQer", // Your Razorpay Key ID
      amount: Math.round(amountInSmallestUnit),
      currency: formData.Currency,
      name: "OTSI",
      // description: 'Description of the purchase',
      prefill: {
        // name: parsedUser?.name,
        // email: parsedUser?.email,
        // contact: parsedUser?.mobileNumber,
      },
      theme: {
        color: "#1434A4", // Customize color according to your theme
      },
      handler: function (response: any) {
        if (response?.razorpay_payment_id) {
          payment(response?.razorpay_payment_id);
        }
      },
    };
    const paymentObject = new (window as any).Razorpay(options);
    (paymentObject as any).open();
  };
  const getFormattedTimestamp = () => {
    const now = new Date();

    // Get date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");

    // Get time components
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  console.log(getFormattedTimestamp());
  console.log(formData['Transaction Type'], 'formData[Transaction Type]')

  const payment = (id: any) => {
    const obj = {
      transactionId: id,
      amount: formData?.Amount,
      currency: formData?.Currency,
      timestamp: getFormattedTimestamp(),
      status: 'COMPLETED',
      customerId: formData['Customer ID'],
      merchantId: formData['Merchant ID'],
      country: formData['Country'],
      region: formData['Region'],
      city: formData['City'],
      merchantCategory: formData['Merchant Type'],
      transactionType: formData['Transaction Type'],
      direction: "DEBIT",
      fee: 2.50,
      description: formData['Description'],
      sourceAccount: "ACC123456789",
      destinationAccount: "ACC987654321",
      version: 1
    }
    TrasactionsService.transaction(obj).then((res) => {
      if (res && res.status === 200) {
        setFormData({})
        setIsTraction(false);
      }
    })


  }
  const goBacktoTras = () => {
    setIsTraction(false);
    setFormData({})
  }

  return (
    <>
      <div className="space-y-5">
        {!isTraction && <>
          <div className="flex justify-between items-center pt-4">
            <div>
            </div>

            <AlertSummary />

          </div>

          {!showDetailView ? (
            <div className="grid mt-4">
              <div className=" border border-slate-100 shadow-md rounded-lg p-3">
                {/* <div className="flex items-center gap-4">
                <p className="text-black font-light">List of Transactions</p>

                <div className="relative">
                  <input
                    type="text"
                    className="w-[273px] h-[26px] rounded-[12px] px-[12px] pr-[32px] py-[6px] bg-gray-100 text-sm"
                    placeholder="Search"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />

                  <svg
                    className="absolute top-1/2 right-[10px] transform -translate-y-1/2 h-4 w-4 text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div> */}
                <div className="flex items-center gap-6">
                  <p className="font-regular">List of Transactions</p>

                  <div className="relative">
                    <input
                      type="text"
                      className="w-[320px] h-[30px] rounded-full px-[14px] pr-[40px] py-[8px] bg-gray-100 text-black text-sm font-lexendDecaLight"
                      placeholder="Search"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />

                    <svg
                      className="absolute top-1/2 right-[12px] transform -translate-y-1/2 h-4 w-4 text-slate-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <div className="flex-1"></div>

                  {/* <button className="relative bg-[#0a8fff] text-white px-6 py-2 rounded-md flex items-center justify-center" onClick={() => setIsTraction(true)}>
                    <span className="relative">
                      Check

                    </span>
                  </button> */}
                  <button
                    className="relative border-2 border-gray-200 text-white bg-white flex items-center justify-center 
             transition-all duration-500 ease-out group w-[40px] h-[40px] rounded-full 
             hover:w-[180px] hover:rounded-lg px-0 hover:px-6 overflow-hidden"
                    onClick={() => setIsTraction(true)}
                  >
                    <span className="relative flex items-center justify-center min-w-[60px]">
                      {/* Default icon (before hover) */}
                      <span className="absolute opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-0">
                        <img src={trans} className="w-5 h-5" alt="Icon" />
                      </span>

                      {/* Hover text (fully visible in a single line) */}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out text-[#164164] 
                     whitespace-nowrap">
                        Transaction Check
                      </span>
                    </span>
                  </button>




                  {/* <button
                    className="relative bg-[#0a8fff] text-white px-6 py-2 rounded-md flex items-center justify-center transition-all duration-300 ease-in-out hover:px-10 group"
                    onClick={() => setIsTraction(true)}
                  >
                    <span className="relative flex items-center justify-center w-full">

                      <span className="absolute opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0">
                        Check
                      </span>


                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                        Transaction Check
                      </span>
                    </span>
                  </button> */}


                  {/* <button className="flex items-center gap-2 px-2 py-1 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">
                  <span className="text-lg font-lexendDecaLight py-2 text-center float-left flex justify-center items-center">Check</span>
                  <span className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-blue-600 text-white rounded-full border border-white">
                    T
                  </span>
                </button> */}
                </div>

                <div className="mt-2">
                  <Table
                    headerColumns={headerColumns}
                    updateWallet={() => { }}
                    authStore={list}
                    parentCallback={() => { }}
                    value={filterValue}
                    modelCallBack={() => { }}
                    dailogType={"slider"}
                    statusPopover={false}
                    pagination={pagination}
                    renderPaginationNumbers={renderPaginationNumbers}
                    handlePageChange={handlePageChange}
                    getDetails={getDetails}
                  />


                </div>


              </div>
            </div>
          ) : (

            <AlertDetails
              selectedAlert={viewList[0]}
              onBackToTable={getBackTable}
            />
          )}
        </>}
        {isTraction && <>
          <div className="bg-white rounded-lg shadow mt-5 p-5">
            {/* Header Section */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-300" onClick={() => goBacktoTras()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => console.log("Back to table")}
                className="cursor-pointer"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <p className="text-black text-xl font-medium">Transactions</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-3 gap-4 p-5">
              {fieldConfig.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  {field.type === "text" ? (
                    <input
                      type="text"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black text-sm font-lexendDecaLight"
                      placeholder={field.label}
                      value={formData[field.label] || ""}
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                      readOnly={field.label === "Region"}
                    />
                  ) : (
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black text-sm font-lexendDecaLight"
                      value={formData[field.label] || ""}
                      onChange={(e) => handleInputChange(field.label, e.target.value)}
                    >
                      <option value="" disabled>Select {field.label}</option>
                      {(field.label === "City" ? cityOptions : field.options)?.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons at Bottom Right */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-white text-sm font-medium text-[#0a8fff] border border-[#0a8fff] px-6 py-2 rounded-md hover:bg-[#0a8fff] hover:text-white"
                onClick={() => setFormData({})}
              >
                Reset
              </button>
              <button
                onClick={() => rozarPay()}
                className="px-6 py-2 bg-[#0a8fff] text-white rounded-md hover:bg-blue-700 transition"
              >
                Pay
              </button>
            </div>
          </div>
        </>}
      </div >
    </>
  );
};

export default Transactions;