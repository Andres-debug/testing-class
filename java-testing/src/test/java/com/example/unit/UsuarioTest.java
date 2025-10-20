package com.example.unit;

import com.example.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

/**
 * Pruebas unitarias para la clase Usuario
 * 
 * PROPÓSITO:
 * Verificar que todos los métodos de la entidad Usuario funcionen correctamente
 * de manera aislada, sin dependencias externas.
 * 
 * TÉCNICAS DEMOSTRADAS:
 * - Testing de métodos simples con lógica de negocio
 * - Testing parametrizado para múltiples casos de entrada
 * - Testing de casos edge (valores null, vacíos, límites)
 * - Testing de equals y hashCode para consistencia de objetos
 * - Testing con fechas y cálculos temporales
 * - Uso de AssertJ para assertions expresivas
 * - Organización de tests con @Nested para mejor estructura
 * 
 * ARQUITECTURA DE TESTING:
 * - Cada grupo @Nested testea una funcionalidad específica
 * - @BeforeEach configura estado común para todos los tests
 * - @DisplayName proporciona descripciones legibles para reportes
 * - @ParameterizedTest reduce duplicación de código de test
 */
@DisplayName("Usuario - Pruebas Unitarias")
class UsuarioTest {
    
    private Usuario usuario;
    
    /**
     * Configuración antes de cada prueba
     * 
     * PROPÓSITO:
     * Crear un estado inicial consistente para todos los tests.
     * Se ejecuta automáticamente antes de cada método @Test.
     * 
     * BENEFICIOS:
     * - Garantiza que cada test empiece con datos conocidos
     * - Evita dependencias entre tests
     * - Reduce duplicación de código de configuración
     * - Facilita mantenimiento cuando cambian los datos de prueba
     */
    @BeforeEach
    void setUp() {
        // Crear usuario con datos válidos que servirán como base para todos los tests
        usuario = new Usuario("Juan Pérez", "juan@example.com", 25);
    }
    
    /**
     * GRUPO: Pruebas de Constructor y Estado Inicial
     * 
     * OBJETIVO:
     * Verificar que los constructores inicialicen correctamente el objeto Usuario
     * y que los valores por defecto sean los esperados.
     * 
     * IMPORTANCIA:
     * Los constructores son el punto de entrada del objeto, por lo que deben
     * garantizar un estado válido desde la creación.
     */
    @Nested
    @DisplayName("Constructor y Estado Inicial")
    class ConstructorYEstadoInicial {
        
        @Test
        @DisplayName("Constructor con parámetros debe crear usuario válido")
        void constructorConParametros_debeCrearUsuarioValido() {
            // PATRÓN ARRANGE-ACT-ASSERT
            
            // Given (Arrange) - Preparar datos de entrada
            String nombre = "Ana García";
            String email = "ana@test.com";
            Integer edad = 30;
            
            // When (Act) - Ejecutar la acción que estamos testeando
            Usuario usuario = new Usuario(nombre, email, edad);
            
            // Then (Assert) - Verificar que el resultado es el esperado
            // Usar AssertJ para assertions más expresivas y legibles
            assertThat(usuario.getNombre()).isEqualTo(nombre);
            assertThat(usuario.getEmail()).isEqualTo(email);
            assertThat(usuario.getEdad()).isEqualTo(edad);
            
            // Verificar valores por defecto establecidos en constructor
            assertThat(usuario.getActivo()).isTrue(); // Valor por defecto
            assertThat(usuario.getFechaRegistro()).isNotNull();
            assertThat(usuario.getId()).isNull(); // Aún no persistido en DB
        }
        
        @Test
        @DisplayName("Constructor por defecto debe inicializar valores correctos")
        void constructorPorDefecto_debeInicializarValoresCorrectos() {
            // When - Crear usuario sin parámetros
            Usuario usuario = new Usuario();
            
            // Then - Verificar que valores por defecto se establecen correctamente
            assertThat(usuario.getActivo()).isTrue();
            assertThat(usuario.getFechaRegistro()).isNotNull();
            
            // Verificar que la fecha de registro es reciente (no más antigua que ahora)
            assertThat(usuario.getFechaRegistro()).isBeforeOrEqualTo(LocalDateTime.now());
        }
    }
    
