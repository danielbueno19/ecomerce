package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfirmacionEmailRequest {
    private String email;
    private String codigoConfirmacion;
}
