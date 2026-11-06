import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../../api/user";
import { useAuth } from "../../hooks/useAuth";
import { LogIn, KeyRound, Mail, ArrowRight, ShieldCheck, CheckCircle2, Terminal } from "lucide-react";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [lastTokenReceived, setLastTokenReceived] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Correo electrónico no válido")
        .required("El correo electrónico es obligatorio"),
      password: Yup.string().required("La contraseña es obligatoria"),
    }),
    onSubmit: async (formValues) => {
      setLoading(true);
      try {
        console.log("Valores enviados: ", formValues);
        const response = await loginApi(formValues);
        const { access } = response;

        // Print to console as requested for the assignment screenshot:
        // "Captura del Login funcionando: (La pantalla de React y la consola mostrando que se obtuvo el Token)"
        console.log("%c========================================", "color: #00ff88; font-weight: bold;");
        console.log("%c[DJANGO JWT AUTH] TOKEN RECIBIDO CON ÉXITO:", "color: #00ff88; font-weight: bold; font-size: 14px;");
        console.log("Access Token:", access);
        console.log("%c========================================", "color: #00ff88; font-weight: bold;");

        setLastTokenReceived(access);
        toast.success("¡Inicio de sesión exitoso!");

        // Update AuthContext state
        await login(access);

        // Small delay so user sees success and console logs before redirecting to /dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 600);
      } catch (error: any) {
        console.error("Error en login:", error);
        toast.error(error.message || "Usuario o contraseña incorrecta");
      } finally {
        setLoading(false);
      }
    },
  });

  // Quick fill helper for testing
  const fillCredentials = (email: string, pass: string) => {
    formik.setFieldValue("email", email);
    formik.setFieldValue("password", pass);
  };

  return (
    <div className="login-admin min-h-screen w-full flex items-center justify-center p-4">
      <div className="login-admin__content max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Ingresa tus credenciales para autenticarte con JWT en Django
          </p>
        </div>

        {/* Form matching manual */}
        <form className="login-form-admin space-y-5" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                placeholder="ejemplo@test.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-11 pr-4 py-3 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                  formik.touched.email && formik.errors.email
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-rose-400 text-xs mt-1.5 font-medium">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="current-password"
                className={`w-full pl-11 pr-4 py-3 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                  formik.touched.password && formik.errors.password
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-rose-400 text-xs mt-1.5 font-medium">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-medium mb-2.5 flex items-center justify-between">
            <span>Usuarios de prueba preconfigurados:</span>
            <span className="text-[10px] text-blue-400 font-mono">click para autollenar</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("admin@test.com", "password123")}
              className="p-2 text-left bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-lg transition-colors group cursor-pointer"
            >
              <div className="text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                admin@test.com
              </div>
              <div className="text-[11px] text-slate-500 font-mono">password123 (Admin)</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("estudiante@test.com", "password123")}
              className="p-2 text-left bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-lg transition-colors group cursor-pointer"
            >
              <div className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                estudiante@test.com
              </div>
              <div className="text-[11px] text-slate-500 font-mono">password123 (User)</div>
            </button>
          </div>
        </div>

        {/* Live Token Captured Visualizer (Perfect for assignment screenshots) */}
        {lastTokenReceived && (
          <div className="mt-5 p-3.5 bg-slate-950 border border-emerald-500/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>TOKEN JWT OBTENIDO (Registrado en consola):</span>
            </div>
            <p className="text-[11px] font-mono text-emerald-300 break-all bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
              {lastTokenReceived}
            </p>
          </div>
        )}

        {/* Footer Link to Register */}
        <div className="mt-6 text-center text-xs text-slate-400">
          ¿No tienes una cuenta aún?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
