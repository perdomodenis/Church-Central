import React from "react";
import "./Card.css";

function Card({
    title,
    children,
    footer,
    className = "",
}) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

export default Card;