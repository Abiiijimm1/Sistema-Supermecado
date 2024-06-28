import React from 'react';
import '../App.css';
import imagen from '../assets/product.png';

const Card = ({ nombre, precio, descripcion, agregarAlCarrito, agregado }) => {
  return (
    <div className='card display-column mg-5'>
      <section>
        <img src={imagen} className='img-product' alt="Producto"></img>
      </section>
      <section className='pd-10'>
        <h3>{nombre}</h3>
        <h4>${parseFloat(precio).toFixed(2)}</h4> {/* Asegurar que el precio sea un número */}
        <label>{descripcion}</label>
        <button 
          className={`card-button ${agregado ? 'agregado' : ''}`} 
          onClick={agregarAlCarrito}
          disabled={agregado}
        >
          {agregado ? 'Agregado' : 'Agregar'}
        </button>
      </section>
    </div>
  );
}

export default Card;

