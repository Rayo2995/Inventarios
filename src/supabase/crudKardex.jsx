import { supabase } from "../index";
import Swal from "sweetalert2";
export async function InsertarKardex(p) {
  const { error } = await supabase.from("kardex").insert(p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message, // ← mostrará "Stock insuficiente. Stock actual: X..."
      footer: '<a href="">...</a>',
    });
    return false; // ← retorna false si falla
  }
  return true; // ← retorna true si éxito
}

export async function MostrarKardex(p) {
  const { data, error } = await supabase
    .rpc("mostrarkardexempresa", {
      _id_empresa: p.id_empresa,
    })
    .order("id", { ascending: false });
  
  console.log("MostrarKardex params:", p);
  console.log("MostrarKardex error:", error);
  return data;
}
export async function BuscarKardex(p) {
  const { data } = await supabase
    .rpc("buscarkardexempresa", {
      _id_empresa: p.id_empresa,
      buscador: p.buscador,
    })
    .order("id", { ascending: false });
  return data;
}