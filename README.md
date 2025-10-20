# Testing Class - Repositorio de Ejemplos de Testing

## 📋 Descripción

Este repositorio contiene ejemplos completos y didácticos de diferentes tipos de testing en desarrollo de software. Está diseñado como material educativo para aprender testing unitario, de integración y de componentes en múltiples tecnologías.

## 🏗️ Estructura del Proyecto

```
testing-class/
├── 📁 integration-tests/          # Pruebas de integración en JavaScript/Node.js
├── 📁 java-testing/              # Pruebas unitarias e integración en Java
├── 📁 react-components/          # Testing de componentes React
├── 📁 unit-test/                 # Ejemplos básicos de testing unitario en JavaScript
├── 📄 jest.setup.js              # Configuración global de Jest
├── 📄 package.json               # Dependencias y scripts de Node.js
└── 📄 README.md                  # Este archivo
```

## 🎯 Objetivos de Aprendizaje

- **Testing Unitario**: Verificar funcionalidad de unidades individuales de código
- **Testing de Integración**: Probar interacciones entre componentes
- **Testing de Componentes**: Validar comportamiento de componentes UI
- **Mocking y Stubbing**: Simular dependencias externas
- **TDD/BDD**: Metodologías de desarrollo dirigido por pruebas
- **Cobertura de Código**: Medir y mejorar la cobertura de tests

## 📚 Contenido por Carpeta

### 🟡 `unit-test/` - Ejemplos Básicos de Testing Unitario

**Tecnologías**: JavaScript, Jest

**Contenido**:
- `Edad/`: Testing de cálculo de edad
- `Password/`: Validación de contraseñas
- `Precio/`: Cálculo de precios con descuentos

**Conceptos Cubiertos**:
- Estructura básica de tests con Jest
- Assertions fundamentales
- Testing de funciones puras
- Casos edge y validaciones

### 🔵 `integration-tests/` - Pruebas de Integración

**Tecnologías**: JavaScript, Node.js, Jest

**Contenido**:
- `services/`: Servicios de usuario y post
- `tests/`: Pruebas big bang e incrementales
- `stubs-drivers/`: Helpers y utilidades de testing
- `ejemplos-claros/`: Ejemplos didácticos con CartService y ProductService

**Conceptos Cubiertos**:
- Testing de APIs y servicios
- Mocking de dependencias externas
- Pruebas big bang vs incrementales
- Testing de bases de datos
- Stubs y drivers de prueba

### 🟠 `react-components/` - Testing de Componentes React

**Tecnologías**: React, Jest, React Testing Library

**Contenido**:
- `Button.jsx/.test.jsx`: Componente de botón con pruebas
- `CharacterCard.jsx/.test.jsx`: Componente que consume API de Rick and Morty
- `ContactForm.jsx/.test.jsx`: Formulario con validaciones
- Documentación completa de arquitectura y testing

**Conceptos Cubiertos**:
- Testing de componentes React
- Simulación de APIs externas
- Testing de interacciones de usuario
- Estados asíncronos y loading
- Accessibility testing
- Custom hooks testing

### 🟢 `java-testing/` - Testing Unitario e Integración en Java

**Tecnologías**: Java 11, Spring Boot, JUnit 5, Mockito, AssertJ

**Contenido**:
- `src/main/java/`: Clases principales (Usuario, UsuarioService, EmailService, Repository)
- `src/test/java/unit/`: Pruebas unitarias completas
- `src/test/java/integration/`: Pruebas de integración con Spring Boot
- `pom.xml`: Configuración completa de Maven con dependencias de testing

**Conceptos Cubiertos**:
- Testing unitario con JUnit 5 y Mockito
- Testing de integración con Spring Boot
- Testing de repositorios JPA
- Mocking de servicios externos
- Testing parametrizado
- AssertJ para assertions expresivas

## 🚀 Cómo Ejecutar las Pruebas

### JavaScript/Node.js (unit-test, integration-tests, react-components)

```bash
# Instalar dependencias
npm install

# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar en modo watch
npm run test:watch

# Ejecutar pruebas específicas
npm test -- --testPathPattern=unit-test
npm test -- --testPathPattern=integration-tests
npm test -- --testPathPattern=react-components
```

