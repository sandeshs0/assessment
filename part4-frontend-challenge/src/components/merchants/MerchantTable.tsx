import type { Merchant } from '../../types/merchant';
import { Ban } from 'lucide-react';
import {PenSquare} from 'lucide-react'

interface MerchantTableProps {
  merchants: Merchant[];
  loading: boolean;
  onView: (merchant: Merchant) => void;
  onEdit: (merchant: Merchant) => void;
  onDeactivate: (merchant: Merchant) => void;
}

export const MerchantTable = ({ 
  merchants, 
  loading, 
  onView, 
  onEdit, 
  onDeactivate 
}: MerchantTableProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading merchants...</p>
      </div>
    );
  }

  if (merchants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No merchants found</p>
      </div>
    );
  }

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
      case 'ACQUIRER':
        return 'bg-blue-100 text-blue-800';
      case 'ISSUER':
        return 'bg-purple-100 text-purple-800';
      case 'BOTH':
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
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Member Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {merchants.map((merchant) => (
            <tr key={merchant.memberCode} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {merchant.memberCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {merchant.memberName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(merchant.memberType)}`}>
                  {merchant.memberType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(merchant.status)}`}>
                  {merchant.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(merchant.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onView(merchant)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(merchant)}
                  className="text-black-600 hover:text-indigo-900 mr-3"
                >
                 <PenSquare className="inline-block w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeactivate(merchant)}
                  className="text-red-400 hover:text-red-900"
                >
                  <Ban className="inline-block w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
