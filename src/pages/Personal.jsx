import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useMarcaStore } from "../store/MarcaStore";
import { PersonalTemplate } from "../components/templates/PersonalTemplate";
import { useGlobalStore } from "../store/GlobalStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { usePermisosStore } from "../store/PermisosStore";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Personal() {
  const queryClient = useQueryClient();
  const { datapermisos } = usePermisosStore();
  const { mostrarUsuariosTodos, datausuariosTodos } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarModulos } = useGlobalStore();

  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Personal")
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios todos", dataempresa?.id],
    queryFn: () => mostrarUsuariosTodos({ _id_empresa: dataempresa.id }),
    enabled: !!dataempresa?.id,
  });

  const { data: modulos } = useQuery({
    queryKey: ["mostrar modulos"],
    queryFn: mostrarModulos,
  });

  const refrescarUsuarios = () => {
    queryClient.invalidateQueries(["mostrar usuarios todos", dataempresa?.id]);
  };

  if (datapermisos.length === 0) return <SpinnerLoader />;
  if (!statePermiso) return <BloqueoPagina state={statePermiso} />;
  if (isLoading) return <SpinnerLoader />;
  if (error) return <span>Error...</span>;

  return (
    <>
      <PersonalTemplate data={datausuariosTodos} refrescar={refrescarUsuarios} />
    </>
  );
}