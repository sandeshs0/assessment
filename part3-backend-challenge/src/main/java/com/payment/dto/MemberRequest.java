package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Serdeable
public class MemberRequest {

    @NotBlank(message = "Member name is required")
    @Size(min = 3, max = 100, message = "Member name must be between 3 and 100 characters")
    private String memberName;

    @NotBlank(message = "Member type is required")
    private String memberType;

    @Size(max = 50, message = "Country must not exceed 50 characters")
    private String country;

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getMemberType() {
        return memberType;
    }

    public void setMemberType(String memberType) {
        this.memberType = memberType;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
