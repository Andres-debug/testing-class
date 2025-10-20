package com.example.service;

import com.example.model.Usuario;
import org.springframework.stereotype.Service;

/**
 * Servicio para envío de emails
 * 
 * Esta clase simula un servicio externo que será mockeado en las pruebas
 * para demostrar técnicas de testing con dependencias externas.
 */
@Service
public class EmailService {
    
    /**
     * Envía email de bienvenida al usuario
     * Este método será mockeado en las pruebas unitarias
     */
    public void enviarEmailBienvenida(Usuario usuario) {
        // Simulación de envío de email
        // En una implementación real, aquí habría integración con servicio de email
        
        if (usuario == null || usuario.getEmail() == null) {
            throw new IllegalArgumentException("Usuario o email no válido");
        }
        
        String asunto = "¡Bienvenido " + usuario.getNombreFormateado() + "!";
        String mensaje = construirMensajeBienvenida(usuario);
        
        // Simular posible fallo en servicio externo
        if (usuario.getEmail().contains("fallo")) {
            throw new RuntimeException("Error en servicio de email externo");
        }
        
        // Simular envío exitoso
        System.out.println("Email enviado a: " + usuario.getEmail());
        System.out.println("Asunto: " + asunto);
        System.out.println("Mensaje: " + mensaje);
    }
    
    /**
     * Envía email de despedida al usuario
     */
    public void enviarEmailDespedida(Usuario usuario) {
        if (usuario == null || usuario.getEmail() == null) {
            throw new IllegalArgumentException("Usuario o email no válido");
        }
        
        String asunto = "Hasta pronto " + usuario.getNombreFormateado();
        String mensaje = "Lamentamos que te vayas. ¡Esperamos verte pronto de vuelta!";
        
        // Simular envío
        System.out.println("Email de despedida enviado a: " + usuario.getEmail());
    }
    
    /**
     * Construye mensaje personalizado de bienvenida
     * Método con lógica que puede ser testeada
     */
    public String construirMensajeBienvenida(Usuario usuario) {
        StringBuilder mensaje = new StringBuilder();
        
        mensaje.append("Hola ").append(usuario.getNombreFormateado()).append(",\n\n");
        mensaje.append("¡Bienvenido a nuestra plataforma!\n\n");
        
        if (usuario.esMayorDeEdad()) {
            mensaje.append("Como eres mayor de edad, tienes acceso a todas las funcionalidades.\n");
        } else {
            mensaje.append("Algunas funcionalidades están restringidas por tu edad.\n");
        }
        
        mensaje.append("\nGracias por registrarte.\n");
        mensaje.append("El equipo de desarrollo");
        
        return mensaje.toString();
    }
    
    /**
     * Valida formato de email
     * Método auxiliar que será testeado
     */
    public boolean esEmailValido(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        // Validación básica para demostrar testing
        return email.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    }
}