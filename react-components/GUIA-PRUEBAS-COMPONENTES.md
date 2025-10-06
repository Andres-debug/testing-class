# Guía Completa: Pruebas de Componentes React

## 📋 Índice
1. [Introducción](#introducción)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Herramientas Principales](#herramientas-principales)
4. [Conceptos Fundamentales](#conceptos-fundamentales)
5. [Tipos de Pruebas](#tipos-de-pruebas)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Ejemplos Prácticos](#ejemplos-prácticos)
8. [Patrones Comunes](#patrones-comunes)
9. [Solución de Problemas](#solución-de-problemas)
10. [Recursos Adicionales](#recursos-adicionales)

---

## 🎯 Introducción

Las **pruebas de componentes React** son fundamentales para garantizar que la interfaz de usuario funcione correctamente. A diferencia de las pruebas unitarias tradicionales, estas pruebas verifican cómo los componentes se renderizan, responden a interacciones del usuario y manejan cambios de estado.

### ¿Por qué son importantes?

- **Confianza**: Garantizan que los componentes funcionan como se espera
- **Regresiones**: Detectan cambios no deseados en el comportamiento
- **Documentación**: Sirven como documentación viva del comportamiento esperado
- **Refactoring**: Permiten cambios internos sin romper la funcionalidad

---

## ⚙️ Configuración del Entorno

### Dependencias Necesarias

```bash
# Dependencias principales
npm install --save react react-dom

# Dependencias de desarrollo para testing
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Dependencias para transformación de JSX
npm install --save-dev @babel/preset-env @babel/preset-react

# Para manejar imports de CSS en pruebas
npm install --save-dev identity-obj-proxy
```

### Configuración de Jest (package.json)

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "moduleNameMapping": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    "testMatch": [
      "**/*.test.js",
      "**/*.test.jsx"
    ]
  }
}
```

### Configuración de Babel (.babelrc)

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

### Setup de Jest (jest.setup.js)

```javascript
// Importar matchers adicionales
require('@testing-library/jest-dom');

// Configuración global
jest.setTimeout(15000);

afterEach(() => {
    jest.clearAllMocks();
});

// Mocks necesarios para el entorno de pruebas
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
```

---

## 🛠️ Herramientas Principales

### 1. React Testing Library

Es la librería principal para probar componentes React de manera que imita cómo los usuarios realmente interactúan con la aplicación.

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
```

**Filosofía**: "Mientras más se parezcan tus pruebas a cómo se usa tu software, más confianza te pueden dar."

### 2. Jest

El framework de pruebas que proporciona:
- Runner de pruebas
- Assertions (expect)
- Mocks y spies
- Coverage reports

### 3. User Event

Simula interacciones reales del usuario de manera más precisa que `fireEvent`.

```javascript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(button);
await user.type(input, 'texto');
```

---

## 📚 Conceptos Fundamentales

### 1. Renderizado de Componentes

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renderiza correctamente', () => {
    render(<MyComponent prop="valor" />);
    
    // El componente está ahora en el DOM virtual
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
});
```

### 2. Queries (Búsquedas)

Las queries son métodos para encontrar elementos en el DOM. Se dividen en tres tipos:

#### getBy* - Elementos que DEBEN existir
```javascript
screen.getByRole('button')           // Por rol ARIA
screen.getByText('Click me')         // Por texto visible
screen.getByLabelText('Username')    // Por label asociado
screen.getByPlaceholderText('Email') // Por placeholder
screen.getByTestId('submit-btn')     // Por data-testid (último recurso)
```

#### queryBy* - Elementos que PUEDEN NO existir
```javascript
screen.queryByText('Optional text')  // Devuelve null si no existe
expect(screen.queryByText('Error')).not.toBeInTheDocument();
```

#### findBy* - Elementos que aparecerán ASINCRÓNAMENTE
```javascript
const asyncElement = await screen.findByText('Loaded content');
```

### 3. Eventos y Interacciones

#### FireEvent - Eventos básicos del DOM
```javascript
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'nuevo valor' } });
fireEvent.submit(form);
```

#### User Event - Interacciones realistas
```javascript
const user = userEvent.setup();

await user.click(button);
await user.type(input, 'texto a escribir');
await user.selectOptions(select, 'opcion1');
await user.upload(fileInput, file);
```

### 4. Assertions (Verificaciones)

```javascript
// Existencia en el DOM
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Texto y contenido
expect(element).toHaveTextContent('texto esperado');
expect(element).toContainHTML('<span>contenido</span>');

// Atributos y propiedades
expect(element).toHaveAttribute('data-testid', 'my-element');
expect(element).toHaveClass('active', 'highlighted');
expect(input).toHaveValue('valor actual');

// Estados
expect(button).toBeDisabled();
expect(checkbox).toBeChecked();
expect(element).toHaveFocus();

