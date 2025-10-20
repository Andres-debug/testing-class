package com.example.unit;

import com.example.model.Usuario;
import com.example.repository.UsuarioRepository;
import com.example.service.EmailService;
import com.example.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para UsuarioService
 * 
 * PROPÓSITO:
 * Testear la lógica de negocio del servicio de manera aislada,
 * sin dependencias reales de base de datos o servicios externos.
 * 
 * TÉCNICAS DE TESTING DEMOSTRADAS:
 * - Mocking con Mockito para aislar dependencias
 * - Testing de lógica de negocio compleja
 * - Verificación de interacciones entre objetos
 * - Testing de excepciones y manejo de errores
 * - Testing de métodos que combinan múltiples operaciones
 * - Configuración de comportamiento de mocks
 * - Verificación de que métodos se llaman en orden correcto
 * 
 * ARQUITECTURA DE MOCKING:
 * - @Mock: Crea objetos simulados de las dependencias
 * - @InjectMocks: Inyecta los mocks en la clase bajo testing
 * - @ExtendWith(MockitoExtension.class): Habilita anotaciones de Mockito
 * 
 * BENEFICIOS DEL MOCKING:
 * - Tests rápidos (no hay I/O real)
 * - Tests determinísticos (comportamiento predecible)
 * - Testing de casos edge (simular errores)
 * - Aislamiento completo de la unidad bajo testing
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UsuarioService - Pruebas Unitarias")
class UsuarioServiceTest {
    
    // CONFIGURACIÓN DE MOCKS
    
    /**
     * Mock del repository de usuarios
     * 
     * @Mock crea un objeto simulado que:
     * - No ejecuta código real del repository
     * - Permite configurar respuestas específicas
     * - Registra todas las interacciones para verificación
     * - Es completamente controlado por el test
     */
    @Mock
    private UsuarioRepository usuarioRepository;
    
    /**
     * Mock del servicio de email
     * 
     * Simula servicio externo que puede fallar.
     * Permite testear comportamiento cuando servicios externos
     * no están disponibles o fallan.
     */
    @Mock
    private EmailService emailService;
    
    /**
     * Clase bajo testing con dependencias inyectadas
     * 
     * @InjectMocks automáticamente:
     * - Crea una instancia real de UsuarioService
     * - Inyecta los mocks como dependencias
     * - Permite testear el comportamiento real del servicio
     */
    @InjectMocks
    private UsuarioService usuarioService;
    
    private Usuario usuarioEjemplo;
    
    @BeforeEach
    void setUp() {
        // Crear un usuario de ejemplo que usaremos en múltiples tests
        // Esto evita duplicar la creación de datos de prueba
        usuarioEjemplo = new Usuario("Juan Pérez", "juan@example.com", 25);
        usuarioEjemplo.setId(1L);
    }
    
    /**
     * GRUPO: Creación de Usuario
     * 
     * OBJETIVO:
     * Testear el método más crítico del servicio: crear usuarios nuevos.
     * Este método combina múltiples operaciones y validaciones.
     * 
     * CASOS TESTEADOS:
     * - Creación exitosa con datos válidos
     * - Validaciones de entrada (nombre, email, edad)
     * - Verificación de email duplicado
     * - Manejo de errores en servicios externos
     * - Verificación de interacciones correctas con dependencias
     * 
     * TÉCNICAS:
     * - Configuración de mocks con when().thenReturn()
     * - Verificación de llamadas con verify()
     * - Testing de excepciones con assertThatThrownBy()
     * - Uso de ArgumentMatchers para flexibilidad
     */
    @Nested
    @DisplayName("Creación de Usuario")
    class CreacionUsuario {
        
        @Test
        @DisplayName("Crear usuario válido debe funcionar correctamente")
        void crearUsuarioValido_debeFuncionarCorrectamente() {
            // Given - Configurar datos de entrada y comportamiento de mocks
            String nombre = "Ana García";
            String email = "ana@test.com";
            Integer edad = 30;
            
            // CONFIGURACIÓN DE MOCKS:
            // Definir qué deben retornar los mocks cuando se llamen
            
            // Mock: email no existe previamente
            when(usuarioRepository.existsByEmail(email)).thenReturn(false);
            
            // Mock: guardar usuario retorna el usuario con ID asignado
            when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioEjemplo);
            
