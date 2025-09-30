// Configuración global para Jest
// Este archivo se ejecuta antes de cada archivo de prueba

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