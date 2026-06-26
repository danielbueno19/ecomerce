package com.ecommerce.controller;

import com.ecommerce.dto.CarritoDTO;
import com.ecommerce.model.Usuario;
import com.ecommerce.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    @PostMapping("/agregar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CarritoDTO> agregarAlCarrito(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Long productoId, @RequestParam Integer cantidad){
        Long usuarioId = ((Usuario)userDetails).getId();
        return ResponseEntity.ok(carritoService.agregarAlCarrito(usuarioId, productoId, cantidad));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CarritoDTO> obtenerCarrito(@AuthenticationPrincipal UserDetails userDetails){
        Long usuarioId = ((Usuario)userDetails).getId();
        return ResponseEntity.ok(carritoService.obtenerCarrito(usuarioId));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> vaciarCarrito(@AuthenticationPrincipal UserDetails userDetails){
        Long usuarioId = ((Usuario)userDetails).getId();
        carritoService.vaciarCarrito(usuarioId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removerItemCarrito(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long productoId){
        Long usuarioId = ((Usuario)userDetails).getId();
        carritoService.removerItemCarrito(usuarioId, productoId);
        return ResponseEntity.noContent().build();
    }
}
