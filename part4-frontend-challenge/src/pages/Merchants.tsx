import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../components/common/Pagination';
import { MerchantFilters } from '../components/merchants/MerchantFilters';
import { MerchantTable } from '../components/merchants/MerchantTable';
import { useMerchantMutations } from '../hooks/useMerchantMutations';
import { useMerchants } from '../hooks/useMerchants';
import type { MerchantFilters as FilterType, Merchant } from '../types/merchant';
import './Merchants.css';

export const Merchants = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    size: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data, loading, error, refetch } = useMerchants(filters);
  const { deleting, deleteMerchant } = useMerchantMutations();

  const handleFilterChange = (newFilters: Partial<FilterType>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      size: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters(prev => ({ ...prev, size, page: 1 }));
  };

  const handleView = (merchant: Merchant) => {
    navigate(`/merchants/${merchant.memberId}`);
  };

  const handleEdit = (merchant: Merchant) => {
    navigate(`/merchants/${merchant.memberId}/edit`);
  };

  const handleDelete = async (merchant: Merchant) => {
    if (window.confirm(`Are you sure you want to delete merchant "${merchant.memberName}"?`)) {
      try {
        await deleteMerchant(merchant.memberId);
        refetch();
      } catch (err) {
        console.error('Failed to delete merchant:', err);
      }
    }
  };

  const handleAddNew = () => {
    navigate('/merchants/new');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Merchants Management</h1>
          <p className="text-gray-600 mt-1">Manage merchant accounts and settings</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Merchant
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading merchants</p>
          <p className="text-sm">{error.message || String(error)}</p>
        </div>
      )}

      <MerchantFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <MerchantTable
        merchants={data?.merchants || []}
        loading={loading || deleting}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {data && data.pagination.totalPages > 0 && (
        <Pagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          pageSize={data.pagination.pageSize}
          totalItems={data.pagination.totalRecords}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </main>
  );
};
