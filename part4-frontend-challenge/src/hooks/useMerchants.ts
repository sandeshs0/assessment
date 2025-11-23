import { useEffect, useState } from 'react';
import { merchantService } from '../services/merchantService';
import type { Merchant, MerchantFilters } from '../types/merchant';

interface UseMerchantsResult {
  data: {
    merchants: Merchant[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalRecords: number;
    };
  } | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useMerchants = (
  filters: MerchantFilters
): UseMerchantsResult => {
  const [data, setData] = useState<UseMerchantsResult['data']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await merchantService.getMerchants(filters);
      setData(response);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [
    filters.page, 
    filters.size, 
    filters.search, 
    filters.memberType, 
    filters.status,
    filters.sortBy,
    filters.sortOrder
  ]);

  return {
    data,
    loading,
    error,
    refetch: fetchMerchants,
  };
};