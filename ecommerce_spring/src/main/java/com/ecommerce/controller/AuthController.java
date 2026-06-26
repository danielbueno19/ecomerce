package com.ecommerce.controller;

import com.ecommerce.dto.ConfirmacionEmailRequest;
import com.ecommerce.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.dto.CambiarPasswordRequest;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.model.Usuario;
import com.ecommerce.service.JwtService;
import com.ecommerce.service.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        final UserDetails userDetails = usuarioService.obtenertUsuarioByEmail(loginRequest.getEmail());
        final String jwt = jwtService.generarToken(userDetails);

        return ResponseEntity.ok(jwt);
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@Valid @RequestBody Usuario usuario){
        return ResponseEntity.ok(usuarioService.registrarUsuario(usuario));
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@Valid @RequestBody CambiarPasswordRequest passwordRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        usuarioService.cambiarPassword(email, passwordRequest);

        return ResponseEntity.ok().body("Contraseña cambiada");
    }

    @PostMapping("/confirmar-email")
    public ResponseEntity<?> confirmarEmail(@RequestBody ConfirmacionEmailRequest request){
        try {
            usuarioService.confirmarEmail(request.getEmail(), request.getCodigoConfirmacion());
            return ResponseEntity.ok().body("Confirmación de email exitosa");
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Código de confirmacion inválido");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario/rol")
    public ResponseEntity<String> obtenerRolUsuario(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Usuario usuario = usuarioService.obtenertUsuarioByEmail(email);

        if(usuario != null){
            String rol = String.valueOf(usuario.getRole());
            return ResponseEntity.ok(rol);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<String> obtenerUsuarioPorEmail(@PathVariable Long id){
        Usuario usuario = usuarioService.obtenerUsuarioById(id);

        if(usuario != null){
            return ResponseEntity.ok(usuario.getEmail());
        }
        return ResponseEntity.notFound().build();
    }
}
