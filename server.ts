import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'django-insecure-ra2-super-secret-key-2026';

app.use(express.json());

// In-memory user database initialized with standard credentials
interface UserRecord {
  id: number;
  username: string;
  email: string;
  password: string; // In real Django, hashed via make_password
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}

const usersDb: UserRecord[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@test.com',
    password: 'password123',
    first_name: 'Administrador',
    last_name: 'Principal',
    is_active: true,
    is_staff: true,
    date_joined: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    username: 'estudiante',
    email: 'estudiante@test.com',
    password: 'password123',
    first_name: 'Brian',
    last_name: 'De Jesús',
    is_active: true,
    is_staff: false,
    date_joined: '2026-02-01T12:30:00Z',
  },
];

// Helper to sign JWTs
function generateTokens(user: UserRecord) {
  const access = jwt.sign(
    {
      token_type: 'access',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      jti: Math.random().toString(36).substring(2),
      user_id: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET
  );

  const refresh = jwt.sign(
    {
      token_type: 'refresh',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      jti: Math.random().toString(36).substring(2),
      user_id: user.id,
    },
    JWT_SECRET
  );

  return { access, refresh };
}

// ==========================================
// BACKEND API ENDPOINTS (Django REST Clone)
// ==========================================

// 1. POST /api/v1/auth/token/ (Login endpoint)
app.post('/api/v1/auth/token/', (req: Request, res: Response): any => {
  const { email, password, username } = req.body;
  console.log(`[API Auth Token] Login attempt:`, { email, username });

  const user = usersDb.find(
    (u) =>
      (email && u.email.toLowerCase() === email.toLowerCase()) ||
      (username && u.username.toLowerCase() === username.toLowerCase())
  );

  if (!user || user.password !== password) {
    return res.status(401).json({
      detail: 'No active account found with the given credentials',
    });
  }

  const tokens = generateTokens(user);
  return res.status(200).json(tokens);
});

// 2. POST /api/v1/auth/token/refresh/
app.post('/api/v1/auth/token/refresh/', (req: Request, res: Response): any => {
  const { refresh } = req.body;
  if (!refresh) {
    return res.status(400).json({ detail: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refresh, JWT_SECRET) as any;
    const user = usersDb.find((u) => u.id === decoded.user_id);
    if (!user) {
      return res.status(401).json({ detail: 'User not found' });
    }

    const { access } = generateTokens(user);
    return res.status(200).json({ access });
  } catch (err) {
    return res.status(401).json({ detail: 'Token is invalid or expired' });
  }
});

// 3. POST /api/v1/auth/register/
app.post('/api/v1/auth/register/', (req: Request, res: Response): any => {
  const { username, email, password } = req.body;
  console.log(`[API Auth Register] Register attempt:`, { username, email });

  if (!email || !password) {
    return res.status(400).json({
      email: !email ? ['Este campo es requerido.'] : undefined,
      password: !password ? ['Este campo es requerido.'] : undefined,
    });
  }

  const existingEmail = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingEmail) {
    return res.status(400).json({
      email: ['Ya existe un usuario con este correo electrónico.'],
    });
  }

  const cleanUsername = username || email.split('@')[0];
  const existingUsername = usersDb.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (existingUsername) {
    return res.status(400).json({
      username: ['Ya existe un usuario con este nombre de usuario.'],
    });
  }

  const newUser: UserRecord = {
    id: usersDb.length + 1,
    username: cleanUsername,
    email,
    password,
    first_name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
    last_name: 'Usuario',
    is_active: true,
    is_staff: false,
    date_joined: new Date().toISOString(),
  };

  usersDb.push(newUser);

  return res.status(201).json({
    message: 'Usuario registrado exitosamente',
    user: {
      username: newUser.username,
      email: newUser.email,
    },
  });
});

// 4. GET /api/v1/auth/me/ (Protected user data)
app.get('/api/v1/auth/me/', (req: Request, res: Response): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      detail: 'Las credenciales de autenticación no se proveyeron.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = usersDb.find((u) => u.id === decoded.user_id);
    if (!user) {
      return res.status(404).json({ detail: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      is_staff: user.is_staff,
      date_joined: user.date_joined,
    });
  } catch (err) {
    return res.status(401).json({
      detail: 'El token proporcionado es inválido o ha expirado.',
    });
  }
});

