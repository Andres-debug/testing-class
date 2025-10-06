import React, { useState } from 'react';

/**
 * Formulario de Contacto con validación básica
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSubmit - Función a ejecutar cuando se envía el formulario
 */
const ContactForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validaciones
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'El mensaje es requerido';
        } else if (formData.message.length < 10) {
            newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
        }

        return newErrors;
    };

    // Manejar cambios en inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo actual si existe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            if (onSubmit) {
                await onSubmit(formData);
            }
            
            // Limpiar formulario después de envío exitoso
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setErrors({ submit: 'Error al enviar el formulario' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div className="form-group">
                <label htmlFor="name">Nombre:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Ingresa tu nombre"
                />
                {errors.name && (
                    <span className="error-message" role="alert">
                        {errors.name}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="tu@email.com"
                />
                {errors.email && (
                    <span className="error-message" role="alert">
                        {errors.email}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="message">Mensaje:</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={errors.message ? 'error' : ''}
                    placeholder="Escribe tu mensaje aquí..."
                    rows="4"
                />
                {errors.message && (
                    <span className="error-message" role="alert">
                        {errors.message}
                    </span>
                )}
            </div>

            {errors.submit && (
                <div className="error-message" role="alert">
                    {errors.submit}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
        </form>
    );
};

export default ContactForm;