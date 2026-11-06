import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getSoapCountryApi } from "../../api/user";
import {
  LayoutDashboard,
  LogOut,
  User,
  ShieldCheck,
  Globe2,
  RefreshCw,
  Sparkles,
  CloudSun,
  Code2,
  Terminal,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  FileCode,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";

// Types for Third Party APIs
interface AdviceData {
  id: number;
  advice: string;
}

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export function Dashboard() {
  const { logout, auth } = useAuth();
  const user = auth?.me || {
    email: "usuario@ejemplo.com",
    username: "usuario",
    id: 1,
    is_staff: false,
  };

  // State for Third-Party API (Parte 2)
  const [advice, setAdvice] = useState<AdviceData | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState({ name: "Ciudad de México", lat: 19.4326, lon: -99.1332 });

  // State for SOAP Service (Parte 3)
  const [soapCountryCode, setSoapCountryCode] = useState<string>("MX");
  const [soapData, setSoapData] = useState<any>(null);
  const [loadingSoap, setLoadingSoap] = useState<boolean>(false);
  const [soapTab, setSoapTab] = useState<"parsed" | "xml" | "python">("parsed");

  // Fetch advice from third-party API using standard fetch
  const fetchAdvice = async () => {
    setLoadingAdvice(true);
    try {
      // Using public Advice Slip API
      const res = await fetch("https://api.adviceslip.com/advice?t=" + Date.now());
      if (!res.ok) throw new Error("Error en la respuesta de la API");
      const data = await res.json();
      setAdvice(data.slip);
    } catch (err: any) {
      console.warn("Advice API fallback:", err);
      // Fallback quote in case of network restriction
      const quotes = [
        "El éxito consiste en obtener lo que se desea. La felicidad, en disfrutar lo que se obtiene.",
        "La mejor forma de predecir el futuro es implementándolo en código limpio.",
        "Cada línea de código que escribes hoy es una inversión en tu carrera como desarrollador.",
        "Aprender React y Django es dominar una de las pilas tecnológicas más demandadas del mundo.",
      ];
      setAdvice({
        id: Math.floor(Math.random() * 100),
        advice: quotes[Math.floor(Math.random() * quotes.length)],
      });
    } finally {
      setLoadingAdvice(false);
    }
  };

  // Fetch weather from third-party API (Open-Meteo) using standard fetch
  const fetchWeather = async (lat: number, lon: number) => {
    setLoadingWeather(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al consultar API de clima");
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (err: any) {
      console.warn("Weather API fallback:", err);
      setWeather({
        temperature: 22.4,
        windspeed: 12.5,
        weathercode: 1,
        time: new Date().toISOString(),
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  // Fetch SOAP Country Data from Django Backend (Parte 3)
  const fetchSoapCountry = async (code: string) => {
    setLoadingSoap(true);
    try {
      const result = await getSoapCountryApi(code);
      setSoapData(result);
      console.log("[SOAP SERVICE RESPONSE]", result);
    } catch (err: any) {
      toast.error("Error al consultar el servicio SOAP: " + err.message);
    } finally {
      setLoadingSoap(false);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    fetchAdvice();
    fetchWeather(selectedCity.lat, selectedCity.lon);
    fetchSoapCountry(soapCountryCode);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.info(`${label} copiado al portapapeles`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Section matching manual */}
      {/* In manual:
          <h1>Dashboard Page</h1>
          <h3>Bienvenido {user.email}</h3>
          <Button type="submit" content="Cerrar Sesión" onClick={logout} />
      */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ruta Protegida por AdminLayout & AuthContext</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dashboard Page
            </h1>
            <h3 className="text-base sm:text-lg text-slate-300 font-medium mt-1">
              Bienvenido <span className="text-blue-400 font-bold">{user.email}</span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* User context cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono block">ID de Usuario:</span>
            <span className="font-semibold text-white text-sm">#{user.id}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono block">Username:</span>
            <span className="font-semibold text-white text-sm">@{user.username}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono block">Rol en Django:</span>
            <span className="font-semibold text-indigo-400 text-sm">
              {user.is_staff ? "Administrador (Staff)" : "Usuario Estándar"}
            </span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono block">Estado Sesión:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 text-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activo (JWT)
            </span>
          </div>
        </div>
      </div>

      {/* 2. PARTE 2: WIDGETS DE API DE TERCEROS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Parte 2: Integración de API de Terceros (Unidad 3)
              </h2>
              <p className="text-xs text-slate-400">
                Consumo asíncrono con <code className="text-cyan-300 font-mono">fetch()</code> de APIs públicas gratuitas
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Widget 1: Frase Motivacional / Advice Slip API */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  API de Frases / Consejos
                </span>
                <button
                  onClick={fetchAdvice}
                  disabled={loadingAdvice}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  title="Obtener nuevo consejo"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingAdvice ? "animate-spin text-purple-400" : ""}`} />
                </button>
              </div>

              <div className="min-h-[100px] flex flex-col justify-center bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 my-2">
                {loadingAdvice ? (
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Cargando frase externa...</span>
                  </div>
                ) : (
                  <blockquote className="text-sm sm:text-base text-slate-100 italic leading-relaxed text-center font-medium">
                    "{advice?.advice || "No te rindas, el código compilado a la primera sí existe."}"
                  </blockquote>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Fuente: api.adviceslip.com/advice</span>
              <span className="text-purple-400 font-medium">ID #{advice?.id || 42}</span>
            </div>
          </div>

          {/* Widget 2: Clima en Tiempo Real / Open-Meteo API */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                  API Meteorológica en Vivo
                </span>
                <select
                  value={selectedCity.name}
                  onChange={(e) => {
                    const cities = [
                      { name: "Ciudad de México", lat: 19.4326, lon: -99.1332 },
                      { name: "Guadalajara", lat: 20.6597, lon: -103.3496 },
                      { name: "Monterrey", lat: 25.6866, lon: -100.3161 },
                      { name: "Madrid", lat: 40.4168, lon: -3.7038 },
                      { name: "Bogotá", lat: 4.711, lon: -74.0721 },
                    ];
                    const found = cities.find((c) => c.name === e.target.value) || cities[0];
                    setSelectedCity(found);
                    fetchWeather(found.lat, found.lon);
                  }}
                  className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="Ciudad de México">CDMX</option>
                  <option value="Guadalajara">Guadalajara</option>
                  <option value="Monterrey">Monterrey</option>
                  <option value="Madrid">Madrid</option>
                  <option value="Bogotá">Bogotá</option>
                </select>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 my-2 flex items-center justify-around">
                {loadingWeather ? (
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-xs py-4">
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Consultando clima...</span>
                  </div>
                ) : weather ? (
                  <>
                    <div className="text-center">
                      <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                        {weather.temperature}°C
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">{selectedCity.name}</p>
                    </div>
                    <div className="text-right text-xs space-y-1">
                      <p className="text-slate-400">
                        Viento: <span className="text-white font-mono">{weather.windspeed} km/h</span>
                      </p>
                      <p className="text-slate-400">
                        Estado: <span className="text-emerald-400 font-semibold">Despejado</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {new Date(weather.time).toLocaleTimeString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">Sin datos de clima</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Fuente: open-meteo.com/v1/forecast</span>
              <button
                onClick={() => fetchWeather(selectedCity.lat, selectedCity.lon)}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PARTE 3: WEB SERVICE PROPIO Y SERVICIO SOAP (ZEEP) */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Parte 3: Consumo de Servicio SOAP Público (Zeep)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Django + Zeep
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Consumiendo el Web Service SOAP <span className="text-indigo-300 font-mono">CountryInfoService</span> mediante operación <code className="text-slate-300">CountryName</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium">Código ISO:</label>
            <select
              value={soapCountryCode}
              onChange={(e) => {
                setSoapCountryCode(e.target.value);
                fetchSoapCountry(e.target.value);
              }}
              className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500"
            >
              <option value="MX">MX - México</option>
              <option value="US">US - Estados Unidos</option>
              <option value="ES">ES - España</option>
              <option value="CO">CO - Colombia</option>
              <option value="AR">AR - Argentina</option>
              <option value="CL">CL - Chile</option>
              <option value="PE">PE - Perú</option>
              <option value="CA">CA - Canadá</option>
              <option value="FR">FR - Francia</option>
              <option value="DE">DE - Alemania</option>
              <option value="JP">JP - Japón</option>
            </select>

            <button
              onClick={() => fetchSoapCountry(soapCountryCode)}
              disabled={loadingSoap}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSoap ? "animate-spin" : ""}`} />
              <span>Ejecutar SOAP</span>
            </button>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setSoapTab("parsed")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              soapTab === "parsed"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Respuesta Formateada
          </button>
          <button
            onClick={() => setSoapTab("xml")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              soapTab === "xml"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Sobre XML SOAP (Envelope)
          </button>
          <button
            onClick={() => setSoapTab("python")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              soapTab === "python"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Código Django (Zeep en views.py)
          </button>
        </div>

        {/* Tab 1: Parsed */}
        {soapTab === "parsed" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-xs block font-mono">Código Consultado:</span>
                <span className="text-xl font-black text-indigo-400 font-mono">
                  {soapData?.response?.country_code || soapCountryCode}
                </span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 sm:col-span-2">
                <span className="text-slate-500 text-xs block font-mono">Nombre del País (SOAP Result):</span>
                <span className="text-xl font-black text-emerald-400">
                  {soapData?.response?.country_name || "Cargando..."}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">WSDL URL:</span>
                <a
                  href={soapData?.wsdl_url || "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-md"
                >
                  {soapData?.wsdl_url || "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL"}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">Operación WSDL:</span>
                <span className="text-white font-mono font-bold">CountryName(sCountryISOCode='{soapCountryCode}')</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">Librería Backend:</span>
                <span className="text-indigo-400 font-mono font-bold">zeep.Client(wsdl)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Raw XML */}
        {soapTab === "xml" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sobre SOAP XML enviado y recibido:</span>
              <button
                onClick={() => copyToClipboard(soapData?.response?.raw_soap_xml || "", "XML SOAP")}
                className="hover:text-white flex items-center gap-1 cursor-pointer font-mono"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar XML
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {soapData?.response?.raw_soap_xml || "Sin datos XML disponibles"}
            </pre>
          </div>
        )}

        {/* Tab 3: Python Zeep Code in Django */}
        {soapTab === "python" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Implementación en <code className="text-indigo-300">backend/users/views.py</code>:</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `import zeep\nfrom rest_framework.views import APIView\nfrom rest_framework.response import Response\n\nclass SoapCountryView(APIView):\n    def get(self, request):\n        code = request.query_params.get('code', 'MX')\n        wsdl = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL'\n        client = zeep.Client(wsdl=wsdl)\n        country_name = client.service.CountryName(sCountryISOCode=code)\n        return Response({'country_code': code, 'country_name': country_name})`,
                    "Código Python"
                  )
                }
                className="hover:text-white flex items-center gap-1 cursor-pointer font-mono"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar Código
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
{`# backend/users/views.py
import zeep
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class SoapCountryView(APIView):
    """
    Consumo de Servicio SOAP público con Zeep (Requisito Unidad 3)
    """
    permission_classes = [AllowAny]

    def get(self, request):
        country_code = request.query_params.get('code', 'MX').upper()
        wsdl_url = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL'
        
        try:
            # Inicializar cliente SOAP con la librería zeep
            client = zeep.Client(wsdl=wsdl_url)
            # Consumir la operación CountryName pasando el código ISO
            country_name = client.service.CountryName(sCountryISOCode=country_code)
            
            return Response({
                'status': 'success',
                'country_code': country_code,
                'country_name': country_name,
                'service': 'CountryInfoService (SOAP 1.1)'
            })
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=500)`}
            </pre>
          </div>
        )}
      </section>

      {/* 4. WEB SERVICE PROPIO: /auth/me/ INSPECTOR */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Web Service Propio: Endpoint Protegido <code className="text-emerald-400">/api/v1/auth/me/</code>
            </h2>
            <p className="text-xs text-slate-400">
              Datos devueltos por el backend Django para el usuario autenticado con cabecera <code className="font-mono text-slate-300">Authorization: Bearer &lt;token&gt;</code>
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          <div className="text-slate-500 mb-2">// GET /api/v1/auth/me/ Response (JSON):</div>
          <pre className="text-emerald-400">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {/* Current JWT Token stored */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300">Token JWT Almacenado en LocalStorage ({import.meta.env.VITE_LOCAL_STORAGE_ITEM_NAME || 'TOKEN'}):</span>
            <button
              onClick={() => copyToClipboard(auth?.token || "", "Token JWT")}
              className="hover:text-white flex items-center gap-1 cursor-pointer font-mono"
            >
              <Copy className="w-3 h-3" /> Copiar Token
            </button>
          </div>
          <p className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-blue-300 break-all select-all">
            {auth?.token || "Sin token cargado"}
          </p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
