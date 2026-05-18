import { create } from "zustand";
import {
  EditarTemaMonedaUser,
  MostrarUsuarios,
  supabase,
  InsertarUsuarios,
  InsertarPermisos,
  MostrarUsuariosTodos,
  InsertarAsignaciones,
  Editarusuarios,
  EliminarPermisos,
  MostrarModulos,
  MostrarPermisos,
  DataModulosConfiguracion,
} from "../index";

export const useUsuariosStore = create((set, get) => ({
  datamoduloscheck: [],
  setdatamodulosCheck: (p) => {
    set({ datamoduloscheck: p });
  },
  idusuario: 0,
  setiduser: () => {
    set({ idusuario: 0 });
  },
  datausuarios: [],
  datausuariosTodos: [],
  mostrarUsuarios: async () => {
    const response = await MostrarUsuarios();
    set({ datausuarios: response });
    if (response) {
      set({ idusuario: response.id });
      return response;
    } else {
      return [];
    }
  },
  mostrarUsuariosTodos: async (p) => {
    const response = await MostrarUsuariosTodos(p);
    set({ datausuariosTodos: response });
    return response;
  },
  editartemamonedauser: async (p) => {
    await EditarTemaMonedaUser(p);
    const { mostrarUsuarios } = get();
    set(mostrarUsuarios);
  },
  editarusuario: async (p, datacheckpermisos,idempresa) => {
    
    await Editarusuarios(p);
    const { mostrarUsuariosTodos } = get();
    await EliminarPermisos({id_usuario:p.id})
    datacheckpermisos.forEach(async (item) => {
      if (item.check) {
        let parametrospermisos = {
          id_usuario: p.id,
          idmodulo: item.id,
        };
        await InsertarPermisos(parametrospermisos);
      }
    });
    set(mostrarUsuariosTodos({_id_empresa:idempresa}));
  },
  insertarUsuarioAdmin: async (p) => {
    //creando el correo y pass

    await supabase.auth.signUp({
      email: p.correo,
      password: p.pass,
    });
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.correo,
      password: p.pass,
    });
    if (error) {
      return null;
    }
    await InsertarUsuarios({
      idauth: data.user.id,
      fecharegistro: new Date(),
      tipouser: "superadmin",
    });

    return data.user;
  },
  insertarUsuario: async (parametrosAuth, p, datacheckpermisos, adminCredentials) => {
    // 1. Guarda la sesión actual del admin
    const { data: sessionActual } = await supabase.auth.getSession(); 
    console.log("intentando signup con:", {
      correo: parametrosAuth.correo,
      pass: parametrosAuth.pass,
      largoPass: parametrosAuth.pass?.length
    });
    // 2. Crea el usuario nuevo
    const { data, error } = await supabase.auth.signUp({
      email: parametrosAuth.correo,
      password: parametrosAuth.pass,
    });

    console.log("signup error detalle:", error); // ← agrega esto
    console.log("signup data:", data);

    if (error) {
      Swal.fire("Error signup", error.message, "error");
      return null;
    }

    // 3. Inserta en tabla usuarios
    const dataUserNew = await InsertarUsuarios({
      nombres: p.nombres,
      nro_doc: p.nrodoc,
      telefono: p.telefono,
      direccion: p.direccion,
      fecharegistro: new Date(),
      estado: "activo",
      idauth: data.user.id,
      tipouser: p.tipouser,
      tipodoc: p.tipodoc,
      correo: p.correo,
    });

    // 4. ⚠️ Restaura la sesión del admin antes de insertar permisos
    await supabase.auth.setSession({
      access_token: sessionActual.session.access_token,
      refresh_token: sessionActual.session.refresh_token,
    });

    // 5. Ahora inserta asignaciones y permisos con sesión del admin
    await InsertarAsignaciones({
      id_empresa: p.id_empresa,
      id_usuario: dataUserNew.id,
    });

    for (const item of datacheckpermisos) {
      if (item.check) {
        await InsertarPermisos({
          id_usuario: dataUserNew.id,
          idmodulo: item.id,
        });
      }
    }

    // 6. Cierra sesión del nuevo usuario (ya no es necesario)
    // El signOut lo quitamos porque ya restauramos la sesión del admin
    
    return data.user;
  },
  mostrarModulos: async (p) => {
    const response = await MostrarModulos(p);
    set({ datamodulos: response });
    return response;
  },

    mostrarpermisos: async (p) => {
    const response = await MostrarPermisos(p);
    set({ datapermisos: response });
    let allDocs= [];
    DataModulosConfiguracion.map((element)=>{
      const statePermiso = response.some((objeto) => objeto.modulos.includes(element.title));
      if(statePermiso){
        allDocs.push({...element,state:true})
      }else{

        allDocs.push({...element,state:false})
      }
    });
    DataModulosConfiguracion.splice(0,DataModulosConfiguracion.length)
    DataModulosConfiguracion.push(...allDocs)
    return response;
  },
  eliminarUsuario: async ({ id, idauth, idempresa }) => {
  try {
    // 1. Borrar permisos
    await EliminarPermisos({ id_usuario: id });

    // 2. Borrar asignaciones
    await supabase.from("asignarempresa").delete().eq("id_usuario", id);

    // 3. ← agrega esto: borrar kardex del usuario
    await supabase.from("kardex").delete().eq("id_usuario", id);

    // 4. Borrar de usuarios
    const { error } = await supabase.from("usuarios").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar usuario:", error.message);
      return false;
    }

    // 5. Eliminar de auth
    if (idauth) {
      await supabase.rpc("eliminar_usuario_auth", { _idauth: idauth });
    }

    const { mostrarUsuariosTodos } = get();
    await mostrarUsuariosTodos({ _id_empresa: idempresa });

    return true;
  } catch (err) {
    console.error("Error inesperado al eliminar usuario:", err);
    return false;
  }
},
}));
