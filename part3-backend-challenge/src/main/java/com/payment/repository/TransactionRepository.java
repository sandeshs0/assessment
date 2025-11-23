package com.payment.repository;

import com.payment.entity.TransactionMaster;
import com.vladsch.flexmark.ext.ins.Ins;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import io.micronaut.serde.annotation.Serdeable;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository for TransactionMaster entities.
 * 
 * TODO: Add custom query methods for:
 * - Finding transactions by merchant ID with date range
 * - Paginated queries
 * - Aggregation queries for summary calculation
 * - Join queries with transaction details
 */
@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface TransactionRepository extends CrudRepository<TransactionMaster, Long> {

    // Example: Basic finder method (provided)
    List<TransactionMaster> findByMerchantId(String merchantId);

    boolean existsByMerchantId(String merchantId);

    // Query Method to find transaction by MerchantID and Date Range with pagination and status filtering
    @Query(value = "SELECT * FROM operators.transaction_master "+
                    "WHERE merchant_id = :merchantId "+
                    "AND txn_date BETWEEN :startDate AND :endDate AND (:status IS NULL OR status = :status) "+
                    "ORDER BY local_txn_date_time DESC",
                    countQuery = "SELECT COUNT(*) FROM operators.transaction_master " +
                    "WHERE merchant_id = :merchantId AND txn_date BETWEEN :startDate AND :endDate " +
                    "AND (:status IS NULL OR status = :status)")
    Page<TransactionMaster> findByMerchantAndDateRange(
      String merchantId,
      Instant startDate,
      Instant endDate,
      String status,
      Pageable pageable
    );

//    To find transactions by merchant and date range for summary so no pagination required.
    List<TransactionMaster>findByMerchantIdAndLocalTxnDateTimeBetween(
            String merchantId,
            Instant startDate,
            Instant endDate
    );

//    Transaction Count by Status
    @Query("SELECT status, COUNT(*) as count FROM operators.transaction_master " +
            "WHERE merchant_id = :merchantId AND txn_date BETWEEN :startDate AND :endDate " +
            "GROUP BY status")
    List<StatusCount> countByStatus(
            String merchantId,
            Instant startDate,
            Instant endDate
    );

//    Status Count Type Defination
    @Serdeable
    class StatusCount {
        private String status;
        private Long count;

    public StatusCount(String status, Long count) {
        this.status = status;
        this.count = count;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}

}
