import React from 'react';
import './Button.css';

function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
}) {
    return (
        <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={buttonClass}
        >
        {children}
        </button>
    );
}

export default Button;