import React, { useState } from 'react';
import { formatDate } from '../../commonUtils/FormateDate';

// Define the Alert type
export interface Transaction {
  transactionId: string;
  customerId: string;
  sourceAccount: string;
  destinationAccount: string;
  amount: number;
  currency: string;
  fee: number;
  status: string; // Can be a union type if status is limited
  transactionType: string;
  description: string;
  merchantId: string;
  merchantCategory: string;
  direction: string; // Assuming only these two values
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  city: string;
  region: string;
  country: string;
}


interface AlertDetailsProps {
  selectedAlert: Transaction | null;
  onBackToTable: () => void;
}

const TransactionDetails: React.FC<AlertDetailsProps> = ({ selectedAlert, onBackToTable }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async (id: any) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(id);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      } catch (err) {
        console.error("Clipboard API failed, using fallback", err);
        fallbackCopy(id);
      }
    } else {
      console.warn("Clipboard API not supported, using fallback");
      fallbackCopy(id);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // Prevents scrolling to the element
    textarea.style.opacity = "0"; // Hides the textarea
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand("copy");

      if (!successful) {
        throw new Error("Copy command was unsuccessful");
      } else {
        setShowTooltip(true);
      }
    } catch (err) {
      console.error("Fallback: Copying text failed", err);
      alert("Copy failed. Please try manually.");
    } finally {
      document.body.removeChild(textarea);
    }
  };






  if (!selectedAlert) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow mt-5">
      <div className="p-5">
        {/* <div className="flex items-center mb-4">
          <button
            onClick={onBackToTable}
            className="flex items-center mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="ml-2">Transaction Details</span>
          </button>


        </div> */}

        <div className="flex items-center gap-2 pb-2 border-b border-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" onClick={() => onBackToTable()}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>

          <div className="relative">
            <p className="text-black text-xl font-medium">Transaction Details</p>
          </div>
        </div>

        <div className="mb-6 p-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm mb-1">Transaction Id</h4>
              <p className="text-sm mb-1">{selectedAlert.transactionId}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Transaction Type</h4>
              <p className="text-sm mb-1">{selectedAlert.transactionType}</p>
            </div>

            {/* <div>
              <h4 className="text-sm mb-1">Status</h4>
              <p className="text-sm mb-1">{selectedAlert.status}</p>
            </div> */}
            <div>
              <h4 className="text-sm mb-1">Status</h4>
              <p
                className={`text-sm mb-1 ${selectedAlert.status === "FAILED" || selectedAlert.status === "CANCELLED"
                  ? "text-red-500"
                  : selectedAlert.status === "COMPLETED"
                    ? "text-green-500"
                    : selectedAlert.status === "CRITICAL"
                      ? "text-purple-500"
                      : selectedAlert.status === "PENDING"
                        ? "text-orange-500"
                        : "text-gray-500"
                  }`}
              >
                {selectedAlert.status}
              </p>

            </div>

            <div>
              <h4 className="text-sm mb-1">Time Stamp</h4>
              <p className="text-sm mb-1">{formatDate(selectedAlert?.timestamp)}</p>
            </div>

            {/* <div>
              <h4 className="text-sm mb-1">Customer Id</h4>
              <p className="text-sm mb-1">{selectedAlert.customerId}</p>
            </div> */}

            <div className="flex flex-col gap-1 relative">
              {/* Title & Icon in a Row */}
              <div className="flex items-center gap-1">
                <h4 className="text-sm">Customer Id</h4>

                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition"
                    onClick={() => handleCopy(selectedAlert.customerId)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                    />
                  </svg>

                  {/* Black Tooltip */}
                  {showTooltip && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md">
                      Copied!
                    </div>
                  )}
                </div>
              </div>

              {/* Customer ID Value Below */}
              <p className="text-sm">{selectedAlert.customerId}</p>
            </div>


            <div>
              <h4 className="text-sm mb-1">Currency</h4>
              <p className="text-sm mb-1">{selectedAlert.currency}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Amount</h4>
              <p className="text-sm mb-1">{selectedAlert.amount}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Fee</h4>
              <p className="text-sm mb-1">{selectedAlert.fee}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Merchant Id</h4>
              <p className="text-sm mb-1">{selectedAlert.merchantId}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Merchant Category</h4>
              <p className="text-sm mb-1">{selectedAlert.merchantCategory}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Destination Account</h4>
              <p className="text-sm mb-1">{selectedAlert.destinationAccount}</p>
            </div>
            {/* <div>
              <h4 className="text-sm mb-1">Direction</h4>
              <p
                className={`text-sm mb-1 ${selectedAlert.direction === "CREDIT"
                  ? "text-green-500"
                  : selectedAlert.direction === "DEBIT"
                    ? "text-red-500"
                    : "text-gray-500"
                  }`}
              >
                {selectedAlert.direction}
              </p>
              
            </div> */}

            <div>
              {/* Title (Direction) */}
              <h4 className="text-sm mb-1">Direction</h4>

              {/* Direction Value + Arrow in a Straight Line */}
              <div className="flex items-center gap-1">
                {/* Incoming Arrow for CREDIT, Outgoing Arrow for DEBIT */}
                {selectedAlert.direction === "CREDIT" ? (
                  // <svg
                  //   xmlns="http://www.w3.org/2000/svg"
                  //   fill="none"
                  //   viewBox="0 0 24 24"
                  //   strokeWidth="1.5"
                  //   stroke="currentColor"
                  //   className="w-4 h-4 text-green-500"
                  // >
                  //   <path
                  //     strokeLinecap="round"
                  //     strokeLinejoin="round"
                  //     d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"
                  //   />
                  // </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-green-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25" />
                  </svg>

                ) : selectedAlert.direction === "DEBIT" ? (
                  // <svg
                  //   xmlns="http://www.w3.org/2000/svg"
                  //   fill="none"
                  //   viewBox="0 0 24 24"
                  //   strokeWidth="1.5"
                  //   stroke="currentColor"
                  //   className="w-4 h-4 text-red-500"
                  // >
                  //   <path
                  //     strokeLinecap="round"
                  //     strokeLinejoin="round"
                  //     d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  //   />
                  // </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-red-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 19.5-15-15m0 0v11.25m0-11.25h11.25" />
                  </svg>

                ) : null}

                {/* Direction Value */}
                <p
                  className={`text-sm mb-1 ${selectedAlert.direction === "CREDIT"
                    ? "text-green-500"
                    : selectedAlert.direction === "DEBIT"
                      ? "text-red-500"
                      : "text-gray-500"
                    }`}
                >
                  {selectedAlert.direction}
                </p>
              </div>
            </div>



            <div>
              <h4 className="text-sm mb-1">Source Account</h4>
              <p className="text-sm mb-1">{selectedAlert.sourceAccount}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">country</h4>
              <p className="text-sm mb-1">{selectedAlert.country}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Region</h4>
              <p className="text-sm mb-1">{selectedAlert.region}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">City</h4>
              <p className="text-sm mb-1">{selectedAlert.city}</p>
            </div>


            <div>
              <h4 className="text-sm mb-1">Description</h4>
              <p className="text-sm mb-1">{selectedAlert.description}</p>
            </div>




            {/* 
            <div>
              <h4 className="text-sm mb-1">Transaction ID</h4>
              <p className="text-sm mb-1">{selectedAlert.transactionId}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Transaction Type</h4>
              <p className="text-sm mb-1">{selectedAlert.transactionType}</p>
            </div>

            <div>
              <h4 className="text-sm mb-1">Network</h4>
              <p className="text-sm mb-1">{selectedAlert.network}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Country</h4>
              <p className="text-sm mb-1">{selectedAlert.country}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Alert Owner</h4>
              <p className="text-sm mb-1">{selectedAlert.owner}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Last Updated</h4>
              <p className="text-sm mb-1">{selectedAlert.date}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Uploaded File</h4>
              {selectedAlert.downloadFile ? (
                <p className="text-sm text-blue-600 cursor-pointer">{selectedAlert.downloadFile}</p>
              ) : (
                <p className="text-sm text-gray-400">No file uploaded</p>
              )}
            </div>
            <div>
              <h4 className="text-sm mb-1">Rule Version</h4>
              <p className="text-sm mb-1">{selectedAlert.ruleVersion}</p>
            </div>
            <div>
              <h4 className="text-sm mb-1">Case ID</h4>
              <p className="text-sm mb-1">{selectedAlert.caseID}</p>
            </div> */}
          </div>
        </div>






      </div>
    </div >
  );
};

export default TransactionDetails;