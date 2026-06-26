package com.ecommerce.service;

import com.ecommerce.dto.CambiarPasswordRequest;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Usuario;
import com.ecommerce.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;

    public Usuario registrarUsuario(Usuario usuario){
        if(usuarioRepository.findByEmail(usuario.getEmail()).isPresent()){
            throw new IllegalStateException("Email ya se ecuantra registrado");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRole(Usuario.Role.USER);
        usuario.setConfirmarCodigo(generarConfirmacionCodigo());
        usuario.setConfirmacionEmail(false);

        emailService.enviarCodigoConfirmacion(usuario);
        return usuarioRepository.save(usuario);
    }

    public void cambiarPassword(String email, CambiarPasswordRequest passwordRequest){
        Usuario usuario = obtenertUsuarioByEmail(email);

        if(!passwordEncoder.matches(passwordRequest.getActualPassword(), usuario.getPassword())){
            throw new BadCredentialsException("La contraseña actual es incorrecta");
        }
        usuario.setPassword(passwordEncoder.encode(passwordRequest.getNuevaPassword()));
        usuarioRepository.save(usuario);
    }

    public void confirmarEmail(String email, String codigoConfirmacion){
        Usuario usuario = obtenertUsuarioByEmail(email);

        if(usuario.getConfirmarCodigo().equals(codigoConfirmacion)){
            usuario.setConfirmacionEmail(true);
            usuario.setConfirmarCodigo(null);

            usuarioRepository.save(usuario);
        } else {
            throw new BadCredentialsException("Código de confirmación inválido");
        }
    }

    public Usuario obtenertUsuarioByEmail(String email){
        return usuarioRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Usuario no encontrado"));
    }

    public Usuario obtenerUsuarioById(Long id){
        return usuarioRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Usuario no encontrado con el id: " + id));
    }

    private String generarConfirmacionCodigo(){
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);

        return String.valueOf(code);
    }

}
