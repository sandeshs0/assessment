package com.payment.controller;

import com.payment.dto.TransactionResponse;
import com.payment.service.TransactionService;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.annotation.Controller;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.QueryValue;
import io.micronaut.http.annotation.Header;
import io.swagger.v3.oas.annotations.Operation;
import com.payment.entity.TransactionMaster;
import com.payment.repository.TransactionRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Optional;

/**
 * Transaction Controller - BASIC IMPLEMENTATION PROVIDED
 * 
 * TODO for Junior Developer:
 * 1. Create TransactionService and inject it
 * 2. Implement actual database queries
 * 3. Add proper pagination
 * 4. Add date filtering
 * 5. Add status filtering
 * 6. Return proper TransactionResponse DTOs
 * 7. Add error handling
 */
@Controller("/api/v1/merchants")
@Tag(name = "Transactions")
public class TransactionController {

    private final TransactionService transactionService;
    
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }
    @Get("/{merchantId}/transactions")
    @Operation(
        summary = "Get merchant transactions",
        description = "Returns paginated list of transactions for a merchant. TODO: Implement proper pagination, filtering, and database queries."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Fetched Merchant Transactions Successfully.",
            content=@Content(schema = @Schema(implementation = TransactionResponse.class))
    )
    @ApiResponse(responseCode = "400", description = "Invalid input parameters")
    @ApiResponse(responseCode = "404", description = "Merchant not found")
    public HttpResponse<TransactionResponse> getTransactions(
            @PathVariable
            @Parameter(description = "Merchant ID", example = "MCH-001")
            String merchantId,

            @QueryValue(defaultValue = "0")
            @Parameter(description = "Page number", example = "0")
            int page,

            @QueryValue(defaultValue = "20")
            @Parameter(description = "Number of elements per page", example = "20")
            int size,

            @QueryValue
            @Parameter(description = "Start date", example = "2025-11-16", required = true)
            String startDate,

            @QueryValue
            @Parameter(description = "End date", example = "2025-11-18", required = true)
            String endDate,

            @QueryValue
            @Nullable
            @Parameter(description = "Transaction status filter", example = "COMPLETED")
            String status
            ) {
        Instant start = parseDate(startDate, "startDate");
        Instant end = parseDate(endDate, "endDate");

        if (page < 0) {
            throw new IllegalArgumentException("Page number must be greater or equal to 0");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than 1");
        }

        TransactionResponse response = TransactionService.getTransactions(
                merchantId,
                start,
                end,
                status,
                page,
                size
        );
        return HttpResponse.ok(response);
    }

//    @Post("/{merchantId}/transactions")
//    @Operation(
//        summary = "Create new transaction",
//        description = "Creates a new transaction for a merchant. TODO: Add validation, error handling, and business logic."
//    )
//    public HttpResponse<Map<String, Object>> createTransaction(
//            @PathVariable String merchantId,
//            @Body TransactionMaster transaction
//    ) {
//        // TODO: Add validation
//        // TODO: Add error handling
//        // TODO: Move to service layer
//        transaction.setMerchantId(merchantId);
//        TransactionMaster saved = transactionRepository.save(transaction);
//        return HttpResponse.created(Map.of(
//            "message", "Transaction created",
//            "transactionId", saved.getTxnId(),
//            "note", "TODO: Add proper validation and error handling"
//        ));
//    }


//    Helper to parse Date
private Instant parseDate(String dateString, String fieldName) {
    if (dateString == null || dateString.trim().isEmpty()) {
        throw new IllegalArgumentException(fieldName + " is required");
    }

    try {
        LocalDate date = LocalDate.parse(dateString);
        return date.atStartOfDay(ZoneOffset.UTC).toInstant();
    } catch (DateTimeParseException e) {
        throw new IllegalArgumentException(
                fieldName + " must be in format YYYY-MM-DD got: " + dateString
        );
    }
}
}
