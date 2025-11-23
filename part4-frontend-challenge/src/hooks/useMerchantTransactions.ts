import { useEffect, useState } from 'react';
import { merchantService } from '../services/merchantService';
import type { Transaction } from '../types/merchant';

interface UseMerchantTransactionsResult {
  data: {
    transactions: Transaction[];
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

export const useMerchantTransactions = (
  memberCode: string | undefined,
  page = 0,
  size = 10
): UseMerchantTransactionsResult => {
  const [data, setData] = useState<UseMerchantTransactionsResult['data']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async () => {
    if (!memberCode) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await merchantService.getMerchantTransactions(memberCode, page, size);
      setData(response as any);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching merchant transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [memberCode, page, size]);

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions,
  };
};