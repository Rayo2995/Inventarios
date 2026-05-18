import Swal from "sweetalert2";
import { ObtenerIdAuthSupabase, supabase, usePermisosStore } from "../index";
export const InsertarUsuarios = async (p) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert(p)
      .select()
      .maybeSingle();
    console.log("parametros del user", p);
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al insertar usuario " + error.message,
        footer: '<a href="">error</a>',
      });
    }
    if (data) return data;
  } catch (error) {}
};
export const InsertarAsignaciones = async (p) => {
  try {
    const { error } = await supabase.from("asignarempresa").insert(p);
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al insertar asignacion " + error.message,
        footer: '<a href="">error</a>',
      });
    }
  } catch (error) {}
};
export const MostrarUsuarios = async () => {
  try {
    const idAuthSupabase = await ObtenerIdAuthSupabase();
    const { error, data } = await supabase
      .from("usuarios")
      .select()
      .eq("idauth", idAuthSupabase)
      .maybeSingle();
    if (data) {
      console.log("demoledor idauth", idAuthSupabase);
      return data;
    }
  } catch (error) {}
};
export const MostrarUsuariosTodos = async (p) => {
  try {
    const { error, data } = await supabase.rpc("mostrarusuarios", {
      _id_empresa: p._id_empresa,
    });
    if (data) {
      return data;
    }
  } catch (error) {}
};
export async function EditarTemaMonedaUser(p) {
  try {
    const { error } = await supabase.from("usuarios").update(p).eq("id", p.id);
    if (error) {
      alert("Error al editar usuarios", error);
    }
    Swal.fire({
      icon: "success",
      title: "Datos modificados",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    alert(error.error_description || error.message + "EditarTemaMonedaUser");
  }
}
export async function Editarusuarios(p) {
  try {
    
    const { data, error } = await supabase
      .from("usuarios")
      .update(p)
      .eq("id", p.id);
    console.log("parametros user edit", error.message);
    // if (error) {
    // return  alert("Error al editar usuarios !!!", error.message);
    // }
    if (data) {
      Swal.fire({
        icon: "success",
        title: "Datos modificados",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    return data;
  } catch (error) {
    // alert(error.error_description || error.message + "EditarTemaMonedaUser");
  }
}

export const EliminarUsuario = async ({ id, idauth, idempresa }) => {
  try {
    // 1️⃣ Borrar permisos del usuario
    const { error: permisosError } = await supabase
      .from("permisos")
      .delete()
      .eq("id_usuario", id);
    if (permisosError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al eliminar permisos: " + permisosError.message,
      });
      return false;
    }

    // 2️⃣ Borrar asignaciones del usuario
    const { error: asignacionesError } = await supabase
      .from("asignarempresa")
      .delete()
      .eq("id_usuario", id);
    if (asignacionesError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al eliminar asignaciones: " + asignacionesError.message,
      });
      return false;
    }

    // 3️⃣ Borrar de la tabla usuarios
    const { error: usuariosError } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", id);
    if (usuariosError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al eliminar usuario: " + usuariosError.message,
      });
      return false;
    }

    
// 4️⃣ Eliminar de auth.users via RPC
    if (idauth) {
      const { error: authError } = await supabase.rpc("eliminar_usuario_auth", {
        _idauth: idauth,
      });
      if (authError) {
        console.warn("No se pudo borrar de auth:", authError.message);
      }
    }

    Swal.fire({
      icon: "success",
      title: "Usuario eliminado",
      showConfirmButton: false,
      timer: 1500,
    });

    return true;
  } catch (err) {
    console.error("Error inesperado al eliminar usuario:", err);
    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: err.message || "No se pudo eliminar el usuario",
    });
    return false;
  }
};