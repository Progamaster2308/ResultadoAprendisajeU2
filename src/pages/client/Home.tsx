import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  ShieldCheck,
  KeyRound,
  Globe2,
  Terminal,
  ArrowRight,
  Database,
  Layers,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Github,
  BookOpen,
} from "lucide-react";

export function Home() {
  const { auth } = useAuth();

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Resultado de Aprendizaje 2 • Unidades 2 & 3</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Django + React con <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Autenticación JWT</span> & APIs
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Plataforma Full-Stack que integra una arquitectura desacoplada: Frontend en React con Vite y React Router v6, Backend Django REST Framework con tokens JWT, consumo de API externa en tiempo real y servicio SOAP vía Zeep.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {auth ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Acceder al Dashboard Protegido</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Iniciar Sesión (Login)</span>
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Registrar Nuevo Usuario</span>
                </Link>
              </>
            )}

            <a
              href="https://github.com/Progamaster2308/ResultadoAprendisajeFrontend.git"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4 text-white" />
              <span>Repositorio GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>
      </section>

      {/* 3 Core Architecture Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">Parte 1</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">React SPA + Router v6</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Vite, React Router v6, AuthContext con persistencia en localStorage, layouts segregados (Admin, Client, Common) y formularios validados con Formik & Yup.
            </p>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-slate-800/80">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>AuthContext & Hook useAuth()</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Login con token JWT almacenado</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Registro de usuarios reactivo</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">Parte 2</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">API Externa de Terceros</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Consumo asíncrono con <code className="font-mono text-cyan-300">fetch</code> dentro del Dashboard protegido para obtener datos en tiempo real (clima, frases inspiradoras o imágenes).
            </p>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-slate-800/80">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Integración con API pública gratuita</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Visualización dinámica en Dashboard</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Estados de carga y reintento en vivo</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">Parte 3</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Web Services & SOAP Zeep</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Endpoint protegido <code className="font-mono text-indigo-300">/auth/me/</code> con verificación Bearer JWT más consumo de servicio SOAP público mediante la librería <code className="font-mono text-indigo-300">zeep</code> en Django.
            </p>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-slate-800/80">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Endpoint protegido /api/v1/auth/me/</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Consumo SOAP CountryInfo (WSDL)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Inspector de Envelope XML y respuestas</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Guide to Assignment Deliverables & Screenshots */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            Lista de Capturas de Pantalla para el Documento PDF
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Sigue esta guía interactiva para capturar cada uno de los 5 requisitos solicitados por el profesor:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-semibold text-blue-400">1. Enlace al Repositorio GitHub:</span>
            <p className="text-slate-400 mt-1 font-mono text-[11px] break-all">
              https://github.com/Progamaster2308/ResultadoAprendisajeFrontend.git
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-semibold text-blue-400">2. Captura del Login funcionando:</span>
            <p className="text-slate-400 mt-1">
              Pantalla de Login con los campos llenos y la consola de herramientas de desarrollo (F12) mostrando el token access JWT obtenido.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-semibold text-blue-400">3. Captura del Dashboard protegido:</span>
            <p className="text-slate-400 mt-1">
              Pantalla en <code className="text-slate-300 font-mono">/dashboard</code> mostrando el mensaje de bienvenida con el email del usuario logueado gracias al AuthContext.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-semibold text-blue-400">4. Captura del Widget de API de Terceros:</span>
            <p className="text-slate-400 mt-1">
              Sección en el Dashboard con datos externos consumidos vía fetch (consejos, clima, etc.) con sus botones de actualización.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 md:col-span-2">
            <span className="font-semibold text-blue-400">5. Captura del Consumo SOAP:</span>
            <p className="text-slate-400 mt-1">
              Terminal o navegador ejecutando el endpoint SOAP consumido con Zeep, mostrando la respuesta XML o JSON con los datos del servicio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
