package com.ecommerce.repositories;

import com.ecommerce.dto.ProductoListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.model.Producto;
import org.springframework.data.jpa.repository.Query;

public interface ProductoRepository extends JpaRepository<Producto, Long>{

    @Query("SELECT new com.ecommerce.dto.ProductoListDto(p.id, p.nombre, p.descripcion, p.precio, p.cantidad, p.imagen) FROM Producto p")
    Page<ProductoListDto> findAllWithoutComentarios(Pageable pageable);
}
