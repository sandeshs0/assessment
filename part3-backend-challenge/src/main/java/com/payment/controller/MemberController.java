package com.payment.controller;

import com.payment.dto.*;
import com.payment.service.MemberService;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import jakarta.validation.Valid;

@Controller("/api/v1/merchants")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @Get
    public HttpResponse<MemberListResponse> findAll(
            @Nullable
            @QueryValue
            String search,


            @Nullable @QueryValue String memberType,
            @Nullable @QueryValue String status,
            @Nullable @QueryValue String sortBy,
            @Nullable @QueryValue String sortOrder,
            @QueryValue(defaultValue = "1") int page,
            @QueryValue(defaultValue = "20") int size) {

        MemberListResponse response = memberService.findAll(
            search, memberType, status, sortBy, sortOrder, page, size
        );
        
        return HttpResponse.ok(response);
    }

    @Get("/{memberId}")
    public HttpResponse<MemberResponse> findById(@PathVariable Long memberId) {
        MemberResponse response = memberService.findById(memberId);
        return HttpResponse.ok(response);
    }

    @Post
    public HttpResponse<MemberResponse> create(@Valid @Body MemberRequest request) {
        MemberResponse response = memberService.create(request);
        return HttpResponse.created(response);
    }

    @Put("/{memberId}")
    public HttpResponse<MemberResponse> update(@PathVariable Long memberId, 
                                               @Valid @Body MemberRequest request) {
        MemberResponse response = memberService.update(memberId, request);
        return HttpResponse.ok(response);
    }

    @Patch("/{memberId}")
    public HttpResponse<Void> deactivate(@PathVariable Long memberId) {
        memberService.deactivate(memberId);
        return HttpResponse.noContent();
    }

    @Get("/{memberId}/stats")
    public HttpResponse<MemberStatsResponse> getStats(@PathVariable String memberCode) {
        MemberStatsResponse stats = memberService.getStats(memberCode);
        return HttpResponse.ok(stats);
    }

    @Get("/{memberId}/transactions")
    public HttpResponse<MemberTransactionListResponse> getTransactions(
            @PathVariable String memberCode,
            @QueryValue(defaultValue = "0") int page,
            @QueryValue(defaultValue = "10") int size) {
        MemberTransactionListResponse response = memberService.getTransactions(memberCode, page, size);
        return HttpResponse.ok(response);
    }
}
