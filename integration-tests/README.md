# Ejercicio de Pruebas de Integración con Jest

Este proyecto demuestra diferentes tipos de pruebas de integración utilizando Jest, incluyendo pruebas incrementales, Big Bang, y el uso de stubs y drivers.

## 📂 Estructura del Proyecto

```
integration-tests/
├── blogSystem.js              # Sistema principal que integra servicios
├── services/
│   ├── userService.js         # Servicio para gestionar usuarios
│   └── postService.js         # Servicio para gestionar posts
├── stubs-drivers/
│   └── testHelpers.js         # Drivers y stubs para pruebas
└── tests/
    ├── incremental.test.js    # Pruebas de integración incrementales
    ├── bigbang.test.js        # Pruebas de integración Big Bang
    └── drivers-stubs.test.js  # Pruebas específicas con drivers y stubs
```

## 🎯 Objetivos del Ejercicio

### 1. **Pruebas de Integración Incrementales**
- Prueban la integración entre módulos de forma gradual
- Verifican cada servicio individualmente antes de integrarlos
- Utilizan mocks para aislar dependencias externas

### 2. **Pruebas de Integración Big Bang**
- Prueban todo el sistema integrado de una sola vez
- Incluyen pruebas con API real y con stubs
- Verifican el comportamiento del sistema completo

### 3. **Uso de Drivers y Stubs**
- **Drivers**: Simulan componentes superiores del sistema
- **Stubs**: Simulan componentes inferiores del sistema
- Permiten aislar el código bajo prueba

## 🛠️ Tecnologías Utilizadas

- **Jest**: Framework de pruebas
- **Axios**: Cliente HTTP para llamadas a API
- **JSONPlaceholder**: API pública para pruebas reales
- **Mocks/Stubs**: Para simular dependencias

## 🚀 Cómo Ejecutar las Pruebas

### Ejecutar todas las pruebas de integración:
```bash
npm test integration-tests
```

### Ejecutar pruebas específicas:

**Pruebas Incrementales:**
```bash
npm test incremental.test.js
```

**Pruebas Big Bang:**
```bash
npm test bigbang.test.js
```

**Pruebas con Drivers y Stubs:**
```bash
npm test drivers-stubs.test.js
```

### Ejecutar con información detallada:
```bash
npm test -- --verbose
```

## 📋 Descripción de los Componentes

### BlogSystem (Sistema Principal)
El sistema principal que integra los servicios de usuario y posts:
- `getUserProfile(userId)`: Obtiene perfil completo de usuario con sus posts
- `createUserPost(userId, postData)`: Crea un post para un usuario existente
- `getBlogStats()`: Obtiene estadísticas generales del blog

### UserService
Servicio para gestionar operaciones relacionadas con usuarios:
- `getUserById(id)`: Obtiene un usuario por ID
- `getAllUsers()`: Obtiene todos los usuarios
- `createUser(userData)`: Crea un nuevo usuario

### PostService
Servicio para gestionar operaciones relacionadas con posts:
- `getPostsByUserId(userId)`: Obtiene posts por ID de usuario
- `getPostById(id)`: Obtiene un post específico por ID
- `createPost(postData)`: Crea un nuevo post

## 🎭 Drivers y Stubs

### BlogControllerDriver (Driver)
Simula un controlador HTTP que maneja peticiones:
- Simula respuestas HTTP con códigos de estado
- Maneja errores de integración
- Proporciona una interfaz consistente

### DatabaseStub (Stub)
Simula una base de datos en memoria:
- Operaciones CRUD simuladas
- Datos de prueba predefinidos
- Estado persistente durante las pruebas

### NotificationServiceStub (Stub)
Simula un servicio de notificaciones:
- Envío de notificaciones simulado
- Registro de notificaciones enviadas
- Verificación de integración

## 📊 Tipos de Pruebas Implementadas

### 1. Pruebas Incrementales (`incremental.test.js`)

#### Nivel 1: UserService con stubs
```javascript
test('Debe obtener un usuario por ID usando stub de axios', async () => {
    const mockUserData = { id: 1, name: 'Leanne Graham' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockUserData });
    
    const result = await userService.getUserById(1);
    expect(result.name).toBe('Leanne Graham');
});
```