            // When - Ejecutar el método bajo testing
            Usuario resultado = usuarioService.crearUsuario(nombre, email, edad);
            
            // Then - Verificar resultado y comportamiento
            assertThat(resultado).isNotNull();
            assertThat(resultado).isEqualTo(usuarioEjemplo);
            
            // VERIFICACIONES DE INTERACCIONES:
            // Confirmar que el servicio llama a las dependencias correctamente
            
            // Verificar que se consultó existencia de email
            verify(usuarioRepository).existsByEmail(email);
            
            // Verificar que se guardó un usuario (cualquier instancia de Usuario)
            verify(usuarioRepository).save(any(Usuario.class));
            
            // Verificar que se envió email de bienvenida
            verify(emailService).enviarEmailBienvenida(any(Usuario.class));
        }
        
        @Test
        @DisplayName("Crear usuario con nombre null debe lanzar excepción")
        void crearUsuarioConNombreNull_debeLanzarExcepcion() {
            // Given
            String nombre = null;
            String email = "test@test.com";
            Integer edad = 25;
            
            // When & Then - Testing de excepciones
            // assertThatThrownBy permite verificar que se lanza la excepción correcta
            assertThatThrownBy(() -> usuarioService.crearUsuario(nombre, email, edad))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("El nombre no puede estar vacío");
            
            // VERIFICACIONES NEGATIVAS:
            // Confirmar que NO se ejecutaron operaciones cuando hay error de validación
            
            // never() verifica que un método NO fue llamado
            verify(usuarioRepository, never()).existsByEmail(anyString());
            verify(usuarioRepository, never()).save(any(Usuario.class));
            verify(emailService, never()).enviarEmailBienvenida(any(Usuario.class));
        }
        
        @Test
        @DisplayName("Crear usuario con nombre vacío debe lanzar excepción")
        void crearUsuarioConNombreVacio_debeLanzarExcepcion() {
            // Given
            String nombre = "   ";
            String email = "test@test.com";
            Integer edad = 25;
            
            // When & Then
            assertThatThrownBy(() -> usuarioService.crearUsuario(nombre, email, edad))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("El nombre no puede estar vacío");
        }
        
        @Test
        @DisplayName("Crear usuario con email null debe lanzar excepción")
        void crearUsuarioConEmailNull_debeLanzarExcepcion() {
            // Given
            String nombre = "Juan";
            String email = null;
            Integer edad = 25;
            
            // When & Then
            assertThatThrownBy(() -> usuarioService.crearUsuario(nombre, email, edad))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("El email no puede estar vacío");
        }
        
        @Test
        @DisplayName("Crear usuario con edad negativa debe lanzar excepción")
        void crearUsuarioConEdadNegativa_debeLanzarExcepcion() {
            // Given
            String nombre = "Juan";
            String email = "juan@test.com";
            Integer edad = -5;
            
            // When & Then
            assertThatThrownBy(() -> usuarioService.crearUsuario(nombre, email, edad))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("La edad debe ser un número positivo");
        }
        
        @Test
        @DisplayName("Crear usuario con email existente debe lanzar excepción")
        void crearUsuarioConEmailExistente_debeLanzarExcepcion() {
            // Given
            String nombre = "Juan";
            String email = "existente@test.com";
            Integer edad = 25;
            
            when(usuarioRepository.existsByEmail(email)).thenReturn(true);
            
            // When & Then
            assertThatThrownBy(() -> usuarioService.crearUsuario(nombre, email, edad))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Ya existe un usuario con este email");
            
            // Verificar que no se intentó guardar
            verify(usuarioRepository, never()).save(any(Usuario.class));
            verify(emailService, never()).enviarEmailBienvenida(any(Usuario.class));
        }
        
        @Test
        @DisplayName("Error en envío de email no debe impedir creación de usuario")
        void errorEnEnvioEmail_noDebeImpedirCreacionUsuario() {
            // TESTING DE TOLERANCIA A FALLOS:
            // Verificar que errores en servicios externos no rompan la funcionalidad principal
            
            // Given
            String nombre = "Juan";
            String email = "juan@test.com";
            Integer edad = 25;
            
            // Configurar mocks para operación exitosa
            when(usuarioRepository.existsByEmail(email)).thenReturn(false);
            when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioEjemplo);
            
