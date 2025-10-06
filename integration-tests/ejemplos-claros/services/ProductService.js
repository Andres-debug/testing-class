const axios = require('axios');

/**
 * SERVICIO DE PRODUCTOS - E-COMMERCE
 * 
 * Este servicio gestiona productos de una tienda online.
 * Utiliza una API externa para obtener información de productos.
 * 
 * Ejemplo de uso en el mundo real:
 * - Amazon obteniendo info de productos de proveedores
 * - MercadoLibre consultando inventario de vendedores
 */
class ProductService {
    constructor(apiUrl = 'https://fakestoreapi.com') {
        this.apiUrl = apiUrl;
    }

    /**
     * Obtiene un producto por su ID
     * 
     * EJEMPLO REAL: Usuario hace clic en "Ver Producto"
     * 
     * @param {number} productId - ID del producto
     * @returns {Promise<Object>} Información del producto
     */
    async getProduct(productId) {
        try {
            console.log(`Buscando producto ${productId} en la API...`);
            
            const response = await axios.get(`${this.apiUrl}/products/${productId}`);
            
            const product = {
                id: response.data.id,
                title: response.data.title,
                price: response.data.price,
                description: response.data.description,
                category: response.data.category,
                image: response.data.image,
                // Agregamos lógica de negocio
                isExpensive: response.data.price > 100,
                priceWithTax: this.calculateTax(response.data.price)
            };

            console.log(`Producto encontrado: ${product.title}`);
            return product;
            
        } catch (error) {
            console.error(`Error obteniendo producto ${productId}:`, error.message);
            throw new Error(`No se pudo obtener el producto: ${error.message}`);
        }
    }

    /**
     * Obtiene productos por categoría
     * 
     * EJEMPLO REAL: Usuario navega por "Electrónicos" o "Ropa"
     * 
     * @param {string} category - Categoría de productos
     * @returns {Promise<Array>} Lista de productos
     */
    async getProductsByCategory(category) {
        try {
            console.log(`Buscando productos de la categoría: ${category}`);
            
            const response = await axios.get(`${this.apiUrl}/products/category/${category}`);
            
            // Procesamos y enriquecemos los datos
            const products = response.data.map(product => ({
                id: product.id,
                title: product.title,
                price: product.price,
                category: product.category,
                isExpensive: product.price > 100,
                priceWithTax: this.calculateTax(product.price)
            }));

            console.log(`Encontrados ${products.length} productos en ${category}`);
            return products;
            
        } catch (error) {
            console.error(`Error obteniendo productos de ${category}:`, error.message);
            throw new Error(`No se pudieron obtener productos de la categoría: ${error.message}`);
        }
    }

    /**
     * Verifica si un producto está disponible
     * 
     * EJEMPLO REAL: Antes de agregar al carrito, verificar stock
     * 
     * @param {number} productId - ID del producto
     * @returns {Promise<boolean>} true si está disponible
     */
    async isProductAvailable(productId) {
        try {
            const product = await this.getProduct(productId);
            // En un sistema real, aquí consultaríamos el inventario
            // Por ahora, simulamos que productos caros tienen menos stock
            return !product.isExpensive || Math.random() > 0.3;
            
        } catch (error) {
            return false; // Si no podemos obtener el producto, no está disponible
        }
    }

    /**
     * Calcula impuestos del producto
     * LÓGICA DE NEGOCIO: Productos > $100 tienen 15% de impuesto, otros 10%
     * 
     * @param {number} price - Precio base
     * @returns {number} Precio con impuestos incluidos
     */
    calculateTax(price) {
        const taxRate = price > 100 ? 0.15 : 0.10;
        return price + (price * taxRate);
    }
}

module.exports = ProductService;