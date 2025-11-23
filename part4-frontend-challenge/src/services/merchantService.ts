import type {
    Merchant,
    MerchantFilters,
    MerchantFormData,
    MerchantListResponse,
    MerchantStats,
    Transaction
} from '../types/merchant';
import { del, get, post, put } from './api';

export const merchantService = {
  
    async getMerchants(filters: MerchantFilters = {}): Promise<MerchantListResponse> {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.memberType) params.memberType = filters.memberType;
    if (filters.status) params.status = filters.status;
    if (filters.page !== undefined) params.page = filters.page.toString();
    if (filters.size !== undefined) params.size = filters.size.toString();
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return get<MerchantListResponse>('/merchants', { params });
  },

  async getMerchant(memberId: string): Promise<Merchant> {
    return get<Merchant>(`/merchants/${memberId}`);
  },

  async getMerchantStats(memberId: string): Promise<MerchantStats> {
    return get<MerchantStats>(`/merchants/${memberId}/stats`);
  },

  async getMerchantTransactions(
    memberId: string, 
    page = 0, 
    size = 10
  ): Promise<{ transactions: Transaction[]; pagination: any }> {
    return get(`/merchants/${memberId}/transactions`, {
      params: { page, size },
    });
  },


  async createMerchant(data: MerchantFormData): Promise<Merchant> {
    return post<Merchant>('/merchants', data);
  },


  async updateMerchant(memberId: string, data: Partial<MerchantFormData>): Promise<Merchant> {
    return put<Merchant>(`/merchants/${memberId}`, data);
  },


  async deleteMerchant(memberId: string): Promise<void> {
    return del<void>(`/merchants/${memberId}`);
  },
};
