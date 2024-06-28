import React from 'react'

const lista = ({imagen,nombre,precio}) => {
  return (
    <div className='lista wi-100 mg-bottom border box-shadow'>
        <section>
            <img className='imagen-lista' src={imagen}/>
        </section>
        <section className='contenido'>
            <h2>{nombre}</h2>
            <label>$ {precio}</label>
        </section>
        <img/>
    </div>
  )
}

export default lista
