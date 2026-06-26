package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Orden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private String direccion;
    private String telefono;

    @Enumerated(EnumType.STRING)
    private EstadoOrden estado;

    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrdenItem> ordenItems = new ArrayList<>();

    public enum EstadoOrden {
        PREPARANDO,ENTREGANDO,ENTREGADO,CANCELADO
    }
}
