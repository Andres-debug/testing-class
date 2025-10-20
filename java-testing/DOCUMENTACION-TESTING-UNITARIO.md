# Documentación Completa: Testing Unitario en Java

## Visión General del Proyecto de Testing

Este proyecto demuestra técnicas avanzadas de testing unitario en Java utilizando JUnit 5, Mockito y AssertJ. Está estructurado para mostrar diferentes aspectos del testing desde lo básico hasta conceptos avanzados.

## Arquitectura del Proyecto de Testing

### Estructura de Carpetas
```
src/
├── main/java/com/example/
│   ├── model/Usuario.java              # Entidad con lógica de negocio
│   ├── repository/UsuarioRepository.java # Repository con queries personalizadas
│   └── service/
│       ├── UsuarioService.java         # Servicio con lógica compleja
│       └── EmailService.java           # Servicio externo simulado
└── test/java/com/example/
    ├── unit/                           # Pruebas unitarias
    │   ├── UsuarioTest.java
    │   ├── UsuarioServiceTest.java
    │   └── EmailServiceTest.java
    └── integration/                    # Pruebas de integración (siguiente fase)
```

### Dependencias Utilizadas

#### JUnit 5 (Jupiter)
- **Propósito**: Framework principal de testing
- **Características**: Anotaciones modernas, testing parametrizado, arquitectura extensible
- **Versión**: 5.10.0

#### Mockito
- **Propósito**: Framework de mocking para aislar dependencias
- **Características**: Mocks inteligentes, verificación de interacciones, stubbing flexible
- **Versión**: 5.6.0

#### AssertJ
- **Propósito**: Biblioteca de assertions fluidas y expresivas
- **Características**: API fluida, mejores mensajes de error, mayor legibilidad
- **Versión**: 3.24.2

## Técnicas de Testing Implementadas

### 1. Testing de Entidades (UsuarioTest.java)

#### Objetivo
Verificar comportamiento de la entidad Usuario sin dependencias externas.

#### Técnicas Demostradas

**Testing Parametrizado**
```java
@ParameterizedTest
@ValueSource(ints = {18, 19, 25, 30, 65, 100})
void usuariosConEdadesValidasMayores_debenSerMayoresDeEdad(int edad) {
    usuario.setEdad(edad);
    assertThat(usuario.esMayorDeEdad()).isTrue();
}
```

**Beneficios:**
- Reduce duplicación de código
- Prueba múltiples casos con una definición
- Reportes individuales por parámetro
- Fácil agregar nuevos casos

**Testing con @CsvSource**
```java
@ParameterizedTest
@CsvSource({
    "juan, Juan",
    "MARÍA, María",
    "ana luisa, Ana luisa"
})
void nombres_debenFormateaseCorrectamente(String input, String expected) {
    usuario.setNombre(input);
    assertThat(usuario.getNombreFormateado()).isEqualTo(expected);
}
```

**Ventajas:**
- Testea transformaciones entrada-salida
- Casos múltiples en formato legible
- Ideal para validar lógica de formateo

**Testing de Casos Edge**
```java
@ParameterizedTest
@NullAndEmptySource
@ValueSource(strings = {"   ", "\t", "\n"})
void emailNullOVacio_noDebeSerValido(String email) {
    usuario.setEmail(email);
    assertThat(usuario.tieneEmailValido()).isFalse();
}
```

**Importancia:**
- @NullAndEmptySource automatiza casos comunes
- Previene NullPointerException
- Valida robustez del código

### 2. Testing de Servicios con Mocks (UsuarioServiceTest.java)

#### Objetivo
Testear lógica de negocio aislada de dependencias externas.

#### Configuración de Mocks

**Anotaciones Clave**
```java
@ExtendWith(MockitoExtension.class)  // Habilita Mockito
class UsuarioServiceTest {
    
    @Mock
    private UsuarioRepository usuarioRepository;  // Mock de dependencia
    
    @Mock 
    private EmailService emailService;  // Mock de servicio externo
    
    @InjectMocks
    private UsuarioService usuarioService;  // Clase real con mocks inyectados
}
```

**Configuración de Comportamiento**
```java
// Configurar respuesta del mock
when(usuarioRepository.existsByEmail(email)).thenReturn(false);
when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioEjemplo);

// Configurar excepción
doThrow(new RuntimeException("Error")).when(emailService)
    .enviarEmailBienvenida(any(Usuario.class));
```

**Verificación de Interacciones**
```java
// Verificar que se llamó el método
verify(usuarioRepository).existsByEmail(email);

// Verificar que NO se llamó
verify(usuarioRepository, never()).save(any(Usuario.class));

// Verificar número específico de llamadas
verify(emailService, times(1)).enviarEmailBienvenida(any(Usuario.class));
```

#### Casos de Testing Avanzados

**Testing de Tolerancia a Fallos**
```java
@Test
void errorEnEnvioEmail_noDebeImpedirCreacionUsuario() {
    // Configurar mock para lanzar excepción
    doThrow(new RuntimeException("Error de email")).when(emailService)
        .enviarEmailBienvenida(any(Usuario.class));
    
    // El método principal debe completarse exitosamente
    Usuario resultado = usuarioService.crearUsuario(nombre, email, edad);
    
    assertThat(resultado).isNotNull();
}
```

**Testing de Validaciones**
```java
@Test
void crearUsuarioConNombreNull_debeLanzarExcepcion() {
    assertThatThrownBy(() -> usuarioService.crearUsuario(null, email, edad))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("El nombre no puede estar vacío");
    
    // Verificar que no se ejecutaron operaciones secundarias
    verify(usuarioRepository, never()).save(any(Usuario.class));
}
```

