# Documentación Técnica: CharacterCard Component

## Decisiones de Arquitectura del Componente

### 1. Separación de Estados
Se implementaron tres estados independientes (loading, error, character) en lugar de un estado unificado por las siguientes razones:

- **Granularidad de Control**: Permite manejar cada escenario de manera específica
- **Testing Simplificado**: Cada estado puede ser testeado de forma aislada
- **UX Mejorada**: Estados específicos permiten mostrar interfaces apropiadas para cada situación
- **Mantenibilidad**: Lógica clara de cuándo mostrar qué elemento

### 2. Función fetchCharacter Separada
Se extrajo la lógica de fetch como función independiente:

**Ventajas:**
- **Reutilización**: Se puede llamar desde useEffect y desde handlers de eventos
- **Testing**: Facilita el mock y testing de la lógica de API
- **Separación de Responsabilidades**: Lógica de red separada de lógica de componente
- **Mantenimiento**: Cambios en la API centralizados en un lugar

### 3. Manejo Explícito de response.ok
Se verifica manualmente response.ok porque fetch() no rechaza automáticamente para códigos HTTP 4xx/5xx:

```javascript
if (!response.ok) {
  throw new Error(`Error: ${response.status}`);
}
```

Esto asegura que errores HTTP se manejen consistentemente como errores de JavaScript.

### 4. Optional Chaining y Fallbacks
Se utilizan operadores de optional chaining (?.) y valores fallback:

```javascript
{character.origin?.name || 'Desconocido'}
{character.episode?.length || 0}
```

**Razones:**
- **Robustez**: Maneja APIs que pueden retornar datos parciales
- **Evita Errores**: Previene errores de runtime por propiedades undefined
- **UX Consistente**: Siempre muestra algo al usuario, nunca valores vacíos

### 5. Data Test IDs
Todos los elementos importantes tienen atributos data-testid:

**Beneficios:**
- **Testing Confiable**: Queries que no dependen de texto o estructura DOM
- **Mantenibilidad**: Cambios de UI no rompen tests
- **Claridad**: Elementos específicamente marcados para testing
- **Separación**: Testing separado de implementación visual

## Decisiones de Testing

### 1. Mock Global de fetch
Se mockea fetch globalmente porque:

- **Control**: Total control sobre respuestas de API
- **Determinismo**: Tests predecibles sin dependencias externas
- **Velocidad**: Tests rápidos sin llamadas de red reales
- **Aislamiento**: Cada test independiente de servicios externos

### 2. Datos de Prueba Realistas
Los mocks replican exactamente la estructura de la API real:

**Ventajas:**
- **Confianza**: Tests cercanos al comportamiento real
- **Cobertura**: Testea el manejo real de datos de la API
- **Debugging**: Errores de estructura de datos detectados en testing
- **Documentación**: Los mocks sirven como documentación de la API

### 3. Organización por Grupos Funcionales
Los tests se agrupan por funcionalidad (Estados de Carga, Manejo de Errores, etc.):

**Beneficios:**
- **Claridad**: Fácil encontrar tests relacionados con funcionalidad específica
- **Mantenimiento**: Cambios en funcionalidad requieren actualizar grupo específico
- **Cobertura**: Asegura que todos los aspectos están cubiertos
- **Reporting**: Fallos agrupados por funcionalidad facilitan debugging

### 4. waitFor para Operaciones Asíncronas
Se utiliza waitFor() para todas las operaciones que involucran estado asíncrono:

```javascript
await waitFor(() => {
  expect(screen.getByTestId('character-card')).toBeInTheDocument();
});
```

**Razones:**
- **Sincronización**: Espera correcta a que componente actualice después de fetch
- **Estabilidad**: Evita race conditions en tests
- **Flexibilidad**: Permite timeouts personalizados si es necesario
- **Realismo**: Simula cómo usuarios esperan carga de contenido

### 5. Testing de Interacciones
Se testean clicks de botones y cambios de props:

**Importancia:**
- **Funcionalidad Completa**: Verifica que la UI responde a acciones del usuario
- **Integración**: Testea que handlers están correctamente conectados
- **UX**: Asegura que funcionalidades como "reintentar" realmente funcionan
- **Regresión**: Previene que cambios rompan interacciones existentes

### 6. Casos Edge Explícitos
Se incluyen tests para datos incompletos, estados null, etc.:

**Valor:**
- **Robustez**: Asegura que el componente maneja APIs imperfectas
- **Producción**: Scenarios que pueden ocurrir en producción
- **Confianza**: Mayor seguridad en despliegues
- **Debugging**: Identifica problemas potenciales antes de producción

### 7. Test de Integración Opcional
Se incluye un test marcado como skip para integración real:

**Propósito:**
- **Validación**: Permite verificar integración real cuando sea necesario
- **Debugging**: Útil para debugging de problemas de API
- **CI/CD**: No se ejecuta automáticamente para evitar dependencias externas
- **Documentación**: Muestra cómo hacer testing de integración cuando se necesite

## Principios de Testing Aplicados

### 1. Arrange-Act-Assert
Cada test sigue este patrón:
- **Arrange**: Configurar mocks y datos
- **Act**: Renderizar componente o simular interacción
- **Assert**: Verificar resultado esperado

### 2. Testing de Comportamiento, No Implementación
Los tests verifican qué hace el componente, no cómo lo hace:
- Se testea que se muestra información correcta
- No se testea state interno específico
- Se testea respuesta a interacciones, no métodos específicos

### 3. Tests Independientes
Cada test puede ejecutarse de forma independiente:
- beforeEach limpia mocks
- No hay dependencias entre tests
- Orden de ejecución no importa

### 4. Nombres Descriptivos
Los nombres de tests describen exactamente qué verifican:
- "muestra indicador verde para personaje vivo"
- "botón de reintentar funciona después de un error"
- Facilita understanding sin leer implementación

## Consideraciones de Rendimiento

### 1. Mocking Eficiente
Los mocks son objetos simples, no requieren procesamiento pesado.

### 2. Cleanup Apropiado
beforeEach() asegura que no hay memory leaks entre tests.

### 3. Tests Focalizados
Cada test verifica una funcionalidad específica, evitando tests pesados.

### 4. Timeouts Apropiados
waitFor() tiene timeouts sensatos para evitar tests lentos.

Esta arquitectura balanceacomplejidad, mantenibilidad, y confiabilidad, proporcionando una base sólida para un componente de producción.