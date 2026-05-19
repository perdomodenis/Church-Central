import React from 'react';
import './Buttons.css';

function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
}) {
    const buttonClass = `button ${variant}`;

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
