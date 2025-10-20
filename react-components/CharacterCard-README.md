# Ejemplo: Componente CharacterCard de Rick and Morty

Este ejemplo muestra cómo crear un componente React que consume una API externa (Rick and Morty API) y cómo escribir pruebas completas para él.

## 📋 Características del Componente

- ✅ Consume la API de Rick and Morty
- ✅ Maneja estados de carga, error y éxito
- ✅ Muestra información completa del personaje
- ✅ Indicadores visuales de estado (vivo/muerto/desconocido)
- ✅ Botón de actualización/reintento
- ✅ Responsive design
- ✅ Accesibilidad

## 🚀 Uso del Componente

```jsx
import CharacterCard from './CharacterCard';

// Uso básico - mostrará al personaje con ID 1 (Rick Sanchez)
<CharacterCard />

// Especificar un personaje diferente
<CharacterCard characterId={2} />

// En una aplicación completa
function App() {
  return (
    <div className="App">
      <h1>Personajes de Rick and Morty</h1>
      <CharacterCard characterId={1} />
      <CharacterCard characterId={2} />
      <CharacterCard characterId={3} />
    </div>
  );
}
```

## 🧪 Ejecutar las Pruebas

```bash
# Ejecutar todas las pruebas del componente
npm test CharacterCard.test.jsx

# Ejecutar en modo watch
npm test CharacterCard.test.jsx -- --watch

# Generar reporte de cobertura
npm test CharacterCard.test.jsx -- --coverage
```

## 📊 Cobertura de Pruebas

Las pruebas cubren:

### ✅ Estados de Carga
- Estado inicial de carga
- Mensajes apropiados durante la carga

### ✅ Manejo de Datos Exitosos
- Renderizado correcto de información del personaje
- Mostrar imagen con atributos correctos
- Formateo apropiado de datos

### ✅ Indicadores de Estado Visual
- Color verde para personajes vivos
- Color rojo para personajes muertos
- Color gris para estado desconocido

### ✅ Manejo de Errores
- Errores de red
- Respuestas HTTP no exitosas
- Funcionalidad de reintento

### ✅ Funcionalidad de Actualización
- Botón de actualizar recarga datos
- Reintento después de errores

### ✅ Llamadas a la API
- URLs correctas
- Parámetros apropiados
- Cambios de props

### ✅ Casos Edge
- Datos incompletos
- Respuestas nulas
- Estados vacíos

### ✅ Accesibilidad
- Roles y labels apropiados
- Elementos interactivos accesibles

## 🎯 Conceptos de Testing Demostrados

### 1. **Mocking de APIs**
```javascript
global.fetch = jest.fn();

fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => mockData,
});
```

### 2. **Testing de Estados Asíncronos**
```javascript
await waitFor(() => {
  expect(screen.getByTestId('character-card')).toBeInTheDocument();
});
```

### 3. **Testing de Interacciones**
```javascript
const refreshButton = screen.getByTestId('refresh-button');
fireEvent.click(refreshButton);
```

### 4. **Testing de Props Dinámicas**
```javascript
const { rerender } = render(<CharacterCard characterId={1} />);
rerender(<CharacterCard characterId={2} />);
```

### 5. **Testing de Estilos Condicionables**
```javascript
expect(statusIndicator).toHaveStyle('background-color: #55cc44');
```

## 🛠️ Herramientas Utilizadas

- **React Testing Library**: Para renderizado y queries
- **Jest**: Framework de testing
- **@testing-library/jest-dom**: Matchers adicionales
- **fetch mock**: Para simular llamadas HTTP

## 📝 Mejores Prácticas Implementadas

1. **Separación de Responsabilidades**: Lógica separada de presentación
2. **Data Test IDs**: Para queries confiables en pruebas
3. **Estados de Carga**: UX mejorada durante operaciones asíncronas
4. **Manejo de Errores**: Recuperación elegante de fallos
5. **Accesibilidad**: Atributos alt, roles apropiados
6. **Testing Exhaustivo**: Cobertura de todos los escenarios

## 🔄 Flujo de Estados

```
Inicial → Cargando → Éxito/Error
    ↑         ↓         ↓
    └── Actualizar ←────┘
```

## 📱 API de Rick and Morty

- **Endpoint**: `https://rickandmortyapi.com/api/character/{id}`
- **Sin autenticación requerida**
- **Respuesta en JSON**
- **Documentación**: https://rickandmortyapi.com/documentation

## 🎨 Personalización

El componente es fácilmente personalizable:

- **Estilos**: Modifica `CharacterCard.css`
- **Campos**: Agrega/quita información mostrada
- **Estados**: Personaliza mensajes de carga/error
- **API**: Cambiar a otra API similar

Este ejemplo demuestra un enfoque completo para el testing de componentes React que consumen APIs externas, cubriendo desde casos básicos hasta escenarios edge complejos.