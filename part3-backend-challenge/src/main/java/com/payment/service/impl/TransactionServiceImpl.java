package com.payment.service.impl;
import com.payment.dto.TransactionResponse;
import com.payment.entity.TransactionDetail;
import com.payment.entity.TransactionMaster;
import com.payment.exception.NotFoundException;
import com.payment.repository.TransactionDetailRepository;
import com.payment.repository.TransactionRepository;
import com.payment.service.TransactionService;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import jakarta.inject.Singleton;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Singleton
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionDetailRepository transactionDetailRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, TransactionDetailRepository transactionDetailRepository) {
        this.transactionRepository = transactionRepository;
        this.transactionDetailRepository = transactionDetailRepository;
    }

    public TransactionResponse getTransactions(
            String merchantId,
            Instant startDate,
            Instant endDate,
            String status,
            int page,
            int size
    ) {
        //        Validation: Checking if the member exists
        validateMerchant(merchantId);

        //        Validatation: Checking if the Date range is valid
        validateDateRange(startDate, endDate);

        Pageable pageable = Pageable.from(page, size);
        Page<TransactionMaster> transactionPage = transactionRepository.findByMerchantAndDateRange(
                merchantId,
                startDate,
                endDate,
                status,
                pageable
        );

        //        Building the response
        TransactionResponse response = new TransactionResponse();
        response.setMerchantId(merchantId);

        TransactionResponse.DateRange dateRange = new TransactionResponse.DateRange(startDate, endDate);
        response.setDateRange(dateRange);

        //        Setting transactions to the response
        List<TransactionResponse.Transaction> transactionDTOs= transactionPage.getContent()
                .stream()
                .map(this::mapToTransactionDTO)
                .collect(Collectors.toList());
        response.setTransactions(transactionDTOs);

        //        Setting summary
        TransactionResponse.Summary summary = calcSummary(merchantId, startDate, endDate);
        response.setSummary(summary);

        //        Seting pagination DTO
        TransactionResponse.Pagination pagination = new TransactionResponse.Pagination(
                page,
                size,
                transactionPage.getTotalPages(),
                transactionPage.getTotalSize()
        );
        response.setPagination(pagination);

        return  response;
    }


    //        Helper method to validate if the merchant exists
    private void validateMerchant(String merchantId) {
        // Check if merchant exists in the system
        boolean exists = transactionRepository.existsByMerchantId(merchantId);
        if (!exists) {
            throw new NotFoundException("Merchant not found");
        }
    }

    // Helper Method to validate the date range
    private void validateDateRange(Instant startDate, Instant endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }
    }

    //    Helper to Map the TransactionMaster entity to Response DTO
    private TransactionResponse.Transaction mapToTransactionDTO(TransactionMaster master) {
        TransactionResponse.Transaction dto = new TransactionResponse.Transaction();
        dto.setTxnId(master.getTxnId());
        dto.setTimestamp(master.getLocalTxnDateTime());
        dto.setAmount(master.getAmount());
        dto.setCurrency(master.getCurrency());
        dto.setStatus(master.getStatus());
        dto.setCardLast4(master.getCardLast4());
        dto.setCardType(master.getCardType());

        //        Transaction Details
        List<TransactionDetail> details = transactionDetailRepository.findByMasterTxnId(master.getTxnId());
        List<TransactionResponse.Detail> detailDto = details.stream().map(this::mapToDetailDto).collect(Collectors.toList());
        dto.setDetails(detailDto);

        return dto;
    }

    //    Helper to map transactionDetail to detail dto
    private TransactionResponse.Detail mapToDetailDto(TransactionDetail detail) {
        TransactionResponse.Detail dto = new TransactionResponse.Detail();
        dto.setType(detail.getDetailType());
        dto.setAmount(detail.getAmount());
        dto.setCurrency(detail.getCurrency());
        return dto;
    }

    //    Helper to calculate summary
    private TransactionResponse.Summary calcSummary(String merchantId, Instant startDate, Instant endDate) {
        TransactionResponse.Summary summary = new TransactionResponse.Summary();
        //        Fetching transactions for the date range
        List<TransactionMaster> allTransactions= transactionRepository.findByMerchantIdAndLocalTxnDateTimeBetween(merchantId,startDate,endDate);

        //        Total Count
        summary.setTotalTransactions(allTransactions.size());

        //        For Total Amount
        BigDecimal totalAmount = allTransactions.stream().map(TransactionMaster::getAmount).filter(Objects::nonNull).reduce(BigDecimal.ZERO,BigDecimal::add);
        summary.setTotalAmount(totalAmount);

        //        Currency
        String currency = allTransactions.get(0).getCurrency();
        summary.setCurrency(currency);

        //        Status Stats
        List<TransactionRepository.StatusCount> statusCounts = transactionRepository.countByStatus(merchantId,startDate,endDate);
        Map<String, Integer> byStatus = statusCounts.stream().collect(Collectors.toMap(
                TransactionRepository.StatusCount::getStatus,
                sc -> sc.getCount().intValue()
        ));
        summary.setByStatus(byStatus);

        return summary;
    }
}