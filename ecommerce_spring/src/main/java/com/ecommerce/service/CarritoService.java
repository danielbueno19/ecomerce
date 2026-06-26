package com.ecommerce.service;

import com.ecommerce.dto.CarritoDTO;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.StockInsuficienteException;
import com.ecommerce.mapper.CarritoMapper;
import com.ecommerce.model.Carrito;
import com.ecommerce.model.CarritoItem;
import com.ecommerce.model.Producto;
import com.ecommerce.model.Usuario;
import com.ecommerce.repositories.CarritoRepository;
import com.ecommerce.repositories.ProductoRepository;
import com.ecommerce.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarritoService {
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final CarritoRepository carritoRepository;
    private final CarritoMapper carritoMapper;

    public CarritoDTO agregarAlCarrito(Long usuarioId, Long productoId, Integer cantidad){
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(()-> new ResourceNotFoundException("Usuario no encontrado"));
        Producto producto = productoRepository.findById(productoId).orElseThrow(()-> new ResourceNotFoundException("Producto no encontrado"));
        CarritoItem carritoItem = null;
        if(producto.getCantidad() < cantidad){
            throw new StockInsuficienteException("Diponibilidad insuficiente");
        }

        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId).orElse(new Carrito(null, usuario, new ArrayList<>()));
        Optional<CarritoItem> existeItemCarrito = carrito.getItems().stream()
                .filter(item -> item.getProducto()
                        .getId().equals(productoId))
                .findFirst();

        if(existeItemCarrito.isPresent()){
            carritoItem = existeItemCarrito.get();
            carritoItem.setCantidad(carritoItem.getCantidad() + cantidad);
        } else {
            carritoItem = new CarritoItem(null, carrito, producto, cantidad);
            carrito.getItems().add(carritoItem);
        }

        Carrito guardarCarrito = carritoRepository.save(carrito);
        return carritoMapper.toDTO(guardarCarrito);
    }

    public CarritoDTO obtenerCarrito(Long usuarioId){
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId).orElseThrow(()-> new ResourceNotFoundException("Carrito no encontrado"));

        return carritoMapper.toDTO(carrito);
    }

    public void vaciarCarrito(Long usuarioId){
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId).orElseThrow(()-> new ResourceNotFoundException("Carrito no encontrado"));

        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }

    public void removerItemCarrito(Long usuarioId, Long productoId){
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId).orElseThrow(()-> new RuntimeException("Carrito no encontrado para el usuario actual"));
        carrito.getItems().removeIf(item -> item.getProducto().getId().equals(productoId));
        carritoRepository.save(carrito);
    }
}
