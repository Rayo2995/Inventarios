import Swal from "sweetalert2";
import { ObtenerIdAuthSupabase,supabase } from "../index";

export const MostrarEmpresa = async (p) => {
  const { data, error } = await supabase
    .rpc("mostrarempresaasignaciones", { _id_auth: p.idusuario })
    .maybeSingle();
  console.log("MostrarEmpresa params:", p);  // ← debe aparecer en consola
  console.log("MostrarEmpresa error:", error);
  return data ?? null;
};
export const ContarUsuariosXempresa = async (p) => {
  const { data,error } = await supabase.rpc("contarusuariosxempresa", {
    _id_empresa: p.id_empresa,
  }).maybeSingle();
 
  if (data) {
    return data;
  }
};
export const ListarEmpresas = async () => {
  const { data, error } = await supabase.rpc("mostrarempresa");
  
  if (error) {
    console.error("Error al mostrar empresas:", error.message);
    Swal.fire("Error", "No se pudieron cargar las empresas", "error");
    return null;
  }

  return data;
};