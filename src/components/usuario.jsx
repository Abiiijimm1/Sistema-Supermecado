import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './usuario.css';


const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(true);

  const apiUrl = 'http://172.168.2.149:4040/usuario';

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsuarios(data);
      setFetching(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      setError('No se pudieron obtener los usuarios');
      setFetching(false);
    }
  };

  const agregarUsuario = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar Usuario',
      html: `
        <input id="clv_usuario" class="swal2-input" placeholder="Clave Usuario">
        <input id="nombre" class="swal2-input" placeholder="Nombre">
        <input id="apellido1" class="swal2-input" placeholder="Apellido Paterno">
        <input id="apellido2" class="swal2-input" placeholder="Apellido Materno">
        <input id="telefono" class="swal2-input" placeholder="Teléfono">
        <input id="correo" class="swal2-input" placeholder="Correo">
        <input id="direccion" class="swal2-input" placeholder="Dirección">
        <input id="id_rol" class="swal2-input" placeholder="ID Rol">
        <input id="contrasenia" class="swal2-input" placeholder="Contraseña">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          clv_usuario: document.getElementById('clv_usuario').value,
          nombre: document.getElementById('nombre').value,
          apellido1: document.getElementById('apellido1').value,
          apellido2: document.getElementById('apellido2').value,
          telefono: document.getElementById('telefono').value,
          correo: document.getElementById('correo').value,
          direccion: document.getElementById('direccion').value,
          id_rol: document.getElementById('id_rol').value,
          contrasenia: document.getElementById('contrasenia').value,
        };
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`${apiUrl}/nuevo_usuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValues)
        });
        if (!response.ok) {
          throw new Error('Error al agregar usuario');
        }
        obtenerUsuarios();
        Swal.fire('Usuario agregado', '', 'success');
      } catch (error) {
        console.error('Error agregando usuario:', error);
        Swal.fire('Error', 'No se pudo agregar el usuario', 'error');
      }
    }
  };

  const editarUsuario = async (usuario) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html: `
        <input id="clv_usuario" class="swal2-input" placeholder="Clave Usuario" value="${usuario.clv_usuario}" disabled>
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${usuario.nombre}">
        <input id="apellido1" class="swal2-input" placeholder="Apellido Paterno" value="${usuario.apellido1}">
        <input id="apellido2" class="swal2-input" placeholder="Apellido Materno" value="${usuario.apellido2}">
        <input id="telefono" class="swal2-input" placeholder="Teléfono" value="${usuario.telefono}">
        <input id="correo" class="swal2-input" placeholder="Correo" value="${usuario.correo}">
        <input id="direccion" class="swal2-input" placeholder="Dirección" value="${usuario.direccion}">
        <input id="id_rol" class="swal2-input" placeholder="ID Rol" value="${usuario.id_rol}">
        <input id="contrasenia" class="swal2-input" placeholder="Contraseña" value="${usuario.contrasenia}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          clv_usuario: usuario.clv_usuario,
          nombre: document.getElementById('nombre').value,
          apellido1: document.getElementById('apellido1').value,
          apellido2: document.getElementById('apellido2').value,
          telefono: document.getElementById('telefono').value,
          correo: document.getElementById('correo').value,
          direccion: document.getElementById('direccion').value,
          id_rol: document.getElementById('id_rol').value,
          contrasenia: document.getElementById('contrasenia').value,
        };
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`${apiUrl}/actualizar_usuario/${usuario.clv_usuario}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValues)
        });
        if (!response.ok) {
          throw new Error('Error al editar usuario');
        }
        obtenerUsuarios();
        Swal.fire('Usuario editado', '', 'success');
      } catch (error) {
        console.error('Error editando usuario:', error);
        Swal.fire('Error', 'No se pudo editar el usuario', 'error');
      }
    }
  };

  if (fetching) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error al cargar usuarios: {error}</p>;
  }

  return (
    <div>
      <h1>Usuarios</h1>
      <button onClick={agregarUsuario}>Agregar Usuario</button>
      <div className='tabla'>
        <table className="table">
          <thead>
            <tr>
              <th>Clave Usuario</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>ID Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.clv_usuario}>
                <td>{usuario.clv_usuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido1}</td>
                <td>{usuario.apellido2}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.direccion}</td>
                <td>{usuario.id_rol}</td>
                <td>
                  <button onClick={() => editarUsuario(usuario)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuario;
