package com.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import com.vladsch.flexmark.ext.ins.Ins;
import io.micronaut.serde.annotation.Serdeable;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public class TransactionResponse {

    @JsonProperty("merchantId")
    private String merchantId;

    @JsonProperty("dateRange")
    private DateRange dateRange;

    @JsonProperty("summary")
    private Summary summary;

    @JsonProperty("transactions")
    private List<Transaction> transactions;

    @JsonProperty("pagination")
    private Pagination pagination;

    @Serdeable
    public static class DateRange{

        @JsonProperty("start")
        private Instant start;

        @JsonProperty("end")
        private Instant end;

        public DateRange(){}

        public DateRange(Instant start, Instant end){
            this.start = start;
            this.end=end;
        }

        public Instant getStart() {
            return start;
        }

        public void setStart(Instant start) {
            this.start = start;
        }

        public Instant getEnd() {
            return end;
        }

        public void setEnd(Instant end) {
            this.end = end;
        }
    }

    @Serdeable
    public static class Summary{
        @JsonProperty("totalTransactions")
        private Integer totalTransactions;

        @JsonProperty("totalAmount")
        private BigDecimal totalAmount;

        @JsonProperty("currency")
        private String currency;

        @JsonProperty("byStatus")
        private Map<String, Integer> byStatus;

        public Summary() {}

        public Integer getTotalTransactions() {
            return totalTransactions;
        }

        public void setTotalTransactions(Integer totalTransactions) {
            this.totalTransactions = totalTransactions;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public Map<String, Integer> getByStatus() {
            return byStatus;
        }

        public void setByStatus(Map<String, Integer> byStatus) {
            this.byStatus = byStatus;
        }
    }

    @Getter
    @Serdeable
    public static class Transaction{
        @JsonProperty("txnId")
        private Long txnId;

        @JsonProperty("amount")
        private BigDecimal amount;

        @JsonProperty("currency")
        private String currency;

        @JsonProperty("status")
        private String status;

        @JsonProperty("timestamp")
        private Instant timestamp;

        @JsonProperty("cardType")
        private String cardType;

        @JsonProperty("cardLast4")
        private String cardLast4;

        @JsonProperty("acquirer")
        private String acquirer;

        @JsonProperty("issuer")
        private String issuer;

        @JsonProperty("details")
        private List<Detail>details;

        public Transaction() {
        }

        public Long getTxnId() {
            return txnId;
        }

        public void setTxnId(Long txnId) {
            this.txnId = txnId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Instant getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Instant timestamp) {
            this.timestamp = timestamp;
        }

        public String getCardType() {
            return cardType;
        }

        public void setCardType(String cardType) {
            this.cardType = cardType;
        }

        public String getCardLast4() {
            return cardLast4;
        }

        public void setCardLast4(String cardLast4) {
            this.cardLast4 = cardLast4;
        }

        public String getAcquirer() {
            return acquirer;
        }

        public void setAcquirer(String acquirer) {
            this.acquirer = acquirer;
        }

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }

        public List<Detail> getDetails() {
            return details;
        }

        public void setDetails(List<Detail> details) {
            this.details = details;
        }
    }

    @Serdeable
    public static class Detail{
        @JsonProperty("type")
        private String type;

        @JsonProperty("amount")
        private BigDecimal amount;

        @JsonProperty("currency")
        private String currency;

        public Detail() {
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }
    }

    @Getter
    @Serdeable
    public static class Pagination{
        @JsonProperty("page")
        private Integer page;

        @JsonProperty("size")
        private Integer size;

        @JsonProperty("totalPages")
        private Integer totalPages;

        @JsonProperty("totalElements")
        private Long totalElements;

        public Pagination(Integer page, Integer size, Integer totalPages, Long totalElements) {
            this.page = page;
            this.size = size;
            this.totalPages = totalPages;
            this.totalElements = totalElements;
        }

        public Integer getPage() {
            return page;
        }

        public void setPage(Integer page) {
            this.page = page;
        }

        public Integer getSize() {
            return size;
        }

        public void setSize(Integer size) {
            this.size = size;
        }

        public Integer getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(Integer totalPages) {
            this.totalPages = totalPages;
        }

        public Long getTotalElements() {
            return totalElements;
        }

        public void setTotalElements(Long totalElements) {
            this.totalElements = totalElements;
        }
    }

    public TransactionResponse() {
    }

    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public DateRange getDateRange() {
        return dateRange;
    }

    public void setDateRange(DateRange dateRange) {
        this.dateRange = dateRange;
    }

    public Summary getSummary() {
        return summary;
    }

    public void setSummary(Summary summary) {
        this.summary = summary;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public Pagination getPagination() {
        return pagination;
    }

    public void setPagination(Pagination pagination) {
        this.pagination = pagination;
    }
}
