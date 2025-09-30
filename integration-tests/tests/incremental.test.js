const UserService = require('../services/userService');
const PostService = require('../services/postService');
const BlogSystem = require('../blogSystem');

// Mock de axios para simular respuestas de la API
jest.mock('axios');
const axios = require('axios');
const mockedAxios = axios;

/**
 * PRUEBAS DE INTEGRACIÓN INCREMENTALES
 * 
 * Estas pruebas verifican la integración entre módulos de forma gradual,
 * probando primero cada servicio individualmente y luego su integración.
 * Utilizan stubs (mocks) para simular las dependencias externas.
 */

describe('Pruebas de Integración Incrementales', () => {
    
    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();
    });

    describe('Nivel 1: Pruebas de UserService (con stub de axios)', () => {
        let userService;

        beforeEach(() => {
            userService = new UserService();
        });

        test('Debe obtener un usuario por ID usando stub de axios', async () => {
            // Stub: Simulamos la respuesta de axios
            const mockUserData = {
                id: 1,
                name: 'Leanne Graham',
                username: 'Bret',
                email: 'Sincere@april.biz'
            };

            mockedAxios.get.mockResolvedValueOnce({
                data: mockUserData
            });

            const result = await userService.getUserById(1);

            expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
            expect(result).toEqual(mockUserData);
            expect(result.name).toBe('Leanne Graham');
        });

        test('Debe obtener todos los usuarios usando stub de axios', async () => {
            // Stub: Simulamos una lista de usuarios
            const mockUsersData = [
                { id: 1, name: 'Usuario 1', email: 'user1@test.com' },
                { id: 2, name: 'Usuario 2', email: 'user2@test.com' }
            ];

            mockedAxios.get.mockResolvedValueOnce({
                data: mockUsersData
            });

            const result = await userService.getAllUsers();

            expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Usuario 1');
        });
    });

    describe('Nivel 2: Pruebas de PostService (con stub de axios)', () => {
        let postService;

        beforeEach(() => {
            postService = new PostService();
        });

        test('Debe obtener posts por userId usando stub de axios', async () => {
            // Stub: Simulamos posts de un usuario específico
            const mockPostsData = [
                {
                    id: 1,
                    userId: 1,
                    title: 'Post de prueba 1',
                    body: 'Contenido del post 1'
                },
                {
                    id: 2,
                    userId: 1,
                    title: 'Post de prueba 2',
                    body: 'Contenido del post 2'
                }
            ];

            mockedAxios.get.mockResolvedValueOnce({
                data: mockPostsData
            });

            const result = await postService.getPostsByUserId(1);

            expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts?userId=1');
            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Post de prueba 1');
        });

        test('Debe crear un post usando stub de axios', async () => {
            // Stub: Simulamos la creación de un post
            const newPostData = {
                title: 'Nuevo Post',
                body: 'Contenido del nuevo post',
                userId: 1
            };

            const mockCreatedPost = {
                id: 101,
                ...newPostData
            };

            mockedAxios.post.mockResolvedValueOnce({
                data: mockCreatedPost
            });

            const result = await postService.createPost(newPostData);

            expect(mockedAxios.post).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts', newPostData);
            expect(result.id).toBe(101);
            expect(result.title).toBe('Nuevo Post');
        });
    });

    describe('Nivel 3: Integración UserService + PostService (BlogSystem)', () => {
        let blogSystem;

        beforeEach(() => {
            blogSystem = new BlogSystem();
        });

        test('Debe obtener perfil completo integrando UserService y PostService', async () => {
            // Stub para UserService
            const mockUser = {
                id: 1,
                name: 'Juan Pérez',
                email: 'juan@test.com'
            };

            // Stub para PostService
            const mockPosts = [
                { id: 1, title: 'Post 1', userId: 1 },
                { id: 2, title: 'Post 2', userId: 1 }
            ];

            // Configuramos los stubs en orden de llamada
            mockedAxios.get
                .mockResolvedValueOnce({ data: mockUser })      // Primera llamada: getUserById
                .mockResolvedValueOnce({ data: mockPosts });    // Segunda llamada: getPostsByUserId

            const result = await blogSystem.getUserProfile(1);

            // Verificamos que ambos servicios fueron llamados correctamente
            expect(mockedAxios.get).toHaveBeenCalledTimes(2);
            expect(mockedAxios.get).toHaveBeenNthCalledWith(1, 'https://jsonplaceholder.typicode.com/users/1');
            expect(mockedAxios.get).toHaveBeenNthCalledWith(2, 'https://jsonplaceholder.typicode.com/posts?userId=1');

            // Verificamos la integración de datos
            expect(result.user.name).toBe('Juan Pérez');
            expect(result.posts).toHaveLength(2);
            expect(result.totalPosts).toBe(2);
        });

        test('Debe crear post para usuario existente integrando ambos servicios', async () => {
            // Stub para verificar que el usuario existe
            const mockUser = {
                id: 1,
                name: 'Ana García',
                email: 'ana@test.com'
            };

            // Stub para crear el post
            const mockCreatedPost = {
                id: 101,
                title: 'Mi nuevo post',
                body: 'Contenido del post',
                userId: 1
            };

            mockedAxios.get.mockResolvedValueOnce({ data: mockUser });
            mockedAxios.post.mockResolvedValueOnce({ data: mockCreatedPost });

            const postData = {
                title: 'Mi nuevo post',
                body: 'Contenido del post'
            };

            const result = await blogSystem.createUserPost(1, postData);

            // Verificamos la integración
            expect(result.post.title).toBe('Mi nuevo post');
            expect(result.author).toBe('Ana García');
            expect(result.authorEmail).toBe('ana@test.com');
        });
    });
});