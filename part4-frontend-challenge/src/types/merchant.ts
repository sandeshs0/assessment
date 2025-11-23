export interface Merchant {
  memberId: string;
  memberName: string;
  memberType: 'ACQUIRER' | 'ISSUER' | 'BOTH';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  address?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantStats {
  totalTransactions: number;
  totalRevenue: number;
  avgTransactionAmount: number;
  lastTransactionDate?: string;
}

export interface MerchantFormData {
  memberName: string;
  memberType: 'ACQUIRER' | 'ISSUER' | 'BOTH';
  address: string;
  country: string;
}

export interface MerchantFilters {
  search?: string;
  memberType?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MerchantListResponse {
  merchants: Merchant[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
}

export interface Transaction {
  txnId: number;
  timestamp: string;
  amount: number;
  currency: string;
  status: string;
  cardLast4: string;
  cardType: string;
}