// Visibilidad
expect(element).toBeVisible();
expect(element).not.toBeVisible();
```

---

## 🎭 Tipos de Pruebas

### 1. Pruebas de Renderizado

Verifican que el componente se renderiza correctamente con diferentes props.

```javascript
test('renderiza con props básicas', () => {
    render(<Button variant="primary">Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('btn-primary');
});
```

### 2. Pruebas de Interacción

Verifican que el componente responde correctamente a las acciones del usuario.

```javascript
test('llama onClick cuando se hace click', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 3. Pruebas de Estado

Verifican que los cambios de estado se reflejan correctamente en la UI.

```javascript
test('actualiza el contador al hacer click', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: /increment/i });
    const counter = screen.getByText('0');
    
    await user.click(button);
    
    expect(screen.getByText('1')).toBeInTheDocument();
});
```

### 4. Pruebas de Formularios

Verifican validaciones, envío y manejo de datos.

```javascript
test('valida campos requeridos', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
});
```

### 5. Pruebas de Accesibilidad

Verifican que el componente es accesible para usuarios con discapacidades.

```javascript
test('es navegable por teclado', async () => {
    const user = userEvent.setup();
    render(<Modal isOpen={true} />);
    
    await user.tab();
    expect(screen.getByRole('button', { name: /close/i })).toHaveFocus();
    
    await user.keyboard('{Escape}');
    expect(mockOnClose).toHaveBeenCalled();
});
```

---

## 🏆 Mejores Prácticas

### 1. Prioridad de Queries

**Orden recomendado de queries:**

1. `getByRole()` - Más accesible y semántico
2. `getByLabelText()` - Para elementos de formulario
3. `getByText()` - Para contenido visible
4. `getByDisplayValue()` - Para inputs con valores
5. `getByAltText()` - Para imágenes
6. `getByTitle()` - Para tooltips
7. `getByTestId()` - **Último recurso**

```javascript
// ✅ Bueno - Accesible y semántico
screen.getByRole('button', { name: /submit/i })

// ❌ Malo - Depende de implementación
screen.getByTestId('submit-button')
```

### 2. Usar User Event en lugar de FireEvent

```javascript
// ✅ Bueno - Simula comportamiento real del usuario
const user = userEvent.setup();
await user.click(button);

// ❌ Aceptable pero menos realista
fireEvent.click(button);
```

### 3. Probar Comportamiento, No Implementación

```javascript
// ✅ Bueno - Prueba el comportamiento visible
test('muestra mensaje de error cuando el email es inválido', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});

// ❌ Malo - Prueba detalles de implementación
test('actualiza el estado de error', () => {
    const wrapper = shallow(<LoginForm />);
    wrapper.instance().setState({ emailError: 'Invalid email' });
    expect(wrapper.state().emailError).toBe('Invalid email');
});
```

### 4. Usar Mocks Apropiadamente

```javascript
// ✅ Bueno - Mock de dependencias externas
const mockApiCall = jest.fn().mockResolvedValue({ data: 'success' });
jest.mock('./api', () => ({
    submitForm: mockApiCall
}));

// ✅ Bueno - Mock de props/callbacks
const mockOnSubmit = jest.fn();
render(<Form onSubmit={mockOnSubmit} />);
```

### 5. Organizar Pruebas con describe()

```javascript
describe('ContactForm', () => {
    describe('Renderizado', () => {
        test('muestra todos los campos requeridos', () => {
            // ...
        });
    });
    
    describe('Validación', () => {
        test('valida formato de email', () => {
            // ...
        });
    });
    
    describe('Envío', () => {
        test('llama onSubmit con datos válidos', () => {
            // ...
        });
    });
});
```

---

## 💼 Ejemplos Prácticos

### Ejemplo 1: Componente Button Simple

```javascript
// Button.jsx
const Button = ({ children, onClick, disabled = false, variant = 'primary' }) => {
    return (
        <button
            className={`btn btn-${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// Button.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
    test('renderiza con texto y variante correcta', () => {
        render(<Button variant="secondary">Save</Button>);
        
        const button = screen.getByRole('button', { name: /save/i });
        expect(button).toHaveClass('btn', 'btn-secondary');
    });
    
    test('llama onClick cuando se hace click', async () => {
        const user = userEvent.setup();
        const mockClick = jest.fn();
        
        render(<Button onClick={mockClick}>Click me</Button>);
        
        await user.click(screen.getByRole('button'));
        
        expect(mockClick).toHaveBeenCalledTimes(1);
    });
    
    test('no permite click cuando está deshabilitado', async () => {
        const user = userEvent.setup();
        const mockClick = jest.fn();
        
        render(<Button onClick={mockClick} disabled>Disabled</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        
        await user.click(button);
        expect(mockClick).not.toHaveBeenCalled();
    });
});
```

### Ejemplo 2: Formulario con Validación

```javascript
// LoginForm.jsx
const LoginForm = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsLoading(true);
        try {
            await onSubmit({ email, password });
        } catch (error) {
            setErrors({ submit: 'Login failed' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span role="alert">{errors.email}</span>}
            </div>
            
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <span role="alert">{errors.password}</span>}
            </div>
            
            {errors.submit && <div role="alert">{errors.submit}</div>}
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

// LoginForm.test.jsx
describe('LoginForm', () => {
    test('valida campos requeridos', async () => {
        const user = userEvent.setup();
        render(<LoginForm />);
        
        await user.click(screen.getByRole('button', { name: /login/i }));
        
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    test('envía formulario con datos válidos', async () => {
        const user = userEvent.setup();
        const mockSubmit = jest.fn().mockResolvedValue();
        
        render(<LoginForm onSubmit={mockSubmit} />);
        
        await user.type(screen.getByLabelText(/email/i), 'user@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /login/i }));
        
        expect(mockSubmit).toHaveBeenCalledWith({
            email: 'user@example.com',
            password: 'password123'
        });
    });
    
    test('muestra estado de carga durante envío', async () => {
        const user = userEvent.setup();
        const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
        
        render(<LoginForm onSubmit={mockSubmit} />);
        
        await user.type(screen.getByLabelText(/email/i), 'user@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /login/i }));
        
        expect(screen.getByText(/logging in/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
```

---

## 🔧 Patrones Comunes

### 1. Setup Común con beforeEach

```javascript
describe('MyComponent', () => {
    let mockProps;
    
    beforeEach(() => {
        mockProps = {
            onSubmit: jest.fn(),
            initialValue: 'test'
        };
    });
    
    test('example test', () => {
        render(<MyComponent {...mockProps} />);
        // ...
    });
});
```

### 2. Custom Render con Providers

```javascript
// test-utils.js
const CustomRender = ({ children }) => {
    return (
        <ThemeProvider theme={testTheme}>
            <Router>
                {children}
            </Router>
        </ThemeProvider>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: CustomRender, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### 3. Probar Hooks Personalizados

```javascript
import { renderHook, act } from '@testing-library/react';

test('useCounter hook', () => {
    const { result } = renderHook(() => useCounter(0));
    
    expect(result.current.count).toBe(0);
    
    act(() => {
        result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
});
```

### 4. Mocking de Módulos

```javascript
// Mock de una librería externa
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de un módulo local
jest.mock('./utils', () => ({
    formatDate: jest.fn(() => '2023-01-01'),
    validateEmail: jest.fn(() => true)
}));
```

### 5. Pruebas de Componentes Asíncronos

```javascript
test('carga datos y los muestra', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }];
    jest.spyOn(api, 'fetchItems').mockResolvedValue(mockData);
    
    render(<ItemList />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

---

## 🐛 Solución de Problemas

### Problema 1: "Cannot use import statement outside a module"

**Solución**: Configurar Babel correctamente

```json
// .babelrc
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

### Problema 2: "TestingLibraryElementError: Unable to find an element"

**Solución**: 
- Verificar que el elemento exista con `screen.debug()`
- Usar queries más específicas
- Verificar timing con `waitFor()`

```javascript
// Debug del DOM actual
screen.debug();

// Esperar elemento asíncrono
await waitFor(() => {
    expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

### Problema 3: "Warning: An update to Component was not wrapped in act(...)"

**Solución**: Usar `act()` para actualizaciones de estado

```javascript
import { act } from '@testing-library/react';

test('example', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
        await user.click(button);
    });
});
```

### Problema 4: Pruebas que fallan intermitentemente

**Solución**:
- Usar `waitFor()` para operaciones asíncronas
- Evitar timeouts fijos
- Limpiar mocks entre pruebas

```javascript
afterEach(() => {
    jest.clearAllMocks();
    cleanup();
});
```

---

## 📖 Recursos Adicionales

### Documentación Oficial
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)

### Herramientas Útiles
- [Testing Playground](https://testing-playground.com/) - Para encontrar las queries correctas
- [Jest Preview](https://www.jest-preview.com/) - Para ver el DOM durante las pruebas
- [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)

### Scripts Útiles para package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:react": "jest react-components",
    "test:react:watch": "jest react-components --watch",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

---

## 🎯 Conclusión

Las pruebas de componentes React son esenciales para construir aplicaciones robustas y mantenibles. Al seguir las mejores prácticas y patrones mostrados en esta guía, podrás:

- **Escribir pruebas confiables** que realmente validen el comportamiento del usuario
- **Detectar bugs temprano** antes de que lleguen a producción  
- **Refactorizar con confianza** sabiendo que las pruebas capturarán regresiones
- **Documentar el comportamiento esperado** de manera ejecutable

Recuerda: **"Mientras más se parezcan tus pruebas a cómo se usa tu software, más confianza te pueden dar."**

---