    /**
     * GRUPO: Validación de Mayoría de Edad
     * 
     * OBJETIVO:
     * Testear la lógica de negocio que determina si un usuario es mayor de edad.
     * 
     * TÉCNICAS UTILIZADAS:
     * - Testing de valores límite (18 años exactos)
     * - Testing parametrizado para múltiples valores
     * - Testing de casos edge (valores null)
     * 
     * CASOS CUBIERTOS:
     * - Edad exactamente 18 (valor límite)
     * - Edades válidas mayores de 18
     * - Edades menores de 18
     * - Edad null (caso edge)
     */
    @Nested
    @DisplayName("Validación de Mayoría de Edad")
    class ValidacionMayoriaEdad {
        
        @Test
        @DisplayName("Usuario con 18 años debe ser mayor de edad")
        void usuarioConDieciochoAños_debeSerMayorDeEdad() {
            // Given - Establecer edad límite exacta
            usuario.setEdad(18);
            
            // When - Ejecutar método bajo testing
            boolean resultado = usuario.esMayorDeEdad();
            
            // Then - Verificar resultado esperado
            // 18 años es el límite mínimo para ser mayor de edad
            assertThat(resultado).isTrue();
        }
        
        @ParameterizedTest
        @DisplayName("Usuarios con edades válidas de mayores de edad")
        @ValueSource(ints = {18, 19, 25, 30, 65, 100})
        void usuariosConEdadesValidasMayores_debenSerMayoresDeEdad(int edad) {
            // BENEFICIOS DEL TESTING PARAMETRIZADO:
            // - Reduce duplicación de código
            // - Prueba múltiples casos con una sola definición
            // - Facilita agregar nuevos casos de prueba
            // - Genera reportes individuales para cada parámetro
            
            // Given - JUnit inyecta automáticamente cada valor de @ValueSource
            usuario.setEdad(edad);
            
            // When
            boolean resultado = usuario.esMayorDeEdad();
            
            // Then - Todos estos valores deben resultar en mayoría de edad
            assertThat(resultado).isTrue();
        }
        
        @ParameterizedTest
        @DisplayName("Usuarios menores de 18 años no deben ser mayores de edad")
        @ValueSource(ints = {0, 1, 10, 15, 17})
        void usuariosMenoresDeDieciocho_noDebenSerMayoresDeEdad(int edad) {
            // Given - Probar con edades que están por debajo del límite
            usuario.setEdad(edad);
            
            // When
            boolean resultado = usuario.esMayorDeEdad();
            
            // Then - Todos estos valores deben resultar en NO mayor de edad
            assertThat(resultado).isFalse();
        }
        
        @Test
        @DisplayName("Usuario con edad null no debe ser mayor de edad")
        void usuarioConEdadNull_noDebeSerMayorDeEdad() {
            // CASO EDGE: Testing con valores null
            // Importante porque null puede aparecer en datos corruptos o parciales
            
            // Given
            usuario.setEdad(null);
            
            // When
            boolean resultado = usuario.esMayorDeEdad();
            
            // Then - null debe manejarse como NO mayor de edad
            assertThat(resultado).isFalse();
        }
    }
    
    /**
     * GRUPO: Validación de Email
     * 
     * OBJETIVO:
     * Testear la validación básica de formato de email.
     * 
     * TÉCNICAS:
     * - @ParameterizedTest con @ValueSource para múltiples emails
     * - @NullAndEmptySource para casos edge automáticos
     * - Testing de strings con espacios en blanco
     * 
     * COBERTURA:
     * - Emails válidos con diferentes formatos
     * - Emails inválidos comunes
     * - Casos edge (null, vacío, espacios)
     */
    @Nested
    @DisplayName("Validación de Email")
    class ValidacionEmail {
        
        @ParameterizedTest
        @DisplayName("Emails válidos deben pasar validación")
        @ValueSource(strings = {
            "test@example.com",
            "usuario@dominio.es",
            "juan.perez@empresa.com.mx",
            "admin@test.org"
        })
        void emailsValidos_debenPasarValidacion(String email) {
            // VENTAJA DE @ValueSource:
            // Permite testear múltiples casos válidos sin duplicar código
            // Cada string se ejecuta como un test separado
            
            // Given
            usuario.setEmail(email);
            
            // When
            boolean resultado = usuario.tieneEmailValido();
            
            // Then
            assertThat(resultado).isTrue();
        }
        
