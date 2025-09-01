
import React, { useEffect, useState } from 'react';
import { PaginationState } from '../../commonUtils/Interface';
import CustomerManagementServices from '../../Services/CustomerManagementServices';
import TrasactionsService from '../../Services/TrasactionsService';
import Table from './RulesTable';
import AlertDetails from './TransactionDetails';
const COUNTRY_REGION_CITY_MAP: Record<string, { region: string; cities: string[] }> = {
    'United States': { region: "North America", cities: ["New York", "Los Angeles", "Chicago"] },
    India: { region: "Asia", cities: ["Mumbai", "Delhi", "Bangalore"] },
    Germany: { region: "Europe", cities: ["Berlin", "Munich", "Hamburg"] },
};

const Rules: React.FC = () => {
    const [filterValue, setFilterValue] = useState<string>("");
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const fieldConfig: { label: string; type: "text" | "select"; options?: string[] }[] = [

        { label: "Name", type: "text" },


        // { label: "Currency", type: "select", options: ["USD", "EUR", "GBP", "JPY", "INR"] },
        { label: "Rule Type", type: "text" },
        { label: "Category", type: "select", options: ["Business", "Customer"] },

        { label: "Min Amount", type: "text" },
        { label: "Max Amount", type: "text" },
        { label: "location", type: "text" },
        { label: "Transaction Direction", type: "select", options: ["CREDIT", "DEBIT"] },
        { label: "Recommendation Text", type: "text" },

        // { label: "Merchant Type", type: "select", options: ["Grocery", "Electronics", "Clothing", "Restaurants", "Travel"] },
        // {
        //     label: "Transaction Type", type: "select", options: ["DEPOSIT", "WITHDRAWAL", "TRANSFER", "PAYMENT", "WIRE_TRANSFER",
        //         "CARD_PAYMENT", "CASH_WITHDRAWAL", "INTERNATIONAL_TRANSFER", "CRYPTO_EXCHANGE"]
        // },
        // { label: "Country", type: "select", options: Object.keys(COUNTRY_REGION_CITY_MAP) },
        // { label: "City", type: "select", options: [] },
        // { label: "Region", type: "text" },
    ];
    const headerColumns = [
        // { column: "S.No", columnValue: "action", width: "14.2%" },
        {
            column: "Rule Id",
            columnValue: "id",
            width: "15%",
        },
        { column: "Rule Type", columnValue: "ruleType", width: "15%" },
        {
            column: "category",
            columnValue: "category",
            width: "15%",
        },
        { column: "Max Amount", columnValue: "maxAmount", width: "15%" },
        { column: "Min Amount", columnValue: "minAmount", width: "15%" },
        { column: "Merchant Category", columnValue: "merchantCategory", width: "15%" },

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
        CustomerManagementServices.getrules(page, size).then((res) => {
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


    const createRule = () => {
        const obj = {
            name: formData['Name'],
            ruleType: formData['Rule Type'],
            category: formData['Category'],
            minAmount: formData['Min Amount'],
            maxAmount: formData['Max Amount'],
            location: formData['Location'],
            transactionDirection: formData['Transaction Direction'],
            recommendationText: formData['Recommendation Text']
        }
        CustomerManagementServices.createRule(obj).then((res) => {
            if (res) {
                setFormData({})
                setIsTraction(false)
            }
        })
    }
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


    const goBacktoTras = () => {
        setIsTraction(false);
        setFormData({})
    }

    return (
        <>
            <div className="space-y-5">
                {!isTraction && <>


                    {!showDetailView ? (
                        <div className="grid mt-4">
                            <div className=" border border-slate-100 shadow-md rounded-lg p-3">

                                <div className="flex items-center gap-6">
                                    <p className="font-regular">List of Rules</p>

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
                                                {/* <img src={trans} className="w-5 h-5" alt="Icon" /> */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-gray-800">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                                </svg>

                                            </span>

                                            {/* Hover text (fully visible in a single line) */}
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out text-gray-900 
                     whitespace-nowrap">
                                                Create Rule
                                            </span>
                                        </span>
                                    </button>




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
                            <p className="text-black text-xl font-medium">Create Rule</p>
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
                                onClick={() => createRule()}
                                className="px-6 py-2 bg-[#0a8fff] text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </>}
            </div >
        </>
    );
};

export default Rules;
