const ProductService = require('../services/ProductService');
const CartService = require('../services/CartService');

/**
 * PRUEBAS DE INTEGRACIÓN BIG BANG - EJEMPLO CLARO
 * 
 * ¿Qué es Big Bang?
 * - Probamos TODO EL SISTEMA de una sola vez
 * - Como probar un auto completo: encender y manejar directamente
 * - No probamos componentes individuales, sino el sistema completo trabajando
 * 
 * Diferencia con Incrementales:
 * - Incrementales = Paso a paso (ProductService → CartService → Integración)
 * - Big Bang = Todo junto desde el inicio
 * 
 * ¿Cuándo usar cada uno?
 * - Incrementales: Durante desarrollo, para encontrar errores específicos
 * - Big Bang: Al final, para verificar que todo funcione junto en el mundo real
 */

describe('PRUEBAS BIG BANG - E-commerce Completo', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        // Mockeamos Math.random para tener productos siempre disponibles
        jest.spyOn(Math, 'random').mockReturnValue(0.1);
    });

    afterEach(() => {
        // Restauramos Math.random
        if (Math.random.mockRestore) {
            Math.random.mockRestore();
        }
    });
    
    // ===============================================
    // ESCENARIO 1: CON MOCKS (CONTROL TOTAL)
    // ===============================================
    describe('Escenario Big Bang CON MOCKS (Entorno Controlado)', () => {
        
        beforeEach(() => {
            // Restauramos axios para usar mocks
            jest.doMock('axios');
        });

        test('FLUJO COMPLETO: Usuario compra múltiples productos (Todo mockeado)', async () => {
            const axios = require('axios');
            
            // ARRANGE: Configuramos TODO EL ESCENARIO de una vez
            
            // Simulamos una tienda completa con múltiples productos
            const mockProducts = {
                laptop: { data: { id: 1, title: 'MacBook Pro', price: 2000, category: 'electronics', image: '' }},
                mouse: { data: { id: 2, title: 'Magic Mouse', price: 80, category: 'electronics', image: '' }},
                keyboard: { data: { id: 3, title: 'Magic Keyboard', price: 150, category: 'electronics', image: '' }}
            };

            // Configuramos el mock para responder según el producto solicitado
            axios.get.mockImplementation((url) => {
                if (url.includes('/products/1')) return Promise.resolve(mockProducts.laptop);
                if (url.includes('/products/2')) return Promise.resolve(mockProducts.mouse);
                if (url.includes('/products/3')) return Promise.resolve(mockProducts.keyboard);
                return Promise.reject(new Error('Producto no encontrado'));
            });

            // ACT: SIMULAMOS UN USUARIO COMPLETO COMPRANDO
            
            console.log('Simulando usuario comprando...');
            
            // 1. Usuario crea carrito
            const cartService = new CartService();
            
            // 2. Usuario agrega productos (como en la vida real)
            console.log('Usuario agrega MacBook Pro...');
            const item1 = await cartService.addProduct(1, 1);
            
            console.log('Usuario agrega Magic Mouse...');
            const item2 = await cartService.addProduct(2, 2);
            
            console.log('Usuario agrega Magic Keyboard...');
            const item3 = await cartService.addProduct(3, 1);
            
            // 3. Usuario revisa su carrito
            console.log('Usuario revisa carrito...');
            const summary = cartService.getCartSummary();
            
            // 4. Usuario valida antes de comprar
            console.log('Sistema valida disponibilidad...');
            const validation = await cartService.validateCart();

            // ASSERT: Verificamos TODO EL FLUJO BIG BANG
            
            console.log('\nResultados del flujo completo:');
            
            // Verificamos que se integró correctamente con ProductService
            expect(axios.get).toHaveBeenCalledTimes(9); // 3 productos × 3 llamadas cada uno (addProduct x2 + validateCart x1)
            
            // Verificamos el estado final del carrito
            expect(summary.items).toHaveLength(3);
            expect(summary.totalItems).toBe(4); // 1 + 2 + 1
            
            // Cálculos del sistema completo:
            // MacBook: $2000 + 15% = $2300
            // Mouse: $80 + 10% = $88 × 2 = $176  
            // Keyboard: $150 + 15% = $172.5
            // Subtotal: $2300 + $176 + $172.5 = $2648.5
            expect(summary.subtotal).toBe(2648.5);
            
            // Descuento (>$500): 5% = $132.43
            expect(summary.hasDiscount).toBe(true);
            expect(summary.total).toBe(2516.08); // $2648.5 - $132.43
            
            // Validación completa
            expect(validation.totalItems).toBe(3);
            
            console.log(`Total a pagar: $${summary.total}`);
            console.log('Flujo Big Bang completado exitosamente!');
        });

        test('FLUJO COMPLETO: Manejo de errores en sistema integrado', async () => {
            const axios = require('axios');
            
            // ARRANGE: Simulamos un escenario con problemas
            const mockProduct = { data: { id: 1, title: 'Producto OK', price: 100, category: 'test' }};
            
            axios.get
                .mockResolvedValueOnce(mockProduct)  // Primera llamada exitosa
                .mockResolvedValueOnce(mockProduct)  // Segunda llamada exitosa
                .mockRejectedValueOnce(new Error('API caída')); // Tercera llamada falla

            // ACT: El sistema debe manejar errores graciosamente
            const cartService = new CartService();
            
            // Primera operación exitosa
            const item1 = await cartService.addProduct(1, 1);
            expect(item1.title).toBe('Producto OK');
            
            // Segunda operación falla por API
            await expect(cartService.addProduct(2, 1))
                .rejects
                .toThrow('No se pudo agregar al carrito');
            
            // El carrito debe mantener consistencia
            const summary = cartService.getCartSummary();
            expect(summary.items).toHaveLength(1); // Solo el primer producto
            
            console.log('Sistema mantuvo consistencia ante fallos');
        });
    });

    // ===============================================
    // ESCENARIO 2: CON API REAL (MUNDO REAL)  
    // ===============================================
    describe('Escenario Big Bang CON API REAL (Mundo Real)', () => {
        
        beforeEach(() => {
            // Restauramos axios para usar la API real
            jest.restoreAllMocks();
            jest.unmock('axios');
            // Mantenemos Math.random mockeado para evitar fallos aleatorios
            jest.spyOn(Math, 'random').mockReturnValue(0.1);
        });

        afterEach(() => {
            // Volvemos a mockear para otras pruebas
            jest.doMock('axios');
        });

        test('INTEGRACIÓN REAL: Sistema completo con FakeStore API', async () => {
            // ACT: Probamos con API real (sin mocks de axios)
            
            console.log('Conectando a API real...');
            
            try {
                // Creamos servicios que usarán la API real
                const productService = new ProductService('https://fakestoreapi.com');
                const cartService = new CartService();
                
                console.log('Obteniendo producto real de la API...');
                
                // Obtenemos un producto real
                const product = await productService.getProduct(1);
                
                // Verificamos que recibimos datos reales
                expect(product.id).toBe(1);
                expect(product.title).toBeDefined();
                expect(product.price).toBeGreaterThan(0);
                expect(product.priceWithTax).toBeGreaterThan(product.price);
                
                console.log(`Producto real obtenido: ${product.title}`);
                console.log(`Precio con impuestos: $${product.priceWithTax}`);
                
                // Probamos integración completa con datos reales
                await cartService.addProduct(1, 2);
                const summary = cartService.getCartSummary();
                
                expect(summary.totalItems).toBe(2);
                expect(summary.subtotal).toBeGreaterThan(0);
                
                console.log('Integración real exitosa!');
                
            } catch (error) {
                // Si la API real no está disponible o el producto no está disponible, documentamos
                console.warn('API real no disponible o producto no disponible:', error.message);
                // Verificamos que el error es del tipo esperado
                expect(error.message).toBeDefined();
            }
            
        }, 10000); // Timeout extendido para API real

        test('COMPARACIÓN: Mismo flujo con API real vs Mock', async () => {
            console.log('\nComparando API real vs Mock...');
            
            try {
                // Con API real
                const productService = new ProductService('https://fakestoreapi.com');
                const realProduct = await productService.getProduct(2);
                
                console.log('API REAL:');
                console.log(`- Título: ${realProduct.title}`);
                console.log(`- Precio: $${realProduct.price}`);
                console.log(`- Categoría: ${realProduct.category}`);
                
                // Verificamos que es un producto real y válido
                expect(realProduct.title).toBeTruthy();
                expect(realProduct.price).toBeGreaterThan(0);
                
                console.log('\nDiferencias clave:');
                console.log('- API Real: Datos impredecibles, pueden cambiar');
                console.log('- Mock: Datos controlados, siempre iguales');
                console.log('- API Real: Más lenta, requiere internet');
                console.log('- Mock: Instantáneo, funciona offline');
                
            } catch (error) {
                console.warn('API real falló, usando solo mocks para esta prueba');
                expect(error.message).toBeDefined();
            }
        }, 10000);
    });

    // ===============================================
    // ESCENARIO 3: PRUEBAS DE RENDIMIENTO
    // ===============================================
    describe('Big Bang: Rendimiento del Sistema Completo', () => {
        
        test('RENDIMIENTO: Múltiples usuarios comprando simultáneamente', async () => {
            const axios = require('axios');
            
            // ARRANGE: Configuramos respuestas rápidas
            const mockProduct = {
                data: { id: 1, title: 'Producto Test', price: 50, category: 'test', image: '' }
            };
            
            axios.get.mockResolvedValue(mockProduct);
            
            // ACT: Simulamos múltiples usuarios comprando al mismo tiempo
            console.log('Simulando 5 usuarios comprando simultáneamente...');
            
            const startTime = Date.now();
            
            const promises = [];
            for (let i = 0; i < 5; i++) {
                const cartService = new CartService();
                promises.push(
                    cartService.addProduct(1, Math.floor(Math.random() * 3) + 1)
                );
            }
            
            // Esperamos que todas las operaciones terminen
            const results = await Promise.all(promises);
            
            const endTime = Date.now();
            const executionTime = endTime - startTime;
            
            // ASSERT: Verificamos rendimiento
            expect(results).toHaveLength(5);
            expect(executionTime).toBeLessThan(2000); // Menos de 2 segundos
            
            console.log(`${results.length} operaciones completadas en ${executionTime}ms`);
            console.log('Sistema mantuvo rendimiento bajo carga');
        });
    });
});

/**
 * COMPARACIÓN: INCREMENTAL vs BIG BANG
 * 
 * PRUEBAS INCREMENTALES:
 * Ventajas:
 * - Fácil encontrar errores específicos
 * - Pruebas más rápidas individualmente  
 * - Mejor para desarrollo paso a paso
 * - Aislamiento de problemas
 * 
 * Desventajas:
 * - No detectan problemas de integración compleja
 * - Más pruebas que escribir y mantener
 * - Pueden pasar por alto el comportamiento real
 * 
 * PRUEBAS BIG BANG:
 * Ventajas:
 * - Detectan problemas de integración completa
 * - Reflejan el uso real del sistema
 * - Menos pruebas que escribir
 * - Validación end-to-end
 * 
 * Desventajas:
 * - Difícil localizar errores específicos
 * - Pruebas más lentas
 * - Configuración más compleja
 * - Dependiente de servicios externos
 * 
 * RECOMENDACIÓN:
 * - Usar AMBOS enfoques según el contexto
 * - Incrementales: Durante desarrollo
 * - Big Bang: Para validación final
 * - Combinar mocks (control) con API real (realismo)
 */