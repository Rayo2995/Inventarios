import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useReportesStore } from "../store/ReportesStore";
import { usePermisosStore } from "../store/PermisosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";
import { ReportesTemplate } from "../components/templates/ReportesTemplate";

export function Reportes() {
  const { datapermisos } = usePermisosStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarMovimientosMes, mostrarStockBajo, mostrarTotales } = useReportesStore();

  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Reportes")
  );

  const { isLoading: loadingMov } = useQuery({
    queryKey: ["reportes movimientos", dataempresa?.id],
    queryFn: () => mostrarMovimientosMes({ id_empresa: dataempresa.id }),
    enabled: !!dataempresa?.id,
  });

  const { isLoading: loadingStock } = useQuery({
    queryKey: ["reportes stock bajo", dataempresa?.id],
    queryFn: () => mostrarStockBajo({ id_empresa: dataempresa.id }),
    enabled: !!dataempresa?.id,
  });

  const { isLoading: loadingTotales } = useQuery({
    queryKey: ["reportes totales", dataempresa?.id],
    queryFn: () => mostrarTotales({ id_empresa: dataempresa.id }),
    enabled: !!dataempresa?.id,
  });

  if (datapermisos.length === 0) return <SpinnerLoader />;
  if (!statePermiso) return <BloqueoPagina state={statePermiso} />;
  if (loadingMov || loadingStock || loadingTotales) return <SpinnerLoader />;

  return <ReportesTemplate />;
}