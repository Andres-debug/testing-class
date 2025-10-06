import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

/**
 * PRUEBAS DE COMPONENTES REACT - EJEMPLO COMPLETO
 * 
 * Estas pruebas demuestran cómo probar componentes React usando:
 * - React Testing Library (render, screen, fireEvent)
 * - Jest (expect, describe, test)
 * - User Event (simulación de interacciones reales del usuario)
 */

describe('Button Component', () => {
    
    // ===============================================
    // PRUEBAS BÁSICAS DE RENDERIZADO
    // ===============================================
    describe('Renderizado básico', () => {
        
        test('Debe renderizar correctamente con texto', () => {
            // ARRANGE & ACT: Renderizamos el componente
            render(<Button>Click me</Button>);
            
            // ASSERT: Verificamos que se renderizó correctamente
            const button = screen.getByRole('button', { name: /click me/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent('Click me');
        });

        test('Debe aplicar las clases CSS correctas por defecto', () => {
            render(<Button>Test Button</Button>);
            
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn', 'btn--primary');
            expect(button).not.toHaveClass('btn--disabled');
        });

        test('Debe renderizar diferentes variantes correctamente', () => {
            const { rerender } = render(<Button variant="secondary">Secondary</Button>);
            
            let button = screen.getByRole('button');
            expect(button).toHaveClass('btn--secondary');
            
            // Cambiar variante usando rerender
            rerender(<Button variant="danger">Danger</Button>);
            button = screen.getByRole('button');
            expect(button).toHaveClass('btn--danger');
        });
    });

    // ===============================================
    // PRUEBAS DE INTERACCIÓN CON EVENTOS
    // ===============================================
    describe('Manejo de eventos', () => {
        
        test('Debe llamar onClick cuando se hace click', () => {
            // ARRANGE: Creamos un mock function para onClick
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);
            
            // ACT: Simulamos click del usuario
            const button = screen.getByRole('button');
            fireEvent.click(button);
            
            // ASSERT: Verificamos que se llamó la función
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        test('Debe llamar onClick con user-event (más realista)', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            
            render(<Button onClick={handleClick}>Click me</Button>);
            
            // ACT: Simulamos interacción real del usuario
            const button = screen.getByRole('button');
            await user.click(button);
            
            // ASSERT
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        test('NO debe llamar onClick cuando está disabled', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            
            render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
            
            const button = screen.getByRole('button');
            await user.click(button);
            
            // ASSERT: No se debe haber llamado onClick
            expect(handleClick).not.toHaveBeenCalled();
            expect(button).toBeDisabled();
        });
    });

    // ===============================================
    // PRUEBAS DE PROPIEDADES Y ESTADOS
    // ===============================================
    describe('Propiedades del componente', () => {
        
        test('Debe manejar la propiedad disabled correctamente', () => {
            render(<Button disabled>Disabled Button</Button>);
            
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('btn--disabled');
        });

        test('Debe aplicar clases CSS adicionales', () => {
            render(<Button className="custom-class">Custom Button</Button>);
            
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn', 'btn--primary', 'custom-class');
        });

        test('Debe pasar propiedades adicionales al elemento button', () => {
            render(<Button data-testid="my-button" aria-label="Custom label">Button</Button>);
            
            const button = screen.getByTestId('my-button');
            expect(button).toHaveAttribute('aria-label', 'Custom label');
        });
    });

    // ===============================================
    // PRUEBAS AVANZADAS CON MÚLTIPLES ESCENARIOS
    // ===============================================
    describe('Escenarios avanzados', () => {
        
        test('Debe manejar múltiples clicks correctamente', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            
            render(<Button onClick={handleClick}>Multi-click</Button>);
            
            const button = screen.getByRole('button');
            
            // ACT: Múltiples clicks
            await user.click(button);
            await user.click(button);
            await user.click(button);
            
            // ASSERT: Verificamos que se llamó 3 veces
            expect(handleClick).toHaveBeenCalledTimes(3);
        });

        test('Debe manejar cambio de props dinámicamente', () => {
            const handleClick = jest.fn();
            
            // ARRANGE: Renderizado inicial
            const { rerender } = render(
                <Button onClick={handleClick} variant="primary">
                    Dynamic Button
                </Button>
            );
            
            let button = screen.getByRole('button');
            expect(button).toHaveClass('btn--primary');
            expect(button).not.toBeDisabled();
            
            // ACT: Cambiar props
            rerender(
                <Button onClick={handleClick} variant="danger" disabled>
                    Dynamic Button
                </Button>
            );
            
            // ASSERT: Verificar cambios
            button = screen.getByRole('button');
            expect(button).toHaveClass('btn--danger', 'btn--disabled');
            expect(button).toBeDisabled();
        });

        test('Debe prevenir eventos cuando está disabled', () => {
            const handleClick = jest.fn();
            
            render(<Button onClick={handleClick} disabled>Disabled</Button>);
            
            const button = screen.getByRole('button');
            
            // ACT: Intentar hacer click en botón disabled
            fireEvent.click(button);
            
            // ASSERT: No debe llamarse onClick
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    // ===============================================
    // PRUEBAS DE ACCESIBILIDAD
    // ===============================================
    describe('Accesibilidad', () => {
        
        test('Debe tener el rol button correcto', () => {
            render(<Button>Accessible Button</Button>);
            
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        test('Debe ser navegable por teclado', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            
            render(<Button onClick={handleClick}>Keyboard Button</Button>);
            
            const button = screen.getByRole('button');
            
            // ACT: Navegar con teclado y presionar Enter
            await user.tab(); // Enfocar el botón
            expect(button).toHaveFocus();
            
            await user.keyboard('{Enter}');
            
            // ASSERT: Debe haberse llamado onClick
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        test('Debe manejar navegación con Space', async () => {
            const user = userEvent.setup();
            const handleClick = jest.fn();
            
            render(<Button onClick={handleClick}>Space Button</Button>);
            
            const button = screen.getByRole('button');
            button.focus();
            
            // ACT: Presionar barra espaciadora
            await user.keyboard(' ');
            
            // ASSERT
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    // ===============================================
    // PRUEBAS DE INTEGRACIÓN CON OTROS COMPONENTES
    // ===============================================
    describe('Integración con otros componentes', () => {
        
        test('Debe funcionar dentro de un formulario', () => {
            const handleSubmit = jest.fn();
            
            render(
                <form onSubmit={handleSubmit}>
                    <Button type="submit">Submit</Button>
                </form>
            );
            
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'submit');
            
            // Simular submit del formulario
            fireEvent.click(button);
            
            // Nota: En un caso real, aquí verificarías el comportamiento del formulario
            expect(button).toBeInTheDocument();
        });

        test('Debe renderizar contenido complejo como children', () => {
            render(
                <Button>
                    <span>Icon</span>
                    <span>Text</span>
                </Button>
            );
            
            const button = screen.getByRole('button');
            expect(button).toContainHTML('<span>Icon</span><span>Text</span>');
        });
    });
});

/**
 * RESUMEN DE CONCEPTOS DE REACT TESTING LIBRARY:
 * 
 * 1. RENDERING:
 *    - render() = Renderiza el componente en un DOM virtual
 *    - rerender() = Re-renderiza con nuevas props
 *    - screen = Objeto para buscar elementos en el DOM
 * 
 * 2. QUERIES (Búsquedas):
 *    - getByRole() = Busca por rol ARIA (más accesible)
 *    - getByText() = Busca por texto visible
 *    - getByTestId() = Busca por data-testid (último recurso)
 * 
 * 3. EVENTS:
 *    - fireEvent = Eventos básicos del DOM
 *    - userEvent = Simulación más realista de interacciones del usuario
 * 
 * 4. ASSERTIONS:
 *    - toBeInTheDocument() = Verifica que el elemento existe
 *    - toHaveClass() = Verifica clases CSS
 *    - toBeDisabled() = Verifica estado disabled
 *    - toHaveFocus() = Verifica que tiene el foco
 * 
 * 5. MEJORES PRÁCTICAS:
 *    - Probar comportamiento, no implementación
 *    - Usar queries accesibles (getByRole)
 *    - Simular interacciones reales del usuario
 *    - Probar casos edge (disabled, errores, etc.)
 */