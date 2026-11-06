import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Login } from "../pages/common/Login";
import { LayoutDashboard, LogOut, Globe2, ShieldCheck, Home as HomeIcon } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  // Show nothing or loader while checking initial token state
  if (auth === undefined) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Verificando sesión JWT...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated, render the Login page as specified in the manual
  if (!auth) {
    return <Login />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-white">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="tracking-tight">
                RA2 <span className="text-blue-400 font-semibold text-sm">Dashboard</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm">
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-md text-white bg-slate-800 hover:bg-slate-700 font-medium flex items-center gap-1.5 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                Panel Principal
              </Link>
              <Link
                to="/home"
                className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium flex items-center gap-1.5 transition-colors"
              >
                <HomeIcon className="w-4 h-4 text-slate-400" />
                Inicio Público
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-medium">Usuario Activo</p>
              <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                {auth?.me?.email || auth?.me?.username || 'Usuario'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        RA2 Django + React con Autenticación JWT, APIs de Terceros y Web Service SOAP • Unidad 2 & 3
      </footer>
    </div>
  );
}
