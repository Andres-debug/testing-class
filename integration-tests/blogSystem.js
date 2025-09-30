const UserService = require('./services/userService');
const PostService = require('./services/postService');

/**
 * Sistema principal que integra los servicios de usuario y posts
 * Demuestra la integración entre múltiples módulos
 */
class BlogSystem {
    constructor() {
        this.userService = new UserService();
        this.postService = new PostService();
    }

    /**
     * Obtiene el perfil completo de un usuario incluyendo sus posts
     * @param {number} userId - ID del usuario
     * @returns {Promise<Object>} Perfil completo del usuario con sus posts
     */
    async getUserProfile(userId) {
        try {
            // Obtener datos del usuario
            const user = await this.userService.getUserById(userId);
            
            // Obtener posts del usuario
            const posts = await this.postService.getPostsByUserId(userId);
            
            return {
                user: user,
                posts: posts,
                totalPosts: posts.length
            };
        } catch (error) {
            throw new Error(`Error al obtener perfil: ${error.message}`);
        }
    }

    /**
     * Crea un nuevo post para un usuario existente
     * @param {number} userId - ID del usuario
     * @param {Object} postData - Datos del post
     * @returns {Promise<Object>} Post creado con información del usuario
     */
    async createUserPost(userId, postData) {
        try {
            // Verificar que el usuario existe
            const user = await this.userService.getUserById(userId);
            
            // Crear el post
            const newPost = await this.postService.createPost({
                ...postData,
                userId: userId
            });
            
            return {
                post: newPost,
                author: user.name,
                authorEmail: user.email
            };
        } catch (error) {
            throw new Error(`Error al crear post: ${error.message}`);
        }
    }

    /**
     * Obtiene estadísticas generales del blog
     * @returns {Promise<Object>} Estadísticas del blog
     */
    async getBlogStats() {
        try {
            const users = await this.userService.getAllUsers();
            
            // Obtener posts de todos los usuarios
            const allPostsPromises = users.map(user => 
                this.postService.getPostsByUserId(user.id)
            );
            
            const allPostsArrays = await Promise.all(allPostsPromises);
            const totalPosts = allPostsArrays.reduce((sum, posts) => sum + posts.length, 0);
            
            return {
                totalUsers: users.length,
                totalPosts: totalPosts,
                averagePostsPerUser: totalPosts / users.length
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

module.exports = BlogSystem;