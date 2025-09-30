const BlogSystem = require('../blogSystem');

// Mock de axios a nivel global
jest.mock('axios');
const axios = require('axios');
const mockedAxios = axios;

/**
 * PRUEBAS DE INTEGRACIÓN BIG BANG
 * 
 * Estas pruebas verifican todo el sistema integrado de una sola vez,
 * probando múltiples módulos trabajando juntos simultáneamente.
 * Incluyen pruebas con API real y con stubs para diferentes escenarios.
 */

describe('Pruebas de Integración Big Bang', () => {

    describe('Sistema Completo con Stubs (Escenarios Controlados)', () => {
        let blogSystem;

        beforeEach(() => {
            jest.clearAllMocks();
            blogSystem = new BlogSystem();
        });

        test('Sistema completo: Obtener estadísticas del blog (Big Bang con múltiples llamadas)', async () => {
            // Stub complejo: Simulamos respuestas para múltiples usuarios y sus posts
            const mockUsers = [
                { id: 1, name: 'Usuario 1', email: 'user1@test.com' },
                { id: 2, name: 'Usuario 2', email: 'user2@test.com' },
                { id: 3, name: 'Usuario 3', email: 'user3@test.com' }
            ];

            const mockPostsUser1 = [
                { id: 1, userId: 1, title: 'Post 1 del Usuario 1' },
                { id: 2, userId: 1, title: 'Post 2 del Usuario 1' }
            ];

            const mockPostsUser2 = [
                { id: 3, userId: 2, title: 'Post 1 del Usuario 2' }
            ];

            const mockPostsUser3 = [
                { id: 4, userId: 3, title: 'Post 1 del Usuario 3' },
                { id: 5, userId: 3, title: 'Post 2 del Usuario 3' },
                { id: 6, userId: 3, title: 'Post 3 del Usuario 3' }
            ];

            // Configuramos múltiples stubs para simular todo el flujo
            mockedAxios.get
                .mockResolvedValueOnce({ data: mockUsers })        // getAllUsers()
                .mockResolvedValueOnce({ data: mockPostsUser1 })    // getPostsByUserId(1)
                .mockResolvedValueOnce({ data: mockPostsUser2 })    // getPostsByUserId(2)
                .mockResolvedValueOnce({ data: mockPostsUser3 });   // getPostsByUserId(3)

            const result = await blogSystem.getBlogStats();

            // Verificamos que el sistema integró correctamente todos los módulos
            expect(mockedAxios.get).toHaveBeenCalledTimes(4);
            expect(result.totalUsers).toBe(3);
            expect(result.totalPosts).toBe(6); // 2 + 1 + 3
            expect(result.averagePostsPerUser).toBe(2); // 6/3
        });

        test('Flujo completo: Crear usuario y post en una operación compleja', async () => {
            // Simulamos un flujo complejo que involucra múltiples operaciones
            const mockUser = {
                id: 1,
                name: 'Carlos Rodríguez',
                email: 'carlos@test.com'
            };

            const mockCreatedPost = {
                id: 101,
                title: 'Mi experiencia con pruebas de integración',
                body: 'Las pruebas Big Bang son muy útiles...',
                userId: 1
            };

            // Driver complejo: Simulamos múltiples interacciones
            mockedAxios.get.mockResolvedValueOnce({ data: mockUser });
            mockedAxios.post.mockResolvedValueOnce({ data: mockCreatedPost });

            const postData = {
                title: 'Mi experiencia con pruebas de integración',
                body: 'Las pruebas Big Bang son muy útiles...'
            };

            const result = await blogSystem.createUserPost(1, postData);

            // Verificamos la integración completa del sistema
            expect(result.post.title).toBe('Mi experiencia con pruebas de integración');
            expect(result.author).toBe('Carlos Rodríguez');
            expect(result.authorEmail).toBe('carlos@test.com');
            
            // Verificamos que ambos servicios trabajaron correctamente juntos
            expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'https://jsonplaceholder.typicode.com/posts',
                expect.objectContaining({
                    title: 'Mi experiencia con pruebas de integración',
                    userId: 1
                })
            );
        });

        test('Manejo de errores en sistema integrado (Big Bang con fallos)', async () => {
            // Stub que simula error en la API
            mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

            await expect(blogSystem.getUserProfile(999)).rejects.toThrow('Error al obtener perfil');
            
            // Verificamos que el sistema maneja errores de integración correctamente
            expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/999');
        });
    });

    describe('Sistema Completo con API Real (Pruebas End-to-End)', () => {
        let blogSystem;

        beforeEach(() => {
            // Restauramos todos los mocks para usar la API real
            jest.restoreAllMocks();
            blogSystem = new BlogSystem();
        });

        afterEach(() => {
            // Volvemos a mockear axios después de las pruebas reales
            jest.doMock('axios');
        });

        // NOTA: Estas pruebas usan la API real de JSONPlaceholder
        test('Sistema completo con API real: Obtener perfil de usuario existente', async () => {
            try {
                // Esta prueba usa la API real de JSONPlaceholder
                const result = await blogSystem.getUserProfile(1);

                // Verificamos que el sistema integró correctamente los datos reales
                expect(result.user).toBeDefined();
                expect(result.user.id).toBe(1);
                expect(result.user.name).toBeDefined();
                expect(result.posts).toBeDefined();
                expect(Array.isArray(result.posts)).toBe(true);
                expect(result.totalPosts).toBe(result.posts.length);
                
                console.log('✓ Integración exitosa con API real - Usuario:', result.user.name);
                console.log('✓ Posts obtenidos:', result.totalPosts);
            } catch (error) {
                // En caso de que la API no esté disponible, marcamos la prueba como pendiente
                console.warn('⚠ API real no disponible, saltando prueba:', error.message);
                expect(error.message).toContain('Error al obtener');
            }
        }, 10000);

        test('Sistema completo con API real: Crear post (simulación)', async () => {
            try {
                // JSONPlaceholder permite crear posts (solo simulación)
                const postData = {
                    title: 'Post de prueba de integración',
                    body: 'Este post fue creado durante una prueba de integración Big Bang'
                };

                const result = await blogSystem.createUserPost(1, postData);

                // Verificamos la integración del flujo de creación
                expect(result.post).toBeDefined();
                expect(result.post.title).toBe(postData.title);
                expect(result.author).toBeDefined();
                expect(result.authorEmail).toBeDefined();
                
                console.log('✓ Post creado exitosamente:', result.post.title);
                console.log('✓ Autor:', result.author);
            } catch (error) {
                console.warn('⚠ API real no disponible, saltando prueba:', error.message);
                expect(error.message).toContain('Error al crear');
            }
        }, 10000);
    });

    describe('Pruebas de Rendimiento del Sistema Integrado', () => {
        let blogSystem;

        beforeEach(() => {
            jest.clearAllMocks();
            blogSystem = new BlogSystem();
        });

        test('Rendimiento: Múltiples operaciones simultáneas con stubs', async () => {
            // Simulamos carga alta en el sistema
            const mockUsers = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                name: `Usuario ${i + 1}`,
                email: `user${i + 1}@test.com`
            }));

            const mockPosts = Array.from({ length: 3 }, (_, i) => ({
                id: i + 1,
                title: `Post ${i + 1}`,
                userId: 1
            }));

            // Configuramos stubs para múltiples llamadas simultáneas
            mockedAxios.get.mockImplementation((url) => {
                if (url.includes('/users/')) {
                    return Promise.resolve({ data: mockUsers[0] });
                }
                if (url.includes('posts?userId=')) {
                    return Promise.resolve({ data: mockPosts });
                }
                return Promise.resolve({ data: mockUsers });
            });

            const startTime = Date.now();

            // Ejecutamos múltiples operaciones en paralelo
            const promises = [
                blogSystem.getUserProfile(1),
                blogSystem.getUserProfile(2),
                blogSystem.getUserProfile(3),
                blogSystem.getBlogStats()
            ];

            const results = await Promise.all(promises);
            const endTime = Date.now();
            const executionTime = endTime - startTime;

            // Verificamos que el sistema maneja múltiples operaciones correctamente
            expect(results).toHaveLength(4);
            expect(executionTime).toBeLessThan(5000); // Debe completarse en menos de 5 segundos
            
            console.log('✓ Múltiples operaciones completadas en:', executionTime, 'ms');
        });
    });
});