package com.ecommerce.mapper;

import com.ecommerce.dto.CarritoDTO;
import com.ecommerce.dto.CarritoItemDTO;
import com.ecommerce.model.Carrito;
import com.ecommerce.model.CarritoItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CarritoMapper {
    @Mapping(target = "usuarioId", source = "usuario.id")
    CarritoDTO toDTO(Carrito carrito);

    @Mapping(target = "usuario.id", source = "usuarioId")
    Carrito toEntity(CarritoDTO carritoDTO);

    @Mapping(target = "productoId", source = "producto.id")
    CarritoItemDTO toDTO(CarritoItem carritoItem);

    @Mapping(target = "producto.id", source = "productoId")
    CarritoItem toEntity(CarritoItemDTO carritoItemDTO);

}