### 3. Testing de Servicios Sin Mocks (EmailServiceTest.java)

#### Objetivo
Testear lógica pura sin dependencias externas complejas.

#### Técnicas Específicas

**Testing de Construcción de Strings**
```java
@Test
void mensajeParaUsuarioMayorEdad_debeIncluirAccesoCompleto() {
    usuario.setEdad(25);
    String mensaje = emailService.construirMensajeBienvenida(usuario);
    
    assertThat(mensaje)
        .contains("Hola Juan Pérez")
        .contains("tienes acceso a todas las funcionalidades")
        .doesNotContain("funcionalidades están restringidas");
}
```

**Testing de Ausencia de Excepciones**
```java
@Test
void enviarEmailAUsuarioValido_debeCompletarseSinErrores() {
    assertThatCode(() -> emailService.enviarEmailBienvenida(usuario))
        .doesNotThrowAnyException();
}
```

**Testing de Validaciones con Regex**
```java
@ParameterizedTest
@ValueSource(strings = {
    "test@example.com",
    "user+tag@domain.co.uk"
})
void emailsValidos_debenPasarValidacion(String email) {
    assertThat(emailService.esEmailValido(email)).isTrue();
}
```

## Patrones y Mejores Prácticas

### 1. Patrón Arrange-Act-Assert (AAA)

**Estructura Consistente**
```java
@Test
void metodoDeTest() {
    // ARRANGE (Given) - Preparar datos y configuración
    String input = "valor de prueba";
    when(mock.metodo()).thenReturn(respuesta);
    
    // ACT (When) - Ejecutar acción bajo testing
    String resultado = servicioEnTesting.metodo(input);
    
    // ASSERT (Then) - Verificar resultado
    assertThat(resultado).isEqualTo(valorEsperado);
    verify(mock).metodo();
}
```

### 2. Naming Convention para Tests

**Formato Utilizado**
```
[método/escenario]_debe[comportamientoEsperado]
```

**Ejemplos:**
- `crearUsuarioValido_debeFuncionarCorrectamente`
- `buscarPorIdInexistente_debeRetornarOptionalVacio`
- `emailNullOVacio_noDebeSerValido`

### 3. Organización con @Nested

**Ventajas de Agrupación**
```java
@Nested
@DisplayName("Creación de Usuario")
class CreacionUsuario {
    // Tests relacionados con creación
}

@Nested
@DisplayName("Validación de Email") 
class ValidacionEmail {
    // Tests relacionados con email
}
```

**Beneficios:**
- Organización lógica de tests
- Reportes más claros
- Facilita mantenimiento
- Permite configuración específica por grupo

### 4. Uso de AssertJ para Assertions Expresivas

**Comparación con JUnit Clásico**
```java
// JUnit clásico
assertEquals(expected, actual);
assertTrue(condition);

// AssertJ (más expresivo)
assertThat(actual).isEqualTo(expected);
assertThat(condition).isTrue();
assertThat(list).hasSize(3).contains("elemento");
```

**Ventajas de AssertJ:**
- API fluida más legible
- Mejores mensajes de error
- Métodos específicos por tipo de dato
- Encadenamiento de assertions

## Cobertura de Casos de Testing

### 1. Happy Path (Casos Exitosos)
- Datos válidos y operaciones normales
- Flujos principales de negocio

### 2. Edge Cases (Casos Límite)
- Valores null y vacíos
- Límites de validación (edad = 18)
- Strings con espacios en blanco

### 3. Error Cases (Casos de Error)
- Validaciones fallidas
- Excepciones esperadas
- Errores de servicios externos

### 4. Boundary Testing (Testing de Límites)
- Valores mínimos y máximos
- Transiciones de estado
- Condiciones límite

## Configuración de Maven para Testing

### Plugins Importantes

**Surefire Plugin (Tests Unitarios)**
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <includes>
            <include>**/*Test.java</include>
        </includes>
        <excludes>
            <exclude>**/*IntegrationTest.java</exclude>
        </excludes>
    </configuration>
</plugin>
```

**JaCoCo Plugin (Cobertura)**
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### Comandos de Ejecución

```bash
# Ejecutar solo tests unitarios
mvn test

# Ejecutar con reporte de cobertura
mvn test jacoco:report

# Ejecutar solo una clase de test
mvn test -Dtest=UsuarioTest

# Ejecutar con profile específico
mvn test -Punit-tests
```

## Beneficios del Enfoque Implementado

### 1. Aislamiento Completo
- Cada test es independiente
- No hay dependencias entre tests
- Uso de mocks para aislar unidades

### 2. Testing Determinístico
- Resultados predecibles
- Sin dependencias de tiempo o red
- Estados controlados

### 3. Feedback Rápido
- Tests ejecutan en milisegundos
- Fallos detectados inmediatamente
- Ideal para TDD

### 4. Documentación Viva
- Tests documentan comportamiento esperado
- Nombres descriptivos explican funcionalidad
- Ejemplos de uso real

### 5. Refactoring Seguro
- Tests actúan como red de seguridad
- Detectan regresiones automáticamente
- Permiten cambios con confianza

## Próximos Pasos

Este proyecto de testing unitario establece la base para:

1. **Pruebas de Integración**: Testing con base de datos real
2. **Pruebas End-to-End**: Testing de flujos completos
3. **Testing de Performance**: Benchmarks y stress testing
4. **Mutation Testing**: Validación de calidad de tests

El enfoque demostrado aquí proporciona una base sólida para cualquier proyecto Java que requiera testing robusto y mantenible.