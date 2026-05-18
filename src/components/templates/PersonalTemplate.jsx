import styled from "styled-components";
import { Header, Btnfiltro, v, RegistrarCategorias, Title, Lottieanimacion, TablaCategorias, Buscador, RegistrarMarca, TablaMarca, useMarcaStore, RegistrarPersonal, TablaPersonal, useUsuariosStore } from "../../index";
import { useState, useMemo  } from "react";
import vacio from "../../assets/vacio.json";


export function PersonalTemplate({data, refrescar}) {
  const { datausuariosTodos } = useUsuariosStore(); // Todos los usuarios
  const [buscador, setBuscador] = useState(""); // Estado del buscador
  const [state, setState] = useState(false);
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState([]);
  function nuevoRegistro() {
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setdataSelect([]);
  }

   const dataFiltrada = useMemo(() => {
    if (!datausuariosTodos) return [];
    return datausuariosTodos.filter(u =>
      u.nombres.toLowerCase().includes(buscador.toLowerCase())
    );
  }, [datausuariosTodos, buscador]);
  return (
    <Container>
      {openRegistro && (
        <RegistrarPersonal setdataSelect={setdataSelect}
          dataSelect={dataSelect}
          onClose={() => setOpenRegistro(!openRegistro)}
          accion={accion}
          refrescar={refrescar} 
        />
      )}
      <header className="header">
        <Header
          stateConfig={{ state: openRegistro, setState: () => setOpenRegistro(!openRegistro) }} 
        />
      </header>
      <section className="area1">
        <ContentFiltro>
          <Title>
            Personal
          </Title>
          <Btnfiltro
            funcion={nuevoRegistro}
            bgcolor="#f6f3f3"
            textcolor="#353535"
            icono={<v.agregar />}
          />
        </ContentFiltro>
      </section>
      <section className="area2">
        <Buscador setBuscador={setBuscador} />
      </section>
      <section className="main">
      {(!data || data.length === 0) && (
        <Lottieanimacion
          alto="300"
          ancho="300"
          animacion={vacio}
        />
      )}
        <TablaPersonal
          data={dataFiltrada}
          setOpenRegistro={setOpenRegistro}
          setdataSelect={setdataSelect}
          setAccion={setAccion}
          refrescar={refrescar} 
        />
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

  .header {
    grid-area: header;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    /* background-color: rgba(229, 67, 26, 0.14); */
    display: flex;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(77, 237, 106, 0.14); */
    display: flex;
    align-items: center;
    justify-content:end;

  }
  .main {
    grid-area: main;
    /* background-color: rgba(179, 46, 241, 0.14); */
  }
`;
const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content:end;
  width:100%;
  gap:15px;
`;