// 5. GET /api/v1/soap/countries/ (Consumo de Servicio SOAP)
// Consumes public SOAP Web Service: CountryInfoService
// WSDL: http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL
app.get('/api/v1/soap/countries/', async (req: Request, res: Response): Promise<any> => {
  const countryCode = ((req.query.code as string) || 'MX').toUpperCase();
  console.log(`[API SOAP] Consuming CountryInfo SOAP Service for: ${countryCode}`);

  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CountryName xmlns="http://www.oorsprong.org/websamples.countryinfo">
      <sCountryISOCode>${countryCode}</sCountryISOCode>
    </CountryName>
  </soap:Body>
</soap:Envelope>`;

  try {
    const response = await fetch('http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://www.oorsprong.org/websamples.countryinfo/CountryName',
      },
      body: soapEnvelope,
      signal: AbortSignal.timeout(6000),
    });

    const rawXml = await response.text();
    // Parse result from <m:CountryNameResult> or <CountryNameResult>
    const match = rawXml.match(/<m:CountryNameResult>([^<]+)<\/m:CountryNameResult>/) ||
                  rawXml.match(/<CountryNameResult>([^<]+)<\/CountryNameResult>/);
    const countryName = match ? match[1] : `${countryCode} Country`;

    return res.status(200).json({
      status: 'success',
      service: 'CountryInfoService (SOAP 1.1)',
      wsdl_url: 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL',
      library_equivalent: 'zeep.Client in Python/Django',
      request: {
        operation: 'CountryName',
        parameters: { sCountryISOCode: countryCode },
        xml_envelope: soapEnvelope,
      },
      response: {
        country_code: countryCode,
        country_name: countryName,
        raw_soap_xml: rawXml,
      },
    });
  } catch (error: any) {
    // If the external network request fails or times out, provide realistic SOAP simulation
    const simulatedCountries: Record<string, string> = {
      MX: 'Mexico',
      US: 'United States',
      ES: 'Spain',
      CO: 'Colombia',
      AR: 'Argentina',
      CL: 'Chile',
      PE: 'Peru',
      CA: 'Canada',
    };
    const countryName = simulatedCountries[countryCode] || `Country (${countryCode})`;

    return res.status(200).json({
      status: 'success',
      fallback: true,
      service: 'CountryInfoService (SOAP 1.1 Zeep emulation)',
      wsdl_url: 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL',
      library_equivalent: 'zeep.Client(wsdl=wsdl_url)',
      request: {
        operation: 'CountryName',
        parameters: { sCountryISOCode: countryCode },
        xml_envelope: soapEnvelope,
      },
      response: {
        country_code: countryCode,
        country_name: countryName,
        raw_soap_xml: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <m:CountryNameResponse xmlns:m="http://www.oorsprong.org/websamples.countryinfo">
      <m:CountryNameResult>${countryName}</m:CountryNameResult>
    </m:CountryNameResponse>
  </soap:Body>
</soap:Envelope>`,
      },
    });
  }
});

// Status and backend info endpoint
app.get('/api/v1/info/', (req: Request, res: Response) => {
  res.json({
    app: 'RA2 Django + React Auth & APIs',
    endpoints: [
      'POST /api/v1/auth/token/',
      'POST /api/v1/auth/token/refresh/',
      'POST /api/v1/auth/register/',
      'GET  /api/v1/auth/me/',
      'GET  /api/v1/soap/countries/?code=MX',
    ],
    demoUsers: [
      { email: 'admin@test.com', password: 'password123', role: 'Administrador' },
      { email: 'estudiante@test.com', password: 'password123', role: 'Estudiante' },
    ],
  });
});

// ==========================================
// VITE MIDDLEWARE SETUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
