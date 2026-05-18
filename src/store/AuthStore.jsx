import { useState } from "react";
import { create } from "zustand";
import { supabase } from "../index";
import { Navigate } from "react-router-dom";
export const useAuthStore = create((set) => ({
  isAuth: false,
  datauserAuth: null, // cambia [] por null

  signInWithEmail: async (p) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.correo,
      password: p.pass,
    });
    if (error) return null;

    // Guarda el usuario autenticado
    set({ isAuth: true, datauserAuth: data.user });
    return data.user;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    set({ isAuth: false, datauserAuth: null });
    if (error) throw new Error("Error durante el cierre de sesión: " + error);
  },
}));