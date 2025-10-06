const ProductService = require('../services/ProductService');
const CartService = require('../services/CartService');

// MOCK: Simulador de axios
jest.mock('axios');
const axios = require('axios');

/**
 * PRUEBAS DE INTEGRACIÓN INCREMENTALES - EJEMPLO CLARO
 * 
 * ¿Qué estamos probando?
 * - NIVEL 1: ProductService solo (con mock de API)
 * - NIVEL 2: CartService solo (con mock de ProductService)
 * - NIVEL 3: ProductService + CartService juntos (integración completa)
 * 
 * ¿Por qué usar mocks?
 * - Control: Sabemos exactamente qué datos recibiremos
 * - Velocidad: No dependemos de APIs externas lentas
 * - Confiabilidad: Las pruebas no fallan por problemas de red
 */

describe('PRUEBAS INCREMENTALES - E-commerce', () => {
    
    beforeEach(() => {
        // Limpiamos los mocks antes de cada prueba
        jest.clearAllMocks();
    });

    // ===============================================
    // NIVEL 1: PRODUCTSERVICE AISLADO CON MOCKS
    // ===============================================
    describe('NIVEL 1: ProductService con API simulada (Mock)', () => {
        let productService;

        beforeEach(() => {
            productService = new ProductService();
        });

        test('Debe obtener producto y calcular impuestos correctamente', async () => {
            // ARRANGE: Configuramos el MOCK de la API
            // Simulamos que la API externa nos devuelve estos datos específicos
            const mockApiResponse = {
                data: {
                    id: 1,
                    title: 'iPhone 15 Pro',
                    price: 999,
                    description: 'Smartphone de última generación',
                    category: 'electronics',
                    image: 'https://ejemplo.com/iphone.jpg'
                }
            };

            // Configuramos el mock: cuando axios.get sea llamado, devuelve mockApiResponse
            axios.get.mockResolvedValueOnce(mockApiResponse);

            // ACT: Ejecutamos el método que queremos probar
            const result = await productService.getProduct(1);

            // ASSERT: Verificamos que todo funcionó correctamente
            
            // 1. Verificamos que se llamó a la API con la URL correcta
            expect(axios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
            expect(axios.get).toHaveBeenCalledTimes(1); // Solo una llamada
            
            // 2. Verificamos que los datos básicos estén correctos
            expect(result.id).toBe(1);
            expect(result.title).toBe('iPhone 15 Pro');
            expect(result.price).toBe(999);
            
            // 3. Verificamos la LÓGICA DE NEGOCIO (esto es lo importante)
            expect(result.isExpensive).toBe(true); // $999 > $100
            expect(result.priceWithTax).toBe(1148.85); // $999 + 15% = $1148.85
        });

        test('Debe manejar productos baratos correctamente', async () => {
            // ARRANGE: Producto barato para probar lógica diferente
            const mockApiResponse = {
                data: {
                    id: 2,
                    title: 'Camiseta básica',
                    price: 25,
                    description: 'Camiseta de algodón',
                    category: 'clothing',
                    image: 'https://ejemplo.com/camiseta.jpg'
                }
            };

            axios.get.mockResolvedValueOnce(mockApiResponse);

            // ACT
            const result = await productService.getProduct(2);

            // ASSERT: Lógica diferente para productos baratos
            expect(result.isExpensive).toBe(false); // $25 <= $100
            expect(result.priceWithTax).toBe(27.5); // $25 + 10% = $27.5
        });

        test('Debe manejar errores de API correctamente', async () => {
            // ARRANGE: Simulamos que la API falla
            axios.get.mockRejectedValueOnce(new Error('Network timeout'));

            // ACT & ASSERT: Esperamos que lance un error
            await expect(productService.getProduct(999))
                .rejects
                .toThrow('No se pudo obtener el producto: Network timeout');
        });
    });

    // ===============================================
    // NIVEL 2: CARTSERVICE CON PRODUCTSERVICE MOCKEADO
    // ===============================================
    describe('NIVEL 2: CartService con ProductService simulado', () => {
        let cartService;

        beforeEach(() => {
            cartService = new CartService();
            // Mockeamos el método isProductAvailable para que siempre devuelva true
            jest.spyOn(cartService.productService, 'isProductAvailable').mockResolvedValue(true);
        });

        test('Debe agregar producto al carrito usando ProductService', async () => {
            // ARRANGE: Simulamos respuestas del ProductService
            
            // Primera llamada: getProduct()
            const mockProduct = {
                data: {
                    id: 1,
                    title: 'Laptop Gaming',
                    price: 1200,
                    description: 'Laptop para videojuegos',
                    category: 'electronics',
                    image: 'https://ejemplo.com/laptop.jpg'
                }
            };

            // Configuramos respuesta del mock para getProduct
            axios.get.mockResolvedValueOnce(mockProduct);

            // ACT: Agregamos producto al carrito
            const result = await cartService.addProduct(1, 2); // ID=1, cantidad=2

            // ASSERT: Verificamos la integración
            
            // 1. Se llamó a ProductService correctamente
            expect(axios.get).toHaveBeenCalledTimes(1); // Solo getProduct
            expect(axios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
            
            // 2. Se verificó disponibilidad
            expect(cartService.productService.isProductAvailable).toHaveBeenCalledWith(1);
            
            // 3. El carrito procesó correctamente los datos
            expect(result.productId).toBe(1);
            expect(result.title).toBe('Laptop Gaming');
            expect(result.quantity).toBe(2);
            expect(result.priceWithTax).toBe(1380); // $1200 + 15% = $1380
            expect(result.subtotal).toBe(2760); // $1380 * 2 = $2760
        });
    });

    // ===============================================
    // NIVEL 3: INTEGRACIÓN COMPLETA
    // ===============================================
    describe('NIVEL 3: Integración ProductService ↔ CartService', () => {
        let cartService;

        beforeEach(() => {
            cartService = new CartService();
            // Mockeamos isProductAvailable para que siempre devuelva true
            jest.spyOn(cartService.productService, 'isProductAvailable').mockResolvedValue(true);
        });

        test('INTEGRACIÓN COMPLETA: Agregar múltiples productos y calcular total', async () => {
            // ARRANGE: Configuramos respuestas para múltiples productos
            
            // Producto 1: Caro (Laptop)
            const mockLaptop = {
                data: { id: 1, title: 'Laptop Pro', price: 1500, category: 'electronics', image: '' }
            };
            
            // Producto 2: Barato (Mouse)
            const mockMouse = {
                data: { id: 2, title: 'Mouse Gamer', price: 50, category: 'electronics', image: '' }
            };

            // Configuramos SECUENCIA de respuestas
            axios.get
                .mockResolvedValueOnce(mockLaptop)  // getProduct(1)
                .mockResolvedValueOnce(mockMouse);  // getProduct(2)

            // ACT: Agregamos múltiples productos
            await cartService.addProduct(1, 1); // 1 Laptop
            await cartService.addProduct(2, 3); // 3 Mouses

            const summary = cartService.getCartSummary();

            // ASSERT: Verificamos la integración completa
            
            // 1. Llamadas correctas a ProductService
            expect(axios.get).toHaveBeenCalledTimes(2);
            expect(cartService.productService.isProductAvailable).toHaveBeenCalledTimes(2);
            
            // 2. Productos procesados correctamente
            expect(summary.items).toHaveLength(2);
            expect(summary.totalItems).toBe(4); // 1 + 3
            
            // 3. Cálculos de integración correctos
            // Laptop: $1500 + 15% = $1725
            // Mouse: $50 + 10% = $55, * 3 = $165
            // Subtotal: $1725 + $165 = $1890
            expect(summary.subtotal).toBe(1890);
            
            // 4. Lógica de descuento (>$500 = 5% descuento)
            expect(summary.hasDiscount).toBe(true);
            expect(summary.discount).toBe(94.5); // 5% de $1890
            expect(summary.total).toBe(1795.5); // $1890 - $94.5
        });

        test('INTEGRACIÓN: Validación completa del carrito', async () => {
            // ARRANGE: Producto que puede no estar disponible
            const mockProduct = {
                data: { id: 1, title: 'Producto Limitado', price: 200, category: 'limited', image: '' }
            };

            axios.get.mockResolvedValueOnce(mockProduct);

            // ACT: Agregamos producto y validamos carrito
            await cartService.addProduct(1, 2);
            const validation = await cartService.validateCart();

            // ASSERT: Verificamos flujo completo de integración
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(cartService.productService.isProductAvailable).toHaveBeenCalledTimes(2); // addProduct + validateCart
            expect(validation.totalItems).toBe(1);
            expect(validation.isValid).toBe(true); // Con isProductAvailable mockeado siempre true
        });
    });

    // ===============================================
    // EXPLICACIÓN: ¿Por qué volvemos a llamar la API?
    // ===============================================
    describe('EXPLICACIÓN: ¿Por qué múltiples llamadas a la API?', () => {
        
        test('EJEMPLO EDUCATIVO: Rastreando llamadas a la API', async () => {
            const cartService = new CartService();
            // Mockeamos isProductAvailable
            jest.spyOn(cartService.productService, 'isProductAvailable').mockResolvedValue(true);
            
            const mockProduct = {
                data: { id: 1, title: 'Producto Demo', price: 100, category: 'demo', image: '' }
            };

            // Configuramos el mock para responder
            axios.get.mockResolvedValueOnce(mockProduct);

            // ACT: Operación que requiere múltiples llamadas
            await cartService.addProduct(1, 1);

            // ANÁLISIS: ¿Cuántas veces y por qué se llamó la API?
            
            console.log('Análisis de llamadas a la API:');
            console.log('Total de llamadas a axios.get:', axios.get.mock.calls.length);
            console.log('Total de llamadas a isProductAvailable:', cartService.productService.isProductAvailable.mock.calls.length);
            
            // Verificamos llamadas
            expect(axios.get.mock.calls).toHaveLength(1); // Solo getProduct
            expect(axios.get.mock.calls[0][0]).toBe('https://fakestoreapi.com/products/1');
            expect(cartService.productService.isProductAvailable).toHaveBeenCalledTimes(1);
            
            console.log('Llamada 1: CartService.addProduct() -> ProductService.getProduct()');
            console.log('Llamada 2: CartService.addProduct() -> ProductService.isProductAvailable() (mockeado)');
            console.log('');
            console.log('Explicación:');
            console.log('- getProduct() obtiene los datos del producto de la API');
            console.log('- isProductAvailable() verifica disponibilidad (en este caso mockeado)');
            console.log('- CartService coordina ambas operaciones');
            console.log('- En producción, isProductAvailable haría su propia llamada a la API');
        });
    });

    // ===============================================
    // PRUEBAS DE DISPONIBILIDAD ALEATORIA
    // ===============================================
    describe('PRUEBAS DE DISPONIBILIDAD: Manejo de productos no disponibles', () => {
        
        test('Debe manejar productos no disponibles correctamente', async () => {
            const cartService = new CartService();
            
            // ARRANGE: Configuramos isProductAvailable para devolver false (no disponible)
            jest.spyOn(cartService.productService, 'isProductAvailable').mockResolvedValue(false);
            
            const mockProduct = {
                data: { id: 1, title: 'Producto Agotado', price: 200, category: 'limited', image: '' }
            };

            axios.get.mockResolvedValueOnce(mockProduct);

            // ACT & ASSERT: Esperamos que falle por falta de disponibilidad
            await expect(cartService.addProduct(1, 1))
                .rejects
                .toThrow('No se pudo agregar al carrito: Producto Producto Agotado no disponible en stock');
                
            // Verificamos que se hicieron las llamadas correctas
            expect(axios.get).toHaveBeenCalledTimes(1); // getProduct
            expect(cartService.productService.isProductAvailable).toHaveBeenCalledTimes(1);
        });

        test('Debe permitir productos disponibles', async () => {
            const cartService = new CartService();
            
            // ARRANGE: Configuramos isProductAvailable para devolver true (disponible)
            jest.spyOn(cartService.productService, 'isProductAvailable').mockResolvedValue(true);
            
            const mockProduct = {
                data: { id: 1, title: 'Producto Disponible', price: 200, category: 'available', image: '' }
            };

            axios.get.mockResolvedValueOnce(mockProduct);

            // ACT: Debería agregar exitosamente
            const result = await cartService.addProduct(1, 1);

            // ASSERT: Verificamos que se agregó correctamente
            expect(result.title).toBe('Producto Disponible');
            expect(result.quantity).toBe(1);
            expect(axios.get).toHaveBeenCalledTimes(1); // getProduct
            expect(cartService.productService.isProductAvailable).toHaveBeenCalledTimes(1);
        });
    });
});

/**
 * RESUMEN DE CONCEPTOS CLAVE:
 * 
 * 1. MOCKS (Simuladores):
 *    - axios.get.mockResolvedValueOnce() = Simula UNA respuesta exitosa
 *    - axios.get.mockRejectedValueOnce() = Simula UNA respuesta con error
 *    - jest.spyOn().mockResolvedValue() = Mockea métodos específicos de objetos
 * 
 * 2. ESTRATEGIAS DE MOCKING:
 *    - Mock de APIs externas (axios) para control de respuestas
 *    - Mock de métodos específicos (isProductAvailable) para control de lógica
 *    - Combinación de ambos para pruebas más precisas
 * 
 * 3. INTEGRACIÓN INCREMENTAL:
 *    - Nivel 1: Probamos ProductService aislado
 *    - Nivel 2: Probamos CartService con ProductService mockeado
 *    - Nivel 3: Probamos ambos servicios trabajando juntos
 * 
 * 4. VENTAJAS DE LOS MOCKS:
 *    - Control total sobre las respuestas
 *    - Pruebas rápidas (no esperamos respuestas reales)
 *    - Pruebas confiables (no dependen de servicios externos)
 *    - Podemos probar escenarios específicos (errores, casos límite, etc.)
 * 
 * 5. MEJORES PRÁCTICAS:
 *    - Mockear en el nivel correcto (método vs API)
 *    - Limpiar mocks entre pruebas
 *    - Verificar tanto el comportamiento como las interacciones
 *    - Documentar qué se está mockeando y por qué
 */