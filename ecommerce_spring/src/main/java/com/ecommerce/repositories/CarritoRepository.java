package com.ecommerce.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.model.Carrito;

public interface CarritoRepository extends JpaRepository<Carrito, Long>{
    Optional<Carrito> findByUsuarioId(Long userId);
}
