import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CharacterCard from './CharacterCard';

/**
 * CONFIGURACIÓN Y MOCKS
 * 
 * Se configura el entorno de testing antes de las pruebas.
 * El mock de fetch es necesario porque Jest no incluye fetch nativamente
 * y necesitamos controlar las respuestas de la API para testing determinístico.
 */

// Mock global de fetch para controlar las respuestas HTTP en las pruebas
// Se hace global para que esté disponible en todos los tests
global.fetch = jest.fn();

/**
 * DATOS DE PRUEBA
 * 
 * Se definen objetos mock que simulan las respuestas de la API de Rick and Morty.
 * Estos datos permiten testing predecible y no dependen de la disponibilidad
 * de servicios externos durante la ejecución de las pruebas.
 */

// Datos de prueba que simulan una respuesta exitosa de la API
const mockCharacterData = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: {
    name: "Earth (C-137)",
    url: "https://rickandmortyapi.com/api/location/1"
  },
  location: {
    name: "Citadel of Ricks",
    url: "https://rickandmortyapi.com/api/location/3"
  },
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2"
  ],
  url: "https://rickandmortyapi.com/api/character/1",
  created: "2017-11-04T18:48:46.250Z"
};

// Variaciones de datos para testear diferentes estados
const mockDeadCharacter = {
  ...mockCharacterData,
  id: 2,
  name: "Morty Smith",
  status: "Dead",
  species: "Human",
  gender: "Male"
};

const mockUnknownCharacter = {
  ...mockCharacterData,
  id: 3,
  name: "Summer Smith",
  status: "unknown",
  species: "Human",
  gender: "Female"
};

/**
 * SUITE PRINCIPAL DE PRUEBAS
 * 
 * Las pruebas están organizadas en grupos lógicos usando describe().
 * Cada grupo testea un aspecto específico del componente, lo que facilita
 * el mantenimiento y la comprensión de qué funcionalidad está siendo probada.
 */
