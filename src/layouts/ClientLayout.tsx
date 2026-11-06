import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ShieldCheck, LogIn, UserPlus, LayoutDashboard, ExternalLink, Code2 } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="tracking-tight">
              RA2 <span className="text-blue-400 font-semibold text-sm">Django + React</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/home"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Inicio
            </Link>

            {auth ? (
              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Ir al Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm shadow-blue-600/30 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>Resultado de Aprendizaje 2 • Django REST Framework & React Router v6</p>
          <p className="text-slate-400 font-mono">Repo: ResultadoAprendisajeFrontend</p>
        </div>
      </footer>
    </div>
  );
}
