package com.example.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entidad Usuario para demostrar pruebas unitarias e integración
 * 
 * Esta clase representa un usuario del sistema con validaciones básicas
 * y métodos que requieren testing comprehensivo.
 */
@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;
    
    @Column(name = "edad")
    private Integer edad;
    
    @Column(name = "activo")
    private Boolean activo;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    // Constructor por defecto requerido por JPA
    public Usuario() {
        this.activo = true;
        this.fechaRegistro = LocalDateTime.now();
    }
    
    // Constructor completo
    public Usuario(String nombre, String email, Integer edad) {
        this();
        this.nombre = nombre;
        this.email = email;
        this.edad = edad;
    }
    
    /**
     * Valida si el usuario es mayor de edad
     * Método que será testeado unitariamente
     */
    public boolean esMayorDeEdad() {
        return edad != null && edad >= 18;
    }
    
    /**
     * Valida si el email tiene formato válido
     * Implementación básica para demostrar testing
     */
    public boolean tieneEmailValido() {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return email.contains("@") && email.contains(".") && email.length() > 5;
    }
    
    /**
     * Obtiene nombre de usuario formateado
     * Útil para testing de strings
     */
    public String getNombreFormateado() {
        if (nombre == null || nombre.trim().isEmpty()) {
            return "Usuario Anónimo";
        }
        return nombre.trim().substring(0, 1).toUpperCase() + 
               nombre.trim().substring(1).toLowerCase();
    }
    
    /**
     * Calcula años desde el registro
     * Método que requiere testing con fechas
     */
    public long getAñosDesdeRegistro() {
        if (fechaRegistro == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.YEARS.between(
            fechaRegistro.toLocalDate(), 
            LocalDateTime.now().toLocalDate()
        );
    }
    
    /**
     * Activa o desactiva el usuario
     * Método simple para testing de estado
     */
    public void cambiarEstado() {
        this.activo = !this.activo;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Integer getEdad() {
        return edad;
    }
    
    public void setEdad(Integer edad) {
        this.edad = edad;
    }
    
    public Boolean getActivo() {
        return activo;
    }
    
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    // Métodos equals y hashCode para testing
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(id, usuario.id) &&
               Objects.equals(email, usuario.email);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }
    
    @Override
    public String toString() {
        return "Usuario{" +
               "id=" + id +
               ", nombre='" + nombre + '\'' +
               ", email='" + email + '\'' +
               ", edad=" + edad +
               ", activo=" + activo +
               ", fechaRegistro=" + fechaRegistro +
               '}';
    }
}