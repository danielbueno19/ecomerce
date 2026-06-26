package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class ProductoListDto {
    private Long id;

    @NotBlank(message = "El nombre es requerido")
    private String nombre;

    @NotBlank(message = "La descripción es requerida")
    private String descripcion;

    @Positive(message = "El precio debera ser positivo")
    private BigDecimal price;

    @PositiveOrZero(message = "La cantidad debe ser mayor o igual a 0")
    private Integer cantidad;

    private String imagen;
}
