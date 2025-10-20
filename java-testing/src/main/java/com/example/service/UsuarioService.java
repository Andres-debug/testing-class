package com.example.service;

import com.example.model.Usuario;
import com.example.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestión de usuarios
 * 
 * Esta clase contiene lógica de negocio que será testeada unitariamente
 * con mocks y en pruebas de integración completas.
 */
@Service
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    
    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }
    
    /**
     * Crea un nuevo usuario con validaciones
     * Método principal para testing de lógica de negocio
     */
    public Usuario crearUsuario(String nombre, String email, Integer edad) {
        // Validaciones que serán testeadas
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El email no puede estar vacío");
        }
        
        if (edad == null || edad < 0) {
            throw new IllegalArgumentException("La edad debe ser un número positivo");
        }
        
        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Ya existe un usuario con este email");
        }
        
        // Crear usuario
        Usuario usuario = new Usuario(nombre, email, edad);
        
        // Validar email antes de guardar
        if (!usuario.tieneEmailValido()) {
            throw new IllegalArgumentException("El formato del email no es válido");
        }
        
        // Guardar usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        
        // Enviar email de bienvenida (dependencia externa)
        try {
            emailService.enviarEmailBienvenida(usuarioGuardado);
        } catch (Exception e) {
            // Log error pero no fallar la creación
            System.err.println("Error enviando email de bienvenida: " + e.getMessage());
        }
        
        return usuarioGuardado;
    }
    
    /**
     * Busca usuario por ID
     * Método simple para testing básico
     */
    public Optional<Usuario> buscarPorId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID debe ser un número positivo");
        }
        return usuarioRepository.findById(id);
    }
    
    /**
     * Busca usuario por email
     * Para testing de delegación a repository
     */
    public Optional<Usuario> buscarPorEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        return usuarioRepository.findByEmail(email.trim().toLowerCase());
    }
    
    /**
     * Obtiene todos los usuarios activos
     * Para testing de filtros
     */
    public List<Usuario> obtenerUsuariosActivos() {
        return usuarioRepository.findByActivoTrue();
    }
    
    /**
     * Actualiza información del usuario
     * Para testing de operaciones de actualización
     */
    public Usuario actualizarUsuario(Long id, String nombre, String email, Integer edad) {
        Usuario usuario = buscarPorId(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        // Validar nuevo email si cambió
        if (email != null && !email.equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Ya existe un usuario con este email");
            }
            usuario.setEmail(email);
        }
        
        if (nombre != null && !nombre.trim().isEmpty()) {
            usuario.setNombre(nombre);
        }
        
        if (edad != null && edad >= 0) {
            usuario.setEdad(edad);
        }
        
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Desactiva un usuario
     * Para testing de cambios de estado
     */
    public void desactivarUsuario(Long id) {
        Usuario usuario = buscarPorId(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
        
        // Enviar email de despedida
        try {
            emailService.enviarEmailDespedida(usuario);
        } catch (Exception e) {
            System.err.println("Error enviando email de despedida: " + e.getMessage());
        }
    }
    
    /**
     * Busca usuarios por criterios múltiples
     * Para testing de lógica compleja
     */
    public List<Usuario> buscarUsuarios(String nombre, Integer edadMinima, Boolean activo) {
        if (nombre != null && !nombre.trim().isEmpty()) {
            return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
        }
        
        if (edadMinima != null && activo != null) {
            return usuarioRepository.findUsuariosActivosConEdadMinima(activo, edadMinima);
        }
        
        if (activo != null && activo) {
            return usuarioRepository.findByActivoTrue();
        }
        
        return usuarioRepository.findAll();
    }
    
    /**
     * Obtiene estadísticas de usuarios
     * Para testing de métodos que combinan múltiples operaciones
     */
    public EstadisticasUsuarios obtenerEstadisticas() {
        long totalUsuarios = usuarioRepository.count();
        long usuariosActivos = usuarioRepository.countByActivoTrue();
        long usuariosMayoresEdad = usuarioRepository.findUsuariosMayoresDeEdad().size();
        
        return new EstadisticasUsuarios(totalUsuarios, usuariosActivos, usuariosMayoresEdad);
    }
    
    /**
     * Elimina usuario por ID
     * Para testing de operaciones delete
     */
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
    
    /**
     * Clase interna para estadísticas
     * Útil para testing de objetos de respuesta
     */
    public static class EstadisticasUsuarios {
        private final long totalUsuarios;
        private final long usuariosActivos;
        private final long usuariosMayoresEdad;
        
        public EstadisticasUsuarios(long totalUsuarios, long usuariosActivos, long usuariosMayoresEdad) {
            this.totalUsuarios = totalUsuarios;
            this.usuariosActivos = usuariosActivos;
            this.usuariosMayoresEdad = usuariosMayoresEdad;
        }
        
        public long getTotalUsuarios() { return totalUsuarios; }
        public long getUsuariosActivos() { return usuariosActivos; }
        public long getUsuariosMayoresEdad() { return usuariosMayoresEdad; }
    }
}