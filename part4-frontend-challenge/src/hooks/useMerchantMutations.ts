import { useState } from 'react';
import { merchantService } from '../services/merchantService';
import type { Merchant, MerchantFormData } from '../types/merchant';

interface UseMerchantMutationsResult {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: Error | null;
  createMerchant: (data: MerchantFormData) => Promise<Merchant | null>;
  updateMerchant: (memberId: string, data: Partial<MerchantFormData>) => Promise<Merchant | null>;
  deleteMerchant: (memberId: string) => Promise<boolean>;
}

export const useMerchantMutations = (): UseMerchantMutationsResult => {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createMerchant = async (data: MerchantFormData): Promise<Merchant | null> => {
    try {
      setCreating(true);
      setError(null);
      const response = await merchantService.createMerchant(data);
      return response;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating merchant:', err);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const updateMerchant = async (
    memberId: string, 
    data: Partial<MerchantFormData>
  ): Promise<Merchant | null> => {
    try {
      setUpdating(true);
      setError(null);
      const response = await merchantService.updateMerchant(memberId, data);
      return response;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating merchant:', err);
      return null;
    } finally {
      setUpdating(false);
    }
  };

  const deleteMerchant = async (memberId: string): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      await merchantService.deleteMerchant(memberId);
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting merchant:', err);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    creating,
    updating,
    deleting,
    error,
    createMerchant,
    updateMerchant,
    deleteMerchant,
  };
};