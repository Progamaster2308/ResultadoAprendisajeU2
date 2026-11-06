import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

export function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between relative">
      {/* Top simple navigation */}
      <header className="p-4 sm:p-6 flex items-center justify-between z-10">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a Inicio
        </Link>
        <span className="text-xs text-slate-500 font-mono">
          RA2 • Autenticación JWT
        </span>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-600">
        Práctica 4 Backend Django + Frontend React con Vite & Formik
      </footer>
    </div>
  );
}
