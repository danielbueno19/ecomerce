package com.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ecommerce.dto.ComentarioDTO;
import com.ecommerce.model.Comentario;

@Mapper(componentModel = "spring")
public interface ComentarioMapper {

    @Mapping(target = "usuarioId", source = "usuario.id")
    ComentarioDTO toDTO(Comentario comentario);

    @Mapping(target = "usuario.id", source = "usuarioId")
    @Mapping(target = "producto", ignore = true)
    Comentario toEntity(ComentarioDTO comentarioDTO);
}
