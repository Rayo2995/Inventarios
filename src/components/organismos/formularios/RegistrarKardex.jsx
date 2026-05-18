import { useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btnsave,
  useKardexStore,
  useUsuariosStore,
  useEmpresaStore,
  ListaGenerica,
  Selector,
} from "../../../index";
import { useForm } from "react-hook-form";
import { Device } from "../../../styles/breakpoints";
import { BuscarProductos } from "../../../index";

const TipoMovimientoData = [
  { id: 1, descripcion: "entrada" },
  { id: 2, descripcion: "salida" },
];

export function RegistrarKardex({ onClose, refrescar }) {
  const { insertarKardex } = useKardexStore();
  const { datausuarios } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();

  const [stateTipo, setStateTipo] = useState(false);
  const [tipo, setTipo] = useState({ id: 1, descripcion: "entrada" });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const cantidad = watch("cantidad", 0);
  const precio_unitario = watch("precio_unitario", 0);
  const total = (Number(cantidad) * Number(precio_unitario)).toFixed(2);

  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productoSelect, setProductoSelect] = useState(null);
  const [resultadosProductos, setResultadosProductos] = useState([]);
  const [showResultados, setShowResultados] = useState(false);


  async function handleBuscarProducto(valor) {
  setBusquedaProducto(valor);
  if (valor.trim().length < 2) {
    setResultadosProductos([]);
    setShowResultados(false);
    return;
  }
  const resultados = await BuscarProductos({
    descripcion: valor,
    id_empresa: dataempresa.id,
  });
  setResultadosProductos(resultados ?? []);
  setShowResultados(true);
  }

  function seleccionarProducto(producto) {
    setProductoSelect(producto);
    setBusquedaProducto(producto.descripcion);
    setShowResultados(false);
  }


  async function insertar(data) {
    if (!productoSelect) return; // ← valida que haya producto seleccionado
    const p = {
      id_empresa: dataempresa.id,
      id_producto: productoSelect.id, // ← usa el id del producto seleccionado
      tipo: tipo.descripcion,
      cantidad: Number(data.cantidad),
      precio_unitario: Number(data.precio_unitario),
      total: Number(total),
      descripcion: data.descripcion,
      nro_documento: data.nro_documento,
      proveedor: data.proveedor,
      cliente: data.cliente,
      fecha: new Date(),
      id_usuario: datausuarios.id,
    };
    const ok = await insertarKardex(p);
    if (!ok) return;
    refrescar();
    onClose();
  }
  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>Registrar movimiento</h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section className="seccion1">

            <ContainerSelector style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <InputText icono={<v.iconocodigobarras />}>
            <input
              className="form__field"
              type="text"
              placeholder=""
              value={busquedaProducto}
              onChange={(e) => handleBuscarProducto(e.target.value)}
            />
            <label className="form__label">Buscar producto</label>
          </InputText>
          {showResultados && resultadosProductos.length > 0 && (
            <ListaProductos>
              {resultadosProductos.map((p) => (
                <ItemProducto key={p.id} onClick={() => seleccionarProducto(p)}>
                  <span>{p.descripcion}</span>
                  <small>Stock: {p.stock}</small>
                </ItemProducto>
              ))}
            </ListaProductos>
          )}
          {productoSelect && (
            <ProductoSeleccionado>
              ✅ {productoSelect.descripcion} — Stock: {productoSelect.stock}
            </ProductoSeleccionado>
          )}
          {!productoSelect && <p style={{fontSize:"12px", color:"#ef4444"}}>Selecciona un producto</p>}
      </ContainerSelector>

            {/* Tipo movimiento */}
            <ContainerSelector>
              <label>Tipo movimiento:</label>
              <Selector
                state={stateTipo}
                color="#fc6027"
                texto1={tipo.descripcion === "entrada" ? "⬆" : "⬇"}
                texto2={tipo.descripcion}
                funcion={() => setStateTipo(!stateTipo)}
              />
              {stateTipo && (
                <ListaGenerica
                  bottom="-110px"
                  $scroll="auto"
                  setState={() => setStateTipo(!stateTipo)}
                  data={TipoMovimientoData}
                  funcion={(p) => setTipo(p)}
                />
              )}
            </ContainerSelector>

            <article>
              <InputText icono={<v.iconostock />}>
                <input
                  className="form__field"
                  type="number"
                  placeholder=""
                  {...register("cantidad", { required: true, min: 1 })}
                />
                <label className="form__label">Cantidad</label>
                {errors.cantidad?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>

            <article>
              <InputText icono={<v.iconoprecio />}>
                <input
                  className="form__field"
                  type="number"
                  step="0.01"
                  placeholder=""
                  {...register("precio_unitario", { required: true, min: 0 })}
                />
                <label className="form__label">Precio unitario</label>
                {errors.precio_unitario?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>

            {/* Total calculado automáticamente */}
            <TotalContainer>
              <span>Total calculado:</span>
              <strong>${total}</strong>
            </TotalContainer>

            <article>
              <InputText icono={<v.iconocodigobarras />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder=""
                  {...register("nro_documento")}
                />
                <label className="form__label">Nro. documento</label>
              </InputText>
            </article>

          </section>

          <section className="seccion2">

            <article>
              <InputText icono={<v.icononombre />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder=""
                  {...register("proveedor")}
                />
                <label className="form__label">Proveedor</label>
              </InputText>
            </article>

            <article>
              <InputText icono={<v.icononombre />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder=""
                  {...register("cliente")}
                />
                <label className="form__label">Cliente</label>
              </InputText>
            </article>

            <article>
              <InputText icono={<v.iconocodigobarras />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder=""
                  {...register("descripcion")}
                />
                <label className="form__label">Descripción</label>
              </InputText>
            </article>

            <div className="btnguardarContent">
              <Btnsave
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#EF552B"
              />
            </div>

          </section>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    overflow-y: auto;
    overflow-x: hidden;
    height: 90vh;
    &::-webkit-scrollbar {
      width: 6px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #484848;
      border-radius: 10px;
    }
    width: 100%;
    max-width: 90%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }

    .formulario {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
      .btnguardarContent {
        display: flex;
        justify-content: end;
        grid-column: 1;
        @media ${Device.tablet} {
          grid-column: 2;
        }
      }
    }
  }
`;

const ContainerSelector = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-radius: 10px;
  background: rgba(103, 93, 241, 0.1);
  border: 1px solid rgba(103, 93, 241, 0.3);

  span {
    font-size: 14px;
    opacity: 0.8;
  }
  strong {
    font-size: 20px;
    color: ${({ theme }) => theme.text};
  }
    
`;

const ListaProductos = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  border: 1px solid rgba(103, 93, 241, 0.3);
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const ItemProducto = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;
  &:hover {
    background: rgba(103, 93, 241, 0.1);
  }
  small {
    opacity: 0.6;
    font-size: 12px;
  }
`;

const ProductoSeleccionado = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  font-size: 13px;
  font-weight: 600;
`;