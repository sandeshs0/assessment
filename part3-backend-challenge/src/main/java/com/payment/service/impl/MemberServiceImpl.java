package com.payment.service.impl;

import com.payment.dto.*;
import com.payment.entity.Member;
import com.payment.entity.TransactionDetail;
import com.payment.entity.TransactionMaster;
import com.payment.exception.NotFoundException;
import com.payment.repository.MemberRepository;
import com.payment.repository.TransactionDetailRepository;
import com.payment.repository.TransactionRepository;
import com.payment.service.MemberService;
import com.payment.service.TransactionService;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.Sort;
import jakarta.inject.Singleton;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Singleton
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionDetailRepository transactionDetailRepository;

    public MemberServiceImpl(MemberRepository memberRepository,
                            TransactionRepository transactionRepository,
                            TransactionDetailRepository transactionDetailRepository) {
        this.memberRepository = memberRepository;
        this.transactionRepository = transactionRepository;
        this.transactionDetailRepository = transactionDetailRepository;
    }

    @Override
    public MemberListResponse findAll(String search, String memberType, String status,
                                      String sortBy, String sortOrder, int page, int size) {
        
        String effectiveSortBy = sortBy != null ? sortBy : "createdAt";
        String effectiveSortOrder = sortOrder != null ? sortOrder : "desc";
        
        String columnName = mapSortByToColumn(effectiveSortBy);
        Sort.Order order = effectiveSortOrder.equalsIgnoreCase("asc") 
            ? Sort.Order.asc(columnName) 
            : Sort.Order.desc(columnName);
        
        Pageable pageable = Pageable.from(page - 1, size, Sort.of(order));
        
        Page<Member> memberPage = memberRepository.findWithFilters(
            search, memberType, status, pageable
        );

        List<MemberResponse> memberResponses = memberPage.getContent()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());

        MemberListResponse response = new MemberListResponse();
        response.setMerchants(memberResponses);

        MemberListResponse.Pagination pagination = new MemberListResponse.Pagination();
        pagination.setCurrentPage(page);
        pagination.setPageSize(size);
        pagination.setTotalPages(memberPage.getTotalPages());
        pagination.setTotalRecords(memberPage.getTotalSize());
        response.setPagination(pagination);

        return response;
    }
    
    private String mapSortByToColumn(String sortBy) {
        switch (sortBy) {
            case "memberName":
                return "member_name";
            case "createdAt":
                return "created_at";
            case "updatedAt":
                return "updated_at";
            default:
                return "created_at";
        }
    }

    @Override
    public MemberResponse findById(Long memberId) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("Member not found with id: " + memberId));
        
        return mapToResponse(member);
    }

    @Override
    public MemberResponse create(MemberRequest request) {
        validateMemberType(request.getMemberType());
        
        Member member = new Member();
        member.setMemberName(request.getMemberName());
        member.setMemberType(request.getMemberType());
        member.setCountry(request.getCountry());
        member.setMemberCode(generateMemberCode());
        member.setStatus("active");

        Member savedMember = memberRepository.save(member);
        return mapToResponse(savedMember);
    }

    @Override
    public MemberResponse update(Long memberId, MemberRequest request) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("Member not found with id: " + memberId));

        validateMemberType(request.getMemberType());

        member.setMemberName(request.getMemberName());
        member.setMemberType(request.getMemberType());
        member.setCountry(request.getCountry());

        Member updatedMember = memberRepository.update(member);
        return mapToResponse(updatedMember);
    }

    @Override
    public void deactivate(Long memberId) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new NotFoundException("Member not found with id: " + memberId));

        member.setStatus("inactive");
        memberRepository.update(member);
    }

    @Override
    public MemberStatsResponse getStats(String memberCode) {
        Member member = memberRepository.findByMemberCode(memberCode)
            .orElseThrow(() -> new NotFoundException("Member not found with member code: " + memberCode));

        List<TransactionMaster> transactions = transactionRepository.findByMerchantId(String.valueOf(memberCode));

        MemberStatsResponse stats = new MemberStatsResponse();
        stats.setTotalTransactions((long) transactions.size());

        if (!transactions.isEmpty()) {
            double totalRevenue = transactions.stream()
                .mapToDouble(t -> t.getAmount() != null ? t.getAmount().doubleValue() : 0.0)
                .sum();
            
            stats.setTotalRevenue(totalRevenue);
            stats.setAvgTransactionAmount(totalRevenue / transactions.size());

            Instant lastTxnDate = transactions.stream()
                .map(TransactionMaster::getLocalTxnDateTime)
                .filter(Objects::nonNull)
                .max(Instant::compareTo)
                .orElse(null);
            
            stats.setLastTransactionDate(lastTxnDate != null ? lastTxnDate.toString() : null);
        } else {
            stats.setTotalRevenue(0.0);
            stats.setAvgTransactionAmount(0.0);
            stats.setLastTransactionDate(null);
        }

        return stats;
    }

    @Override
    public MemberTransactionListResponse getTransactions(String memberCode, int page, int size) {
        Member member = memberRepository.findByMemberCode(memberCode)
            .orElseThrow(() -> new NotFoundException("Member not found with id: " + memberCode));

        List<TransactionMaster> transactions = transactionRepository.findByMerchantId(String.valueOf(memberCode));

        int start = page * size;
        int end = Math.min(start + size, transactions.size());
        List<TransactionMaster> paginatedTransactions = transactions.subList(start, end);

        List<MemberTransactionResponse> transactionResponses = paginatedTransactions.stream()
            .map(this::mapToTransactionResponse)
            .collect(Collectors.toList());

        MemberTransactionListResponse response = new MemberTransactionListResponse();
        response.setTransactions(transactionResponses);

        MemberTransactionListResponse.Pagination pagination = new MemberTransactionListResponse.Pagination();
        pagination.setCurrentPage(page + 1);
        pagination.setPageSize(size);
        pagination.setTotalRecords(transactions.size());
        pagination.setTotalPages((int) Math.ceil((double) transactions.size() / size));
        response.setPagination(pagination);

        return response;
    }

    private MemberTransactionResponse mapToTransactionResponse(TransactionMaster transaction) {
        MemberTransactionResponse response = new MemberTransactionResponse();
        response.setTxnId(transaction.getTxnId());
        response.setTimestamp(transaction.getLocalTxnDateTime() != null ? transaction.getLocalTxnDateTime().toString() : null);
        response.setAmount(transaction.getAmount() != null ? transaction.getAmount().doubleValue() : 0.0);
        response.setCurrency(transaction.getCurrency());
        response.setStatus(transaction.getStatus());
        response.setCardLast4(transaction.getCardLast4());
        response.setCardType("VISA");
        return response;
    }

    private MemberResponse mapToResponse(Member member) {
        MemberResponse response = new MemberResponse();
        response.setMemberId(String.valueOf(member.getMemberId()));
        response.setMemberCode(member.getMemberCode());
        response.setMemberName(member.getMemberName());
        response.setMemberType(member.getMemberType());
        response.setStatus(member.getStatus());
        response.setCountry(member.getCountry());
        response.setCreatedAt(member.getCreatedAt() != null ? member.getCreatedAt().toString() : null);
        response.setUpdatedAt(member.getUpdatedAt() != null ? member.getUpdatedAt().toString() : null);
        return response;
    }

    private void validateMemberType(String memberType) {
        if (memberType == null || 
            (!memberType.equals("acquirer") && !memberType.equals("issuer") && !memberType.equals("both"))) {
            throw new IllegalArgumentException("Invalid member type. Must be acquirer, issuer, or both");
        }
    }

    private String generateMemberCode() {
        return "MEM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

}
