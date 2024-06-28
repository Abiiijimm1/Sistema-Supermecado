import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(true);

  const servidor = "http://172.168.2.149:4042/cliente";

  useEffect(() => {
    llamadaApi();
  }, []);

  const llamadaApi = async () => {
    try {
      const response = await fetch(servidor);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setClientes(data);
      setFetching(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching:', error);
      setError('Error al obtener los datos');
      setFetching(false);
    }
  };

  const agregarCliente = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar Cliente',
      html: `
        <input id="clv_cliente" class="swal2-input" placeholder="Clave Cliente">
        <input id="nombre" class="swal2-input" placeholder="Nombre">
        <input id="apellido1" class="swal2-input" placeholder="Apellido Paterno">
        <input id="apellido2" class="swal2-input" placeholder="Apellido Materno">
        <input id="telefono" class="swal2-input" placeholder="Teléfono">
        <input id="correo" class="swal2-input" placeholder="Correo">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          clv_cliente: document.getElementById('clv_cliente').value,
          nombre: document.getElementById('nombre').value,
          apellido1: document.getElementById('apellido1').value,
          apellido2: document.getElementById('apellido2').value,
          telefono: document.getElementById('telefono').value,
          correo: document.getElementById('correo').value,
        };
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`${servidor}/nuevo_cliente`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValues)
        });
        if (!response.ok) {
          throw new Error('Error al agregar cliente');
        }
        llamadaApi();
        Swal.fire('Cliente agregado', '', 'success');
      } catch (error) {
        console.error('Error agregando cliente:', error);
        Swal.fire('Error', 'No se pudo agregar el cliente', 'error');
      }
    }
  };

  const editarCliente = async (cliente) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Cliente',
      html: `
        <input id="clv_cliente" class="swal2-input" placeholder="Clave Cliente" value="${cliente.clv_cliente}" disabled>
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${cliente.nombre}">
        <input id="apellido1" class="swal2-input" placeholder="Apellido Paterno" value="${cliente.apellido1}">
        <input id="apellido2" class="swal2-input" placeholder="Apellido Materno" value="${cliente.apellido2}">
        <input id="telefono" class="swal2-input" placeholder="Teléfono" value="${cliente.telefono}">
        <input id="correo" class="swal2-input" placeholder="Correo" value="${cliente.correo}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          clv_cliente: cliente.clv_cliente,
          nombre: document.getElementById('nombre').value,
          apellido1: document.getElementById('apellido1').value,
          apellido2: document.getElementById('apellido2').value,
          telefono: document.getElementById('telefono').value,
          correo: document.getElementById('correo').value,
        };
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`${servidor}/actualizar_cliente/${cliente.clv_cliente}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValues)
        });
        if (!response.ok) {
          throw new Error('Error al editar cliente');
        }
        llamadaApi();
        Swal.fire('Cliente editado', '', 'success');
      } catch (error) {
        console.error('Error editando cliente:', error);
        Swal.fire('Error', 'No se pudo editar el cliente', 'error');
      }
    }
  };

  const eliminarCliente = async (id) => {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${servidor}/eliminar_cliente/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Error al eliminar cliente');
        }
        llamadaApi();
        Swal.fire('Eliminado!', 'El cliente ha sido eliminado.', 'success');
      } catch (error) {
        console.error('Error eliminando cliente:', error);
        Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
      }
    }
  };

  if (fetching) {
    return <p>Cargando clientes...</p>;
  }

  if (error) {
    return <p>Error al cargar clientes: {error}</p>;
  }

  return (
    <div>
      <h1>Clientes</h1>
      <button onClick={agregarCliente}>Agregar Cliente</button>
      <div className='tabla'>
        <table className="table">
          <thead>
            <tr>
              <th>Clave Cliente</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.clv_cliente}>
                <td>{cliente.clv_cliente}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido1}</td>
                <td>{cliente.apellido2}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correo}</td>
                <td>
                  <button onClick={() => editarCliente(cliente)}>Editar</button>
                  <button onClick={() => eliminarCliente(cliente.clv_cliente)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cliente;
