import { create } from "zustand";
import { BuscarKardex, InsertarKardex, MostrarKardex } from "../index";
export const useKardexStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  datakardex: [],
  kardexItemSelect: [],
  parametros: {},

  insertarKardex: async (p) => {
    const ok = await InsertarKardex(p);
    if (!ok) return false; // ← no refresca si hubo error
    const { mostrarKardex, parametros } = get();
    set(mostrarKardex(parametros));
    return true;
  },
  mostrarKardex: async (p) => {
    const response = await MostrarKardex(p);
    set({ parametros: p });
    set({ datakardex: response });
    return response;
  },
  buscarKardex: async (p) => {
    const response = await BuscarKardex(p);
    set({ datakardex: response });
    return response;
  },
}));