        @ParameterizedTest
        @DisplayName("Emails inválidos no deben pasar validación")
        @ValueSource(strings = {
            "email-sin-arroba.com",  // Falta @
            "@dominio.com",          // Falta parte local
            "usuario@",              // Falta dominio
            "test",                  // No es email
            "a@b"                    // Muy corto
        })
        void emailsInvalidos_noDebenPasarValidacion(String email) {
            // Given
            usuario.setEmail(email);
            
            // When
            boolean resultado = usuario.tieneEmailValido();
            
            // Then
            assertThat(resultado).isFalse();
        }
        
        @ParameterizedTest
        @DisplayName("Email null o vacío no debe ser válido")
        @NullAndEmptySource  // Automáticamente prueba con null y ""
        @ValueSource(strings = {"   ", "\t", "\n"})  // Espacios en blanco
        void emailNullOVacio_noDebeSerValido(String email) {
            // @NullAndEmptySource es una anotación de JUnit que automáticamente
            // proporciona null y string vacío como parámetros
            // Esto evita tener que escribir tests separados para estos casos comunes
            
            // Given
            usuario.setEmail(email);
            
            // When
            boolean resultado = usuario.tieneEmailValido();
            
            // Then
            assertThat(resultado).isFalse();
        }
    }
    
    /**
     * GRUPO: Formateo de Nombre
     * 
     * OBJETIVO:
     * Testear la lógica de formateo de nombres (capitalización).
     * 
     * TÉCNICAS:
     * - @CsvSource para testear pares entrada-salida esperada
     * - Testing de strings con espacios y diferentes casos
     * - Testing de valores por defecto
     * 
     * LÓGICA TESTEADA:
     * - Primera letra mayúscula, resto minúscula
     * - Manejo de espacios en blanco
     * - Fallback para valores null/vacíos
     */
    @Nested
    @DisplayName("Formateo de Nombre")
    class FormateeoNombre {
        
        @ParameterizedTest
        @DisplayName("Nombres deben formatearse correctamente")
        @CsvSource({
            "juan, Juan",           // Minúscula a capitalizada
            "MARÍA, María",         // Mayúscula a capitalizada 
            "ana luisa, Ana luisa", // Solo primera palabra se capitaliza
            "  pedro  , Pedro"      // Espacios se eliminan
        })
        void nombres_debenFormateaseCorrectamente(String nombreInput, String nombreEsperado) {
            // @CsvSource permite definir pares de entrada-salida esperada
            // Formato: "entrada, salida_esperada"
            // Muy útil para testear transformaciones de datos
            
            // Given
            usuario.setNombre(nombreInput);
            
            // When
            String resultado = usuario.getNombreFormateado();
            
            // Then
            assertThat(resultado).isEqualTo(nombreEsperado);
        }
        
        @ParameterizedTest
        @DisplayName("Nombre null o vacío debe retornar valor por defecto")
        @NullAndEmptySource
        @ValueSource(strings = {"   ", "\t"})
        void nombreNullOVacio_debeRetornarValorPorDefecto(String nombre) {
            // Testing del fallback cuando no hay nombre válido
            
            // Given
            usuario.setNombre(nombre);
            
            // When
            String resultado = usuario.getNombreFormateado();
            
            // Then
            assertThat(resultado).isEqualTo("Usuario Anónimo");
        }
    }
    
    /**
     * GRUPO: Cálculo de Años desde Registro
     */
    @Nested
    @DisplayName("Cálculo de Años desde Registro")
    class CalculoAñosDesdeRegistro {
        
        @Test
        @DisplayName("Usuario registrado hace 0 años debe retornar 0")
        void usuarioRegistradoHaceCeroAños_debeRetornarCero() {
            // Given - fecha actual
            usuario.setFechaRegistro(LocalDateTime.now());
            
            // When
            long años = usuario.getAñosDesdeRegistro();
            
            // Then
            assertThat(años).isEqualTo(0);
        }
        
