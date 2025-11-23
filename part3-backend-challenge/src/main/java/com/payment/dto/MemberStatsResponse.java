package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class MemberStatsResponse {
    private Long totalTransactions;
    private Double totalRevenue;
    private Double avgTransactionAmount;
    private String lastTransactionDate;

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Double getAvgTransactionAmount() {
        return avgTransactionAmount;
    }

    public void setAvgTransactionAmount(Double avgTransactionAmount) {
        this.avgTransactionAmount = avgTransactionAmount;
    }

    public String getLastTransactionDate() {
        return lastTransactionDate;
    }

    public void setLastTransactionDate(String lastTransactionDate) {
        this.lastTransactionDate = lastTransactionDate;
    }
}
