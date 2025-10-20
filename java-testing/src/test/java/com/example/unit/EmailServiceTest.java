package com.example.unit;

import com.example.model.Usuario;
import com.example.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.*;

/**
 * Pruebas unitarias para EmailService
 * 
 * PROPÓSITO:
 * Testear lógica de construcción de mensajes y validaciones
 * sin depender de servicios externos reales de email.
 * 
 * ENFOQUE DE TESTING:
 * Como EmailService simula un servicio externo, nos enfocamos en:
 * - Lógica de construcción de mensajes (pura, sin side effects)
 * - Validaciones de entrada
 * - Comportamiento condicional basado en datos del usuario
 * - Manejo de casos edge y datos malformados
 * 
 * TÉCNICAS DEMOSTRADAS:
 * - Testing de métodos con lógica condicional
 * - Testing de construcción de strings complejos
 * - Testing de validaciones con regex
 * - Testing de métodos que simulan efectos secundarios
 * - Uso de assertThatCode() para verificar ausencia de excepciones
 * - Testing de comportamiento vs testing de implementación
 * 
 * DIFERENCIA CON MOCKING:
 * Aquí no usamos mocks porque estamos testeando la clase real,
 * solo que simula ser un servicio externo para propósitos educativos.
 */
@DisplayName("EmailService - Pruebas Unitarias")
class EmailServiceTest {
    
    private EmailService emailService;
    private Usuario usuario;
    
    @BeforeEach
    void setUp() {
        // Crear instancia real del servicio (no mock)
        emailService = new EmailService();
        
        // Usuario de ejemplo para las pruebas
        usuario = new Usuario("Juan Pérez", "juan@example.com", 25);
    }
    
    /**
     * GRUPO: Construcción de Mensaje de Bienvenida
     * 
     * OBJETIVO:
     * Testear la lógica de construcción de mensajes personalizados.
     * Este método es puramente funcional (sin side effects).
     * 
     * TÉCNICAS:
     * - Testing de lógica condicional (mayor/menor de edad)
     * - Verificación de contenido de strings con contains()
     * - Testing de estructura y formato de mensajes
     * - Verificación negativa (que NO contenga cierto texto)
     * 
     * IMPORTANCIA:
     * Los mensajes son parte de la UX, por lo que deben ser correctos
     * y apropiados para cada tipo de usuario.
     */
    @Nested
    @DisplayName("Construcción de Mensaje de Bienvenida")
    class ConstruccionMensajeBienvenida {
        
        @Test
        @DisplayName("Mensaje para usuario mayor de edad debe incluir acceso completo")
        void mensajeParaUsuarioMayorEdad_debeIncluirAccesoCompleto() {
            // Given - Usuario mayor de edad
            usuario.setEdad(25);
            
            // When - Construir mensaje
            String mensaje = emailService.construirMensajeBienvenida(usuario);
            
            // Then - Verificar contenido específico para mayores de edad
            // TÉCNICA: Usar múltiples assertions para verificar diferentes aspectos
            assertThat(mensaje)
                .contains("Hola Juan Pérez")                                    // Personalización
                .contains("¡Bienvenido a nuestra plataforma!")                 // Mensaje base
                .contains("tienes acceso a todas las funcionalidades")         // Mensaje específico
                .contains("El equipo de desarrollo")                           // Firma
                .doesNotContain("funcionalidades están restringidas");         // Verificación negativa
        }
        
        @Test
        @DisplayName("Mensaje para usuario menor de edad debe incluir restricciones")
        void mensajeParaUsuarioMenorEdad_debeIncluirRestricciones() {
            // Given - Usuario menor de edad
            usuario.setEdad(16);
            
            // When
            String mensaje = emailService.construirMensajeBienvenida(usuario);
            
            // Then - Verificar mensaje apropiado para menores
            assertThat(mensaje)
                .contains("Hola Juan Pérez")
                .contains("funcionalidades están restringidas por tu edad")     // Mensaje de restricción
                .doesNotContain("tienes acceso a todas las funcionalidades");  // No debe tener mensaje de adulto
        }
        
        @Test
        @DisplayName("Mensaje debe usar nombre formateado del usuario")
        void mensaje_debeUsarNombreFormateadoDelUsuario() {
            // Given - Usuario con nombre en minúsculas
            usuario.setNombre("juan pérez");
            
            // When
            String mensaje = emailService.construirMensajeBienvenida(usuario);
            
            // Then - Debe usar la versión formateada del nombre
            // Esto verifica la integración con el método getNombreFormateado()
            assertThat(mensaje).contains("Hola Juan pérez");
        }
        
