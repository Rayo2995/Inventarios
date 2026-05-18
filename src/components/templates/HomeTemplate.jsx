import styled from "styled-components";
import { BannerHome, Header } from "../../index";
import { useState, useEffect } from "react";
import { ListarEmpresas } from "../../index"; // importa la función que hicimos

import { useAuthStore } from "../../store/authStore";     // ajusta el path
import { useEmpresaStore } from "../../store/empresaStore"; // ajusta el path

export function HomeTemplate() {
  const [state, setState] = useState(false);

  const datauserAuth  = useAuthStore((s) => s.datauserAuth);
  const { dataempresa, mostrarEmpresa } = useEmpresaStore();

  useEffect(() => {
    if (!datauserAuth?.id) return;

    mostrarEmpresa({ idusuario: datauserAuth.id });
  }, [datauserAuth]);

  return (
    <Main>
      <header className="header">
        <Header stateConfig={{ state, setState: () => setState(!state) }} />
      </header>
      <BannerHome />
    </Main>
  );
}

const Main = styled.main`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-size: 26px;
  padding: 20px;
`;
