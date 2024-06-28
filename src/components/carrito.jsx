import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Carrito = ({ carrito, eliminarDelCarrito, modificarCantidad, usuario, sesion }) => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://172.168.2.149:4042/cliente');
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener los clientes desde el puerto 4042:', error);
        // Intentar con el puerto 4031
        try {
          const response = await axios.get('http://172.168.2.33:4042/cliente');
          setClientes(response.data);
        } catch (error4030) {
          console.error('Error al obtener los clientes desde el puerto 4031:', error4030);
        }
      }
    };

    fetchClientes();
  }, []);

  const handleClienteChange = (event) => {
    const clv_cliente = event.target.value;
    const cliente = clientes.find(c => c.clv_cliente === clv_cliente);
    setClienteSeleccionado(cliente);
  };

  const handleEliminar = (codigo_barras) => {
    eliminarDelCarrito(codigo_barras);
  };

  const handleCantidadChange = (codigo_barras, cantidad, cantidad_actual) => {
    if (cantidad > 0 && cantidad <= cantidad_actual) {
      modificarCantidad(codigo_barras, cantidad);
    } else {
      alert('No hay suficientes productos disponibles');
    }
  };

  const handleConfirmarVenta = async () => {
    if (!clienteSeleccionado) {
      alert('Seleccione un cliente antes de confirmar la venta');
      return;
    }

    const totalVenta = carrito.reduce((acc, producto) => acc + parseFloat(producto.precio) * producto.cantidad, 0).toFixed(2);
    const nuevaVenta = {
      folio_venta: `V${Date.now()}`,  // Generar un folio de venta único
      folio_sesion: sesion.folio_sesion,
      clv_cliente: clienteSeleccionado.clv_cliente,
      fecha_venta: new Date().toISOString().split('T')[0],  // Fecha actual en formato YYYY-MM-DD
      total_venta: totalVenta
    };

    try {
      const response = await axios.post('http://172.168.2.149:4044/venta/nueva_venta', nuevaVenta);
      const ventaCreada = response.data;
      console.log('Venta creada:', ventaCreada);

      for (const producto of carrito) {
        const detalleVenta = {
          folio_venta: nuevaVenta.folio_venta,
          codigo_barras: producto.codigo_barras,
          cantidad: producto.cantidad,
          precio_venta: producto.precio
        };

        console.log('Enviando detalle de venta:', detalleVenta);

        try {
          await axios.post('http://172.168.2.149:4046/detalle_venta', detalleVenta);
          console.log('Detalle de venta creado en puerto 4046:', detalleVenta);
        } catch (error) {
          console.error('Error al crear el detalle de venta en el puerto 4045:', error);
          // Intentar con el puerto 4035
          try {
            await axios.post('http://172.168.2.33:4046/detalle_venta', detalleVenta);
            console.log('Detalle de venta creado en puerto 4046:', detalleVenta);
          } catch (error4035) {
            console.error('Error al crear el detalle de venta en el puerto 4035:', error4035);
          }
        }
      }

      alert('Venta confirmada con éxito');
      // Aquí puedes agregar lógica adicional si es necesario, como limpiar el carrito
    } catch (error) {
      console.error('Error al confirmar la venta:', error);
      alert('Error al confirmar la venta');
    }
  };

  return (
    <div className='carrito-container'>
      <h2>Carrito de Compras</h2>
      {usuario && sesion && (
        <div>
          <p>Usuario: {usuario.nombre}</p>
          <p>Clave de Usuario: {usuario.clv_usuario}</p>
          <p>Folio de Sesión: {sesion.folio_sesion}</p>
        </div>
      )}

      <div>
        <h3>Seleccione un Cliente</h3>
        <select onChange={handleClienteChange} value={clienteSeleccionado?.clv_cliente || ''}>
          <option value="" disabled>Seleccione un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.clv_cliente} value={cliente.clv_cliente}>
              {cliente.nombre} {cliente.apellido1} {cliente.apellido2}
            </option>
          ))}
        </select>
        {clienteSeleccionado && (
          <div>
            <p>Cliente Seleccionado: {clienteSeleccionado.nombre} {clienteSeleccionado.apellido1} {clienteSeleccionado.apellido2}</p>
            <p>Clave Cliente: {clienteSeleccionado.clv_cliente}</p>
          </div>
        )}
      </div>

      {carrito.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <table className='carrito-tabla'>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((producto, index) => (
              <tr key={index}>
                <td>{producto.nombre}</td>
                <td>${parseFloat(producto.precio).toFixed(2)}</td> {/* Asegurar que el precio sea un número */}
                <td>
                  <input
                    type='number'
                    min='1'
                    value={producto.cantidad}
                    onChange={(e) => handleCantidadChange(producto.codigo_barras, parseInt(e.target.value), producto.cantidad_actual)}
                    className='cantidad-input'
                  />
                </td>
                <td>${(parseFloat(producto.precio) * producto.cantidad).toFixed(2)}</td> {/* Asegurar que el precio sea un número */}
                <td>
                  <button onClick={() => handleEliminar(producto.codigo_barras)} className='accion-button'>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>
        Total: ${carrito.reduce((acc, producto) => acc + parseFloat(producto.precio) * producto.cantidad, 0).toFixed(2)}
      </h3>
      <button onClick={handleConfirmarVenta} className='confirmar-button'>Confirmar Venta</button>
    </div>
  );
}

export default Carrito;