            // SIMULAR ERROR EN SERVICIO EXTERNO:
            // doThrow() configura el mock para lanzar excepción cuando se llame
            doThrow(new RuntimeException("Error de email")).when(emailService)
                .enviarEmailBienvenida(any(Usuario.class));
            
            // When - El método debe completarse a pesar del error
            Usuario resultado = usuarioService.crearUsuario(nombre, email, edad);
            
            // Then - Verificar que la creación fue exitosa
            assertThat(resultado).isNotNull();
            
            // Verificar que se intentó guardar el usuario
            verify(usuarioRepository).save(any(Usuario.class));
            
            // Verificar que se intentó enviar email (aunque falló)
            verify(emailService).enviarEmailBienvenida(any(Usuario.class));
        }
    }
    
    /**
     * GRUPO: Búsqueda de Usuario
     */
    @Nested
    @DisplayName("Búsqueda de Usuario")
    class BusquedaUsuario {
        
        @Test
        @DisplayName("Buscar por ID válido debe retornar usuario")
        void buscarPorIdValido_debeRetornarUsuario() {
            // Given
            Long id = 1L;
            when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioEjemplo));
            
            // When
            Optional<Usuario> resultado = usuarioService.buscarPorId(id);
            
            // Then
            assertThat(resultado).isPresent();
            assertThat(resultado.get()).isEqualTo(usuarioEjemplo);
            verify(usuarioRepository).findById(id);
        }
        
        @Test
        @DisplayName("Buscar por ID inexistente debe retornar Optional vacío")
        void buscarPorIdInexistente_debeRetornarOptionalVacio() {
            // Given
            Long id = 999L;
            when(usuarioRepository.findById(id)).thenReturn(Optional.empty());
            
            // When
            Optional<Usuario> resultado = usuarioService.buscarPorId(id);
            
            // Then
            assertThat(resultado).isEmpty();
        }
        
        @Test
        @DisplayName("Buscar por ID null debe lanzar excepción")
        void buscarPorIdNull_debeLanzarExcepcion() {
            // When & Then
            assertThatThrownBy(() -> usuarioService.buscarPorId(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("ID debe ser un número positivo");
        }
        
        @Test
        @DisplayName("Buscar por ID negativo debe lanzar excepción")
        void buscarPorIdNegativo_debeLanzarExcepcion() {
            // When & Then
            assertThatThrownBy(() -> usuarioService.buscarPorId(-1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("ID debe ser un número positivo");
        }
        
        @Test
        @DisplayName("Buscar por email válido debe retornar usuario")
        void buscarPorEmailValido_debeRetornarUsuario() {
            // Given
            String email = "juan@example.com";
            when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuarioEjemplo));
            
            // When
            Optional<Usuario> resultado = usuarioService.buscarPorEmail(email);
            
            // Then
            assertThat(resultado).isPresent();
            verify(usuarioRepository).findByEmail(email);
        }
        
        @Test
        @DisplayName("Buscar por email null debe retornar Optional vacío")
        void buscarPorEmailNull_debeRetornarOptionalVacio() {
            // When
            Optional<Usuario> resultado = usuarioService.buscarPorEmail(null);
            
            // Then
            assertThat(resultado).isEmpty();
            verify(usuarioRepository, never()).findByEmail(anyString());
        }
        
        @Test
        @DisplayName("Buscar por email con espacios debe normalizar")
        void buscarPorEmailConEspacios_debeNormalizar() {
            // Given
            String emailConEspacios = "  JUAN@EXAMPLE.COM  ";
            String emailNormalizado = "juan@example.com";
            
            when(usuarioRepository.findByEmail(emailNormalizado)).thenReturn(Optional.of(usuarioEjemplo));
            
            // When
            usuarioService.buscarPorEmail(emailConEspacios);
            
            // Then
            verify(usuarioRepository).findByEmail(emailNormalizado);
        }
    }
    
    /**
     * GRUPO: Usuarios Activos
     */
    @Nested
    @DisplayName("Usuarios Activos")
    class UsuariosActivos {
        
        @Test
        @DisplayName("Obtener usuarios activos debe delegar al repository")
        void obtenerUsuariosActivos_debeDelegarAlRepository() {
            // Given
            List<Usuario> usuariosActivos = Arrays.asList(usuarioEjemplo);
            when(usuarioRepository.findByActivoTrue()).thenReturn(usuariosActivos);
            
            // When
            List<Usuario> resultado = usuarioService.obtenerUsuariosActivos();
            
            // Then
            assertThat(resultado).isEqualTo(usuariosActivos);
            verify(usuarioRepository).findByActivoTrue();
        }
    }
    
    /**
     * GRUPO: Actualización de Usuario
     */
    @Nested
    @DisplayName("Actualización de Usuario")
    class ActualizacionUsuario {
        
        @Test
        @DisplayName("Actualizar usuario existente debe funcionar correctamente")
        void actualizarUsuarioExistente_debeFuncionarCorrectamente() {
            // Given
            Long id = 1L;
            String nuevoNombre = "Juan Carlos";
            String nuevoEmail = "juan.carlos@test.com";
            Integer nuevaEdad = 30;
            
            when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioEjemplo));
            when(usuarioRepository.existsByEmail(nuevoEmail)).thenReturn(false);
            when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioEjemplo);
            
            // When
            Usuario resultado = usuarioService.actualizarUsuario(id, nuevoNombre, nuevoEmail, nuevaEdad);
            
            // Then
            assertThat(resultado).isNotNull();
            verify(usuarioRepository).findById(id);
            verify(usuarioRepository).existsByEmail(nuevoEmail);
            verify(usuarioRepository).save(usuarioEjemplo);
        }
        
        @Test
        @DisplayName("Actualizar usuario inexistente debe lanzar excepción")
        void actualizarUsuarioInexistente_debeLanzarExcepcion() {
            // Given
            Long id = 999L;
            when(usuarioRepository.findById(id)).thenReturn(Optional.empty());
            
            // When & Then
            assertThatThrownBy(() -> usuarioService.actualizarUsuario(id, "Nombre", "email@test.com", 25))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuario no encontrado");
        }
        
        @Test
        @DisplayName("Actualizar con email existente debe lanzar excepción")
        void actualizarConEmailExistente_debeLanzarExcepcion() {
            // Given
            Long id = 1L;
            String emailExistente = "existente@test.com";
            
            when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioEjemplo));
            when(usuarioRepository.existsByEmail(emailExistente)).thenReturn(true);
            
            // When & Then
            assertThatThrownBy(() -> usuarioService.actualizarUsuario(id, "Nombre", emailExistente, 25))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Ya existe un usuario con este email");
        }
    }
    
    /**
     * GRUPO: Desactivación de Usuario
     */
    @Nested
    @DisplayName("Desactivación de Usuario")
    class DesactivacionUsuario {
        
        @Test
        @DisplayName("Desactivar usuario existente debe funcionar correctamente")
        void desactivarUsuarioExistente_debeFuncionarCorrectamente() {
            // Given
            Long id = 1L;
            when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioEjemplo));
            when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioEjemplo);
            
            // When
            usuarioService.desactivarUsuario(id);
            
            // Then
            verify(usuarioRepository).findById(id);
            verify(usuarioRepository).save(usuarioEjemplo);
            verify(emailService).enviarEmailDespedida(usuarioEjemplo);
            
            assertThat(usuarioEjemplo.getActivo()).isFalse();
        }
        
        @Test
        @DisplayName("Desactivar usuario inexistente debe lanzar excepción")
        void desactivarUsuarioInexistente_debeLanzarExcepcion() {
            // Given
            Long id = 999L;
            when(usuarioRepository.findById(id)).thenReturn(Optional.empty());
            
            // When & Then
            assertThatThrownBy(() -> usuarioService.desactivarUsuario(id))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuario no encontrado");
        }
    }
    
    /**
     * GRUPO: Búsqueda con Criterios
     */
    @Nested
    @DisplayName("Búsqueda con Criterios")
    class BusquedaConCriterios {
        
        @Test
        @DisplayName("Buscar por nombre debe usar repository correcto")
        void buscarPorNombre_debeUsarRepositoryCorrecto() {
            // Given
            String nombre = "Juan";
            List<Usuario> usuarios = Arrays.asList(usuarioEjemplo);
            when(usuarioRepository.findByNombreContainingIgnoreCase(nombre)).thenReturn(usuarios);
            
            // When
            List<Usuario> resultado = usuarioService.buscarUsuarios(nombre, null, null);
            
            // Then
            assertThat(resultado).isEqualTo(usuarios);
            verify(usuarioRepository).findByNombreContainingIgnoreCase(nombre);
        }
        
        @Test
        @DisplayName("Buscar por edad mínima y activo debe usar query personalizada")
        void buscarPorEdadMinimaYActivo_debeUsarQueryPersonalizada() {
            // Given
            Integer edadMinima = 18;
            Boolean activo = true;
            List<Usuario> usuarios = Arrays.asList(usuarioEjemplo);
            
            when(usuarioRepository.findUsuariosActivosConEdadMinima(activo, edadMinima))
                .thenReturn(usuarios);
            
            // When
            List<Usuario> resultado = usuarioService.buscarUsuarios(null, edadMinima, activo);
            
            // Then
            assertThat(resultado).isEqualTo(usuarios);
            verify(usuarioRepository).findUsuariosActivosConEdadMinima(activo, edadMinima);
        }
        
        @Test
        @DisplayName("Buscar solo activos debe usar método específico")
        void buscarSoloActivos_debeUsarMetodoEspecifico() {
            // Given
            Boolean activo = true;
            List<Usuario> usuarios = Arrays.asList(usuarioEjemplo);
            when(usuarioRepository.findByActivoTrue()).thenReturn(usuarios);
            
            // When
            List<Usuario> resultado = usuarioService.buscarUsuarios(null, null, activo);
            
            // Then
            assertThat(resultado).isEqualTo(usuarios);
            verify(usuarioRepository).findByActivoTrue();
        }
        
        @Test
        @DisplayName("Buscar sin criterios debe retornar todos")
        void buscarSinCriterios_debeRetornarTodos() {
            // Given
            List<Usuario> usuarios = Arrays.asList(usuarioEjemplo);
            when(usuarioRepository.findAll()).thenReturn(usuarios);
            
            // When
            List<Usuario> resultado = usuarioService.buscarUsuarios(null, null, null);
            
            // Then
            assertThat(resultado).isEqualTo(usuarios);
            verify(usuarioRepository).findAll();
        }
    }
    
    /**
     * GRUPO: Estadísticas
     */
    @Nested
    @DisplayName("Estadísticas")
    class Estadisticas {
        
        @Test
        @DisplayName("Obtener estadísticas debe calcular correctamente")
        void obtenerEstadisticas_debeCalcularCorrectamente() {
            // Given
            when(usuarioRepository.count()).thenReturn(100L);
            when(usuarioRepository.countByActivoTrue()).thenReturn(85L);
            when(usuarioRepository.findUsuariosMayoresDeEdad()).thenReturn(Arrays.asList(usuarioEjemplo));
            
            // When
            UsuarioService.EstadisticasUsuarios resultado = usuarioService.obtenerEstadisticas();
            
            // Then
            assertThat(resultado.getTotalUsuarios()).isEqualTo(100L);
            assertThat(resultado.getUsuariosActivos()).isEqualTo(85L);
            assertThat(resultado.getUsuariosMayoresEdad()).isEqualTo(1L);
            
            verify(usuarioRepository).count();
            verify(usuarioRepository).countByActivoTrue();
            verify(usuarioRepository).findUsuariosMayoresDeEdad();
        }
    }
    
    /**
     * GRUPO: Eliminación de Usuario
     */
    @Nested
    @DisplayName("Eliminación de Usuario")
    class EliminacionUsuario {
        
        @Test
        @DisplayName("Eliminar usuario existente debe funcionar correctamente")
        void eliminarUsuarioExistente_debeFuncionarCorrectamente() {
            // Given
            Long id = 1L;
            when(usuarioRepository.existsById(id)).thenReturn(true);
            
            // When
            usuarioService.eliminarUsuario(id);
            
            // Then
            verify(usuarioRepository).existsById(id);
            verify(usuarioRepository).deleteById(id);
        }
        
        @Test
        @DisplayName("Eliminar usuario inexistente debe lanzar excepción")
        void eliminarUsuarioInexistente_debeLanzarExcepcion() {
            // Given
            Long id = 999L;
            when(usuarioRepository.existsById(id)).thenReturn(false);
            
            // When & Then
            assertThatThrownBy(() -> usuarioService.eliminarUsuario(id))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuario no encontrado");
            
            verify(usuarioRepository, never()).deleteById(anyLong());
        }
    }
}