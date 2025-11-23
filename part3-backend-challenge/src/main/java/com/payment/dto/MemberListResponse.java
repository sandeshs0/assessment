package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;
import java.util.List;

@Serdeable
public class MemberListResponse {

    private List<MemberResponse> merchants;
    private Pagination pagination;

    public List<MemberResponse> getMerchants() {
        return merchants;
    }

    public void setMerchants(List<MemberResponse> merchants) {
        this.merchants = merchants;
    }

    public Pagination getPagination() {
        return pagination;
    }

    public void setPagination(Pagination pagination) {
        this.pagination = pagination;
    }

    @Serdeable
    public static class Pagination {
        private int currentPage;
        private int pageSize;
        private int totalPages;
        private long totalRecords;

        public int getCurrentPage() {
            return currentPage;
        }

        public void setCurrentPage(int currentPage) {
            this.currentPage = currentPage;
        }

        public int getPageSize() {
            return pageSize;
        }

        public void setPageSize(int pageSize) {
            this.pageSize = pageSize;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }

        public long getTotalRecords() {
            return totalRecords;
        }

        public void setTotalRecords(long totalRecords) {
            this.totalRecords = totalRecords;
        }
    }
}
