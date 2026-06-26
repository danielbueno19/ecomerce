package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductoDTO {
    private Long id;

    @NotBlank(message = "Nombre de producto es requerido")
    private String nombre;

    @NotBlank(message = "Descripción del producto es requerida")
    private String descripcion;

    @Positive(message = "Precio de producto no puede ser negativo")
    private BigDecimal precio;

    @PositiveOrZero(message = "Cantidad de producto no puede ser negativa")
    private Integer cantidad;

    private String imagen;

    private List<ComentarioDTO> comentarios;
}
