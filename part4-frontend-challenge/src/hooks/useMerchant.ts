import { useEffect, useState } from 'react';
import { merchantService } from '../services/merchantService';
import type { Merchant } from '../types/merchant';

interface UseMerchantResult {
  data: Merchant | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useMerchant = (
  memberId: string | undefined
): UseMerchantResult => {
  const [data, setData] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMerchant = async () => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await merchantService.getMerchant(memberId);
      setData(response);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching merchant:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, [memberId]);

  return {
    data,
    loading,
    error,
    refetch: fetchMerchant,
  };
};