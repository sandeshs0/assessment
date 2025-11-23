import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMerchant } from '../hooks/useMerchant';
import { useMerchantStats } from '../hooks/useMerchantStats';
import { useMerchantTransactions } from '../hooks/useMerchantTransactions';
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';

export const MerchantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transactionPage, setTransactionPage] = useState(0);
  
  const { data: merchant, loading: merchantLoading, error: merchantError } = useMerchant(id);
  const { data: stats, loading: statsLoading } = useMerchantStats(id);
  const { data: transactionData, loading: transactionsLoading } = useMerchantTransactions(id, transactionPage, 10);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              {statsLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
              )}
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Transaction</p>
              {statsLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.avgTransactionAmount || 0)}</p>
              )}
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
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
            <Calendar className="w-8 h-8 text-orange-500" />
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
        ) : !transactionData || transactionData.transactions.length === 0 ? (
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
                        {formatCurrency(txn.amount)} {txn.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {txn.cardType} •••• {txn.cardLast4}
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
