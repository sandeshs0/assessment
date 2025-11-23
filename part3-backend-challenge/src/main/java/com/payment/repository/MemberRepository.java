package com.payment.repository;

import com.payment.entity.Member;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.PageableRepository;

import java.util.Optional;

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface MemberRepository extends PageableRepository<Member, Long> {

    Optional<Member> findByMemberCode(String memberCode);

    @Query(value = "SELECT * FROM operators.members WHERE " +
            "(COALESCE(:search, '') = '' OR LOWER(member_name) LIKE LOWER(CONCAT('%', :search, '%')) OR CAST(member_id AS TEXT) LIKE CONCAT('%', :search, '%')) " +
            "AND (COALESCE(:memberType, '') = '' OR member_type = :memberType) " +
            "AND (COALESCE(:status, '') = '' OR status = :status)",
            countQuery = "SELECT COUNT(*) FROM operators.members WHERE " +
            "(COALESCE(:search, '') = '' OR LOWER(member_name) LIKE LOWER(CONCAT('%', :search, '%')) OR CAST(member_id AS TEXT) LIKE CONCAT('%', :search, '%')) " +
            "AND (COALESCE(:memberType, '') = '' OR member_type = :memberType) " +
            "AND (COALESCE(:status, '') = '' OR status = :status)",
            nativeQuery = true)
    Page<Member> findWithFilters(@Nullable String search, 
                                  @Nullable String memberType, 
                                  @Nullable String status, 
                                  Pageable pageable);
}
