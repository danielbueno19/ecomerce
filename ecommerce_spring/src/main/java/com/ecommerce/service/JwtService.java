package com.ecommerce.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    public String generarToken(UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", userDetails.getAuthorities().iterator().next().getAuthority());
        return crearToken(claims, userDetails.getUsername());
    }

    private String crearToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public Boolean validarToken(String token, UserDetails userDetails){
        final String username = extraerUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpirado(token));
    }

    public String extraerUsername(String token) {
        return extraerClaims(token, Claims::getSubject);
    }

    private <T> T extraerClaims(String token, Function<Claims, T> getSubject) {
        final Claims claims = extraerAllClaims(token);
        return getSubject.apply(claims);
    }

    private Claims extraerAllClaims(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }

    private boolean isTokenExpirado(String token) {
        return estadoExpiration(token).before(new Date());
    }

    private Date estadoExpiration(String token) {
        return extraerClaims(token, Claims::getExpiration);
    }
}
