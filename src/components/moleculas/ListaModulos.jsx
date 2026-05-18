import styled from "styled-components";
import { useGlobalStore } from "../../store/GlobalStore";
import { useEffect, useState } from "react";
import { usePermisosStore } from "../../store/PermisosStore";

export function ListaModulos({ setCheckboxs, checkboxs, accion }) {
  const { datamodulos } = useGlobalStore();
  const { datapermisosEdit } = usePermisosStore();
  const [nuevadata, setnuevadata] = useState([]);

  useEffect(() => {
    if (accion === "Editar") {
      let allDocs = [];
      datamodulos.map((element) => {
        const statePermiso = datapermisosEdit?.some((objeto) =>
          objeto.modulos.nombre.includes(element.nombre)
        );
        if (statePermiso) {
          allDocs.push({ ...element, check: true });
        } else {
          allDocs.push({ ...element, check: false });
        }
      });
      setCheckboxs(allDocs);
    } else {
      setCheckboxs(datamodulos);
    }
  }, [datapermisosEdit]);

  function handlecheckbox(id) {
    setCheckboxs((prev) => {
      return prev?.map((item) => {
        if (item.id === id) {
          return { ...item, check: !item.check };
        } else {
          return { ...item };
        }
      });
    });
  }

  return (
    <Container>
      {checkboxs?.map((item, index) => {
        return (
          <div key={index} className="content">
            <input
              onChange={() => handlecheckbox(item.id)}
              id={item.id}
              type="checkbox"
              className="checkbox"
              checked={item.check}
            />
            <span>{item.nombre}</span>
          </div>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px dashed #414244;
  border-radius: 15px;
  padding: 20px;
  gap: 15px;
  .content {
    display: flex;
    gap: 20px;
  }
  .checkbox {
    appearance: none;
    overflow: hidden;
    min-width: 30px;
    aspect-ratio: 1/1;
    border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;
    border: 2px solid rgb(255, 102, 0);
    position: relative;
    transition: all 0.2s ease-in-out;
    &::before {
      position: absolute;
      inset: 0;
      content: "";
      font-size: 35px;
      transition: all 0.2s ease-in-out;
    }
    &:checked {
      border: 2px solid rgb(255, 212, 59);
      background: linear-gradient(
        135deg,
        rgb(255, 212, 59) 0%,
        rgb(255, 102, 0) 100%
      );
      box-shadow: -5px -5px 30px rgba(255, 212, 59, 1),
        5px 5px 30px rgba(255, 102, 0, 1);
      &::before {
        background: linear-gradient(
          135deg,
          rgb(255, 212, 59) 0%,
          rgb(255, 102, 0) 100%
        );
      }
    }
  }
`;
