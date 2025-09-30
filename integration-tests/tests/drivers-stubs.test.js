const BlogSystem = require('../blogSystem');
const { BlogControllerDriver, DatabaseStub, NotificationServiceStub } = require('../stubs-drivers/testHelpers');

// Mock de axios para las pruebas con stubs
jest.mock('axios');
const axios = require('axios');
const mockedAxios = axios;

/**
 * PRUEBAS DE INTEGRACIÓN CON DRIVERS Y STUBS ESPECÍFICOS
 * 
 * Estas pruebas demuestran el uso práctico de drivers y stubs
 * en diferentes escenarios de pruebas de integración.
 */

describe('Pruebas con Drivers y Stubs Específicos', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Pruebas usando Driver (BlogControllerDriver)', () => {
        let blogSystem;
        let controllerDriver;

        beforeEach(() => {
            blogSystem = new BlogSystem();
            controllerDriver = new BlogControllerDriver(blogSystem);
        });

        test('Driver: Debe manejar petición exitosa de perfil de usuario', async () => {
            // Configuramos stubs para simular respuestas exitosas
            const mockUser = {
                id: 1,
                name: 'María González',
                email: 'maria@test.com'
            };

            const mockPosts = [
                { id: 1, userId: 1, title: 'Mi primer post' },
                { id: 2, userId: 1, title: 'Segundo post' }
            ];

            mockedAxios.get
                .mockResolvedValueOnce({ data: mockUser })
                .mockResolvedValueOnce({ data: mockPosts });

            // Usamos el driver para simular una petición HTTP
            const response = await controllerDriver.handleGetUserProfile(1);

            // Verificamos que el driver manejó correctamente la integración
            expect(response.status).toBe(200);
            expect(response.message).toBe('Perfil obtenido exitosamente');
            expect(response.data.user.name).toBe('María González');
            expect(response.data.totalPosts).toBe(2);
        });

        test('Driver: Debe manejar errores de integración correctamente', async () => {
            // Simulamos un error en la API
            mockedAxios.get.mockRejectedValueOnce(new Error('Usuario no encontrado'));

            // El driver debe manejar el error graciosamente
            const response = await controllerDriver.handleGetUserProfile(999);

            expect(response.status).toBe(500);
            expect(response.data).toBeNull();
            expect(response.message).toContain('Usuario no encontrado');
        });

        test('Driver: Debe crear post exitosamente con integración completa', async () => {
            // Stubs para verificar usuario y crear post
            const mockUser = {
                id: 1,
                name: 'Pedro López',
                email: 'pedro@test.com'
            };

            const mockCreatedPost = {
                id: 101,
                title: 'Post desde driver',
                body: 'Contenido creado a través del driver',
                userId: 1
            };

            mockedAxios.get.mockResolvedValueOnce({ data: mockUser });
            mockedAxios.post.mockResolvedValueOnce({ data: mockCreatedPost });

            const postData = {
                title: 'Post desde driver',
                body: 'Contenido creado a través del driver'
            };

            const response = await controllerDriver.handleCreatePost(1, postData);

            expect(response.status).toBe(201);
            expect(response.message).toBe('Post creado exitosamente');
            expect(response.data.post.title).toBe('Post desde driver');
            expect(response.data.author).toBe('Pedro López');
        });
    });

    describe('Pruebas usando Stubs (DatabaseStub y NotificationServiceStub)', () => {
        let databaseStub;
        let notificationStub;

        beforeEach(() => {
            databaseStub = new DatabaseStub();
            notificationStub = new NotificationServiceStub();
        });

        test('Stub de Base de Datos: Debe simular operaciones de base de datos', async () => {
            // Probamos las operaciones del stub de base de datos
            const user = await databaseStub.findUserById(1);
            expect(user.name).toBe('Usuario Stub 1');

            const posts = await databaseStub.findPostsByUserId(1);
            expect(posts).toHaveLength(2);
            expect(posts[0].title).toBe('Post Stub 1');

            // Probamos crear un nuevo post
            const newPost = await databaseStub.createPost({
                userId: 1,
                title: 'Nuevo post stub',
                body: 'Contenido del nuevo post'
            });

            expect(newPost.id).toBeDefined();
            expect(newPost.title).toBe('Nuevo post stub');

            // Verificamos que se agregó a la "base de datos" stub
            const updatedPosts = await databaseStub.findPostsByUserId(1);
            expect(updatedPosts).toHaveLength(3);
        });

        test('Stub de Notificaciones: Debe simular envío de notificaciones', async () => {
            // Probamos el stub de notificaciones
            const result = await notificationStub.sendNotification('new_post', {
                userId: 1,
                postId: 101,
                title: 'Nuevo post creado'
            });

            expect(result).toBe(true);

            const notifications = notificationStub.getSentNotifications();
            expect(notifications).toHaveLength(1);
            expect(notifications[0].type).toBe('new_post');
            expect(notifications[0].status).toBe('sent');
            expect(notifications[0].data.title).toBe('Nuevo post creado');
        });

        test('Integración con múltiples stubs simultáneamente', async () => {
            // Simulamos un flujo que usa múltiples stubs
            
            // 1. "Obtenemos" datos del usuario de la base de datos stub
            const user = await databaseStub.findUserById(1);
            
            // 2. "Creamos" un post usando el stub de base de datos
            const newPost = await databaseStub.createPost({
                userId: user.id,
                title: 'Post integrado con stubs',
                body: 'Este post demuestra integración con múltiples stubs'
            });

            // 3. "Enviamos" notificación usando el stub de notificaciones
            await notificationStub.sendNotification('post_created', {
                userId: user.id,
                userName: user.name,
                postId: newPost.id,
                postTitle: newPost.title
            });

            // Verificamos la integración completa
            expect(newPost.userId).toBe(user.id);
            
            const notifications = notificationStub.getSentNotifications();
            expect(notifications).toHaveLength(1);
            expect(notifications[0].data.userName).toBe(user.name);
            expect(notifications[0].data.postTitle).toBe(newPost.title);

            // Verificamos que el post se guardó correctamente
            const userPosts = await databaseStub.findPostsByUserId(user.id);
            const createdPost = userPosts.find(p => p.id === newPost.id);
            expect(createdPost).toBeDefined();
            expect(createdPost.title).toBe('Post integrado con stubs');
        });
    });

    describe('Pruebas Híbridas: Combinando Drivers, Stubs y Sistema Real', () => {
        let blogSystem;
        let controllerDriver;
        let notificationStub;

        beforeEach(() => {
            blogSystem = new BlogSystem();
            controllerDriver = new BlogControllerDriver(blogSystem);
            notificationStub = new NotificationServiceStub();
        });

        test('Integración completa: Driver + Sistema + Stubs + API simulada', async () => {
            // Esta prueba demuestra una integración completa usando todos los componentes
            
            // 1. Configuramos stubs para la API externa
            const mockUser = {
                id: 1,
                name: 'Laura Martínez',
                email: 'laura@test.com'
            };

            const mockCreatedPost = {
                id: 201,
                title: 'Post de integración híbrida',
                body: 'Este post demuestra integración completa',
                userId: 1
            };

            mockedAxios.get.mockResolvedValueOnce({ data: mockUser });
            mockedAxios.post.mockResolvedValueOnce({ data: mockCreatedPost });

            // 2. Usamos el driver para crear un post
            const postData = {
                title: 'Post de integración híbrida',
                body: 'Este post demuestra integración completa'
            };

            const controllerResponse = await controllerDriver.handleCreatePost(1, postData);

            // 3. Simulamos envío de notificación con stub
            if (controllerResponse.status === 201) {
                await notificationStub.sendNotification('post_created_via_api', {
                    userId: controllerResponse.data.post.userId,
                    author: controllerResponse.data.author,
                    postTitle: controllerResponse.data.post.title
                });
            }

            // 4. Verificamos toda la cadena de integración
            expect(controllerResponse.status).toBe(201);
            expect(controllerResponse.data.author).toBe('Laura Martínez');

            const notifications = notificationStub.getSentNotifications();
            expect(notifications).toHaveLength(1);
            expect(notifications[0].type).toBe('post_created_via_api');
            expect(notifications[0].data.author).toBe('Laura Martínez');

            // Verificamos que todos los componentes trabajaron juntos
            expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'https://jsonplaceholder.typicode.com/posts',
                expect.objectContaining({
                    title: 'Post de integración híbrida',
                    userId: 1
                })
            );
        });
    });
});