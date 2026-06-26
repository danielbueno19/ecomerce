package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambiarPasswordRequest {
    private String actualPassword;
    private String nuevaPassword;
}
