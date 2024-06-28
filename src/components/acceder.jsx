import { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography, IconButton, InputAdornment, Paper } from '@mui/material';
import { LockOpen } from '@mui/icons-material';

const Acceder = ({ setUsuario, setSesion }) => {
  const [clvUsuario, setClvUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mensaje, setMensaje] = useState('');

  const validarUsuario = async () => {
    try {
      const response = await axios.post('http://172.168.2.149:4040/usuario/validar_usuario', {
        clv_usuario: clvUsuario,
        contrasenia: contrasenia,
      });
      return response;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const fallbackResponse = await axios.post('http://172.168.2.33:4040/usuario/validar_usuario', {
          clv_usuario: clvUsuario,
          contrasenia: contrasenia,
        });
        return fallbackResponse;
      } else {
        throw error;
      }
    }
  };

  const verificarSesionActiva = async () => {
    try {
      const response = await axios.get(`http://172.168.2.149:4041/sesion/activa/${clvUsuario}`);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const fallbackResponse = await axios.get(`http://172.168.2.33:4041/sesion/activa/${clvUsuario}`);
        return fallbackResponse;
      } else {
        throw error;
      }
    }
  };

  const actualizarSesion = async (folioSesionActiva) => {
    try {
      await axios.put(`http://172.168.2.149:4041/sesion/actualizar_sesion/${folioSesionActiva}`, {
        estado: 'inactiva',
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await axios.put(`http://172.168.2.33:4041/sesion/actualizar_sesion/${folioSesionActiva}`, {
          estado: 'inactiva',
        });
      } else {
        throw error;
      }
    }
  };

  const crearNuevaSesion = async () => {
    try {
      const response = await axios.post('http://172.168.2.149:4041/sesion/nueva_sesion', {
        folio_sesion: `SES-${Date.now()}`, // Generar un folio de sesión único
        clv_usuario: clvUsuario,
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_final: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString().split('T')[0],
        estado: 'activa',
      });
      return response;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const fallbackResponse = await axios.post('http://172.168.2.33:4041/sesion/nueva_sesion', {
          folio_sesion: `SES-${Date.now()}`, // Generar un folio de sesión único
          clv_usuario: clvUsuario,
          fecha_inicio: new Date().toISOString().split('T')[0],
          fecha_final: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString().split('T')[0],
          estado: 'activa',
        });
        return fallbackResponse;
      } else {
        throw error;
      }
    }
  };

  const handleAcceder = async () => {
    try {
      const usuarioResponse = await validarUsuario();

      if (usuarioResponse.status === 200) {
        const usuarioData = usuarioResponse.data;
        setUsuario(usuarioData);

        const sessionResponse = await verificarSesionActiva();

        if (sessionResponse.data.activa) {
          const folioSesionActiva = sessionResponse.data.folio_sesion;
          await actualizarSesion(folioSesionActiva);
          setMensaje('Sesión anterior cerrada. Iniciando una nueva sesión...');
        }

        const nuevaSesionResponse = await crearNuevaSesion();

        if (nuevaSesionResponse.status === 201) {
          setSesion(nuevaSesionResponse.data);
          setMensaje('Usuario autenticado y nueva sesión iniciada');
        } else {
          setMensaje('Error al iniciar la nueva sesión');
        }
      } else {
        setMensaje('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al acceder:', error);
      setMensaje('Error al acceder. Por favor, intente de nuevo.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton color="primary">
            <LockOpen fontSize="large" />
          </IconButton>
          <Typography component="h1" variant="h5">
            Acceder
          </Typography>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="clvUsuario"
              label="Clave de Usuario"
              name="clvUsuario"
              autoComplete="clvUsuario"
              autoFocus
              value={clvUsuario}
              onChange={(e) => setClvUsuario(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleAcceder}
            >
              Acceder
            </Button>
            {mensaje && (
              <Typography variant="body2" color="error" align="center">
                {mensaje}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Acceder;

