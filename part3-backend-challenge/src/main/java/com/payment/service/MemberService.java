package com.payment.service;

import com.payment.dto.*;

public interface MemberService {

    MemberListResponse findAll(String search, String memberType, String status, 
                               String sortBy, String sortOrder, int page, int size);

    MemberResponse findById(Long memberId);

    MemberResponse create(MemberRequest request);

    MemberResponse update(Long memberId, MemberRequest request);

    void deactivate(Long memberId);

    MemberStatsResponse getStats(String memberCode);

    MemberTransactionListResponse getTransactions(String memberCode, int page, int size);
}
