package com.ecommerce.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.model.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long>{
    List<Comentario> findByProductoId(Long productoId);
}