### Java (java-testing)

```bash
# Navegar al directorio de Java
cd java-testing

# Ejecutar solo pruebas unitarias
mvn test

# Ejecutar solo pruebas de integración
mvn verify

# Ejecutar con cobertura
mvn test jacoco:report

# Ver reporte de cobertura
# Abrir: target/site/jacoco/index.html
```

## 📖 Guías de Estudio

### Para Principiantes
1. Comenzar con `unit-test/` para conceptos básicos
2. Leer documentación en cada carpeta
3. Ejecutar pruebas y experimentar modificando código
4. Estudiar estructura de cada test (Arrange-Act-Assert)

### Para Nivel Intermedio
1. Explorar `integration-tests/` para conceptos avanzados
2. Estudiar técnicas de mocking y stubbing
3. Comparar enfoques big bang vs incrementales
4. Practicar con `react-components/` para UI testing

### Para Nivel Avanzado
1. Profundizar en `java-testing/` para enterprise patterns
2. Estudiar configuración de frameworks de testing
3. Implementar propios helpers y utilidades
4. Experimentar con diferentes estrategias de testing

## 🛠️ Tecnologías y Herramientas

### Testing Frameworks
- **Jest**: Framework principal para JavaScript
- **JUnit 5**: Framework moderno para Java
- **React Testing Library**: Testing de componentes React

### Mocking y Stubbing
- **Jest Mocks**: Mocks nativos de Jest
- **Mockito**: Framework de mocking para Java
- **WireMock**: Mock de servicios HTTP

### Assertions
- **Jest Matchers**: Assertions básicas y extendidas
- **AssertJ**: Assertions fluidas para Java
- **@testing-library/jest-dom**: Matchers específicos para DOM

### Cobertura
- **Jest Coverage**: Cobertura integrada con Jest
- **JaCoCo**: Cobertura de código para Java

## 📋 Requisitos Previos

### Para JavaScript/Node.js
- Node.js 16+ 
- npm 7+
- Conocimientos básicos de JavaScript ES6+

### Para React
- Conocimientos de React Hooks
- Comprensión de componentes funcionales
- Familiaridad con APIs y llamadas asíncronas

### Para Java
- Java 11+
- Maven 3.6+
- Conocimientos básicos de Spring Boot
- Comprensión de inyección de dependencias

## 🎓 Conceptos Clave Aprendidos

### Principios de Testing
- **Pirámide de Testing**: Unitarias > Integración > E2E
- **F.I.R.S.T**: Fast, Independent, Repeatable, Self-validating, Timely
- **AAA Pattern**: Arrange-Act-Assert
- **Given-When-Then**: BDD style testing

### Técnicas Avanzadas
- **Test Doubles**: Mocks, Stubs, Spies, Fakes
- **Parametrized Testing**: Múltiples casos con una definición
- **Testing Asíncrono**: Promises, async/await, timeouts
- **Edge Cases**: Valores null, límites, casos extremos

### Mejores Prácticas
- **Naming**: Nombres descriptivos para tests
- **Independence**: Tests independientes entre sí
- **Maintenance**: Código de test mantenible
- **Documentation**: Tests como documentación viva

## 🤝 Contribuciones

Este es un proyecto educativo. Las contribuciones son bienvenidas:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto es de uso educativo y está disponible bajo licencia MIT.

## 👨‍🏫 Uso Educativo

### Para Instructores
- Cada carpeta es independiente y puede usarse por separado
- Documentación completa incluida en cada sección
- Ejemplos progresivos de simple a complejo
- Configuración lista para usar

### Para Estudiantes
- Código completamente comentado
- Explicaciones de decisiones de diseño
- Múltiples enfoques para comparar
- Ejercicios prácticos incluidos

## 🔗 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [AssertJ Documentation](https://assertj.github.io/doc/)

---

**¿Encontraste algún error o tienes sugerencias?** 
Abre un issue o envía un pull request. ¡Todo feedback es bienvenido para mejorar este material educativo!

## 📊 Estado del Proyecto

![Tests Status](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-%3E90%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Educational](https://img.shields.io/badge/purpose-educational-orange)