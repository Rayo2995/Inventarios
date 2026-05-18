import styled from "styled-components"; 
import { 
  Header, 
  Btnfiltro, 
  v, 
  Title, 
  Lottieanimacion,  
  Buscador, 
  RegistrarProductos, 
  useProductosStore, 
  TablaProductos, 
  useEmpresaStore   // 👈 importamos el store de empresa
} from "../../index";
import { useState, useEffect } from "react";
import vacio from "../../assets/vacio.json";

export function ProductosTemplate({ data }) {
  const { setBuscador } = useProductosStore();
  const { empresa } = useEmpresaStore(); // 👈 traemos la empresa del store

  const [state, setState] = useState(false);
  const [openRegistro, SetopenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState([]);

  // Estado de productos
  const [productosOriginales, setProductosOriginales] = useState(Array.isArray(data) ? data : []);
  const [productosFiltrados, setProductosFiltrados] = useState(Array.isArray(data) ? data : []);

  // Si "data" cambia, actualizamos los productos
  useEffect(() => {
    setProductosOriginales(Array.isArray(data) ? data : []);
    setProductosFiltrados(Array.isArray(data) ? data : []);
  }, [data]);

  function nuevoRegistro() {
    SetopenRegistro(!openRegistro);
    setAccion("Nuevo");
    setdataSelect([]);
  }

  function handleBuscador(value) {
    setBuscador(value);
    if (!value) {
      setProductosFiltrados(productosOriginales);
    } else {
      const filtered = productosOriginales.filter((p) =>
        p.descripcion.toLowerCase().includes(value.toLowerCase())
      );
      setProductosFiltrados(filtered);
    }
  }

  return (
    <Container>
      {openRegistro && (
        <RegistrarProductos
          dataSelect={dataSelect}
          onClose={() => SetopenRegistro(!openRegistro)}
          accion={accion}
        />
      )}

      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>

      <section className="area1">
        <ContentFiltro>
          <EmpresaName>{empresa?.nombre}</EmpresaName> {/* 👈 nombre de empresa dinámico */}
          <Title>Productos</Title>
          <Btnfiltro
            funcion={nuevoRegistro}
            bgcolor="#f6f3f3"
            textcolor="#353535"
            icono={<v.agregar />}
          />
        </ContentFiltro>
      </section>

      <section className="area2">
        <Buscador setBuscador={handleBuscador} />
      </section>

      <section className="main">
        {productosFiltrados.length === 0 ? (
          <Lottieanimacion alto="300" ancho="300" animacion={vacio} />
        ) : (
          <TablaProductos
            data={productosFiltrados}
            SetopenRegistro={SetopenRegistro}
            setdataSelect={setdataSelect}
            setAccion={setAccion}
          />
        )}
      </section>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "area1" 100px
    "area2" 60px
    "main" auto;

  .header { grid-area: header; display: flex; align-items: center; }
  .area1 { grid-area: area1; display: flex; align-items: center; }
  .area2 { grid-area: area2; display: flex; align-items: center; justify-content: end; }
  .main { grid-area: main; }
`;

const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* empresa a la izq, resto a la der */
  align-items: center;
  width: 100%;
  gap: 15px;
`;

const EmpresaName = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;
