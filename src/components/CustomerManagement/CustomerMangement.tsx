
import React, { useEffect, useState } from "react";
import aiIcon from '../../../src/assets/images/artificial-intelligence.png';
import { PaginationState } from "../../commonUtils/Interface";
import CustomerManagementServices from "../../Services/CustomerManagementServices";
import CustomerNavBar from "../CustomerNavBar";
import Table from "./Table";
import TrasactionsService from "../../Services/TrasactionsService";

const CustomerManagement: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const [currentTab, setCurrentTab] = useState('Data Analytics');
    const [displayedTexts, setDisplayedTexts] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState([]);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10
    });
    const [list, setList] = useState<any[]>([]);

    const headerColumns = [


        {
            column: "Customer Id",
            columnValue: "customerId",
            width: "18%",
        },
        { column: "Amount", columnValue: "amount", width: "20%" },
        { column: "City", columnValue: "city", width: "18%" },
        // { column: "Created On", columnValue: "CreatedDate" },
        { column: "Country", columnValue: "country", width: "18%" },
        { column: "Region", columnValue: "region", width: "20%" },



    ];

    const getInfoByPrompt = () => {
        if (inputValue && inputValue !== '') {
            const obj = {
                prompt: inputValue,
                page: pagination?.currentPage,
                pageSize: pagination?.pageSize,
            };
            CustomerManagementServices.getAllTransactionsSummary(obj).then((res) => {
                if (res && res.data) {
                    console.log(res.data.transactions);
                    setList(res?.data?.transactions);
                    setPagination({
                        ...pagination,
                        totalPages: res.data?.totalPages,
                        totalElements: res.data?.totalRecords
                    });
                }
            });
        }
    };

    useEffect(() => {
        if (list.length > 0) {
            getInfoByPrompt();
        }
    }, [pagination.currentPage, pagination.pageSize])
    useEffect(() => {
        if (inputValue && inputValue !== '') {
            setList([])
            setPagination({
                currentPage: 0,
                totalPages: 0,
                totalElements: 0,
                pageSize: 10
            })
        }
    }, [inputValue])

    const handleReset = () => {
        setInputValue("");
        setRecommendations([])
        setDisplayedTexts([])
        setList([])
        setPagination({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            pageSize: 10
        })
    };
    const handleChange = (value: string) => {
        setCurrentTab(value)
        setInputValue('')
        setRecommendations([])
        setDisplayedTexts([])
    }



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
    const showRecommendationsWordByWord = (recs: any) => {
        let timeouts: any[] = [];
        let newDisplayedTexts = Array(recs.length).fill("");
        console.log(newDisplayedTexts)
        recs.forEach((rec: any, recIndex: any) => {
            const words = rec.split(" ");
            let newText = "";

            words.forEach((word: any, wordIndex: any) => {
                const timeout = setTimeout(() => {
                    newText += (wordIndex ? " " : "") + word;
                    setDisplayedTexts((prevTexts) => {
                        const updatedTexts = [...prevTexts];
                        updatedTexts[recIndex] = newText;
                        return updatedTexts;
                    });
                }, wordIndex * 300 + recIndex * 2000); // Delay per word

                timeouts.push(timeout);
            });
        });

        return () => timeouts.forEach(clearTimeout); // Cleanup on unmount
    };

    const customerAIRecomendation = () => {
        TrasactionsService.customerAIRecomendation(inputValue).then((res) => {
            setRecommendations([])
            setDisplayedTexts([])
            if (res && res.data) {
                console.log(res)
                const recs = res?.data?.recommendations || [];
                setRecommendations(recs)
                showRecommendationsWordByWord(recs)
            }
        })
    }
    const businessAIRecomendation = () => {
        TrasactionsService.BusinessAIRecomendation(inputValue).then((res) => {
            setRecommendations([])
            setDisplayedTexts([])
            if (res && res.data) {
                console.log(res)
                const recs = res?.data?.recommendations || [];
                setRecommendations(recs)
                showRecommendationsWordByWord(recs)
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



    return (

        <>
            <div className="space-y-5">
                <CustomerNavBar handleChange={handleChange} currentTab={currentTab} />

                <>
                    {currentTab === 'Data Analytics' && (

                        <div className="grid grid-rows-[auto_1fr] gap-4 h-screen p-4 overflow-hidden">
                            {/* Top Section: Textarea & Buttons */}
                            <div className="flex flex-col w-full">
                                {/* Heading with Icon */}
                                <p className="text-black text-lg font-medium pb-2 flex items-center gap-2">
                                    <img src={aiIcon} alt="AI Icon" className="w-6 h-6" />
                                    AI-Powerd Customer Data Analytics
                                </p>

                                {/* Label */}
                                <label className="text-sm font-light mb-2" htmlFor="customer-query">
                                    Tell me what you are looking for?
                                </label>

                                {/* Textarea */}
                                <textarea
                                    id="customer-query"
                                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                                    placeholder="Type here..."
                                    disabled={list.length > 0}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />

                                {/* Buttons aligned to the right */}
                                <div className="flex justify-end gap-4 mt-2">
                                    <button
                                        className={`bg-white text-sm font-medium text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-600 hover:text-white hover:border-white ${inputValue.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        disabled={inputValue.trim() === ""}

                                        onClick={handleReset}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        className={`bg-blue-500 text-sm font-medium text-white px-6 py-2 rounded-md 
                hover:bg-blue-600 ${list.length > 0 || inputValue.trim() === "" ? "opacity-50 cursor-not-allowed" : ""}`}
                                        onClick={getInfoByPrompt}
                                        disabled={list.length > 0 || inputValue.trim() === ""}
                                    >
                                        Submit
                                    </button>


                                </div>
                            </div>

                            {/* Bottom Section: Table */}
                            <div className="w-full rounded-md p-4 overflow-auto ">

                                {list.length > 0 && (<> <div className="flex items-center gap-6">
                                    <p className="text-black text-xl font-medium">List of Customers</p>


                                </div>

                                    <div className="mt-2">
                                        <Table
                                            headerColumns={headerColumns}
                                            updateWallet={() => { }}
                                            authStore={list}
                                            parentCallback={() => { }}
                                            value={''}
                                            modelCallBack={() => { }}
                                            dailogType={"slider"}
                                            statusPopover={false}
                                            pagination={pagination}
                                            renderPaginationNumbers={renderPaginationNumbers}
                                            handlePageChange={handlePageChange}
                                            getDetails={() => {

                                            }}
                                        />


                                    </div>
                                </>
                                )}
                            </div>
                        </div >)}
                    {currentTab === 'Recommendations' && (
                        <div className="grid grid-rows-[auto_1fr] gap-4 h-screen p-4 overflow-hidden">
                            {/* Top Section: Textarea & Buttons */}
                            <div className="flex flex-col w-full">
                                {/* Heading with Icon */}
                                <p className="text-black text-lg font-medium pb-2 flex items-center gap-2">
                                    <img src={aiIcon} alt="AI Icon" className="w-6 h-6" />
                                    AI-Powerd Customer Recommendations & Business Insights
                                </p>


                                <div className="grid grid-cols-3 gap-3 p-3 items-center">
                                    <input
                                        type="text"
                                        className="block p-2 border border-gray-300 rounded-md text-black text-sm font-lexendDecaLight h-10"
                                        placeholder={'Customer Id'}
                                        value={inputValue}
                                        disabled={recommendations.length > 0}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                    <div className="flex justify-start gap-4">
                                        <button className={`bg-blue-500 text-white px-3 py-2 rounded flex items-center justify-center space-x-2 h-10 w-fit ${inputValue.trim() === "" ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={customerAIRecomendation}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                            </svg>
                                            <span className="text-white text-sm">Customer Insights</span>
                                        </button>
                                        <button className={`bg-blue-500 text-white px-3 py-2 rounded flex items-center justify-center space-x-2 h-10 w-fit ${inputValue.trim() === "" ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={businessAIRecomendation}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                            </svg>
                                            <span className="text-white text-sm">Business Insights</span>
                                        </button>
                                    </div>
                                    <div className="flex justify-end gap-4 mt-2">
                                        <button
                                            className={`bg-white text-sm font-medium text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white hover:border-white ${inputValue.trim() === "" ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={inputValue.trim() === ""}
                                            onClick={handleReset}
                                            style={{ height: "40px" }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Table */}
                            <div className="w-full rounded-md p-4 overflow-auto ">

                                {recommendations.length > 0 && (<> <div className="flex items-center gap-6">
                                    <p className="text-black text-xl font-medium mb-2">Recommendations:</p>


                                </div>

                                    {/* <div className="">
                                        <div className="w-full h-full p-2">
                                            <div className="col-span-4">
                                                <ul className="list-disc pl-5 text-sm text-gray-900">
                                                    {displayedTexts.map((rec, index) => (
                                                        <li className="text-sm font-lexendDecaLight border border-gray-200 p-4 m-2" key={index}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>



                                    </div> */}
                                    <div className="">
                                        <div className="w-full h-full p-4">
                                            <div className="col-span-4">
                                                <ul className="list-disc pl-5 text-sm text-gray-700">
                                                    {displayedTexts.map((rec, index) => {
                                                        const processedText = rec.replace(/^\d+\.\s*/, ''); // Remove number prefix
                                                        const lines = processedText.split('\n'); // Split into lines

                                                        return (
                                                            <li
                                                                key={index}
                                                                className="text-sm font-lexendDecaLight border border-gray-200 p-4 m-2 flex flex-col"
                                                            >
                                                                <span className="flex items-start">
                                                                    <span className="mr-2 text-blue-500">▶</span>
                                                                    {lines[0]} {/* First line with arrow */}
                                                                </span>
                                                                {lines.slice(1).map((line, lineIndex) => (
                                                                    <span key={lineIndex} className="ml-6">{line}</span> // Indent remaining lines
                                                                ))}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </>
                                )}
                            </div>
                        </div >
                    )}
                </>



            </div>
        </>
    );
};

export default CustomerManagement;
