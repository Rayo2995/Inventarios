import { supabase } from "../index";
import Swal from "sweetalert2";
export async function InsertarCategorias(p) {
  try {
     const { error } = await supabase.rpc("insertarcategorias", p);
     if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya existe un registro con " + p._descripcion,
        footer: '<a href="">Agregue una nueva descripcion</a>',
      });
    }
  } catch (error) {
    
  }
 
}
export async function MostrarCategorias(p) {
  try {
    const { data } = await supabase
      .from("categorias")
      .select()
      .eq("id_empresa", p.idempresa)
      .order("id", { ascending: true });
    return data;
  } catch (error) {}
}
export async function EliminarCategorias(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", p.id);
    if (error) {
      alert("Error al eliminar", error);
    }
  } catch (error) {
    alert(error.error_description || error.message + " eliminar categorias");
  }
}
export async function EditarCategorias(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .update({
        descripcion: p.descripcion,
        color: p.color,
        id_empresa: p.id_empresa, // opcional si quieres permitir cambiar empresa
      })
      .eq("id", p.id);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al editar categoría",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Categoría editada correctamente",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
export async function EliminarCategoriasTodas(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("idusuario", p.idusuario);
    if (error) {
      alert("Error al eliminar", error);
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Datos reseteados",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error) {
    alert(error.error_description || error.message + " eliminar categorias");
  }
}
export async function BuscarCategorias(p) {
  try {
    const { data } = await supabase
      .from("categorias")
      .select()
      .eq("id_empresa", p.id_empresa)
      .ilike("descripcion","%"+ p.descripcion+"%")
      
    return data;
  } catch (error) {}
}