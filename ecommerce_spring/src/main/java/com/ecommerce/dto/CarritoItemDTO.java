package com.ecommerce.dto;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarritoItemDTO {
    private Long id;
    private Long productoId;

    @Positive
    private Integer cantidad;
}
