import { supabase } from "../index";

export async function MostrarReportesMovimientosMes(p) {
  const { data, error } = await supabase.rpc("reportes_movimientos_mes", {
    _id_empresa: p.id_empresa,
  });
  if (error) console.error("Error reportes movimientos:", error);
  return data ?? [];
}

export async function MostrarReportesStockBajo(p) {
  const { data, error } = await supabase.rpc("reportes_stock_bajo", {
    _id_empresa: p.id_empresa,
  });
  if (error) console.error("Error reportes stock bajo:", error);
  return data ?? [];
}

export async function MostrarReportesTotales(p) {
  const { data, error } = await supabase.rpc("reportes_totales", {
    _id_empresa: p.id_empresa,
  });
  if (error) console.error("Error reportes totales:", error);
  return data?.[0] ?? null;
}