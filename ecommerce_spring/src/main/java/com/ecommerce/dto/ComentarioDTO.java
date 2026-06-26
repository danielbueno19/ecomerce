package com.ecommerce.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComentarioDTO {
    private Long id;

    @NotBlank(message = "Comentario de producto es requerido")
    private String contenido;

    @Min(value = 1)
    @Max(value = 5)
    private Integer puntuacion;
    private Long usuarioId;
}
