const ProductService = require('./ProductService');

/**
 * SERVICIO DE CARRITO DE COMPRAS - E-COMMERCE
 * 
 * Este servicio gestiona el carrito de compras de un usuario.
 * INTEGRA con ProductService para obtener información de productos.
 * 
 * Ejemplo de uso en el mundo real:
 * - Usuario agrega productos al carrito
 * - Sistema calcula totales automáticamente
 * - Verifica disponibilidad antes de proceder al pago
 */
class CartService {
    constructor() {
        this.productService = new ProductService();
        this.items = []; // Carrito en memoria (en producción sería base de datos)
    }

    /**
     * Agrega un producto al carrito
     * 
     * EJEMPLO REAL: Usuario hace clic en "Agregar al Carrito"
     * 
     * INTEGRACIÓN: Este método llama a ProductService para obtener datos del producto
     * 
     * @param {number} productId - ID del producto a agregar
     * @param {number} quantity - Cantidad a agregar
     * @returns {Promise<Object>} Información del item agregado
     */
    async addProduct(productId, quantity = 1) {
        try {
            console.log(`Agregando ${quantity} unidad(es) del producto ${productId} al carrito...`);

            // INTEGRACIÓN: Llamamos a ProductService para obtener datos del producto
            const product = await this.productService.getProduct(productId);

            // INTEGRACIÓN: Verificamos disponibilidad usando ProductService
            const isAvailable = await this.productService.isProductAvailable(productId);
            
            if (!isAvailable) {
                throw new Error(`Producto ${product.title} no disponible en stock`);
            }

            // Verificamos si el producto ya está en el carrito
            const existingItem = this.items.find(item => item.productId === productId);

            if (existingItem) {
                // Si ya existe, incrementamos la cantidad
                existingItem.quantity += quantity;
                existingItem.subtotal = existingItem.quantity * product.priceWithTax;
                
                console.log(`Cantidad actualizada para ${product.title}: ${existingItem.quantity} unidades`);
                return existingItem;
            } else {
                // Si no existe, lo agregamos como nuevo item
                const newItem = {
                    productId: productId,
                    title: product.title,
                    price: product.price,
                    priceWithTax: product.priceWithTax,
                    quantity: quantity,
                    subtotal: quantity * product.priceWithTax,
                    isExpensive: product.isExpensive
                };

                this.items.push(newItem);
                console.log(`${product.title} agregado al carrito`);
                return newItem;
            }

        } catch (error) {
            console.error(`Error agregando producto al carrito:`, error.message);
            throw new Error(`No se pudo agregar al carrito: ${error.message}`);
        }
    }

    /**
     * Calcula el total del carrito
     * 
     * EJEMPLO REAL: Mostrar total en la página del carrito
     * 
     * @returns {Object} Resumen del carrito con totales
     */
    getCartSummary() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
        
        // Lógica de negocio: Descuento por compras grandes
        const discount = subtotal > 500 ? subtotal * 0.05 : 0; // 5% descuento si > $500
        const total = subtotal - discount;

        return {
            items: this.items,
            totalItems: totalItems,
            subtotal: Math.round(subtotal * 100) / 100,
            discount: Math.round(discount * 100) / 100,
            total: Math.round(total * 100) / 100,
            hasDiscount: discount > 0
        };
    }

    /**
     * Valida que todos los productos del carrito estén disponibles
     * 
     * EJEMPLO REAL: Antes del checkout, verificar que todo esté en stock
     * 
     * INTEGRACIÓN: Llama a ProductService para cada producto
     * 
     * @returns {Promise<Object>} Resultado de la validación
     */
    async validateCart() {
        console.log(`Validando disponibilidad de ${this.items.length} productos...`);
        
        const validationResults = [];

        // INTEGRACIÓN: Para cada producto, verificamos disponibilidad
        for (const item of this.items) {
            const isAvailable = await this.productService.isProductAvailable(item.productId);
            validationResults.push({
                productId: item.productId,
                title: item.title,
                quantity: item.quantity,
                isAvailable: isAvailable
            });
        }

        const unavailableItems = validationResults.filter(result => !result.isAvailable);
        const isValid = unavailableItems.length === 0;

        console.log(isValid ? 
            'Todos los productos están disponibles' : 
            `${unavailableItems.length} productos no disponibles`
        );

        return {
            isValid: isValid,
            availableItems: validationResults.filter(r => r.isAvailable),
            unavailableItems: unavailableItems,
            totalItems: validationResults.length
        };
    }

    /**
     * Limpia el carrito
     */
    clearCart() {
        this.items = [];
        console.log('Carrito limpiado');
    }

    /**
     * Obtiene los items del carrito
     */
    getItems() {
        return [...this.items]; // Retorna una copia para evitar mutaciones
    }
}

module.exports = CartService;