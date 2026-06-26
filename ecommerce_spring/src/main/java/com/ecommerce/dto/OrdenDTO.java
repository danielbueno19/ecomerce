package com.ecommerce.dto;

import com.ecommerce.model.Orden;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OrdenDTO {
    private Long id;
    private Long usuarioId;

    @NotBlank(message = "Dirección es requerida")
    private String direccion;

    @NotBlank(message = "Teléfono es requerida")
    private String telefono;
    private Orden.EstadoOrden estado;
    private LocalDateTime fechaCreacion;
    private List<OrdenItemDTO> ordenItems;
}
