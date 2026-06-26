package com.ecommerce.controller;

import com.ecommerce.dto.OrdenDTO;
import com.ecommerce.model.Orden;
import com.ecommerce.model.Usuario;
import com.ecommerce.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenService ordenService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrdenDTO> crearOrden (@AuthenticationPrincipal UserDetails userDetails, @RequestParam String direccion, @RequestParam String telefono){
        Long usuarioId = ((Usuario) userDetails).getId();
        OrdenDTO ordenDTO = ordenService.crearOrden(usuarioId, direccion, telefono);

        return ResponseEntity.ok(ordenDTO);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrdenDTO>> obtenerTodasOrdenes(){
        List<OrdenDTO> ordenes = ordenService.obtenerTodasOrdenes();
        return ResponseEntity.ok(ordenes);
    }

    @GetMapping("/usuario")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrdenDTO>> obtenerOrdenesUsuario(@AuthenticationPrincipal UserDetails userDetails){
        Long usuarioId = ((Usuario) userDetails).getId();
        List<OrdenDTO> ordenes = ordenService.obtenerOrdenesUsuario(usuarioId);

        return ResponseEntity.ok(ordenes);
    }

    @PutMapping("/{ordenId}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrdenDTO> actualizarEstadoOrden(@PathVariable Long ordenId, @RequestParam Orden.EstadoOrden estado){
        OrdenDTO ordenActualizada = ordenService.actualizarEstadoOrden(ordenId, estado);

        return ResponseEntity.ok(ordenActualizada);
    }
}
