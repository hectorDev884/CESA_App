import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import md5 from "crypto-js/md5";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar sesión desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = JSON.parse(atob(token));

      if (decoded.exp > Date.now()) {
        setUser(decoded);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // LOGIN
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

    const payload = {
      id: data.id,
      email: data.email,
      rol: roleData.rol_id,
      exp: Date.now() + 1000 * 60 * 60, // 1 hora
    };

    const fakeJWT = btoa(JSON.stringify(payload));
    localStorage.setItem("token", fakeJWT);

    setUser(payload);

    return { user: payload };
  };

  // REGISTER (crea usuario con rol 2)
  const register = async (email, password) => {
    const hashedPassword = md5(password).toString();

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ email, password_md5: hashedPassword }])
      .select()
      .single();

    if (error) return { error };

    await supabase.from("roles_usuario").insert([
      {
        usuario_id: data.id,
        rol_id: 2,
      },
    ]);

    return { user: data };
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}