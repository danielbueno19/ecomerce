package com.ecommerce.controller;

import com.ecommerce.dto.ProductoDTO;
import com.ecommerce.dto.ProductoListDto;
import com.ecommerce.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/productos")
public class ProductoController {
    private final ProductoService productoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDTO> crearProducto(@RequestPart("producto") @Valid ProductoDTO productoDTO, @RequestPart(value = "imagen", required = false)MultipartFile imagen) throws IOException {
        return ResponseEntity.ok(productoService.crearProducto(productoDTO, imagen));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDTO> actualizarProducto(@PathVariable Long id, @RequestPart("producto") @Valid ProductoDTO productoDTO, @RequestPart(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        return ResponseEntity.ok(productoService.actualizarProducto(id, productoDTO, imagen));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id){
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerProducto(@PathVariable Long id){
        return ResponseEntity.ok(productoService.obtenerProducto(id));
    }

    @GetMapping
    public ResponseEntity<Page<ProductoListDto>> obtenerTodosProductos(@PageableDefault(size = 10)Pageable pageable){
        return ResponseEntity.ok(productoService.obtenerTodosProductos(pageable));
    }
}
