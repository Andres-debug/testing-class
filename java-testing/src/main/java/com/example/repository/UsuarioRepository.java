package com.example.repository;

import com.example.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository para la entidad Usuario
 * 
 * Incluye métodos personalizados que serán testeados en pruebas de integración
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    /**
     * Busca usuario por email
     * Método básico para testing de repository
     */
    Optional<Usuario> findByEmail(String email);
    
    /**
     * Busca usuarios activos
     * Para testing de consultas con boolean
     */
    List<Usuario> findByActivoTrue();
    
    /**
     * Busca usuarios por rango de edad
     * Para testing con parámetros múltiples
     */
    List<Usuario> findByEdadBetween(Integer edadMinima, Integer edadMaxima);
    
    /**
     * Busca usuarios por nombre que contenga el texto (case insensitive)
     * Para testing de búsquedas parciales
     */
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
    
    /**
     * Cuenta usuarios activos
     * Para testing de métodos count personalizados
     */
    long countByActivoTrue();
    
    /**
     * Busca usuarios registrados después de una fecha
     * Para testing con fechas
     */
    List<Usuario> findByFechaRegistroAfter(LocalDateTime fecha);
    
    /**
     * Query personalizada para usuarios mayores de edad
     * Para testing de @Query personalizado
     */
    @Query("SELECT u FROM Usuario u WHERE u.edad >= 18")
    List<Usuario> findUsuariosMayoresDeEdad();
    
    /**
     * Query con parámetros nombrados
     * Para testing de queries complejas
     */
    @Query("SELECT u FROM Usuario u WHERE u.activo = :activo AND u.edad >= :edadMinima")
    List<Usuario> findUsuariosActivosConEdadMinima(@Param("activo") Boolean activo, 
                                                   @Param("edadMinima") Integer edadMinima);
    
    /**
     * Verifica si existe usuario con email
     * Para testing de métodos exists personalizados
     */
    boolean existsByEmail(String email);
}