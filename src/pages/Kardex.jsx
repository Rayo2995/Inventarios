import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useKardexStore } from "../store/KardexStore";
import { usePermisosStore } from "../store/PermisosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";
import { KardexTemplate } from "../components/templates/KardexTemplate";

export function Kardex() {
  const queryClient = useQueryClient();
  const { datapermisos } = usePermisosStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarKardex } = useKardexStore();

  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Kardex")
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar kardex", dataempresa?.id],
    queryFn: () => mostrarKardex({ id_empresa: dataempresa.id }),
    enabled: !!dataempresa?.id,
  });

  const refrescar = () => {
    queryClient.invalidateQueries(["mostrar kardex", dataempresa?.id]);
  };

  if (datapermisos.length === 0) return <SpinnerLoader />;
  if (!statePermiso) return <BloqueoPagina state={statePermiso} />;
  if (isLoading) return <SpinnerLoader />;
  if (error) return <span>Error...</span>;

  return <KardexTemplate refrescar={refrescar} />;
}