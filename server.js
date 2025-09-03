import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seguridad (permitimos embeber en iframes; luego podremos restringirlo a dominios de clientes)
app.use(helmet({
  frameguard: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "img-src": ["'self'", "data:"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "frame-ancestors": ["*"] // más tarde: ["'self'", "https://tu-dominio-cliente.com"]
    }
  }
}));

// Estáticos (widget y assets)
app.use('/cdn', express.static(path.join(__dirname, 'public', 'cdn')));
app.use(express.static(path.join(__dirname, 'public')));

// Página de embed (UI del chat)
app.get('/embed', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'embed.html'));
});

// Mini-resolución de tenant (simple para arrancar)
function resolveTenant(req) {
  return (req.query.tenant || req.header('x-tenant') || 'default')
    .toString()
    .trim()
    .toLowerCase();
}

// OpenAI (si no hay API key, devolvemos respuestas dummy para probar UI)
const hasOpenAI = !!process.env.OPENAI_API_KEY;
const openai = hasOpenAI ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Endpoint de conversación
app.post('/v1/chat', async (req, res) => {
  try {
    const tenant = resolveTenant(req); // ej. "sabores-del-guijo"
    const { messages = [], sessionId = 'anon' } = req.body || {};

    const system = {
      role: 'system',
      content: `Eres el asistente de atención al cliente de este negocio.
Marca: ${tenant}.
Estilo: cercano, claro, con viñetas.
No muestres la marca Triangle AI en el chat.`
    };

    if (!hasOpenAI) {
      // Modo demo sin OpenAI: simula respuesta
      const last = messages.at(-1)?.content || '';
      return res.json({
        reply:
`(Demo sin OpenAI)
Has dicho: "${last}"

• Estoy online ✅
• Tenant: ${tenant}
• Session: ${sessionId}

Sugerencias: Preguntar por productos | Horarios | Envío`
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [system, ...messages]
    });

    const reply = completion.choices?.[0]?.message?.content || '(Sin respuesta)';
    res.json({ reply });
  } catch (err) {
    console.error('AI_ERROR:', err);
    res.status(500).json({ error: 'AI_ERROR', message: err.message });
  }
});

// Arranque
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Triangle AI API lista en http://localhost:${PORT}`);
  console.log(`🔗 Embed:           http://localhost:${PORT}/embed?tenant=sabores-del-guijo`);
  console.log(`📦 Widget (CDN):    http://localhost:${PORT}/cdn/widget.js`);
});