describe('CharacterCard Component', () => {
  
  /**
   * beforeEach se ejecuta antes de cada prueba individual
   * 
   * Se usa para limpiar el estado de los mocks entre pruebas,
   * garantizando que cada test comience con un estado limpio
   * y no se vea afectado por pruebas anteriores.
   */
  beforeEach(() => {
    fetch.mockClear();
  });

  /**
   * GRUPO 1: ESTADOS DE CARGA
   * 
   * Verifica que el componente muestre correctamente el estado de carga
   * mientras espera respuesta de la API. Es importante testear esto porque
   * mejora la UX al mostrar feedback visual al usuario.
   */
  describe('Estados de Carga', () => {
    
    test('muestra estado de carga inicialmente', () => {
      // Simular una respuesta que tarda en resolverse
      // Esto permite capturar el estado de carga antes de que se complete
      fetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<CharacterCard characterId={1} />);
      
      // Verificar que se muestra el estado de carga
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Cargando personaje...')).toBeInTheDocument();
    });

  });

  /**
   * GRUPO 2: MANEJO DE DATOS EXITOSOS
   * 
   * Verifica que cuando la API responde exitosamente, el componente
   * renderiza correctamente todos los datos. Se testean tanto la presencia
   * de elementos como su contenido específico.
   */
  describe('Manejo de Datos Exitosos', () => {
    
    test('renderiza correctamente los datos del personaje', async () => {
      // Mock de una respuesta exitosa de la API
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacterData,
      });

      render(<CharacterCard characterId={1} />);

      // waitFor es crucial para operaciones asíncronas
      // Espera hasta que el elemento aparezca en el DOM después de la carga
      await waitFor(() => {
        expect(screen.getByTestId('character-card')).toBeInTheDocument();
      });

      // Verificar que todos los datos se muestran correctamente
      // Se verifica tanto la presencia como el contenido exacto
      expect(screen.getByTestId('character-name')).toHaveTextContent('Rick Sanchez');
      expect(screen.getByTestId('character-status')).toHaveTextContent('Alive - Human');
      expect(screen.getByTestId('character-gender')).toHaveTextContent('Male');
      expect(screen.getByTestId('character-origin')).toHaveTextContent('Earth (C-137)');
      expect(screen.getByTestId('character-location')).toHaveTextContent('Citadel of Ricks');
      expect(screen.getByTestId('character-episodes')).toHaveTextContent('2');
    });

    test('muestra la imagen del personaje con atributos correctos', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacterData,
      });

      render(<CharacterCard characterId={1} />);

      await waitFor(() => {
        const image = screen.getByTestId('character-image');
        expect(image).toBeInTheDocument();
        // Verificar atributos específicos importantes para accesibilidad y funcionalidad
        expect(image).toHaveAttribute('src', mockCharacterData.image);
        expect(image).toHaveAttribute('alt', mockCharacterData.name);
      });
    });

  });

  /**
   * GRUPO 3: INDICADORES DE ESTADO VISUAL
   * 
   * Testea la funcionalidad de mostrar diferentes colores según el estado del personaje.
   * Estos tests verifican tanto la lógica de negocio (qué color usar) como la 
   * implementación visual (aplicación correcta de estilos).
   */
  describe('Indicadores de Estado Visual', () => {
    
    test('muestra indicador verde para personaje vivo', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacterData, // status: "Alive"
      });

      render(<CharacterCard characterId={1} />);

      await waitFor(() => {
        const statusIndicator = screen.getByTestId('status-indicator');
        // Verificar que se aplica el color correcto mediante estilos inline
        expect(statusIndicator).toHaveStyle('background-color: #55cc44');
      });
    });

    test('muestra indicador rojo para personaje muerto', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeadCharacter, // status: "Dead"
      });

      render(<CharacterCard characterId={2} />);

      await waitFor(() => {
        const statusIndicator = screen.getByTestId('status-indicator');
        expect(statusIndicator).toHaveStyle('background-color: #d63d2e');
      });
    });

    test('muestra indicador gris para estado desconocido', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUnknownCharacter, // status: "unknown"
      });

      render(<CharacterCard characterId={3} />);

      await waitFor(() => {
        const statusIndicator = screen.getByTestId('status-indicator');
        expect(statusIndicator).toHaveStyle('background-color: #9e9e9e');
      });
    });

  });

  /**
   * GRUPO 4: MANEJO DE ERRORES
   * 
   * Verifica que el componente maneja correctamente los diferentes tipos de errores
   * que pueden ocurrir al consumir una API externa. Esto incluye errores de red,
   * respuestas HTTP no exitosas, y la capacidad de recuperación.
   */
  describe('Manejo de Errores', () => {
    
    test('muestra mensaje de error cuando falla la API', async () => {
      // Simular un error de red o JavaScript
      fetch.mockRejectedValueOnce(new Error('Network Error'));

      render(<CharacterCard characterId={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.getByText('Error: Network Error')).toBeInTheDocument();
        expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      });
    });

    test('muestra error cuando la respuesta no es exitosa', async () => {
      // Simular una respuesta HTTP no exitosa (4xx, 5xx)
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404, // Personaje no encontrado
      });

      render(<CharacterCard characterId={999} />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.getByText('Error: Error: 404')).toBeInTheDocument();
      });
    });

  });

  /**
   * GRUPO 5: FUNCIONALIDAD DE ACTUALIZACIÓN
   * 
   * Testea la capacidad del componente de recargar datos cuando el usuario
   * interactúa con los botones de actualización/reintento. Esto es crucial
   * para una buena UX en caso de errores transitorios o datos desactualizados.
   */
  describe('Funcionalidad de Actualización', () => {
    
    test('botón de actualizar recarga los datos del personaje', async () => {
      // Configurar dos respuestas diferentes para simular actualización de datos
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCharacterData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCharacterData, name: "Rick Sanchez Updated" }),
        });

      render(<CharacterCard characterId={1} />);

      // Esperar carga inicial
      await waitFor(() => {
        expect(screen.getByTestId('character-name')).toHaveTextContent('Rick Sanchez');
      });

      // Simular click del usuario en el botón de actualizar
      const refreshButton = screen.getByTestId('refresh-button');
      fireEvent.click(refreshButton);

      // Verificar que se muestra el estado de carga durante la actualización
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Esperar nueva carga con datos actualizados
      await waitFor(() => {
        expect(screen.getByTestId('character-name')).toHaveTextContent('Rick Sanchez Updated');
      });

      // Verificar que fetch se llamó exactamente dos veces
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    test('botón de reintentar funciona después de un error', async () => {
      // Simular primero un error, luego una respuesta exitosa
      fetch
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCharacterData,
        });

      render(<CharacterCard characterId={1} />);

      // Esperar que aparezca el error inicial
      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });

      // Simular click en botón de reintento
      const retryButton = screen.getByTestId('retry-button');
      fireEvent.click(retryButton);

      // Verificar transición a estado de carga
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Esperar carga exitosa después del reintento
      await waitFor(() => {
        expect(screen.getByTestId('character-card')).toBeInTheDocument();
        expect(screen.getByTestId('character-name')).toHaveTextContent('Rick Sanchez');
      });
    });

  });

  /**
   * GRUPO 6: LLAMADAS A LA API
   * 
   * Verifica que el componente hace las llamadas HTTP correctas a la API.
   * Esto incluye URLs correctas, parámetros apropiados, y comportamiento
   * reactivo ante cambios de props.
   */
  describe('Llamadas a la API', () => {
    
    test('hace la llamada correcta a la API con el ID proporcionado', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacterData,
      });

      render(<CharacterCard characterId={5} />);

      await waitFor(() => {
        // Verificar que fetch fue llamado con la URL correcta
        expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/5');
      });
    });

    test('usa ID por defecto cuando no se proporciona characterId', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacterData,
      });

      // Renderizar sin prop characterId para testear valor por defecto
      render(<CharacterCard />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');
      });
    });

    test('actualiza cuando cambia el characterId', async () => {
      // Configurar respuestas para dos personajes diferentes
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCharacterData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCharacterData, id: 2, name: "Morty Smith" }),
        });

      // render con rerender permite cambiar props durante el test
      const { rerender } = render(<CharacterCard characterId={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('character-name')).toHaveTextContent('Rick Sanchez');
      });

      // Cambiar el ID del personaje para testear reactividad
      rerender(<CharacterCard characterId={2} />);

      await waitFor(() => {
        expect(screen.getByTestId('character-name')).toHaveTextContent('Morty Smith');
      });

      // Verificar que se hicieron dos llamadas distintas
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1, 'https://rickandmortyapi.com/api/character/1');
      expect(fetch).toHaveBeenNthCalledWith(2, 'https://rickandmortyapi.com/api/character/2');
    });

  });

  /**
   * GRUPO 7: CASOS EDGE
   * 
   * Testea escenarios poco comunes pero posibles que podrían causar errores
   * si no se manejan correctamente. Estos tests aumentan la robustez del componente.
   */
  describe('Casos Edge', () => {
    
    test('maneja datos incompletos del personaje', async () => {
      // Simular respuesta con datos parciales o faltantes
      const incompleteCharacter = {
        id: 1,
        name: "Test Character",
        status: "Alive",
        species: "Human",
        gender: "Male",
        // origin y location intencionalmente omitidos
        image: "https://test.com/image.jpg",
        episode: [] // Array vacío
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => incompleteCharacter,
      });

      render(<CharacterCard characterId={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('character-name')).toHaveTextContent('Test Character');
        // Verificar que los fallbacks funcionan correctamente
        expect(screen.getByTestId('character-origin')).toHaveTextContent('Desconocido');
        expect(screen.getByTestId('character-location')).toHaveTextContent('Desconocida');
        expect(screen.getByTestId('character-episodes')).toHaveTextContent('0');
      });
    });

    test('muestra estado vacío cuando character es null', async () => {
      // Simular API que responde con null (caso posible aunque raro)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      render(<CharacterCard characterId={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('empty')).toBeInTheDocument();
        expect(screen.getByText('No se encontró el personaje')).toBeInTheDocument();
      });
    });

  });

  /**
   * GRUPO 8: ACCESIBILIDAD
   * 
   * Verifica que el componente cumple con estándares básicos de accesibilidad.
   * Esto es importante para usuarios con discapacidades y para SEO.
   */
  describe('Accesibilidad', () => {
    
    test('todos los elementos interactivos tienen roles y labels apropiados', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacterData,
      });

      render(<CharacterCard characterId={1} />);

      await waitFor(() => {
        // Verificar que botones son elementos button reales
        const refreshButton = screen.getByTestId('refresh-button');
        expect(refreshButton).toBeInTheDocument();
        expect(refreshButton.tagName).toBe('BUTTON');
        
        // Verificar que imágenes tienen texto alternativo
        const image = screen.getByTestId('character-image');
        expect(image).toHaveAttribute('alt', mockCharacterData.name);
      });
    });

  });

  /**
   * GRUPO 9: INTEGRACIÓN REAL (OPCIONAL)
   * 
   * Test marcado como skip que permite probar contra la API real.
   * Útil para verificar que la integración funciona, pero no se ejecuta
   * en CI/CD para evitar dependencias externas.
   */
  describe('Integración Real de la API (Opcional)', () => {
    
    test.skip('puede hacer una llamada real a la API de Rick and Morty', async () => {
      // Restaurar fetch real solo para esta prueba
      fetch.mockRestore();
      
      render(<CharacterCard characterId={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('character-card')).toBeInTheDocument();
      }, { timeout: 5000 }); // Timeout mayor para llamadas reales

      // Verificar que se muestran datos reales de la API
      expect(screen.getByTestId('character-name')).toBeInTheDocument();
      expect(screen.getByTestId('character-status')).toBeInTheDocument();
    });

  });

});