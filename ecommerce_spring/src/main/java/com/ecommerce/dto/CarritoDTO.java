package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CarritoDTO {
    private Long id;
    private Long usuarioId;
    private List<CarritoItemDTO> items;
}
