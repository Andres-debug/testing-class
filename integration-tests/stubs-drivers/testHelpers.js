/**
 * DRIVERS Y STUBS PARA PRUEBAS DE INTEGRACIÓN
 * 
 * Los drivers son módulos que simulan partes superiores del sistema
 * Los stubs son módulos que simulan partes inferiores del sistema
 */

/**
 * DRIVER: Simula un controlador o interfaz de usuario
 * que llama a nuestro BlogSystem
 */
class BlogControllerDriver {
    constructor(blogSystem) {
        this.blogSystem = blogSystem;
    }

    /**
     * Simula una petición HTTP para obtener el perfil de usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Object>} Respuesta simulada del controlador
     */
    async handleGetUserProfile(userId) {
        try {
            const profile = await this.blogSystem.getUserProfile(userId);
            return {
                status: 200,
                data: profile,
                message: 'Perfil obtenido exitosamente'
            };
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: error.message
            };
        }
    }

    /**
     * Simula una petición HTTP para crear un post
     * @param {number} userId - ID del usuario
     * @param {Object} postData - Datos del post
     * @returns {Promise<Object>} Respuesta simulada del controlador
     */
    async handleCreatePost(userId, postData) {
        try {
            const result = await this.blogSystem.createUserPost(userId, postData);
            return {
                status: 201,
                data: result,
                message: 'Post creado exitosamente'
            };
        } catch (error) {
            return {
                status: 400,
                data: null,
                message: error.message
            };
        }
    }
}

/**
 * STUB: Simula la base de datos o almacenamiento externo
 */
class DatabaseStub {
    constructor() {
        this.users = [
            { id: 1, name: 'Usuario Stub 1', email: 'stub1@test.com' },
            { id: 2, name: 'Usuario Stub 2', email: 'stub2@test.com' }
        ];
        
        this.posts = [
            { id: 1, userId: 1, title: 'Post Stub 1', body: 'Contenido stub 1' },
            { id: 2, userId: 1, title: 'Post Stub 2', body: 'Contenido stub 2' },
            { id: 3, userId: 2, title: 'Post Stub 3', body: 'Contenido stub 3' }
        ];
    }

    /**
     * Simula obtener un usuario de la base de datos
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} Usuario simulado
     */
    async findUserById(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }

    /**
     * Simula obtener posts por usuario de la base de datos
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} Posts simulados
     */
    async findPostsByUserId(userId) {
        return this.posts.filter(p => p.userId === userId);
    }

    /**
     * Simula crear un post en la base de datos
     * @param {Object} postData - Datos del post
     * @returns {Promise<Object>} Post creado simulado
     */
    async createPost(postData) {
        const newPost = {
            id: Math.max(...this.posts.map(p => p.id)) + 1,
            ...postData
        };
        this.posts.push(newPost);
        return newPost;
    }
}

/**
 * STUB: Simula un servicio de notificaciones externo
 */
class NotificationServiceStub {
    constructor() {
        this.sentNotifications = [];
    }

    /**
     * Simula enviar una notificación
     * @param {string} type - Tipo de notificación
     * @param {Object} data - Datos de la notificación
     * @returns {Promise<boolean>} Éxito del envío simulado
     */
    async sendNotification(type, data) {
        const notification = {
            id: Date.now(),
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };
        
        this.sentNotifications.push(notification);
        return true;
    }

    /**
     * Obtiene las notificaciones enviadas (para verificación en pruebas)
     * @returns {Array} Lista de notificaciones enviadas
     */
    getSentNotifications() {
        return this.sentNotifications;
    }

    /**
     * Limpia las notificaciones (para limpiar entre pruebas)
     */
    clear() {
        this.sentNotifications = [];
    }
}

module.exports = {
    BlogControllerDriver,
    DatabaseStub,
    NotificationServiceStub
};