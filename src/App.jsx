import { useState, useEffect } from 'react';
import './App.css';
import Inicio from './components/inicio';
import Carrito from './components/carrito';
import Usuario from './components/usuario';
import Acceder from './components/acceder';
import Cliente from './components/cliente';


function App() {
  const [pagina, setPagina] = useState('Inicio');
  const [carrito, setCarrito] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    // Obtener productos disponibles al cargar la aplicación
    fetch('http://localhost:4040/producto/disponibles')
      .then(response => response.json())
      .then(data => setProductosDisponibles(data))
      .catch(error => console.error("Error al obtener los productos:", error));
  }, []);

  function acceder1() {
    setPagina('Inicio');
  }

  function acceder2() {
    setPagina('Carrito');
  }

  function acceder3() {
    setPagina('Usuario');
  }

  function acceder4() {
    setPagina('Acceder');
  }

	function acceder5() {
    setPagina('Cliente');
  }
	  

  function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.codigo_barras === producto.codigo_barras);
    if (productoExistente) {
      const cantidadDisponible = productosDisponibles.find(p => p.codigo_barras === producto.codigo_barras).cantidad_actual;
      if (productoExistente.cantidad < cantidadDisponible) {
        setCarrito(prevCarrito => prevCarrito.map(item =>
          item.codigo_barras === producto.codigo_barras
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      } else {
        alert('No hay suficientes productos disponibles');
      }
    } else {
      setCarrito(prevCarrito => [
        ...prevCarrito,
        {
          ...producto,
          cantidad: 1,
          precio: parseFloat(producto.precio).toFixed(2) // Convertir precio a número y formatear a dos decimales
        }
      ]);
    }
  }

  function eliminarDelCarrito(codigo_barras) {
    setCarrito(prevCarrito => prevCarrito.filter(producto => producto.codigo_barras !== codigo_barras));
  }

  function modificarCantidad(codigo_barras, cantidad) {
    const producto = productosDisponibles.find(p => p.codigo_barras === codigo_barras);
    if (cantidad <= producto.cantidad_actual) {
      setCarrito(prevCarrito => prevCarrito.map(item =>
        item.codigo_barras === codigo_barras
          ? { ...item, cantidad: parseInt(cantidad) }
          : item
      ));
    } else {
      alert('No hay suficientes productos disponibles');
    }
  }

  let paginaRenderizada;
  if (pagina === 'Inicio') {
    paginaRenderizada = <Inicio agregarAlCarrito={agregarAlCarrito} />;
  } else if (pagina === 'Carrito') {
    paginaRenderizada = <Carrito carrito={carrito} eliminarDelCarrito={eliminarDelCarrito} modificarCantidad={modificarCantidad} usuario={usuario} sesion={sesion} />;
  } else if (pagina === 'Usuario') {
    paginaRenderizada = <Usuario />;
  } else if (pagina === 'Acceder') {
    paginaRenderizada = <Acceder setUsuario={setUsuario} setSesion={setSesion} />;
  } else if (pagina === 'Cliente') {
	paginaRenderizada = <Cliente />
  }

  return (
    <>
      <header className='mg-10'>
        <section className='wd-50 pd-10'>
          <h1 className=''>Novo Marketplace</h1>
        </section>
        <section className='wd-50 display-flex flex-right'>
          <button onClick={acceder1} className='menu-button pd-10 size-20'>Inicio</button>
          <button onClick={acceder2} className='menu-button pd-10 size-20'>Carrito</button>
          <button onClick={acceder3} className='menu-button pd-10 size-20'>Usuario</button>
          <button onClick={acceder4} className='menu-button pd-10 size-20'>Acceder</button>
          <button onClick={acceder5} className='menu-button pd-10 size-20'>Cliente</button>

        </section>
      </header>
      <main>
        {paginaRenderizada}
      </main>
    </>
  );
}

export default App;

