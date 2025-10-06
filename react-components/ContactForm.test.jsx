import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

/**
 * PRUEBAS PUNTUALES DEL FORMULARIO DE CONTACTO
 */

describe('ContactForm - Pruebas Puntuales', () => {

    // ===============================================
    // PRUEBA 1: Renderizado inicial correcto
    // ===============================================
    test('Debe renderizar todos los campos del formulario', () => {
        render(<ContactForm />);
        
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    // ===============================================
    // PRUEBA 2: Validación de campos requeridos
    // ===============================================
    test('Debe mostrar errores cuando se envía el formulario vacío', async () => {
        render(<ContactForm />);
        
        const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
        
        // Intentar enviar formulario vacío
        fireEvent.click(submitButton);
        
        // Verificar que aparezcan los mensajes de error
        await waitFor(() => {
            expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
            expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
            expect(screen.getByText(/el mensaje es requerido/i)).toBeInTheDocument();
        });
    });

    // ===============================================
    // PRUEBA 3: Validación de email
    // ===============================================
    test('Debe mostrar error con email inválido', async () => {
        const user = userEvent.setup();
        render(<ContactForm />);
        
        const emailInput = screen.getByLabelText(/email/i);
        const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
        
        // Escribir email inválido
        await user.type(emailInput, 'email-invalido');
        await user.click(submitButton);
        
        // Verificar mensaje de error específico
        await waitFor(() => {
            expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
        });
    });

    // ===============================================
    // PRUEBA 4: Envío exitoso del formulario
    // ===============================================
    test('Debe enviar el formulario correctamente con datos válidos', async () => {
        const user = userEvent.setup();
        const mockOnSubmit = jest.fn().mockResolvedValue();
        
        render(<ContactForm onSubmit={mockOnSubmit} />);
        
        // Llenar formulario con datos válidos
        await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
        await user.type(screen.getByLabelText(/email/i), 'juan@email.com');
        await user.type(screen.getByLabelText(/mensaje/i), 'Este es un mensaje de prueba largo');
        
        // Enviar formulario
        await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
        
        // Verificar que se llamó onSubmit con los datos correctos
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                name: 'Juan Pérez',
                email: 'juan@email.com',
                message: 'Este es un mensaje de prueba largo'
            });
        });
    });

    // ===============================================
    // PRUEBA 5: Estado de carga durante envío
    // ===============================================
    test('Debe mostrar estado de carga durante el envío', async () => {
        const user = userEvent.setup();
        
        // Mock que simula delay en el envío
        const mockOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
        
        render(<ContactForm onSubmit={mockOnSubmit} />);
        
        // Llenar y enviar formulario
        await user.type(screen.getByLabelText(/nombre/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), 'test@email.com');
        await user.type(screen.getByLabelText(/mensaje/i), 'Mensaje de prueba');
        
        const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
        await user.click(submitButton);
        
        // Verificar estado de carga
        expect(screen.getByText(/enviando/i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
        
        // Esperar a que termine el envío
        await waitFor(() => {
            expect(screen.getByText(/enviar mensaje/i)).toBeInTheDocument();
        });
    });

    // ===============================================
    // PRUEBA 6: Limpieza de errores al escribir
    // ===============================================
    test('Debe limpiar errores cuando el usuario empieza a escribir', async () => {
        const user = userEvent.setup();
        render(<ContactForm />);
        
        // Generar error
        const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
        await user.click(submitButton);
        
        // Verificar que existe el error
        await waitFor(() => {
            expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
        });
        
        // Empezar a escribir en el campo
        const nameInput = screen.getByLabelText(/nombre/i);
        await user.type(nameInput, 'J');
        
        // El error debe desaparecer
        expect(screen.queryByText(/el nombre es requerido/i)).not.toBeInTheDocument();
    });

    // ===============================================
    // PRUEBA 7: Validación de longitud mínima del mensaje
    // ===============================================
    test('Debe rechazar mensajes muy cortos', async () => {
        const user = userEvent.setup();
        render(<ContactForm />);
        
        await user.type(screen.getByLabelText(/nombre/i), 'Test');
        await user.type(screen.getByLabelText(/email/i), 'test@email.com');
        await user.type(screen.getByLabelText(/mensaje/i), 'Corto'); // Menos de 10 caracteres
        
        await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
        
        await waitFor(() => {
            expect(screen.getByText(/el mensaje debe tener al menos 10 caracteres/i)).toBeInTheDocument();
        });
    });

    // ===============================================
    // PRUEBA 8: Manejo de errores en el envío
    // ===============================================
    test('Debe manejar errores del servidor', async () => {
        const user = userEvent.setup();
        const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Error del servidor'));
        
        render(<ContactForm onSubmit={mockOnSubmit} />);
        
        // Llenar formulario correctamente
        await user.type(screen.getByLabelText(/nombre/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), 'test@email.com');
        await user.type(screen.getByLabelText(/mensaje/i), 'Mensaje válido de prueba');
        
        await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
        
        // Verificar mensaje de error
        await waitFor(() => {
            expect(screen.getByText(/error al enviar el formulario/i)).toBeInTheDocument();
        });
    });
});

/**
 * RESUMEN DE LO QUE PROBAMOS:
 * 
 * ✅ Renderizado inicial
 * ✅ Validación de campos requeridos
 * ✅ Validación de formato de email
 * ✅ Envío exitoso con datos válidos
 * ✅ Estado de carga durante envío
 * ✅ Limpieza de errores al escribir
 * ✅ Validación de longitud mínima
 * ✅ Manejo de errores del servidor
 * 
 * Estas 8 pruebas cubren los aspectos más importantes
 * del formulario sin ser demasiado extensas.
 */