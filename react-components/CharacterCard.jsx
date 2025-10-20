import React, { useState, useEffect } from 'react';
import './CharacterCard.css';

/**
 * Componente CharacterCard
 * 
 * Este componente consume la API de Rick and Morty para mostrar información de un personaje.
 * Se diseñó con manejo explícito de estados para proporcionar una buena experiencia de usuario
 * y facilitar las pruebas automatizadas.
 * 
 * @param {number} characterId - ID del personaje a mostrar (por defecto 1)
 * 
 * Decisiones de diseño:
 * - Tres estados separados (loading, error, character) para control granular de la UI
 * - Valor por defecto para characterId para evitar errores si no se proporciona
 * - Función fetchCharacter separada para reutilización y testing más fácil
 */
const CharacterCard = ({ characterId = 1 }) => {
  // Estados separados para manejar diferentes escenarios de la aplicación
  // Esto permite mostrar UIs específicas para cada estado y testear cada uno independientemente
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Función para obtener datos del personaje desde la API
   * 
   * Se extrajo como función separada por las siguientes razones:
   * 1. Reutilización: Puede ser llamada tanto en useEffect como en handleRefresh
   * 2. Testing: Facilita el testing de la lógica de fetch de manera aislada
   * 3. Mantenibilidad: Lógica de API centralizada en un solo lugar
   * 4. Manejo de errores: Control explícito de todos los estados posibles
   * 
   * @param {number} id - ID del personaje a obtener
   */
  const fetchCharacter = async (id) => {
    try {
      // Resetear estados al inicio de cada llamada para evitar estados inconsistentes
      setLoading(true);
      setError(null);
      
      // Llamada a la API de Rick and Morty
      // Se usa template literal para construir la URL de manera clara
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      
      // Verificación explícita del status HTTP
      // fetch() no rechaza automáticamente para códigos 4xx/5xx
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setCharacter(data);
    } catch (err) {
      // Captura tanto errores de red como errores de respuesta HTTP
      setError(err.message);
    } finally {
      // Siempre se ejecuta, independientemente de éxito o error
      // Asegura que el loading se desactive en todos los casos
      setLoading(false);
    }
  };

  /**
   * Hook useEffect para cargar datos al montar el componente o cuando cambia characterId
   * 
   * Se incluye characterId en el array de dependencias para que el componente
   * reaccione automáticamente a cambios en las props, lo cual es esencial para
   * casos donde el padre cambia el ID del personaje a mostrar.
   */
  useEffect(() => {
    fetchCharacter(characterId);
  }, [characterId]);

  /**
   * Handler para el botón de actualización/reintento
   * 
   * Se crea como función separada en lugar de llamar directamente fetchCharacter
   * para mantener consistencia en el naming y facilitar el testing mediante data-testid
   */
  const handleRefresh = () => {
    fetchCharacter(characterId);
  };

  // Renderizado condicional basado en estados
  // Se evalúan en orden de prioridad: loading -> error -> empty -> success
  
  /**
   * Estado de carga
   * 
   * Se muestra mientras se está obteniendo información de la API.
   * Incluye data-testid para facilitar testing automatizado.
   */
  if (loading) {
    return (
      <div className="character-card loading" data-testid="loading">
        <p>Cargando personaje...</p>
      </div>
    );
  }

  /**
   * Estado de error
   * 
   * Se muestra cuando hay problemas con la API (red, HTTP errors, etc.).
   * Incluye botón de reintento para mejorar UX y permitir recuperación sin reload.
   */
  if (error) {
    return (
      <div className="character-card error" data-testid="error">
        <p>Error: {error}</p>
        <button onClick={handleRefresh} data-testid="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  /**
   * Estado vacío
   * 
   * Se muestra cuando la API responde exitosamente pero sin datos.
   * Esto puede ocurrir si la API devuelve null o undefined.
   */
  if (!character) {
    return (
      <div className="character-card empty" data-testid="empty">
        <p>No se encontró el personaje</p>
      </div>
    );
  }

  /**
   * Función helper para determinar el color del indicador de estado
   * 
   * Se extrajo como función separada para:
   * 1. Reutilización: Lógica centralizada para colores de estado
   * 2. Mantenibilidad: Fácil modificación de colores sin buscar en JSX
   * 3. Testing: Permite testear la lógica de colores de manera aislada
   * 4. Legibilidad: JSX más limpio sin lógica condicional compleja
   * 
   * @param {string} status - Estado del personaje (Alive, Dead, unknown)
   * @returns {string} Color hex para el indicador
   */
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return '#55cc44'; // Verde para vivo
      case 'dead':
        return '#d63d2e'; // Rojo para muerto
      default:
        return '#9e9e9e'; // Gris para desconocido o cualquier otro estado
    }
  };

  /**
   * Renderizado principal del componente
   * 
   * Estructura del JSX organizada en secciones lógicas:
   * 1. Imagen del personaje
   * 2. Información básica (nombre, estado)
   * 3. Detalles adicionales
   * 4. Botón de actualización
   * 
   * Todos los elementos importantes incluyen data-testid para testing
   */
  return (
    <div className="character-card" data-testid="character-card">
      {/* Sección de imagen */}
      <div className="character-image">
        <img 
          src={character.image} 
          alt={character.name} // Alt text para accesibilidad
          data-testid="character-image"
        />
      </div>
      
      <div className="character-info">
        {/* Nombre del personaje como título principal */}
        <h2 data-testid="character-name">{character.name}</h2>
        
        {/* Indicador visual de estado con color dinámico */}
        <div className="character-status">
          <span 
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(character.status) }}
            data-testid="status-indicator"
          ></span>
          <span data-testid="character-status">
            {character.status} - {character.species}
          </span>
        </div>

        {/* Detalles del personaje en formato clave-valor */}
        <div className="character-details">
          <div className="detail-item">
            <span className="label">Género:</span>
            <span data-testid="character-gender">{character.gender}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Origen:</span>
            {/* Optional chaining y fallback para datos que pueden no existir */}
            <span data-testid="character-origin">{character.origin?.name || 'Desconocido'}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Última ubicación:</span>
            <span data-testid="character-location">{character.location?.name || 'Desconocida'}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Episodios:</span>
            {/* Manejo seguro de arrays que pueden no existir */}
            <span data-testid="character-episodes">{character.episode?.length || 0}</span>
          </div>
        </div>

        {/* Botón de actualización para recargar datos */}
        <button 
          onClick={handleRefresh}
          className="refresh-button"
          data-testid="refresh-button"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default CharacterCard;