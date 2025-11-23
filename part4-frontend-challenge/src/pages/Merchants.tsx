import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/common/Modal';
import { Pagination } from '../components/common/Pagination';
import { MerchantFilters } from '../components/merchants/MerchantFilters';
import { MerchantForm } from '../components/merchants/MerchantForm';
import { MerchantTable } from '../components/merchants/MerchantTable';
import { useMerchantMutations } from '../hooks/useMerchantMutations';
import { useMerchants } from '../hooks/useMerchants';
import type { MerchantFilters as FilterType, Merchant, MerchantFormData } from '../types/merchant';
import './Merchants.css';

export const Merchants = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    size: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [deactivatingMerchant, setDeactivatingMerchant] = useState<Merchant | null>(null);

  const { data, loading, error, refetch } = useMerchants(filters);
  const { creating, updating, deleting, createMerchant, updateMerchant, deactivateMerchant } = useMerchantMutations();

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
    setEditingMerchant(merchant);
    setIsModalOpen(true);
  };

  const handleDeactivate = async (merchant: Merchant) => {
    setDeactivatingMerchant(merchant);
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivatingMerchant) return;
    
    try {
      await deactivateMerchant(deactivatingMerchant.memberId);
      setDeactivatingMerchant(null);
      refetch();
    } catch (err) {
      console.error('Failed to deactivate merchant:', err);
    }
  };

  const handleCancelDeactivate = () => {
    setDeactivatingMerchant(null);
  };

  const handleAddNew = () => {
    setEditingMerchant(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMerchant(null);
  };

  const handleFormSubmit = async (formData: MerchantFormData) => {
    try {
      if (editingMerchant) {
        await updateMerchant(editingMerchant.memberId, formData);
      } else {
        await createMerchant(formData);
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error('Failed to save merchant:', err);
      throw err;
    }
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
        onDeactivate={handleDeactivate}
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMerchant ? 'Edit Merchant' : 'Add New Merchant'}
      >
        <MerchantForm
          initialData={editingMerchant ? {
            memberName: editingMerchant.memberName,
            memberType: editingMerchant.memberType,
            country: editingMerchant.country
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isSubmitting={creating || updating}
        />
      </Modal>

      <Modal
        isOpen={!!deactivatingMerchant}
        onClose={handleCancelDeactivate}
        title="Confirm Deactivate Merchant?"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to deactivate merchant <strong>"{deactivatingMerchant?.memberName}"</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancelDeactivate}
              disabled={deleting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDeactivate}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deactivating...' : 'Deactivate'}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
};
