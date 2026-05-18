import { useQuery } from "@tanstack/react-query";
import { useCategoriasStore } from "../store/CategoriasStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { usePermisosStore, BloqueoPagina, CategoriasTemplate } from "../index";

export function Categorias() {
  const { datapermisos } = usePermisosStore();
  const { mostrarCategorias, datacategorias, buscarCategorias, buscador } = useCategoriasStore();
  const { dataempresa } = useEmpresaStore();

  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Categoria de productos")
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ idempresa: dataempresa.id }),
    enabled: !!dataempresa?.id,
  });

  const { data: buscar } = useQuery({
    queryKey: ["buscar categorias", buscador, dataempresa?.id],
    queryFn: () => buscarCategorias({
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
      <CategoriasTemplate data={datacategorias} />
    </>
  );
}