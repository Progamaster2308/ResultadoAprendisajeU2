import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../../api/user";
import { UserPlus, Mail, User, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .required("El nombre de usuario es obligatorio"),
      email: Yup.string()
        .email("Correo electrónico no válido")
        .required("El correo electrónico es obligatorio"),
      password: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .required("La contraseña es obligatoria"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Confirma tu contraseña"),
    }),
    onSubmit: async (formValues) => {
      setLoading(true);
      try {
        console.log("Datos de registro enviados:", formValues);
        const dataToSend = {
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
        };

        const response = await registerApi(dataToSend);
        console.log("Respuesta de registro:", response);
        toast.success("¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } catch (error: any) {
        console.error("Error al registrar:", error);
        toast.error(error.message || "No se pudo crear el usuario");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="login-admin min-h-screen w-full flex items-center justify-center p-4">
      <div className="login-admin__content max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Crear Cuenta
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Registro de nuevo usuario conectado al backend Django
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="username"
                placeholder="juanperez"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                  formik.touched.username && formik.errors.username
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <p className="text-rose-400 text-xs mt-1 font-medium">
                {formik.errors.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                placeholder="juan@ejemplo.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                  formik.touched.email && formik.errors.email
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-rose-400 text-xs mt-1 font-medium">
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
                placeholder="Mínimo 8 caracteres"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                  formik.touched.password && formik.errors.password
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-rose-400 text-xs mt-1 font-medium">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-rose-400 text-xs mt-1 font-medium">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Registrar Cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
