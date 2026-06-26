package com.ecommerce.mapper;

import com.ecommerce.dto.ComentarioDTO;
import com.ecommerce.dto.ProductoDTO;
import com.ecommerce.model.Comentario;
import com.ecommerce.model.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductoMapper {
    @Mapping(target = "imagen", source = "imagen")
    ProductoDTO toDTO(Producto producto);

    @Mapping(target = "imagen", source = "imagen")
    Producto toEntity(ProductoDTO productoDTO);

    @Mapping(target = "usuarioId", source = "usuario.id")
    ComentarioDTO toDTO(Comentario comentario);

    @Mapping(target = "usuario.id", source = "usuarioId")
    @Mapping(target = "producto", ignore = true)
    Comentario toEntity(ComentarioDTO comentarioDTO);
}