        @Test
        @DisplayName("Mensaje debe tener estructura correcta")
        void mensaje_debeTenerEstructuraCorrecta() {
            // TESTING DE FORMATO Y ESTRUCTURA:
            // Verificar que el mensaje tiene la estructura esperada
            
            // When
            String mensaje = emailService.construirMensajeBienvenida(usuario);
            
            // Then - Verificar estructura del mensaje
            assertThat(mensaje)
                .startsWith("Hola ")           // Debe empezar con saludo
                .contains("\n\n")              // Debe tener párrafos separados
                .endsWith("El equipo de desarrollo"); // Debe terminar con firma
        }
    }
    
    /**
     * GRUPO: Validación de Email
     * 
     * OBJETIVO:
     * Testear validación de formato de email usando expresiones regulares.
     * 
     * TÉCNICAS:
     * - Testing parametrizado para múltiples casos
     * - Testing de regex de manera indirecta (a través del método)
     * - Cobertura de formatos válidos e inválidos comunes
     * - Testing de casos edge (null, vacío, espacios)
     * 
     * IMPORTANCIA:
     * La validación de email es crítica para:
     * - Prevenir errores en envío de emails
     * - Mantener calidad de datos
     * - Proporcionar feedback temprano al usuario
     */
    @Nested
    @DisplayName("Validación de Email")
    class ValidacionEmail {
        
        @ParameterizedTest
        @DisplayName("Emails válidos deben pasar validación")
        @ValueSource(strings = {
            "test@example.com",
            "usuario@dominio.es", 
            "admin@test.org",
            "juan.perez@empresa.com.mx",
            "user+tag@domain.co.uk"
        })
        void emailsValidos_debenPasarValidacion(String email) {
            // TESTING DE REGEX INDIRECTO:
            // No testeamos la regex directamente, sino el comportamiento
            // del método que la usa. Esto es más maintainable.
            
            // When
            boolean resultado = emailService.esEmailValido(email);
            
            // Then
            assertThat(resultado).isTrue();
        }
        
        @ParameterizedTest
        @DisplayName("Emails inválidos no deben pasar validación")
        @ValueSource(strings = {
            "email-sin-arroba.com",    // Falta @
            "@dominio.com",            // Falta parte local
            "usuario@",                // Falta dominio
            "test",                    // No es formato email
            "a@b",                     // Muy corto
            "usuario@dominio",         // Falta TLD
            "usuario.dominio.com"      // Formato incorrecto
        })
        void emailsInvalidos_noDebenPasarValidacion(String email) {
            // When
            boolean resultado = emailService.esEmailValido(email);
            
            // Then
            assertThat(resultado).isFalse();
        }
        
        @Test
        @DisplayName("Email null debe ser inválido")
        void emailNull_debeSerInvalido() {
            // TESTING DE CASOS EDGE:
            // null es un caso especial que debe manejarse explícitamente
            
            // When
            boolean resultado = emailService.esEmailValido(null);
            
            // Then
            assertThat(resultado).isFalse();
        }
        
        @Test
        @DisplayName("Email vacío debe ser inválido")
        void emailVacio_debeSerInvalido() {
            // When
            boolean resultado = emailService.esEmailValido("");
            
            // Then
            assertThat(resultado).isFalse();
        }
        
        @Test
        @DisplayName("Email con solo espacios debe ser inválido")
        void emailConSoloEspacios_debeSerInvalido() {
            // When
            boolean resultado = emailService.esEmailValido("   ");
            
            // Then
            assertThat(resultado).isFalse();
        }
    }
    
    /**
     * GRUPO: Envío de Email de Bienvenida
     * 
     * OBJETIVO:
     * Testear el método que simula envío de emails.
     * Como no enviamos emails reales, nos enfocamos en validaciones
     * y comportamiento simulado.
     * 
     * TÉCNICAS:
     * - assertThatCode().doesNotThrowAnyException() para verificar ejecución exitosa
     * - Testing de validaciones de entrada
     * - Testing de comportamiento simulado (errores condicionales)
     * 
     * NOTA:
     * En un sistema real, este método sería mockeado en otros tests.
     * Aquí lo testeamos directamente porque es nuestra simulación.
     */
    @Nested
    @DisplayName("Envío de Email de Bienvenida")
    class EnvioEmailBienvenida {
        
        @Test
        @DisplayName("Enviar email a usuario válido debe completarse sin errores")
        void enviarEmailAUsuarioValido_debeCompletarseSinErrores() {
            // TESTING DE AUSENCIA DE EXCEPCIONES:
            // assertThatCode() permite verificar que NO se lanzan excepciones
            
            // When & Then - No debe lanzar excepción
            assertThatCode(() -> emailService.enviarEmailBienvenida(usuario))
                .doesNotThrowAnyException();
        }
        