        @Test
        @DisplayName("Usuario registrado hace 2 años debe retornar 2")
        void usuarioRegistradoHaceDosAños_debeRetornarDos() {
            // Given - fecha de hace 2 años
            usuario.setFechaRegistro(LocalDateTime.now().minusYears(2));
            
            // When
            long años = usuario.getAñosDesdeRegistro();
            
            // Then
            assertThat(años).isEqualTo(2);
        }
        
        @Test
        @DisplayName("Usuario con fecha registro null debe retornar 0")
        void usuarioConFechaRegistroNull_debeRetornarCero() {
            // Given
            usuario.setFechaRegistro(null);
            
            // When
            long años = usuario.getAñosDesdeRegistro();
            
            // Then
            assertThat(años).isEqualTo(0);
        }
    }
    
    /**
     * GRUPO: Cambio de Estado
     */
    @Nested
    @DisplayName("Cambio de Estado")
    class CambioEstado {
        
        @Test
        @DisplayName("Cambiar estado debe alternar valor de activo")
        void cambiarEstado_debeAlternarValorActivo() {
            // Given - usuario activo por defecto
            assertThat(usuario.getActivo()).isTrue();
            
            // When - cambiar estado
            usuario.cambiarEstado();
            
            // Then - debe estar inactivo
            assertThat(usuario.getActivo()).isFalse();
            
            // When - cambiar estado nuevamente
            usuario.cambiarEstado();
            
            // Then - debe estar activo otra vez
            assertThat(usuario.getActivo()).isTrue();
        }
    }
    
    /**
     * GRUPO: Equals y HashCode
     */
    @Nested
    @DisplayName("Equals y HashCode")
    class EqualsYHashCode {
        
        @Test
        @DisplayName("Usuarios con mismo ID y email deben ser iguales")
        void usuariosConMismoIdYEmail_debenSerIguales() {
            // Given
            Usuario usuario1 = new Usuario("Juan", "test@email.com", 25);
            usuario1.setId(1L);
            
            Usuario usuario2 = new Usuario("María", "test@email.com", 30);
            usuario2.setId(1L);
            
            // When & Then
            assertThat(usuario1).isEqualTo(usuario2);
            assertThat(usuario1.hashCode()).isEqualTo(usuario2.hashCode());
        }
        
        @Test
        @DisplayName("Usuarios con diferente ID deben ser diferentes")
        void usuariosConDiferenteId_debenSerDiferentes() {
            // Given
            Usuario usuario1 = new Usuario("Juan", "test@email.com", 25);
            usuario1.setId(1L);
            
            Usuario usuario2 = new Usuario("Juan", "test@email.com", 25);
            usuario2.setId(2L);
            
            // When & Then
            assertThat(usuario1).isNotEqualTo(usuario2);
        }
        
        @Test
        @DisplayName("Usuario debe ser igual a sí mismo")
        void usuario_debeSerIgualASiMismo() {
            // When & Then
            assertThat(usuario).isEqualTo(usuario);
        }
        
        @Test
        @DisplayName("Usuario no debe ser igual a null")
        void usuario_noDebeSerIgualANull() {
            // When & Then
            assertThat(usuario).isNotEqualTo(null);
        }
        
        @Test
        @DisplayName("Usuario no debe ser igual a objeto de otra clase")
        void usuario_noDebeSerIgualAObjetoDeOtraClase() {
            // When & Then
            assertThat(usuario).isNotEqualTo("string");
            assertThat(usuario).isNotEqualTo(123);
        }
    }
    
    /**
     * GRUPO: ToString
     */
    @Nested
    @DisplayName("ToString")
    class ToStringTest {
        
        @Test
        @DisplayName("ToString debe contener información relevante")
        void toString_debeContenerInformacionRelevante() {
            // Given
            usuario.setId(1L);
            
            // When
            String resultado = usuario.toString();
            
            // Then
            assertThat(resultado)
                .contains("Usuario{")
                .contains("id=1")
                .contains("nombre='Juan Pérez'")
                .contains("email='juan@example.com'")
                .contains("edad=25")
                .contains("activo=true");
        }
    }
}