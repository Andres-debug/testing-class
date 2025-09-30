const axios = require('axios');

/**
 * Servicio para gestionar operaciones relacionadas con usuarios
 * Utiliza la API pública JSONPlaceholder para simular operaciones reales
 */
class UserService {
    constructor(baseURL = 'https://jsonplaceholder.typicode.com') {
        this.baseURL = baseURL;
    }

    /**
     * Obtiene un usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} Datos del usuario
     */
    async getUserById(id) {
        try {
            const response = await axios.get(`${this.baseURL}/users/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    }

    /**
     * Obtiene todos los usuarios
     * @returns {Promise<Array>} Lista de usuarios
     */
    async getAllUsers() {
        try {
            const response = await axios.get(`${this.baseURL}/users`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object>} Usuario creado
     */
    async createUser(userData) {
        try {
            const response = await axios.post(`${this.baseURL}/users`, userData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }
}

module.exports = UserService;