import React from 'react';
import './Button.css';

function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
}) {
    return (
        <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`btn btn-${variant} ${className}`}
        >
    {loading ? '⏳ Lädt...' : children}
</button>
    );
}

export default Button;