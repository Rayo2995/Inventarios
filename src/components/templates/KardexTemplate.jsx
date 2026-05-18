import styled from "styled-components";
import { Header, Btnfiltro, v, Title, Lottieanimacion, Buscador, RegistrarKardex } from "../../index";
import { useState, useMemo } from "react";
import { useKardexStore } from "../../store/KardexStore";
import { useEmpresaStore } from "../../store/EmpresaStore";
import vacio from "../../assets/vacio.json";
import { TablaKardex } from "../organismos/tablas/TablaKardex";

export function KardexTemplate({ refrescar }) {
  const { datakardex, buscarKardex } = useKardexStore();
  const { dataempresa } = useEmpresaStore();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [buscador, setBuscador] = useState("");

  async function handleBuscador(valor) {
    setBuscador(valor);
    if (valor.trim() === "") {
      // si buscador vacío recarga todo
      return;
    }
    await buscarKardex({ id_empresa: dataempresa.id, buscador: valor });
  }

  function nuevoRegistro() {
    setOpenRegistro(true);
  }

  return (
    <Container>
      {openRegistro && (
        <RegistrarKardex
          onClose={() => setOpenRegistro(false)}
          refrescar={refrescar}
        />
      )}

      <header className="header">
        <Header
          stateConfig={{
            state: openRegistro,
            setState: () => setOpenRegistro(!openRegistro),
          }}
        />
      </header>

      <section className="area1">
        <ContentFiltro>
          <Title>Kardex</Title>
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
        {(!datakardex || datakardex.length === 0) && (
          <Lottieanimacion alto="300" ancho="300" animacion={vacio} />
        )}
        <TablaKardex data={datakardex} refrescar={refrescar} />
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
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    display: flex;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .main {
    grid-area: main;
  }
`;

const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  width: 100%;
  gap: 15px;
`;