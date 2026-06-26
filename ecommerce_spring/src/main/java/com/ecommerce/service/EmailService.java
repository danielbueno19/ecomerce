package com.ecommerce.service;

import com.ecommerce.model.Orden;
import com.ecommerce.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender enviarMensaje;

    @Value("spring.mail.username")
    private String fromEmail;

    public void enviarConfirmacionOrden(Orden orden){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(orden.getUsuario().getEmail());
        message.setSubject("Confirmacion de orden");
        message.setText("Yu orden a sido confirmada, Orden ID: " + orden.getId());

        enviarMensaje.send(message);
    }

    public void enviarCodigoConfirmacion(Usuario usuario){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(usuario.getEmail());
        message.setSubject("Confirma tu email");
        message.setText("Por favor confirma tu email para introduciendo este codigo: " + usuario.getConfirmarCodigo());

        enviarMensaje.send(message);
    }
}
