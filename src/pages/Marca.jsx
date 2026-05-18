import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { MarcaTemplate } from "../components/templates/MarcaTemplate";
import { useMarcaStore, usePermisosStore, BloqueoPagina } from "../index";

export function Marca() {
  const { datapermisos } = usePermisosStore();
  const { mostrarMarca, datamarca, buscarMarca } = useMarcaStore();
  const { buscador } = useMarcaStore();
  const { dataempresa } = useEmpresaStore();

  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Productos")
  );

  const { data: marcas = [], isLoading, error } = useQuery({
    queryKey: ["mostrar marca", dataempresa?.id],
    queryFn: () => mostrarMarca({ id_empresa: dataempresa.id }),
    enabled: !!dataempresa?.id,
  });

  const { data: buscar } = useQuery({
    queryKey: ["buscar marcas", buscador, dataempresa?.id],
    queryFn: () => buscarMarca({
      descripcion: buscador,
      id_empresa: dataempresa.id,
    }),
    enabled: !!dataempresa?.id && buscador.trim() !== "",
  });

  if (datapermisos.length === 0) return <SpinnerLoader />;
  if (!statePermiso) return <BloqueoPagina />;
  if (isLoading) return <SpinnerLoader />;
  if (error) return <span>Error...</span>;

  return (
    <>
      <MarcaTemplate data={datamarca} />
    </>
  );
}