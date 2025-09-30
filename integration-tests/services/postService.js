const axios = require('axios');

/**
 * Servicio para gestionar operaciones relacionadas con posts
 * Utiliza la API pública JSONPlaceholder para simular operaciones reales
 */
class PostService {
    constructor(baseURL = 'https://jsonplaceholder.typicode.com') {
        this.baseURL = baseURL;
    }

    /**
     * Obtiene posts por ID de usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} Lista de posts del usuario
     */
    async getPostsByUserId(userId) {
        try {
            const response = await axios.get(`${this.baseURL}/posts?userId=${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener posts: ${error.message}`);
        }
    }

    /**
     * Obtiene un post específico por ID
     * @param {number} id - ID del post
     * @returns {Promise<Object>} Datos del post
     */
    async getPostById(id) {
        try {
            const response = await axios.get(`${this.baseURL}/posts/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener post: ${error.message}`);
        }
    }

    /**
     * Crea un nuevo post
     * @param {Object} postData - Datos del post
     * @returns {Promise<Object>} Post creado
     */
    async createPost(postData) {
        try {
            const response = await axios.post(`${this.baseURL}/posts`, postData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al crear post: ${error.message}`);
        }
    }
}

module.exports = PostService;