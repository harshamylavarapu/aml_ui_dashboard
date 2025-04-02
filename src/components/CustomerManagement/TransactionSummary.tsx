import React, { useEffect, useState } from 'react';
import { DataSummary } from '../../commonUtils/Interface';
import TrasactionsService from '../../Services/TrasactionsService';

const AlertSummary: React.FC = () => {
  const [dataSummary, setDataSummary] = useState<DataSummary>({
    totalCount: 0,
    status: {
      CANCELLED: 0,
      COMPLETED: 0,
      FAILED: 0,
      PENDING: 0,
    },
  });
  const alertCategories = [
    { id: 'total', label: 'Total', count: dataSummary.totalCount, colorClass: 'text-blue-500' },
    { id: 'completed', label: 'Completed', count: dataSummary.status.COMPLETED, colorClass: 'text-green-500' },
    { id: 'failed', label: 'Failed', count: dataSummary.status.FAILED, colorClass: 'text-red-500' },
    { id: 'low', label: 'Cancelled', count: dataSummary.status.CANCELLED, colorClass: 'text-red-500' },
    { id: 'critical', label: 'Pending', count: dataSummary.status.PENDING, colorClass: 'text-purple-500' }
  ];

  useEffect(() => {
    getAllTransactionsSummary();
  }, [])
  const getAllTransactionsSummary = () => {
    TrasactionsService.getAllTransactionsSummary().then((res) => {
      if (res && res.data) {
        console.log(res)
        setDataSummary(res.data)
      }
    })

  }

  return (
    // <div className="flex items-center gap-x-2">
    //   {alertCategories.map((category) => (
    //     <div key={category.id} className="bg-white rounded-md shadow p-3 flex flex-col items-center w-20">
    //       <div className="text-sm font-medium text-gray-600">{category.label}</div>
    //       <div className={`text-lg font-semibold ${category.colorClass}`}>
    //         {category.count}
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <div className="flex items-center gap-x-2">
      {alertCategories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-md border p-3 flex flex-col items-right w-[180px] h-[70px]"
        >
          <div className="text-sm font-medium text-gray-600">{category.label}</div>
          <div className={`text-lg ${category.colorClass}`}>
            {category.count}
          </div>
        </div>
      ))}
    </div>


  );
};

export default AlertSummary;