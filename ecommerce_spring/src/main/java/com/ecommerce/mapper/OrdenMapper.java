package com.ecommerce.mapper;

import com.ecommerce.dto.OrdenDTO;
import com.ecommerce.dto.OrdenItemDTO;
import com.ecommerce.model.Orden;
import com.ecommerce.model.OrdenItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrdenMapper {
    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "ordenItems", source = "ordenItems")
    OrdenDTO toDTO(Orden orden);

    @Mapping(target = "usuario.id", source = "usuarioId")
    @Mapping(target = "ordenItems", source = "ordenItems")
    Orden toEntity(OrdenDTO ordenDTO);

    List<OrdenDTO> toDTOs(List<Orden> ordenList);
    List<Orden> toEntities(List<OrdenDTO> ordenDTOList);

    @Mapping(target = "productoId", source = "producto.id")
    OrdenItemDTO toDTO(OrdenItem ordenItem);

    @Mapping(target = "producto.id", source = "productoId")
    OrdenItem toEntity(OrdenItemDTO ordenItemDTO);

    List<OrdenItemDTO> toOrdenItemDtos(List<OrdenItem> ordenItemList);
    List<OrdenItem> toOrdenItemEntities(List<OrdenItemDTO> ordenItemDTOS);
}
