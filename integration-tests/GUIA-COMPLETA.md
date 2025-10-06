# Guía Completa de Pruebas de Integración con Ejemplos Claros

## 🎯 ¿Qué son las Pruebas de Integración?

Las pruebas de integración verifican que **diferentes módulos o componentes trabajen correctamente juntos**. A diferencia de las pruebas unitarias que prueban una función aislada, las pruebas de integración prueban la **comunicación entre componentes**.

### Ejemplo Visual:
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Backend API   │────│   Base de Datos │
│   (Usuario)     │    │   (Servidor)    │    │   (Storage)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────── INTEGRACIÓN ───────────────────────────┘
```

## 🔍 Tipos de Pruebas de Integración

### 1. **Pruebas Incrementales** - Paso a Paso
Como construir una casa: primero los cimientos, luego las paredes, después el techo.

### 2. **Pruebas Big Bang** - Todo Junto
Como probar un auto completo: encender el motor y manejar directamente.

## 🛠️ ¿Qué son los Mocks y por qué los usamos?

### Mock = "Simulador" o "Imitador"

Un mock es como un **actor doble** en una película. En lugar del actor real, usamos un doble que hace exactamente lo que necesitamos para la escena.

### ¿Por qué usar Mocks?

1. **Control Total**: Sabemos exactamente qué respuesta obtendremos
2. **Velocidad**: No dependemos de servicios externos lentos
3. **Confiabilidad**: Las pruebas no fallan por problemas de red
4. **Aislamiento**: Probamos SOLO la integración, no la API externa

### Ejemplo Cotidiano:
```
Sin Mock (Problemático):
- Tu prueba llama a la API real de Facebook
- Facebook está caído → Tu prueba falla
- ¿El error está en TU código o en Facebook? 🤔

Con Mock (Controlado):
- Tu prueba usa un "Facebook simulado"
- Siempre responde lo que necesitas
- Si falla, sabes que el error está en TU código ✅
```

## 📚 Ejemplos Prácticos Paso a Paso

Vamos a crear un sistema de **E-commerce** para entender mejor las pruebas de integración.

### Componentes del Sistema:
1. **ProductService** - Gestiona productos
2. **CartService** - Gestiona carrito de compras  
3. **OrderService** - Procesa pedidos
4. **EcommerceSystem** - Sistema principal que integra todo

## 🔄 ¿Por qué volvemos a llamar la API en las pruebas?

### Escenario 1: Con Mocks (API Simulada)
```javascript
// Lo que hacemos:
mock.get('/products/1').returns({ id: 1, name: 'Laptop', price: 1000 })

// Por qué:
- Controlamos exactamente qué datos recibimos
- La prueba es rápida y confiable
- Probamos cómo maneja nuestro código una respuesta específica
```

### Escenario 2: Con API Real
```javascript
// Lo que hacemos:
const realProduct = await fetch('https://api-real.com/products/1')

// Por qué:
- Verificamos que la integración real funciona
- Detectamos cambios en la API externa
- Validamos el comportamiento end-to-end
```

### Analogía: Ensayo vs Función Real
- **Mocks = Ensayo**: Practicamos con actores dobles, escenario controlado
- **API Real = Función**: Actuación con actores reales, pueden surgir imprevistos

## 🎭 Stubs vs Drivers vs Mocks

### Stub (Simulador de Dependencia Inferior)
```
┌─────────────┐
│ TU CÓDIGO   │
└──────┬──────┘
       │ llama a
       ▼
┌─────────────┐
│ STUB        │ ← Simula: Base de Datos, API Externa
│ (Simulado)  │
└─────────────┘
```

### Driver (Simulador de Dependencia Superior)
```
┌─────────────┐
│ DRIVER      │ ← Simula: Usuario, Interfaz Web, Controlador
│ (Simulado)  │
└──────┬──────┘
       │ llama a
       ▼
┌─────────────┐
│ TU CÓDIGO   │
└─────────────┘
```

### Mock (Simulador con Verificaciones)
```
┌─────────────┐
│ TU CÓDIGO   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ MOCK        │ ← Simula Y verifica: ¿Se llamó? ¿Con qué parámetros?
│ (Inteligente│
└─────────────┘
```