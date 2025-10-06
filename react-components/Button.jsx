import React from 'react';

/**
 * Componente Button básico para demostrar pruebas de React
 * @param {Object} props - Propiedades del componente
 * @param {string} props.children - Texto del botón
 * @param {Function} props.onClick - Función a ejecutar al hacer click
 * @param {string} props.variant - Tipo de botón: 'primary', 'secondary', 'danger'
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.className - Clases CSS adicionales
 */
const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    disabled = false, 
    className = '',
    ...props 
}) => {
    const baseClass = 'btn';
    const variantClass = `btn--${variant}`;
    const disabledClass = disabled ? 'btn--disabled' : '';
    
    const handleClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            className={`${baseClass} ${variantClass} ${disabledClass} ${className}`.trim()}
            onClick={handleClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;