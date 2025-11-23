package com.payment.service;

import com.payment.dto.TransactionResponse;
import com.vladsch.flexmark.ext.ins.Ins;

import java.time.Instant;
import java.time.LocalDate;
public interface TransactionService {
    static TransactionResponse getTransactions(
            String merchantId,
            Instant startDate,
            Instant endDate,
            String status,
            int page,
            int size
    ){
        return  null;
    }
}
