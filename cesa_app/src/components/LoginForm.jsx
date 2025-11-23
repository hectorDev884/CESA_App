import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // ⬅️ REDIRECCIÓN AL DASHBOARD
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