#### Nivel 2: PostService con stubs
```javascript
test('Debe obtener posts por userId usando stub de axios', async () => {
    const mockPostsData = [
        { id: 1, userId: 1, title: 'Post de prueba 1' }
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockPostsData });
    
    const result = await postService.getPostsByUserId(1);
    expect(result).toHaveLength(1);
});
```

#### Nivel 3: Integración completa
```javascript
test('Debe obtener perfil completo integrando UserService y PostService', async () => {
    // Configura stubs para ambos servicios
    // Verifica que la integración funcione correctamente
});
```

### 2. Pruebas Big Bang (`bigbang.test.js`)

#### Con Stubs (Escenarios Controlados)
```javascript
test('Sistema completo: Obtener estadísticas del blog', async () => {
    // Configura múltiples stubs para simular usuarios y posts
    // Prueba todo el flujo de estadísticas de una vez
});
```

#### Con API Real (End-to-End)
```javascript
test('Sistema completo con API real: Obtener perfil de usuario', async () => {
    // Usa la API real de JSONPlaceholder
    // Verifica integración completa con servicios externos
});
```

### 3. Pruebas con Drivers y Stubs (`drivers-stubs.test.js`)

#### Usando Driver
```javascript
test('Driver: Debe manejar petición exitosa de perfil de usuario', async () => {
    // Usa BlogControllerDriver para simular peticiones HTTP
    // Verifica manejo correcto de respuestas
});
```

#### Usando Stubs
```javascript
test('Stub de Base de Datos: Debe simular operaciones de base de datos', async () => {
    // Usa DatabaseStub para operaciones CRUD
    // Verifica funcionamiento sin base de datos real
});
```

## 🔍 Patrones de Prueba Demostrados

### Patrón AAA (Arrange-Act-Assert)
```javascript
test('Ejemplo del patrón AAA', async () => {
    // Arrange: Configurar datos y mocks
    const mockData = { id: 1, name: 'Test User' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    
    // Act: Ejecutar la funcionalidad
    const result = await service.getUser(1);
    
    // Assert: Verificar el resultado
    expect(result.name).toBe('Test User');
});
```

### Patrón Given-When-Then
```javascript
describe('Given un usuario existente', () => {
    test('When solicito su perfil, Then obtengo datos completos', async () => {
        // Given: Usuario y posts existen
        // When: Solicito perfil
        // Then: Recibo datos integrados
    });
});
```

## 📈 Ventajas de Cada Enfoque

### Pruebas Incrementales
✅ **Ventajas:**
- Detección temprana de errores
- Fácil localización de problemas
- Pruebas más específicas y enfocadas
- Menor complejidad por prueba

❌ **Desventajas:**
- Mayor número de pruebas
- Pueden pasar por alto problemas de integración completa

### Pruebas Big Bang
✅ **Ventajas:**
- Verifica el sistema completo
- Detecta problemas de integración compleja
- Refleja el uso real del sistema
- Menor número de pruebas

❌ **Desventajas:**
- Difícil localización de errores
- Configuración más compleja
- Dependiente de servicios externos

### Stubs y Drivers
✅ **Ventajas:**
- Control total sobre dependencias
- Pruebas rápidas y confiables
- Simulación de escenarios específicos
- Independencia de servicios externos

❌ **Desventajas:**
- Pueden no reflejar comportamiento real
- Mantenimiento adicional de código de prueba

## 🎓 Conceptos Clave Aprendidos

1. **Integración Incremental vs Big Bang**
2. **Uso efectivo de Mocks y Stubs**
3. **Pruebas con APIs reales vs simuladas**
4. **Patrones de prueba AAA y Given-When-Then**
5. **Manejo de errores en integración**
6. **Verificación de múltiples llamadas API**
7. **Pruebas de rendimiento básicas**

## 🚨 Notas Importantes

- Las pruebas con API real requieren conexión a internet
- JSONPlaceholder es una API de solo lectura (las creaciones son simuladas)
- Los timeouts están configurados para pruebas con API externa
- Los mocks se limpian automáticamente entre pruebas

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Integration Testing Best Practices](https://martinfowler.com/articles/practical-test-pyramid.html)