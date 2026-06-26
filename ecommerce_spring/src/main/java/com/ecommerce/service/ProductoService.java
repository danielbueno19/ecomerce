package com.ecommerce.service;

import com.ecommerce.dto.ProductoDTO;
import com.ecommerce.dto.ProductoListDto;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.ProductoMapper;
import com.ecommerce.model.Producto;
import com.ecommerce.repositories.ProductoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoMapper productoMapper;
    private final ProductoRepository productoRepository;

    private static final String UPLOAD_DIR = "uploads/images/";

    @Transactional
    public ProductoDTO crearProducto(ProductoDTO productoDTO, MultipartFile imagen) throws IOException {
        Producto producto = productoMapper.toEntity(productoDTO);

        if(imagen != null && !imagen.isEmpty()){
            String fileName = guardarImagen(imagen);
            producto.setImagen("/images/"+fileName);
        }
        Producto guardarProducto = productoRepository.save(producto);

        return productoMapper.toDTO(guardarProducto);
    }

    @Transactional
    public ProductoDTO actualizarProducto(Long id, ProductoDTO productoDTO, MultipartFile imagen) throws IOException {
        Producto productoExistente = productoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Producto no encontrado"));

        productoExistente.setNombre(productoDTO.getNombre());
        productoExistente.setDescripcion(productoDTO.getDescripcion());
        productoExistente.setPrecio(productoDTO.getPrecio());
        productoExistente.setCantidad(productoDTO.getCantidad());

        if(imagen != null && !imagen.isEmpty()){
            String fileName = guardarImagen(imagen);
            productoExistente.setImagen("/images/"+ fileName);
        }
        Producto actualizarProducto = productoRepository.save(productoExistente);

        return productoMapper.toDTO(actualizarProducto);
    }

    @Transactional
    public void eliminarProducto(Long id){
        if(!productoRepository.existsById(id)){
            throw new ResourceNotFoundException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }

    public ProductoDTO obtenerProducto(Long id){
        Producto producto = productoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Producto no encontrado"));
        return productoMapper.toDTO(producto);
    }

    public Page<ProductoListDto> obtenerTodosProductos(Pageable pageable){
        return productoRepository.findAllWithoutComentarios(pageable);
    }

    private String guardarImagen(MultipartFile image) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, image.getBytes());

        return fileName;
    }
}
