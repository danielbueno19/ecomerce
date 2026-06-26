package com.ecommerce.service;

import com.ecommerce.dto.CarritoDTO;
import com.ecommerce.dto.OrdenDTO;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.StockInsuficienteException;
import com.ecommerce.mapper.CarritoMapper;
import com.ecommerce.mapper.OrdenMapper;
import com.ecommerce.model.*;
import com.ecommerce.repositories.OrdenRepository;
import com.ecommerce.repositories.ProductoRepository;
import com.ecommerce.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenService {
    private final Logger logger = LoggerFactory.getLogger(OrdenService.class);

    private final UsuarioRepository usuarioRepository;
    private final CarritoService carritoService;
    private final CarritoMapper carritoMapper;
    private final ProductoRepository productoRepository;
    private final OrdenRepository ordenRepository;
    private final EmailService emailService;
    private final OrdenMapper ordenMapper;

    @Transactional
    public OrdenDTO crearOrden (Long usuarioId, String direccion, String telefono){
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(()-> new ResourceNotFoundException("Usuario no encontrado"));

        if(!usuario.isConfirmacionEmail()){
            throw new IllegalStateException("Email no confirmado, por favor confirme e-mail antes de realizar el pedido");
        }

        CarritoDTO carritoDTO = carritoService.obtenerCarrito(usuarioId);
        Carrito carrito = carritoMapper.toEntity(carritoDTO);

        if(carrito.getItems().isEmpty()){
            throw new IllegalStateException("No puede crear una orden si el carrito esta vacío");
        }

        Orden orden = new Orden();
        orden.setUsuario(usuario);
        orden.setDireccion(direccion);
        orden.setTelefono(telefono);
        orden.setEstado(Orden.EstadoOrden.PREPARANDO);
        orden.setFechaCreacion(LocalDateTime.now());

        List<OrdenItem> itemsOrden = crearOrdenItems(carrito, orden);
        orden.setOrdenItems(itemsOrden);

        Orden almacenarOrden = ordenRepository.save(orden);
        carritoService.vaciarCarrito(usuarioId);

        try {
            emailService.enviarConfirmacionOrden(almacenarOrden);
        } catch (MailException e){
            logger.error("Falló el envio de confirmacion de orden para el ID: " + almacenarOrden.getId(), e);
        }

        return ordenMapper.toDTO(almacenarOrden);
    }

    public List<OrdenDTO> obtenerTodasOrdenes(){
        return ordenMapper.toDTOs(ordenRepository.findAll());
    }

    public List<OrdenDTO> obtenerOrdenesUsuario(Long usuarioId){
        return ordenMapper.toDTOs(ordenRepository.findByUsuarioId(usuarioId));
    }

    public OrdenDTO actualizarEstadoOrden(Long ordenId, Orden.EstadoOrden estadoOrden){
        Orden orden = ordenRepository.findById(ordenId).orElseThrow(()-> new ResourceNotFoundException("Orden no encontrado"));
        orden.setEstado(estadoOrden);
        Orden ordenActualizada = ordenRepository.save(orden);

        return ordenMapper.toDTO(ordenActualizada);
    }

    private List<OrdenItem> crearOrdenItems(Carrito carrito, Orden orden) {

        return carrito.getItems().stream().map(itemCarrito -> {
            Producto producto = productoRepository.findById(itemCarrito.getProducto().getId()).orElseThrow(()-> new EntityNotFoundException("Producto no encontrado en el ID: " + itemCarrito.getProducto().getId()));

            if(producto.getCantidad() == null){
                throw new IllegalStateException("Cantidad no indicada para el producto: " + producto.getNombre());
            }

            if(producto.getCantidad() < itemCarrito.getCantidad()){
                throw new StockInsuficienteException("No hay suficiente cantidad estock para el producto: " + producto.getNombre());
            }

            producto.setCantidad(producto.getCantidad() - itemCarrito.getCantidad());
            productoRepository.save(producto);

            return new OrdenItem(null, orden, producto, itemCarrito.getCantidad(), producto.getPrecio());
        }).collect(Collectors.toList());
    }
}
