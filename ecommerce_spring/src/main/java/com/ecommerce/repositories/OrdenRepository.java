package com.ecommerce.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.model.Orden;

public interface OrdenRepository extends JpaRepository<Orden, Long>{
    List<Orden> findByUsuarioId(Long usuarioId);
}
