import { useEffect, useState } from 'react';
import { merchantService } from '../services/merchantService';
import type { MerchantStats } from '../types/merchant';

interface UseMerchantStatsResult {
  data: MerchantStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useMerchantStats = (
  memberId: string | undefined
): UseMerchantStatsResult => {
  const [data, setData] = useState<MerchantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await merchantService.getMerchantStats(memberId);
      setData(response);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching merchant stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [memberId]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
};