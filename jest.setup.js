// Configuración global para Jest
// Este archivo se ejecuta antes de cada archivo de prueba

// Importar jest-dom para matchers adicionales de React Testing Library
require('@testing-library/jest-dom');

// Configurar timeout por defecto para todas las pruebas
jest.setTimeout(15000);

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
    jest.clearAllMocks();
});

// Configuración global para console.log en pruebas
const originalConsoleLog = console.log;
console.log = (...args) => {
    // Solo mostrar logs en modo verbose o si hay errores
    if (process.env.NODE_ENV === 'test' && !process.argv.includes('--verbose')) {
        return;
    }
    originalConsoleLog(...args);
};

// Configuración específica para React Testing Library
// Mock de window.matchMedia para componentes que usen media queries
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock de IntersectionObserver si es necesario
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
};