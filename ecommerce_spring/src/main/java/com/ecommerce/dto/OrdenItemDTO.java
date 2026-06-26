package com.ecommerce.dto;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrdenItemDTO {
    private Long id;
    private Long productoId;

    @Positive
    private Integer cantidad;

    @Positive
    private BigDecimal precio;
}
