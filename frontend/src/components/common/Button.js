import React from 'react';
import './Buttons.css';

function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
}) {
    const buttonClass = `button ${variant}`;

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
