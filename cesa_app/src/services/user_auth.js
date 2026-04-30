import md5 from "crypto-js/md5";
import { supabase } from "../supabaseClient";

const createUser = async (email, password) => {
  const hashedPassword = md5(password).toString();

  // Insertar usuario
  const { data, error } = await supabase
    .from("usuarios")
    .insert([{ email, password_md5: hashedPassword }])
    .select()
    .single();

  if (error) return { error };

  // Asignar rol 2 automáticamente
  await supabase.from("roles_usuario").insert([
    {
      usuario_id: data.id,
      rol_id: 2,
    },
  ]);

  return { user: data };
};

const signIn = async (email, password) => {
  const hashedPassword = md5(password).toString();

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("password_md5", hashedPassword)
    .single();

  if (error || !data) {
    return { error: "Credenciales inválidas" };
  }

  // Obtener rol
  const { data: roleData } = await supabase
    .from("roles_usuario")
    .select("rol_id")
    .eq("usuario_id", data.id)
    .single();

  // Simular JWT
  const tokenPayload = {
    id: data.id,
    email: data.email,
    rol: roleData.rol_id,
    exp: Date.now() + 1000 * 60 * 60, // 1 hora
  };

  const fakeJWT = btoa(JSON.stringify(tokenPayload));

  localStorage.setItem("token", fakeJWT);

  return { user: tokenPayload };
};