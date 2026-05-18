import { create } from "zustand";
import {
  MostrarReportesMovimientosMes,
  MostrarReportesStockBajo,
  MostrarReportesTotales,
} from "../index";

export const useReportesStore = create((set) => ({
  datamovimientosmes: [],
  datastockbajo: [],
  datatotales: null,

  mostrarMovimientosMes: async (p) => {
    const response = await MostrarReportesMovimientosMes(p);
    set({ datamovimientosmes: response });
    return response;
  },
  mostrarStockBajo: async (p) => {
    const response = await MostrarReportesStockBajo(p);
    set({ datastockbajo: response });
    return response;
  },
  mostrarTotales: async (p) => {
    const response = await MostrarReportesTotales(p);
    set({ datatotales: response });
    return response;
  },
}));