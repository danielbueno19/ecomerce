package com.ecommerce.controller;

import com.ecommerce.dto.ComentarioDTO;
import com.ecommerce.model.Usuario;
import com.ecommerce.service.ComentarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comentarios")
public class ComentarioController {
    private final ComentarioService comentarioService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/producto/{productoId}")
    public ResponseEntity<ComentarioDTO> agregarComentario(@PathVariable Long productoId, @AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody ComentarioDTO comentarioDTO){
        Long usuarioId = ((Usuario)userDetails).getId();
        return ResponseEntity.ok(comentarioService.agregarComentario(productoId, usuarioId, comentarioDTO));
    }

    @GetMapping("producto/{productoId}")
    public ResponseEntity<List<ComentarioDTO>> obtenerComentariosPorProducto(@PathVariable Long productoId){
        return ResponseEntity.ok(comentarioService.obtenerComentariosPorProducto(productoId));
    }
}
