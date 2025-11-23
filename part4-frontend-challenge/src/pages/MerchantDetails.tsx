import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMerchant } from '../hooks/useMerchant';
import {ArrowLeft, Rss} from 'lucide-react';

interface StatsData {
  totalTransactions: number;
  totalRevenue: number;
  avgTransactionAmount: number;
  lastTransactionDate: string;
}

interface TransactionData {
  txnId: string;
  timestamp: string;
  amount: number;
  currency: string;
  status: string;
  cardLast4: string;
  cardType: string;
}

export const MerchantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transactionPage, setTransactionPage] = useState(0);
  
  const { data: merchant, loading: merchantLoading, error: merchantError } = useMerchant(id);
  
  const stats = {
    totalTransactions: 1823,
    totalRevenue: 4523678.12,
    avgTransactionAmount: 2481.56,
    lastTransactionDate: "2025-11-24T06:18:33Z"
  };
  const statsLoading = false;
  
  const allTransactions = [
    {
      txnId: "TXN-2025112414000001",
      timestamp: "2025-11-24T06:18:33Z",
      amount: 1250.00,
      currency: "NRP",
      status: "approved",
      cardLast4: "4532",
      cardType: "VISA"
    },
    {
      txnId: "TXN-2025112414000002",
      timestamp: "2025-11-24T05:45:21Z",
      amount: 3450.75,
      currency: "NRP",
      status: "approved",
      cardLast4: "5412",
      cardType: "MASTERCARD"
    },
    {
      txnId: "TXN-2025112414000003",
      timestamp: "2025-11-24T04:22:15Z",
      amount: 890.50,
      currency: "NRP",
      status: "declined",
      cardLast4: "3782",
      cardType: "AMEX"
    },
    {
      txnId: "TXN-2025112414000004",
      timestamp: "2025-11-24T03:15:48Z",
      amount: 2100.00,
      currency: "NRP",
      status: "approved",
      cardLast4: "6011",
      cardType: "DISCOVER"
    },
    {
      txnId: "TXN-2025112414000005",
      timestamp: "2025-11-24T02:33:21Z",
      amount: 567.89,
      currency: "NRP",
      status: "pending",
      cardLast4: "4916",
      cardType: "VISA"
    },
    {
      txnId: "TXN-2025112414000006",
      timestamp: "2025-11-24T01:55:09Z",
      amount: 4321.12,
      currency: "NRP",
      status: "approved",
      cardLast4: "5555",
      cardType: "MASTERCARD"
    },
    {
      txnId: "TXN-2025112414000007",
      timestamp: "2025-11-24T00:41:55Z",
      amount: 1876.45,
      currency: "NRP",
      status: "approved",
      cardLast4: "3714",
      cardType: "AMEX"
    },
    {
      txnId: "TXN-2025112414000008",
      timestamp: "2025-11-23T23:28:44Z",
      amount: 999.99,
      currency: "NRP",
      status: "declined",
      cardLast4: "6510",
      cardType: "DISCOVER"
    },
    {
      txnId: "TXN-2025112414000009",
      timestamp: "2025-11-23T22:17:33Z",
      amount: 3210.50,
      currency: "NRP",
      status: "approved",
      cardLast4: "4024",
      cardType: "VISA"
    },
    {
      txnId: "TXN-2025112414000010",
      timestamp: "2025-11-23T21:05:12Z",
      amount: 1543.67,
      currency: "NRP",
      status: "approved",
      cardLast4: "2223",
      cardType: "MASTERCARD"
    },
    {
      txnId: "TXN-2025112414000011",
      timestamp: "2025-11-23T20:48:26Z",
      amount: 2876.34,
      currency: "NRP",
      status: "approved",
      cardLast4: "4485",
      cardType: "VISA"
    },
    {
      txnId: "TXN-2025112414000012",
      timestamp: "2025-11-23T19:32:19Z",
      amount: 1234.56,
      currency: "NRP",
      status: "approved",
      cardLast4: "5200",
      cardType: "MASTERCARD"
    },
    {
      txnId: "TXN-2025112414000013",
      timestamp: "2025-11-23T18:15:08Z",
      amount: 3567.89,
      currency: "NRP",
      status: "pending",
      cardLast4: "3400",
      cardType: "AMEX"
    },
    {
      txnId: "TXN-2025112414000014",
      timestamp: "2025-11-23T17:08:55Z",
      amount: 987.65,
      currency: "NRP",
      status: "approved",
      cardLast4: "6011",
      cardType: "DISCOVER"
    },
    {
      txnId: "TXN-2025112414000015",
      timestamp: "2025-11-23T16:45:42Z",
      amount: 2345.67,
      currency: "NRP",
      status: "approved",
      cardLast4: "4539",
      cardType: "VISA"
    }
  ];
  
  const pageSize = 10;
  const startIndex = transactionPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = allTransactions.slice(startIndex, endIndex);
  
  const transactionData = {
    transactions: paginatedTransactions,
    pagination: {
      currentPage: transactionPage + 1,
      pageSize: pageSize,
      totalPages: Math.ceil(allTransactions.length / pageSize),
      totalRecords: allTransactions.length
    }
  };
  
  const transactionsLoading = false;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'acquirer':
        return 'bg-blue-100 text-blue-800';
      case 'issuer':
        return 'bg-purple-100 text-purple-800';
      case 'both':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (merchantLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading merchant details...</p>
        </div>
      </div>
    );
  }

  if (merchantError || !merchant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading merchant</p>
          <p className="text-sm">{merchantError?.message || 'Merchant not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/merchants')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Merchants
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{merchant.memberName}</h1>
            <p className="text-gray-600 mt-1">Member ID: {merchant.memberId}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getTypeBadgeClass(merchant.memberType)}`}>
              {merchant.memberType.toUpperCase()}
            </span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(merchant.status)}`}>
              {merchant.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Country</p>
            <p className="text-gray-900 font-medium">{merchant.country || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created At</p>
            <p className="text-gray-900 font-medium">{formatDate(merchant.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-gray-900 font-medium">{formatDate(merchant.updatedAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              {statsLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats?.totalTransactions || 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              {statsLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">Rs. {stats?.totalRevenue || 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Transaction</p>
              {statsLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">Rs. {stats?.avgTransactionAmount || 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Transaction</p>
              {statsLoading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-sm font-medium text-gray-900">
                  {stats?.lastTransactionDate ? formatDate(stats.lastTransactionDate) : 'No transactions'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        </div>

        {transactionsLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading transactions...</p>
          </div>
        ) : transactionData.transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No transactions found for this merchant
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Card
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactionData.transactions.map((txn) => (
                    <tr key={txn.txnId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {txn.txnId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(txn.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rs. {txn.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                         **** {txn.cardLast4}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          txn.status === 'approved' ? 'bg-green-100 text-green-800' :
                          txn.status === 'declined' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {txn.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {transactionData.pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {transactionPage * 10 + 1} to {Math.min((transactionPage + 1) * 10, transactionData.pagination.totalRecords)} of {transactionData.pagination.totalRecords} transactions
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTransactionPage(p => Math.max(0, p - 1))}
                    disabled={transactionPage === 0}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setTransactionPage(p => p + 1)}
                    disabled={transactionPage >= transactionData.pagination.totalPages - 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