        @Test
        @DisplayName("Enviar email a usuario null debe lanzar excepción")
        void enviarEmailAUsuarioNull_debeLanzarExcepcion() {
            // When & Then
            assertThatThrownBy(() -> emailService.enviarEmailBienvenida(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuario o email no válido");
        }
        
        @Test
        @DisplayName("Enviar email a usuario sin email debe lanzar excepción")
        void enviarEmailAUsuarioSinEmail_debeLanzarExcepcion() {
            // Given
            usuario.setEmail(null);
            
            // When & Then
            assertThatThrownBy(() -> emailService.enviarEmailBienvenida(usuario))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuario o email no válido");
        }
        
        @Test
        @DisplayName("Email con palabra 'fallo' debe simular error externo")
        void emailConPalabraFallo_debeSimularErrorExterno() {
            // Given
            usuario.setEmail("usuario@fallo.com");
            
            // When & Then
            assertThatThrownBy(() -> emailService.enviarEmailBienvenida(usuario))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Error en servicio de email externo");
        }
    }
    
    /**
     * GRUPO: Envío de Email de Despedida
     */
    @Nested
    @DisplayName("Envío de Email de Despedida")
    class EnvioEmailDespedida {
        
        @Test
        @DisplayName("Enviar email de despedida a usuario válido debe completarse sin errores")
        void enviarEmailDespedidaAUsuarioValido_debeCompletarseSinErrores() {
            // When & Then
            assertThatCode(() -> emailService.enviarEmailDespedida(usuario))
                .doesNotThrowAnyException();
        }
        
        @Test
        @DisplayName("Enviar email de despedida a usuario null debe lanzar excepción")
        void enviarEmailDespedidaAUsuarioNull_debeLanzarExcepcion() {
            // When & Then
            assertThatThrownBy(() -> emailService.enviarEmailDespedida(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuario o email no válido");
        }
        
        @Test
        @DisplayName("Enviar email de despedida a usuario sin email debe lanzar excepción")
        void enviarEmailDespedidaAUsuarioSinEmail_debeLanzarExcepcion() {
            // Given
            usuario.setEmail(null);
            
            // When & Then
            assertThatThrownBy(() -> emailService.enviarEmailDespedida(usuario))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuario o email no válido");
        }
    }
    
    /**
     * GRUPO: Casos Edge y Robustez
     */
    @Nested
    @DisplayName("Casos Edge y Robustez")
    class CasosEdgeYRobustez {
        
        @Test
        @DisplayName("Usuario con nombre null debe manejarse en mensaje")
        void usuarioConNombreNull_debeManejarseEnMensaje() {
            // TESTING DE INTEGRACIÓN ENTRE MÉTODOS:
            // Verificar que el servicio maneja correctamente datos corruptos
            
            // Given
            usuario.setNombre(null);
            
            // When
            String mensaje = emailService.construirMensajeBienvenida(usuario);
            
            // Then - Debe usar el método getNombreFormateado que maneja null
            assertThat(mensaje).contains("Usuario Anónimo");
        }
        
        @Test
        @DisplayName("Usuario con edad null debe manejarse en mensaje")
        void usuarioConEdadNull_debeManejarseEnMensaje() {
            // Given
            usuario.setEdad(null);
            
            // When
            String mensaje = emailService.construirMensajeBienvenida(usuario);
            
            // Then - Debe usar la lógica de esMayorDeEdad que maneja null (retorna false)
            assertThat(mensaje).contains("funcionalidades están restringidas");
        }
        
        @Test
        @DisplayName("Email con caracteres especiales debe validarse correctamente")
        void emailConCaracteresEspeciales_debeValidarseCorrectamente() {
            // TESTING DE CASOS REALES:
            // Emails con formatos válidos pero complejos
            
            // Given
            String emailEspecial = "test+tag@domain-name.co.uk";
            
            // When
            boolean resultado = emailService.esEmailValido(emailEspecial);
            
            // Then
            assertThat(resultado).isTrue();
        }
        
        @Test
        @DisplayName("Mensaje debe ser consistente entre llamadas")
        void mensaje_debeSerConsistenteEntreLlamadas() {
            // TESTING DE INMUTABILIDAD Y CONSISTENCIA:
            // Verificar que el método es determinístico
            
            // When - Llamar el método múltiples veces
            String mensaje1 = emailService.construirMensajeBienvenida(usuario);
            String mensaje2 = emailService.construirMensajeBienvenida(usuario);
            
            // Then - Los resultados deben ser idénticos
            assertThat(mensaje1).isEqualTo(mensaje2);
        }
    }
}