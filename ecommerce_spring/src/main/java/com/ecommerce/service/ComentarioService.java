package com.ecommerce.service;

import com.ecommerce.dto.ComentarioDTO;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.ComentarioMapper;
import com.ecommerce.model.Comentario;
import com.ecommerce.model.Producto;
import com.ecommerce.model.Usuario;
import com.ecommerce.repositories.ComentarioRepository;
import com.ecommerce.repositories.ProductoRepository;
import com.ecommerce.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComentarioService {
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComentarioMapper comentarioMapper;
    private final ComentarioRepository comentarioRepository;

    public ComentarioDTO agregarComentario(Long productoId, Long usuarioId, ComentarioDTO comentarioDTO){
        Producto producto = productoRepository.findById(productoId).orElseThrow(()-> new ResourceNotFoundException("Producto no encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(()-> new ResourceNotFoundException("Usuario no encontrado"));

        Comentario comentario = comentarioMapper.toEntity(comentarioDTO);
        comentario.setProducto(producto);
        comentario.setUsuario(usuario);

        Comentario comentarioGuardado = comentarioRepository.save(comentario);

        return comentarioMapper.toDTO(comentarioGuardado);
    }

    public List<ComentarioDTO> obtenerComentariosPorProducto(Long productoId){
        List<Comentario> comentarios = comentarioRepository.findByProductoId(productoId);

        return comentarios.stream()
                .map(comentarioMapper::toDTO)
                .collect(Collectors.toList());
    }
}
