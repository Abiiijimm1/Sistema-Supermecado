import { useState, useEffect } from 'react';
import '../App.css';
import menu from '../assets/menu.png';
import Card from './card';
import axios from 'axios';

const Inicio = ({ agregarAlCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [agregado, setAgregado] = useState({});

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://172.168.2.149:4043/producto/disponibles');
        setProductos(response.data);
      } catch (error) {
        console.error("Hubo un error al obtener los productos desde el puerto 4040:", error);
        try {
          const response = await axios.get('http://172.168.2.33:4043/producto/disponibles');
          setProductos(response.data);
        } catch (error) {
          console.error("Hubo un error al obtener los productos desde el puerto 4041:", error);
        }
      }
    };

    fetchProductos();
  }, []);

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    setAgregado({ ...agregado, [producto.codigo_barras]: true });
    setTimeout(() => {
      setAgregado({ ...agregado, [producto.codigo_barras]: false });
    }, 2000);
  };

  const productList = productos.map(producto => (
    <Card
      key={producto.codigo_barras}
      nombre={producto.nombre}
      precio={producto.precio}
      descripcion={producto.descripcion}
      agregarAlCarrito={() => handleAgregarAlCarrito(producto)}
      agregado={agregado[producto.codigo_barras]}
    />
  ));

  return (
    <>
      <main className='display-column'>
        <section className='pd-10'>
          <img src={menu} className='img-menu' alt="Menu"></img>
        </section>
        <section className='display-row mg-5'>
          {productList}
        </section>
      </main>
    </>
  );
}

export default Inicio;

